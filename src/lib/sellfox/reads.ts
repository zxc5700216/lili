import { querySellfox } from "./db";

export const MARKETPLACE_LABEL: Record<string, string> = {
  ATVPDKIKX0DER: "US",
  A2EUQ1WTGCTBG2: "CA",
  A1AM78C64UM0Y8: "MX",
  A1F83G8C2ARO7P: "UK",
  A1PA6795UKMFR9: "DE",
  A13V1IB3VIYZZH: "FR",
  APJ6JRA9NG5V4: "IT",
  A1RKKUPIHCS9HS: "ES",
  A21TJRUUN4KGV: "IN",
  A39IBJ37TRP1C6: "AU",
  A2Q3Y263D00KWC: "BR",
  A1VC38T7YXB528: "JP",
};

function clampLimit(limit: unknown, fallback = 100, max = 500): number {
  const n = Number(limit);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(Math.floor(n), max);
}

export async function listStores(limit: unknown = 100) {
  const lim = clampLimit(limit, 100);
  const { rows } = await querySellfox<{
    id: string;
    name: string;
    marketplace: string | null;
    country: string | null;
    status: string | null;
    lastSyncedAt: Date | null;
  }>(
    `SELECT id, name, marketplace, country, status, "lastSyncedAt"
     FROM "SellfoxStore"
     ORDER BY name ASC
     LIMIT $1`,
    [lim],
  );
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    marketplace: r.marketplace,
    country: r.country,
    status: r.status,
    last_synced_at: r.lastSyncedAt,
    marketplace_label: r.marketplace
      ? MARKETPLACE_LABEL[r.marketplace] ?? r.marketplace
      : null,
  }));
}

export async function salesDailyByStore(opts: {
  storeId?: string | null;
  limit?: unknown;
} = {}) {
  const lim = clampLimit(opts.limit, 200);
  if (opts.storeId) {
    const { rows } = await querySellfox(
      `SELECT id, "storeId", "reportDate", sku, msku, asin, quantity, orders, revenue, currency
       FROM "SellfoxSalesDailySnapshot"
       WHERE "storeId" = $1
       ORDER BY "reportDate" DESC NULLS LAST
       LIMIT $2`,
      [opts.storeId, lim],
    );
    return rows;
  }
  const { rows } = await querySellfox(
    `SELECT id, "storeId", "reportDate", sku, msku, asin, quantity, orders, revenue, currency
     FROM "SellfoxSalesDailySnapshot"
     ORDER BY "reportDate" DESC NULLS LAST
     LIMIT $1`,
    [lim],
  );
  return rows;
}

export async function productDaily(opts: {
  storeId?: string | null;
  reportDate?: string | null;
  limit?: unknown;
} = {}) {
  const lim = clampLimit(opts.limit, 200);
  const params: unknown[] = [];
  const where: string[] = [];
  if (opts.storeId) {
    params.push(opts.storeId);
    where.push(`"storeId" = $${params.length}`);
  }
  if (opts.reportDate) {
    params.push(opts.reportDate);
    where.push(`"reportDate" = $${params.length}`);
  }
  params.push(lim);
  const sql = `SELECT "storeId", "reportDate", sku, msku, asin, title, "saleQuantity", "saleRevenue",
                      "adCost", "grossProfit", "fbaQuantity", currency
               FROM "SellfoxProductDailySnapshot"
               ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
               ORDER BY "reportDate" DESC NULLS LAST
               LIMIT $${params.length}`;
  const { rows } = await querySellfox(sql, params);
  return rows;
}

