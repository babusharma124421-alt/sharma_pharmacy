import { drizzle as drizzleNodePostgres } from "drizzle-orm/node-postgres";
import { drizzle as drizzleNeonHttp } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const isNeon = databaseUrl.includes("neon.tech");

let dbInstance: any;

if (isNeon) {
  const sql = neon(databaseUrl);
  dbInstance = drizzleNeonHttp(sql);
} else {
  const globalForDb = globalThis as typeof globalThis & {
    __arenaNextJsPostgresqlPool?: Pool;
  };

  const pool =
    globalForDb.__arenaNextJsPostgresqlPool ??
    new Pool({
      connectionString: databaseUrl,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = pool;
  }

  dbInstance = drizzleNodePostgres(pool);
}

export const db = dbInstance;
