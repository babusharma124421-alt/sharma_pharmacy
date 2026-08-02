import { NextResponse } from "next/server";
import { db } from "@/db";
import { invoices, medicines } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const results = await db
      .select()
      .from(invoices)
      .orderBy(desc(invoices.createdAt));
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

interface InvoiceItem {
  medicineId?: number;
  name: string;
  quantity: number;
  unitPrice: number;
  gstPercent: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.customerName || !body.items || body.items.length === 0) {
      return NextResponse.json({ error: "Customer name and items required" }, { status: 400 });
    }

    // Calculate totals
    let subtotal = 0;
    let gstTotal = 0;
    const processedItems = [];

    for (const item of body.items as InvoiceItem[]) {
      const lineTotal = item.quantity * item.unitPrice;
      const lineGst = lineTotal * (item.gstPercent / 100);
      subtotal += lineTotal;
      gstTotal += lineGst;
      processedItems.push({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        gstPercent: item.gstPercent,
        total: lineTotal + lineGst,
      });

      // Reduce stock
      if (item.medicineId) {
        const med = await db
          .select()
          .from(medicines)
          .where(eq(medicines.id, item.medicineId))
          .limit(1);
        if (med.length > 0) {
          const newQty = Math.max(0, med[0].quantity - item.quantity);
          await db
            .update(medicines)
            .set({ quantity: newQty, updatedAt: new Date() })
            .where(eq(medicines.id, item.medicineId));
        }
      }
    }

    const total = subtotal + gstTotal;

    // Generate invoice number
    const count = await db.select().from(invoices);
    const invoiceNumber = `SP-${String(count.length + 1).padStart(6, "0")}`;

    const result = await db.insert(invoices).values({
      invoiceNumber,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      items: processedItems,
      subtotal: subtotal.toFixed(2),
      gstAmount: gstTotal.toFixed(2),
      totalAmount: total.toFixed(2),
      paymentMethod: body.paymentMethod || "cash",
      createdBy: body.createdBy,
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
