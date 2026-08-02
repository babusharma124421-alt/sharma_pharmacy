import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "sharma-pharmacy-secret-key-2024";

export interface JWTPayload {
  userId: number;
  username: string;
  role: string;
  fullName: string;
}

export async function verifyCredentials(
  username: string,
  password: string
): Promise<JWTPayload | null> {
  const users = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username));
  if (!users || users.length === 0) return null;
  const user = users[0];
  if (!user.active) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  return {
    userId: user.id,
    username: user.username,
    role: user.role,
    fullName: user.fullName,
  };
}

export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
