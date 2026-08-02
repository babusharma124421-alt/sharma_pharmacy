import { NextResponse } from "next/server";
import { db } from "@/db";
import { ensureTablesExist } from "@/db/init";
import { adminUsers, businessSettings, medicines, doctorSchedules } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { eq } from "drizzle-orm";

export async function GET() {
  return POST();
}

export async function POST() {
  try {
    await ensureTablesExist();

    // Seed admin user
    const existing = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, "admin"))
      .limit(1);
    if (existing.length === 0) {
      const hash = await hashPassword("admin123");
      await db.insert(adminUsers).values({
        username: "admin",
        passwordHash: hash,
        fullName: "Sharma Admin",
        role: "owner",
      });
    }

    // Seed business settings
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      const ex = await db
        .select()
        .from(businessSettings)
        .where(eq(businessSettings.key, key))
        .limit(1);
      if (ex.length === 0) {
        await db.insert(businessSettings).values({ key, value });
      }
    }

    // Seed doctor schedule (Mon-Sat)
    const existingSchedules = await db.select().from(doctorSchedules).limit(1);
    if (existingSchedules.length === 0) {
      for (let day = 1; day <= 6; day++) {
        await db.insert(doctorSchedules).values({
          doctorName: "Dr. Sharma",
          dayOfWeek: day,
          startTime: "10:00",
          endTime: "14:00",
          isAvailable: true,
        });
      }
    }

    // Seed some sample medicines
    const existingMeds = await db.select().from(medicines).limit(1);
    if (existingMeds.length === 0) {
      const sampleMeds = [
        { name: "Paracetamol 500mg", genericName: "Paracetamol", manufacturer: "Cipla", category: "Pain Relief", quantity: 150, unitPrice: "8.50", mrp: "10.00", gstPercent: "12", batchNumber: "B2024001" },
        { name: "Amoxicillin 250mg", genericName: "Amoxicillin", manufacturer: "Sun Pharma", category: "Antibiotic", quantity: 80, unitPrice: "12.00", mrp: "15.00", gstPercent: "12", requiresPrescription: true, batchNumber: "B2024002" },
        { name: "Cetirizine 10mg", genericName: "Cetirizine", manufacturer: "Dr. Reddy's", category: "Allergy", quantity: 200, unitPrice: "5.00", mrp: "7.00", gstPercent: "12", batchNumber: "B2024003" },
        { name: "Omeprazole 20mg", genericName: "Omeprazole", manufacturer: "Cipla", category: "Gastric", quantity: 0, unitPrice: "10.00", mrp: "14.00", gstPercent: "12", batchNumber: "B2024004" },
        { name: "Metformin 500mg", genericName: "Metformin", manufacturer: "USV", category: "Diabetes", quantity: 120, unitPrice: "6.00", mrp: "8.00", gstPercent: "5", requiresPrescription: true, batchNumber: "B2024005" },
        { name: "Atorvastatin 10mg", genericName: "Atorvastatin", manufacturer: "Sun Pharma", category: "Cholesterol", quantity: 5, unitPrice: "15.00", mrp: "20.00", gstPercent: "12", requiresPrescription: true, batchNumber: "B2024006" },
        { name: "Azithromycin 500mg", genericName: "Azithromycin", manufacturer: "Alkem", category: "Antibiotic", quantity: 45, unitPrice: "25.00", mrp: "32.00", gstPercent: "12", requiresPrescription: true, batchNumber: "B2024007" },
        { name: "Pantoprazole 40mg", genericName: "Pantoprazole", manufacturer: "Cipla", category: "Gastric", quantity: 90, unitPrice: "8.00", mrp: "12.00", gstPercent: "12", batchNumber: "B2024008" },
        { name: "Dolo 650", genericName: "Paracetamol", manufacturer: "Micro Labs", category: "Pain Relief", quantity: 300, unitPrice: "5.50", mrp: "7.50", gstPercent: "12", batchNumber: "B2024009" },
        { name: "Crocin Advance", genericName: "Paracetamol", manufacturer: "GSK", category: "Pain Relief", quantity: 100, unitPrice: "12.00", mrp: "16.00", gstPercent: "12", batchNumber: "B2024010" },
      ];
      for (const med of sampleMeds) {
        await db.insert(medicines).values(med);
      }
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
