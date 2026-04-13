import { describe, expect, it } from "vitest";
import { resolveRuntimeDatabaseUrl } from "@/lib/db";

describe("resolveRuntimeDatabaseUrl", () => {
  it("prefers an explicit pool url override", () => {
    expect(
      resolveRuntimeDatabaseUrl(
        "postgresql://postgres:secret@db.example.supabase.co:5432/postgres",
        "postgresql://postgres:secret@db.example.supabase.co:6543/postgres",
      ),
    ).toBe("postgresql://postgres:secret@db.example.supabase.co:6543/postgres");
  });

  it("rewrites Supabase direct db urls to the transaction pooler port", () => {
    expect(
      resolveRuntimeDatabaseUrl(
        "postgresql://postgres:secret@db.fqvxcyttyardsqugowjl.supabase.co:5432/postgres",
      ),
    ).toBe(
      "postgresql://postgres:secret@db.fqvxcyttyardsqugowjl.supabase.co:6543/postgres",
    );
  });

  it("leaves non-Supabase urls unchanged", () => {
    expect(
      resolveRuntimeDatabaseUrl(
        "postgresql://postgres:secret@localhost:5432/postgres",
      ),
    ).toBe("postgresql://postgres:secret@localhost:5432/postgres");
  });

  it("leaves already pooled urls unchanged", () => {
    expect(
      resolveRuntimeDatabaseUrl(
        "postgresql://postgres:secret@db.fqvxcyttyardsqugowjl.supabase.co:6543/postgres",
      ),
    ).toBe(
      "postgresql://postgres:secret@db.fqvxcyttyardsqugowjl.supabase.co:6543/postgres",
    );
  });
});
