import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getRequiredDatabaseUrl } from "@/lib/env";
import * as schema from "@/lib/db/schema";

export function resolveRuntimeDatabaseUrl(
  databaseUrl: string,
  poolUrl = process.env.DATABASE_POOL_URL,
) {
  if (poolUrl) {
    return poolUrl;
  }

  let parsed: URL;

  try {
    parsed = new URL(databaseUrl);
  } catch {
    return databaseUrl;
  }

  const isSupabaseDirectHost = /^db\.[^.]+\.supabase\.co$/i.test(parsed.hostname);
  const isDirectPort = parsed.port === "" || parsed.port === "5432";

  if (!isSupabaseDirectHost || !isDirectPort) {
    return databaseUrl;
  }

  parsed.port = "6543";
  return parsed.toString();
}

function createDbClient(databaseUrl: string) {
  const sql = postgres(resolveRuntimeDatabaseUrl(databaseUrl), {
    prepare: false,
    connect_timeout: 5,
  });

  const db = drizzle(sql, {
    schema,
  });

  return { sql, db };
}

const globalForDb = globalThis as typeof globalThis & {
  __zynapseSql?: ReturnType<typeof postgres>;
  __zynapseDb?: ReturnType<typeof createDbClient>["db"];
};

function ensureDbClient() {
  if (globalForDb.__zynapseDb) {
    return {
      sql: globalForDb.__zynapseSql!,
      db: globalForDb.__zynapseDb,
    };
  }

  const databaseUrl = getRequiredDatabaseUrl();

  const { sql, db } =
    globalForDb.__zynapseSql && globalForDb.__zynapseDb
      ? { sql: globalForDb.__zynapseSql, db: globalForDb.__zynapseDb }
      : createDbClient(databaseUrl);

  globalForDb.__zynapseSql = sql;
  globalForDb.__zynapseDb = db;

  return { sql, db };
}

export function getDb() {
  return ensureDbClient().db;
}

export function getSql() {
  return ensureDbClient().sql;
}
