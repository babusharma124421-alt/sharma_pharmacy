import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { medicines } from "@/db/schema";
import { eq, ilike, or, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const all = searchParams.get("all"); // for admin - return all including inactive

    let query = db.select().from(medicines);

    if (q) {
      const results = await db
        .select()
        .from(medicines)
        .where(
          or(
            ilike(medicines.name, `%${q}%`),
            ilike(medicines.genericName, `%${q}%`),
            ilike(medicines.manufacturer, `%${q}%`),
            ilike(medicines.category, `%${q}%`)
          )
        )
        .orderBy(desc(medicines.quantity));
      return NextResponse.json(results);
    }

    if (all === "true") {
      const results = await query.orderBy(desc(medicines.updatedAt));
      return NextResponse.json(results);
    }

    const results = await db
      .select()
      .from(medicines)
      .where(eq(medicines.active, true))
      .orderBy(desc(medicines.updatedAt));
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await db.insert(medicines).values({
      name: body.name,
      nameHi: body.nameHi,
      genericName: body.genericName,
      manufacturer: body.manufacturer,
      category: body.category,
      batchNumber: body.batchNumber,
      barcode: body.barcode,
      quantity: body.quantity || 0,
      reorderLevel: body.reorderLevel || 10,
      unitPrice: body.unitPrice || "0",
      mrp: body.mrp || "0",
      gstPercent: body.gstPercent || "12",
      expiryDate: body.expiryDate,
      requiresPrescription: body.requiresPrescription || false,
    }).returning();
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
