import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let _db: any = null;

export function getDb() {
  if (_db) return _db;

  const databaseUrl =
    process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_mhjnwN9DT8qi@ep-falling-art-aydojaq2.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require";

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  _db = drizzle(pool, { schema });
  return _db;
}

export const db = new Proxy({} as any, {
  get(_target, prop) {
    const instance = getDb();
    const value = instance[prop];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

