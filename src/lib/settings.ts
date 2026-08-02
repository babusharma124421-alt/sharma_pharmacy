import { db } from "@/db";
import { businessSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DEFAULT_SETTINGS } from "./constants";

export async function getSetting(key: string): Promise<string> {
  const rows = await db
    .select()
    .from(businessSettings)
    .where(eq(businessSettings.key, key))
    .limit(1);
  if (rows.length > 0) return rows[0].value;
  return DEFAULT_SETTINGS[key] ?? "";
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(businessSettings);
  const result: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    result[row.key] = row.value;
  }
  return result;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const existing = await db
    .select()
    .from(businessSettings)
    .where(eq(businessSettings.key, key))
    .limit(1);
  if (existing.length > 0) {
    await db
      .update(businessSettings)
      .set({ value, updatedAt: new Date() })
      .where(eq(businessSettings.key, key));
  } else {
    await db.insert(businessSettings).values({ key, value });
  }
}
