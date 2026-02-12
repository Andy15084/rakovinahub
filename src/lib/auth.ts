import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

const ADMIN_TOKEN_COOKIE = "admin_token";

type AdminJwtPayload = {
  sub: string;
  email: string;
};

function getJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET is not set");
  }
  return secret;
}

export async function authenticateAdmin(email: string, password: string) {
  try {
    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) {
      console.log(`Admin user not found for email: ${email}`);
      return null;
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      console.log(`Password mismatch for email: ${email}`);
      return null;
    }

    console.log(`Admin user authenticated successfully: ${email}`);
    return user;
  } catch (error) {
    console.error("Error in authenticateAdmin:", error);
    throw error;
  }
}

export async function ensureDefaultAdminUser() {
  try {
    const email = process.env.DEFAULT_ADMIN_EMAIL;
    const password = process.env.DEFAULT_ADMIN_PASSWORD;

    if (!email || !password) {
      console.warn("DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD not set, skipping default admin creation");
      return;
    }

    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) return;

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.adminUser.create({
      data: {
        email,
        passwordHash,
      },
    });
    console.log("Default admin user created successfully");
  } catch (error) {
    console.error("Error ensuring default admin user:", error);
    // Don't throw - allow the app to continue even if default admin creation fails
  }
}

export function createAdminToken(user: { id: string; email: string }) {
  const secret = getJwtSecret();
  const payload: AdminJwtPayload = {
    sub: user.id,
    email: user.email,
  };
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminJwtPayload | null {
  try {
    const secret = getJwtSecret();
    return jwt.verify(token, secret) as AdminJwtPayload;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) return null;

  const payload = verifyAdminToken(token);
  if (!payload) return null;

  return prisma.adminUser.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true },
  });
}

export async function setAdminAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_TOKEN_COOKIE);
}

