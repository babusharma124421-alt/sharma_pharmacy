import { NextResponse } from "next/server";
import { db } from "@/db";
import { deliveryRequests } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const results = await db
      .select()
      .from(deliveryRequests)
      .orderBy(desc(deliveryRequests.createdAt));
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.customerName || !body.customerPhone || !body.deliveryAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const result = await db.insert(deliveryRequests).values({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      deliveryAddress: body.deliveryAddress,
      medicineList: body.medicineList,
      preferredTime: body.preferredTime,
      notes: body.notes,
    }).returning();
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
