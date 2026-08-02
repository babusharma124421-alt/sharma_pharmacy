import { NextResponse } from "next/server";
import { verifyCredentials, createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }
    const payload = await verifyCredentials(username, password);
    if (!payload) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const token = createToken(payload);
    return NextResponse.json({ token, user: payload });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
