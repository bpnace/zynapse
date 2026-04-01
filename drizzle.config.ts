import { config } from "dotenv";
config({ path: ".env.local" });

import { defineConfig } from "drizzle-kit";
import { getRequiredDatabaseUrl } from "@/lib/env";

const databaseUrl = getRequiredDatabaseUrl();

export default defineConfig({
  schema: "./src/lib/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  strict: true,
  verbose: true,
});
