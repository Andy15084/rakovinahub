import { NextResponse } from "next/server";
import { authenticateAdmin, createAdminToken, setAdminAuthCookie, ensureDefaultAdminUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Ensure default admin user exists before attempting login
    try {
      await ensureDefaultAdminUser();
    } catch (error) {
      console.error("Error ensuring default admin:", error);
      // Continue even if this fails
    }

    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { message: "Neplatný request body." },
        { status: 400 },
      );
    }

    const email = body?.email;
    const password = body?.password;

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { message: "Neplatné prihlasovacie údaje. Email a heslo musia byť reťazce." },
        { status: 400 },
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email a heslo sú povinné." },
        { status: 400 },
      );
    }

    let user;
    try {
      user = await authenticateAdmin(email, password);
    } catch (error) {
      console.error("Error authenticating admin:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        { 
          message: "Chyba pri overovaní prihlasovacích údajov.",
          error: errorMessage 
        },
        { status: 500 },
      );
    }

    if (!user) {
      return NextResponse.json(
        { message: "Nesprávny e‑mail alebo heslo." },
        { status: 401 },
      );
    }

    let token;
    try {
      token = createAdminToken({ id: user.id, email: user.email });
    } catch (error) {
      console.error("Error creating token:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        { 
          message: "Chyba pri vytváraní autentifikačného tokenu.",
          error: errorMessage 
        },
        { status: 500 },
      );
    }

    try {
      await setAdminAuthCookie(token);
    } catch (error) {
      console.error("Error setting cookie:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        { 
          message: "Chyba pri nastavení autentifikačného cookie.",
          error: errorMessage 
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Prihlásenie úspešné." });
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        message: "Chyba pri prihlásení. Skúste to znova.",
        error: errorMessage,
        ...(process.env.NODE_ENV === "development" && { stack: errorStack })
      },
      { status: 500 },
    );
  }
}

