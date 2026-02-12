import { NextResponse } from "next/server";
import { authenticateAdmin, createAdminToken, setAdminAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const email = body?.email;
  const password = body?.password;

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { message: "Neplatné prihlasovacie údaje." },
      { status: 400 },
    );
  }

  const user = await authenticateAdmin(email, password);
  if (!user) {
    return NextResponse.json(
      { message: "Nesprávny e‑mail alebo heslo." },
      { status: 401 },
    );
  }

  const token = createAdminToken({ id: user.id, email: user.email });
  await setAdminAuthCookie(token);

  return NextResponse.json({ message: "Prihlásenie úspešné." });
}

