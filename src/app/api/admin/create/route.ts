import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Helper endpoint to create admin user
 * This should be protected in production or removed after initial setup
 * 
 * Usage:
 * POST /api/admin/create
 * Body: { "email": "admin@example.com", "password": "your-password" }
 * 
 * Or it will use DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD from env vars
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const email = body?.email || process.env.DEFAULT_ADMIN_EMAIL;
    const password = body?.password || process.env.DEFAULT_ADMIN_PASSWORD;

    if (!email || !password) {
      return NextResponse.json(
        { 
          message: "Email a heslo sú povinné. Poskytnite ich v request body alebo nastavte DEFAULT_ADMIN_EMAIL a DEFAULT_ADMIN_PASSWORD v environment variables.",
          example: {
            email: "admin@example.com",
            password: "your-secure-password"
          }
        },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      // Update password if user exists
      const passwordHash = await bcrypt.hash(password, 10);
      await prisma.adminUser.update({
        where: { id: existing.id },
        data: { passwordHash },
      });

      return NextResponse.json({
        message: "Admin používateľ už existuje. Heslo bolo aktualizované.",
        user: { email: existing.email, id: existing.id },
      });
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
      login: {
        email: user.email,
        password: password,
        url: "/admin/login"
      }
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        message: "Chyba pri vytváraní admin používateľa.",
        error: errorMessage 
      },
      { status: 500 },
    );
  }
}
