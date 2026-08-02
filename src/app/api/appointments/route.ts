import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const results = await db
      .select()
      .from(appointments)
      .orderBy(desc(appointments.createdAt));
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.customerName || !body.customerPhone || !body.appointmentDate || !body.appointmentTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const result = await db.insert(appointments).values({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      appointmentDate: body.appointmentDate,
      appointmentTime: body.appointmentTime,
      doctorName: body.doctorName || "Dr. Sharma",
      notes: body.notes,
    }).returning();
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
