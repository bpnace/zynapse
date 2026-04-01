import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getRequiredDatabaseUrl } from "@/lib/env";
import * as schema from "@/lib/db/schema";

function createDbClient(databaseUrl: string) {
  const sql = postgres(databaseUrl, {
    prepare: false,
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

export function getDb() {
  if (globalForDb.__zynapseDb) {
    return globalForDb.__zynapseDb;
  }

  const databaseUrl = getRequiredDatabaseUrl();

  const { sql, db } =
    globalForDb.__zynapseSql && globalForDb.__zynapseDb
      ? { sql: globalForDb.__zynapseSql, db: globalForDb.__zynapseDb }
      : createDbClient(databaseUrl);

  globalForDb.__zynapseSql = sql;
  globalForDb.__zynapseDb = db;

  return db;
}
