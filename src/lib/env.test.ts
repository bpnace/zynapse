import { afterEach, describe, expect, it, vi } from "vitest";
import { getRequiredDatabaseUrl } from "@/lib/env";

describe("getRequiredDatabaseUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefers pooled database urls when available", () => {
    vi.stubEnv("DATABASE_URL", "postgresql://direct");
    vi.stubEnv("POSTGRES_URL", "postgresql://pooled");

    expect(getRequiredDatabaseUrl()).toBe("postgresql://pooled");
  });

  it("falls back to DATABASE_URL when no pooled runtime url exists", () => {
    vi.stubEnv("DATABASE_URL", "postgresql://direct");
    vi.stubEnv("POSTGRES_URL", "");
    vi.stubEnv("DATABASE_POOL_URL", "");
    vi.stubEnv("POSTGRES_PRISMA_URL", "");
    vi.stubEnv("POSTGRES_URL_NON_POOLING", "");

    expect(getRequiredDatabaseUrl()).toBe("postgresql://direct");
  });
});