export async function fbaInventory(opts: {
  storeId?: string | null;
  limit?: unknown;
} = {}) {
  const lim = clampLimit(opts.limit, 200);
  if (opts.storeId) {
    const { rows } = await querySellfox(
      `SELECT "storeId", "reportDate", sku, msku, asin, "commodityName", quantity,
              "totalInventory", "inTransit", unfulfillable, "reservedCustomerorders",
              "warehouseName", currency
       FROM "SellfoxFbaInventorySnapshot"
       WHERE "storeId" = $1
       ORDER BY "reportDate" DESC NULLS LAST
       LIMIT $2`,
      [opts.storeId, lim],
    );
    return rows;
  }
  const { rows } = await querySellfox(
    `SELECT "storeId", "reportDate", sku, msku, asin, "commodityName", quantity,
            "totalInventory", "inTransit", unfulfillable, "reservedCustomerorders",
            "warehouseName", currency
     FROM "SellfoxFbaInventorySnapshot"
     ORDER BY "reportDate" DESC NULLS LAST
     LIMIT $1`,
    [lim],
  );
  return rows;
}

export async function adsCampaignDaily(opts: {
  storeId?: string | null;
  limit?: unknown;
} = {}) {
  const lim = clampLimit(opts.limit, 200);
  if (opts.storeId) {
    const { rows } = await querySellfox(
      `SELECT "storeId", "reportDate", "adType", "campaignId", "campaignName", asin, msku,
              impressions, clicks, cost, "adOrders", "adSales", currency
       FROM "SellfoxAdsCampaignDaily"
       WHERE "storeId" = $1
       ORDER BY "reportDate" DESC NULLS LAST
       LIMIT $2`,
      [opts.storeId, lim],
    );
    return rows;
  }
  const { rows } = await querySellfox(
    `SELECT "storeId", "reportDate", "adType", "campaignId", "campaignName", asin, msku,
            impressions, clicks, cost, "adOrders", "adSales", currency
     FROM "SellfoxAdsCampaignDaily"
     ORDER BY "reportDate" DESC NULLS LAST
     LIMIT $1`,
    [lim],
  );
  return rows;
}

export async function adsProductDaily(opts: {
  storeId?: string | null;
  limit?: unknown;
} = {}) {
  const lim = clampLimit(opts.limit, 200);
  if (opts.storeId) {
    const { rows } = await querySellfox(
      `SELECT "storeId", "reportDate", "adType", "campaignId", "adGroupId", "productId",
              asin, msku, impressions, clicks, cost, "adOrders", "adSales", currency
       FROM "SellfoxAdsProductDaily"
       WHERE "storeId" = $1
       ORDER BY "reportDate" DESC NULLS LAST
       LIMIT $2`,
      [opts.storeId, lim],
    );
    return rows;
  }
  const { rows } = await querySellfox(
    `SELECT "storeId", "reportDate", "adType", "campaignId", "adGroupId", "productId",
            asin, msku, impressions, clicks, cost, "adOrders", "adSales", currency
     FROM "SellfoxAdsProductDaily"
     ORDER BY "reportDate" DESC NULLS LAST
     LIMIT $1`,
    [lim],
  );
  return rows;
}

export async function listingSnapshots(opts: {
  storeId?: string | null;
  sku?: string | null;
  asin?: string | null;
  limit?: unknown;
} = {}) {
  const lim = clampLimit(opts.limit, 100);
  const params: unknown[] = [];
  const where: string[] = [];
  if (opts.storeId) {
    params.push(opts.storeId);
    where.push(`"storeId" = $${params.length}`);
  }
  if (opts.sku) {
    params.push(opts.sku);
    where.push(`(sku = $${params.length} OR msku = $${params.length})`);
  }
  if (opts.asin) {
    params.push(opts.asin);
    where.push(`asin = $${params.length}`);
  }
  params.push(lim);
  const sql = `SELECT "storeId", asin, msku, sku, title, status, price, fulfillable,
                      sales7, sales14, sales30, revenue30, "adSpend30",
                      "ratingValue", "bsrRank", currency
               FROM "SellfoxListingSnapshot"
               ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
               ORDER BY "capturedAt" DESC NULLS LAST
               LIMIT $${params.length}`;
  const { rows } = await querySellfox(sql, params);
  return rows;
}
