import { NextResponse } from "next/server";
import { db } from "@/db";
import { prescriptions } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const results = await db
      .select()
      .from(prescriptions)
      .orderBy(desc(prescriptions.createdAt));
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.customerName || !body.customerPhone || !body.fileData || !body.fileType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const result = await db.insert(prescriptions).values({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      fileName: body.fileName || "prescription",
      fileData: body.fileData,
      fileType: body.fileType,
      notes: body.notes,
    }).returning();
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
