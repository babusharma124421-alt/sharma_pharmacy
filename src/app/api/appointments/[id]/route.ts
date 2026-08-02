import { NextResponse } from "next/server";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await db
      .update(appointments)
      .set(body)
      .where(eq(appointments.id, parseInt(id)))
      .returning();
    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
