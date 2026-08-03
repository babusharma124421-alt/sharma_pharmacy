import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_mhjnwN9DT8qi@ep-falling-art-aydojaq2.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require";

const isNeon = databaseUrl.includes("neon.tech");

function getDbClient() {
  if (isNeon) {
    const sql = neon(databaseUrl);
    return drizzleNeon(sql, { schema });
  } else {
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
    });
    return drizzlePg(pool, { schema });
  }
}

export const db = getDbClient() as any;

export async function runQuery(queryText: string, params: any[] = []) {
  if (isNeon) {
    const sql: any = neon(databaseUrl);
    return await sql(queryText, params);
  } else {
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
    });
    try {
      const res = await pool.query(queryText, params);
      return res.rows;
    } finally {
      await pool.end().catch(() => {});
    }
  }
}

