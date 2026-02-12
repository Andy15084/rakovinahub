import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Helper endpoint to check if admin users exist
 * This helps debug authentication issues
 */
export async function GET() {
  try {
    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      count: users.length,
      users: users,
      message: users.length === 0 
        ? "V databáze nie sú žiadni admin používatelia. Použite /api/admin/create na vytvorenie."
        : `Našlo sa ${users.length} admin používateľ(ov).`,
    });
  } catch (error) {
    console.error("Error checking admin users:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        message: "Chyba pri kontrole admin používateľov.",
        error: errorMessage 
      },
      { status: 500 },
    );
  }
}
