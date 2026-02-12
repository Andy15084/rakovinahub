import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Helper endpoint to create admin user
 * This should be protected in production or removed after initial setup
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const email = body?.email || process.env.DEFAULT_ADMIN_EMAIL;
    const password = body?.password || process.env.DEFAULT_ADMIN_PASSWORD;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email a heslo sú povinné." },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "Admin používateľ s týmto emailom už existuje." },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.adminUser.create({
      data: {
        email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: "Admin používateľ bol úspešne vytvorený.",
      user: { email: user.email, id: user.id },
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { message: "Chyba pri vytváraní admin používateľa." },
      { status: 500 },
    );
  }
}
