import { drizzle as drizzleNodePostgres } from "drizzle-orm/node-postgres";
import { drizzle as drizzleNeonHttp } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";

let _db: any = null;

export function getDb() {
  if (_db) return _db;

  const databaseUrl =
    process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_mhjnwN9DT8qi@ep-falling-art-aydojaq2.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require";

  const isNeon = databaseUrl.includes("neon.tech");

  if (isNeon) {
    const sql = neon(databaseUrl);
    _db = drizzleNeonHttp(sql);
  } else {
    const globalForDb = globalThis as typeof globalThis & {
      __arenaNextJsPostgresqlPool?: Pool;
    };

    const pool =
      globalForDb.__arenaNextJsPostgresqlPool ??
      new Pool({
        connectionString: databaseUrl,
        ssl: databaseUrl.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
      });

    if (process.env.NODE_ENV !== "production") {
      globalForDb.__arenaNextJsPostgresqlPool = pool;
    }

    _db = drizzleNodePostgres(pool);
  }

  return _db;
}

export const db = new Proxy({} as any, {
  get(_target, prop) {
    const instance = getDb();
    const value = instance[prop];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
