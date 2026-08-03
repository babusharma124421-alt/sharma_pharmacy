import { db, runQuery } from "@/db";
import { businessSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DEFAULT_SETTINGS } from "./constants";

export async function getSetting(key: string): Promise<string> {
  try {
    const rows = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.key, key));
    if (rows && rows.length > 0) return rows[0].value;
  } catch {
    try {
      const rows = await runQuery("SELECT value FROM business_settings WHERE key = $1", [key]);
      if (rows && rows.length > 0) return rows[0].value;
    } catch { /* ignore */ }
  }
  return DEFAULT_SETTINGS[key] ?? "";
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const result: Record<string, string> = { ...DEFAULT_SETTINGS };
  try {
    const rows = await db.select().from(businessSettings);
    if (rows && rows.length > 0) {
      for (const row of rows) {
        result[row.key] = row.value;
      }
      return result;
    }
  } catch {
    try {
      const rows = await runQuery("SELECT key, value FROM business_settings");
      if (rows && rows.length > 0) {
        for (const row of rows) {
          result[row.key] = row.value;
        }
      }
    } catch { /* ignore */ }
  }
  return result;
}

export async function setSetting(key: string, value: string): Promise<void> {
  try {
    const existing = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.key, key));
    if (existing && existing.length > 0) {
      await db
        .update(businessSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(businessSettings.key, key));
    } else {
      await db.insert(businessSettings).values({ key, value });
    }
  } catch {
    try {
      await runQuery(
        `INSERT INTO business_settings (key, value, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [key, value]
      );
    } catch (e) {
      console.error("setSetting database fallback error:", e);
    }
  }
}

