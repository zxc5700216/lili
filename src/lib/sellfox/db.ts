import { Pool, type QueryResultRow } from "pg";

let pool: Pool | null | undefined;

export function isSellfoxConfigured(): boolean {
  return Boolean(process.env.SELLFOX_DATABASE_URL?.trim());
}

export function getSellfoxPool(): Pool | null {
  const url = process.env.SELLFOX_DATABASE_URL?.trim();
  if (!url) {
    pool = null;
    return null;
  }
  if (pool === undefined) {
    pool = new Pool({
      connectionString: url,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 8_000,
    });
  }
  return pool;
}

export async function querySellfox<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<{ rows: T[] }> {
  const p = getSellfoxPool();
  if (!p) {
    throw new Error("SELLFOX_DATABASE_URL is not set");
  }
  return p.query<T>(text, params);
}
