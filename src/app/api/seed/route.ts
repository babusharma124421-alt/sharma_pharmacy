import { NextResponse } from "next/server";
import { ensureTablesExist } from "@/db/init";

export async function GET() {
  return POST();
}

export async function POST() {
  try {
    await ensureTablesExist();
    return NextResponse.json({
      success: true,
      message: "Database tables created and seeded successfully!",
    });
  } catch (error: any) {
    console.error("Seed route error:", error);
    return NextResponse.json(
      { success: false, error: String(error?.message || error) },
      { status: 500 }
    );
  }
}

