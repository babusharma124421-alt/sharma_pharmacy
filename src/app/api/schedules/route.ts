import { NextResponse } from "next/server";
import { db } from "@/db";
import { doctorSchedules } from "@/db/schema";

export async function GET() {
  try {
    const results = await db.select().from(doctorSchedules);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Replace all schedules
    if (Array.isArray(body)) {
      await db.delete(doctorSchedules);
      for (const s of body) {
        await db.insert(doctorSchedules).values({
          doctorName: s.doctorName,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          isAvailable: s.isAvailable ?? true,
        });
      }
      const results = await db.select().from(doctorSchedules);
      return NextResponse.json(results);
    }
    return NextResponse.json({ error: "Expected array" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
