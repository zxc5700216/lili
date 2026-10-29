import { randomUUID } from "node:crypto";
import { prisma } from "../prisma";
import { fixtureFor } from "./fixtures";
import { isSellfoxConfigured } from "../sellfox/db";
import {
  adsCampaignDaily,
  adsProductDaily,
  fbaInventory,
  listStores,
  listingSnapshots,
  productDaily,
  salesDailyByStore,
} from "../sellfox/reads";

const PREPARE = new Set([
  "ads_prepare_changes",
  "ads_prepare_apply",
  "listing_prepare_change",
  "restock_preview_shipment",
  "restock_prepare_placement",
  "restock_prepare_transportation",
]);

const TABLES = [
  "orders_daily",
  "order_items",
  "returns",
  "return_reasons",
  "inventory_fba",
  "inventory_age",
  "inbound_shipments",
  "reserved_inventory",
  "storage_fees",
  "reimbursements",
  "settlements",
  "fees_by_sku",
  "traffic_sessions",
  "buybox_share",
  "ads_campaigns",
  "ads_ad_groups",
  "ads_keywords",
  "ads_search_terms",
  "ads_targets",
  "ads_placements",
  "ads_purchased_product",
  "promotions",
  "coupon_performance",
  "deal_performance",
  "catalog_listings",
  "listing_quality",
  "reviews",
  "account_health",
  "finance_balances",
  "business_report_daily",
];

type Json = Record<string, unknown>;

export function needsApproval(tool: { name: string; readOnly: boolean }) {
  return !tool.readOnly || PREPARE.has(tool.name);
}

export function approvalKind(name: string) {
  if (name.startsWith("ads_")) return "ads";
  if (name.startsWith("restock_")) return "restock";
  if (name.startsWith("listing_")) return "listing";
  return "other";
}

function isMarket(name: string) {
  return (
    name.startsWith("market_") ||
    name.startsWith("competitor_") ||
    name === "brand_get_search_query_performance"
  );
}

function creditCost(name: string) {
  if (name.startsWith("market_") || name.startsWith("competitor_")) return 2;
  if (name === "brand_get_search_query_performance") return 1;
  if (name === "ads_generate_recommendations") return 5;
  return 0;
}

function parseMaybe(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function missingRequired(schema: unknown, input: Json) {
  const required = Array.isArray((schema as { required?: unknown }).required)
    ? ((schema as { required: string[] }).required ?? [])
    : [];
  return required.filter((key) => {
    const value = input[key];
    return value === undefined || value === null || value === "";
  });
}

export async function loadBundle(storeId?: string | null) {
  const stores = await prisma.store.findMany({
    orderBy: { code: "asc" },
    include: { profiles: true },
  });
  const store = stores.find((item) => item.id === storeId) ?? stores[0];
  if (!store) throw new Error("no store");
  const [products, campaigns, recommendations, shipments, listings, settings, connections] =
    await Promise.all([
      prisma.product.findMany({ where: { storeId: store.id }, orderBy: { daysOfCover: "asc" } }),
      prisma.campaign.findMany({
        where: { storeId: store.id },
        include: { keywords: true },
        orderBy: { spend7: "desc" },
      }),
      prisma.recommendation.findMany({ where: { storeId: store.id, status: "open" } }),
      prisma.shipmentDraft.findMany({
        where: { storeId: store.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.listingDraft.findMany({
        where: { storeId: store.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.appSetting.findUnique({ where: { id: "default" } }),
      prisma.aiConnection.findMany({ orderBy: { connectedAt: "asc" } }),
    ]);
  return {
    stores,
    store,
    products,
    campaigns,
    recommendations,
    shipments,
    listings,
    settings,
    connections,
  };
}

function sampleProducts(ctx: Awaited<ReturnType<typeof loadBundle>>) {
  return ctx.products.slice(0, 4).map((p) => ({
    asin: p.asin,
    sku: p.sku,
    title: p.title,
    price: p.price,
    fulfillable: p.fulfillable,
    days_of_cover: p.daysOfCover,
    buy_box: p.buyBox,
  }));
}

function disclaimer() {
  return "学习沙盒模拟返回，没有调用 Amazon、广告接口、Sorftime 或西柚。";
}

function readPayload(name: string, input: Json, ctx: Awaited<ReturnType<typeof loadBundle>>) {
  const store = {
    id: ctx.store.id,
    name: ctx.store.name,
    marketplace: ctx.store.marketplace,
    ads_profile_id: ctx.store.adsProfileId,
    currency: ctx.store.currency,
  };
  const base = { ok: true, sandbox: true, tool: name, message: disclaimer(), store, echo: input };

  if (name === "meta_list_stores") {
    return {
      ...base,
      stores: ctx.stores.map((s) => ({
        id: s.id,
        name: s.name,
        marketplace: s.marketplace,
        seller_id: s.sellerId,
        ads_profile_id: s.adsProfileId,
        sp_connected: s.spConnected,
        ads_profiles: s.profiles.map((p) => ({
          id: p.id,
          country: p.countryCode,
          enabled: p.enabled,
        })),
      })),
    };
  }
  if (name === "meta_get_usage") {
    return {
      ...base,
      credits: ctx.settings?.credits ?? 0,
      allow_market_research: ctx.connections.some((c) => c.allowMarketResearch),
      allow_ai_execute: ctx.connections.some((c) => c.allowAiExecute),
    };
  }
  if (name === "ads_get_connection_status") {
    return {
      ...base,
      connected: ctx.connections.length > 0,
      profiles: ctx.stores.flatMap((s) =>
        s.profiles.map((p) => ({
          profile_id: s.adsProfileId,
          name: p.name,
          country: p.countryCode,
          enabled: p.enabled,
          account: s.name,
        })),
      ),
    };
  }
  if (name === "ads_get_data_health") {
    const fresh = Boolean(ctx.store.lastSyncedAt);
    return {
      ...base,
      fresh,
      complete: fresh,
      trustworthy: fresh,
      last_synced_at: ctx.store.lastSyncedAt,
      failing_checks: fresh ? [] : ["sync_older_than_expected"],
    };
  }
  if (name === "ads_get_settings") {
    return {
      ...base,
      target_acos: ctx.settings?.adsTargetAcos ?? 0.35,
      click_gate: 15,
      spend_gate: 8,
      negative_orders_gate: 0,
    };
  }
  if (name === "ads_get_sync_status" || name === "data_sync_status") {
    return {
      ...base,
      runs: [
        {
          id: "sync-sandbox",
          status: "succeeded",
          finished_at: ctx.store.lastSyncedAt,
          families: [
            { name: "campaigns", complete: true },
            { name: "keywords", complete: true },
            { name: "search_terms", complete: true },
          ],
        },
      ],
    };
  }
  if (name === "ads_list_entities") {
    return {
      ...base,
      campaigns: ctx.campaigns.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.adType,
        targeting: c.targeting,
        status: c.status,
        daily_budget: c.dailyBudget,
        spend_7d: c.spend7,
        sales_7d: c.sales7,
        acos_7d: c.sales7 ? c.spend7 / c.sales7 : null,
        spend_30d: c.spend30,
        sales_30d: c.sales30,
        acos_30d: c.sales30 ? c.spend30 / c.sales30 : null,
        asin: c.asin,
        keywords: c.keywords.map((k) => ({
          id: k.id,
          text: k.text,
          match_type: k.matchType,
          bid: k.bid,
          suggested_bid: k.suggestedBid,
          spend_30d: k.spend30,
          sales_30d: k.sales30,
          orders_30d: k.orders30,
          wasted: k.wasted,
        })),
      })),
    };
  }
  if (name === "ads_list_recommendations") {
    return {
      ...base,
      recommendations: ctx.recommendations.map((r) => ({
        id: r.id,
        campaign: r.campaignName,
        kind: r.kind,
        target: r.target,
        match_type: r.matchType,
        current_bid: r.currentBid,
        proposed_bid: r.proposedBid,
        reason: r.reasonZh,
        monthly_waste: r.monthlyWaste,
        status: r.status,
      })),
    };
  }
  if (name === "ads_get_bid_recommendations") {
    const keywords = String(input.keywords ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const source = keywords.length
      ? keywords
      : ctx.campaigns.flatMap((c) => c.keywords.map((k) => k.text)).slice(0, 6);
    return {
      ...base,
      match_type: input.match_type ?? "EXACT",
      bids: source.map((text, i) => ({
        expression: text,
        suggested: Number((0.45 + i * 0.08).toFixed(2)),
        range_start: Number((0.32 + i * 0.05).toFixed(2)),
        range_end: Number((0.7 + i * 0.09).toFixed(2)),
      })),
      auto_themes: input.auto_targeting
        ? ["CLOSE_MATCH", "LOOSE_MATCH", "SUBSTITUTES", "COMPLEMENTS"].map((theme, i) => ({
            theme,
            suggested: Number((0.4 + i * 0.05).toFixed(2)),
          }))
        : [],
    };
  }
  if (name === "restock_get_stockout_alerts" || name === "restock_get_plan" || name === "restock_get_forecast") {
    const rows = ctx.products
      .filter((p) => p.daysOfCover <= 21)
      .map((p) => ({
        sku: p.sku,
        asin: p.asin,
        title: p.title,
        fulfillable: p.fulfillable,
        days_of_cover: p.daysOfCover,
        velocity_30d: p.velocity30,
        suggested_qty: p.suggestedQty,
        latest_order_in_days: p.latestOrderIn,
      }));
    return { ...base, rows };
  }
  if (name === "restock_get_clearance") {
    return {
      ...base,
      rows: ctx.products
        .filter((p) => p.ageDays >= 120)
        .map((p) => ({
          sku: p.sku,
          age_days: p.ageDays,
          fulfillable: p.fulfillable,
          storage_fee_month: p.storageFeeMo,
        })),
    };
  }
  if (name === "restock_list_shipment_drafts" || name === "restock_get_shipment_draft") {
    return {
      ...base,
      drafts: ctx.shipments.map((s) => ({
        id: s.id,
        name: s.name,
        status: s.status,
        dest: s.dest,
        fee: s.fee,
        skus: s.skus,
      })),
    };
  }
  if (name === "listing_get_live" || name === "listing_check_restrictions") {
    const sku = String(input.sku ?? "");
    const rows = ctx.products.filter((p) => !sku || p.sku === sku || p.asin === sku);
    return {
      ...base,
      restrictions: rows.map((p) => ({ asin: p.asin, sku: p.sku, restricted: false })),
      listings: rows.map((p) => ({
        asin: p.asin,
        sku: p.sku,
        title: p.title,
        price: p.price,
        status: p.status,
      })),
    };
  }
  if (name === "finance_get_fee_estimate") {
    const price = Number(input.price ?? ctx.products[0]?.price ?? 0);
    const product = ctx.products.find((p) => p.asin === input.asin || p.sku === input.sku) ?? ctx.products[0];
    const referral = price * (product?.referralRate ?? 0.15);
    const fba = product?.fbaFee ?? 0;
    return {
      ...base,
      price,
      referral_fee: Number(referral.toFixed(2)),
      fba_fee: fba,
      currency: ctx.store.currency,
    };
  }
  if (name === "finance_get_balances") {
    const sales30 = ctx.products.reduce((s, p) => s + p.sales30, 0);
    return {
      ...base,
      currency: ctx.store.currency,
      available: Number((sales30 * 0.42).toFixed(2)),
      deferred: Number((sales30 * 0.18).toFixed(2)),
    };
  }
  if (name === "orders_get_recent" || name === "orders_check_review_eligibility") {
    return {
      ...base,
      orders: ctx.products.slice(0, 3).map((p, i) => ({
        order_id: `SAND-${p.sku}-${i + 1}`,
        asin: p.asin,
        sku: p.sku,
        units: 1,
        eligible_for_review_request: i !== 1,
      })),
    };
  }
  if (name === "promotions_search" || name === "promotions_get" || name === "promotions_get_items") {
    return {
      ...base,
      promotions: [
        {
          id: "promo-coupon-sandbox",
          type: "COUPON",
          status: "RUNNING",
          discount: "10%",
          asins: ctx.products.slice(0, 2).map((p) => p.asin),
        },
      ],
    };
  }
  if (name === "data_list_tables") return { ...base, tables: TABLES };
  if (name === "data_describe_table") {
    const table = String(input.table ?? "orders_daily");
    return {
      ...base,
      table,
      columns: ["date", "store_id", "asin", "sku", "value"],
      note: TABLES.includes(table) ? "sandbox column sketch" : "unknown table in this sandbox",
    };
  }
  if (name === "data_query") {
    const sql = String(input.sql ?? "");
    const hit = TABLES.find((table) => sql.toLowerCase().includes(table));
    return {
      ...base,
      sql_executed: false,
      table: hit ?? null,
      rows: sampleProducts(ctx),
    };
  }
  if (name === "market_research_keyword" || name === "market_aba_keywords" || name === "market_mine_keywords") {
    const keyword = String(input.keyword ?? "insulated kettle");
    return {
      ...base,
      keyword,
      sample: true,
      groups: [
        { intent: "core", terms: [keyword, `${keyword} stainless`] },
        { intent: "attribute", terms: [`${keyword} 1.7l`, `${keyword} auto shutoff`] },
        { intent: "backend_only", terms: [`${keyword} replacement`] },
      ],
    };
  }
  if (name === "market_get_asin" || name === "market_find_products" || name === "market_list_competitors") {
    return {
      ...base,
      sample: true,
      items: ctx.products.slice(0, 3).map((p) => ({
        asin: p.asin,
        title: p.titleEn,
        price: p.price,
        rating: p.rating,
        reviews: p.reviewCount,
        bsr: p.bsr,
      })),
    };
  }
  if (name === "market_get_reviews") {
    return {
      ...base,
      sample: true,
      pains: [
        { theme: "size ran small", count: 18 },
        { theme: "lid leaked", count: 11 },
        { theme: "color differed from photo", count: 7 },
      ],
    };
  }
  if (name === "meta_search_skills" || name === "meta_load_skill" || name === "meta_list_workflows") {
    return { ...base, note: "Use the Skills and Workflow pages in this sandbox for the full inventory." };
  }
  if (name === "catalog_search_product_types" || name === "catalog_get_product_type") {
    return {
      ...base,
      product_types: ["KITCHEN", "HOME", "SPORTING_GOODS", "ELECTRONIC_CABLE", "COMPUTER_ADD_ON"],
    };
  }

  const fixture = fixtureFor(name, input, {
    store: ctx.store,
    products: ctx.products,
    campaigns: ctx.campaigns,
    shipments: ctx.shipments,
  });
  if (fixture) return { ...base, ...fixture };

  if (name.startsWith("restock_")) {
    const skus = ctx.products.map((p) => ({
      sku: p.sku,
      asin: p.asin,
      fulfillable: p.fulfillable,
      days_of_cover: p.daysOfCover,
      eligible: p.daysOfCover <= 45,
    }));
    return {
      ...base,
      skus,
      shipments: ctx.shipments,
      inbound_plans: ctx.shipments.map((s) => ({ id: s.id, name: s.name, status: s.status, dest: s.dest })),
      labels: { page_type: "PackageLabel_Letter_6", ready: false },
    };
  }
  if (name.startsWith("listing_")) {
    return {
      ...base,
      aplus: ctx.products.slice(0, 2).map((p) => ({ asin: p.asin, status: "DRAFT", modules: ["STANDARD_HEADER", "STANDARD_THREE_IMAGE_TEXT"] })),
      uploads: [],
    };
  }
  if (name.startsWith("market_") || name.startsWith("competitor_")) {
    return {
      ...base,
      sample: true,
      nodes: [
        { node_id: "1055398", name: "Home & Kitchen" },
        { node_id: "2972638011", name: "Sports & Outdoors" },
      ],
      vendor_tools: ["product_search", "keyword_trend", "review_mining"],
      items: sampleProducts(ctx),
    };
  }
  if (name.startsWith("meta_")) {
    return {
      ...base,
      workflow_runs: [],
      note: "Sandbox has no saved remote workflow run for this id. Open Workflow Templates to rehearse one.",
    };
  }

  return {
    ...base,
    sample: sampleProducts(ctx),
    campaigns: ctx.campaigns.slice(0, 2).map((c) => ({ id: c.id, name: c.name, spend_7d: c.spend7 })),
  };
}

function listingDraftFrom(ctx: Awaited<ReturnType<typeof loadBundle>>, input: Json) {
  const sku = String(input.sku ?? "");
  const product = ctx.products.find((p) => p.sku === sku || p.asin === sku) ?? ctx.products[0];
  const title = `${product?.brand ?? "Sandbox"} ${product?.title ?? "New listing"}`;
  const bullets = [
    `Fits the daily use promised by ${product?.titleEn ?? "the product"}.`,
    "Materials and size are stated in the title so the main image is not doing that work alone.",
    "Care and compatibility are spelled out before the buyer has to open a review.",
    "The search terms below stay out of the title.",
  ];
  return {
    sku: product?.sku ?? (sku || "NEW-SKU"),
    asin: product?.asin ?? null,
    title,
    bullets,
    searchTerms: `${product?.category ?? "home"} replacement spare gift`,
  };
}

export function buildPreview(
  name: string,
  input: Json,
  ctx: Awaited<ReturnType<typeof loadBundle>>,
) {
  if (name.startsWith("ads_")) {
    const wasted = ctx.campaigns.flatMap((c) =>
      c.keywords.filter((k) => k.wasted || k.bid > k.suggestedBid + 0.05),
    );
    const lines = (ctx.recommendations.length ? ctx.recommendations : []).map((r) => ({
      target: r.target,
      match: r.matchType,
      before: `$${r.currentBid.toFixed(2)}`,
      after: `$${r.proposedBid.toFixed(2)}`,
      note: r.reasonEn,
    }));
    const fromInput = parseMaybe(input.changes_json);
    return {
      headline: "Ads change preview",
      lines: lines.length
        ? lines
        : wasted.map((k) => ({
            target: k.text,
            match: k.matchType,
            before: `$${k.bid.toFixed(2)}`,
            after: `$${k.suggestedBid.toFixed(2)}`,
            note: "Sandbox suggestion",
          })),
      raw: fromInput,
      note: "Nothing is sent to Amazon. Approving applies the bid preview inside this sandbox.",
      effects: {
        keywordBids: wasted.map((k) => ({ id: k.id, bid: k.suggestedBid })),
        recommendationIds: ctx.recommendations.map((r) => r.id),
      },
    };
  }

  if (name.startsWith("restock_")) {
    const rows = ctx.products.filter((p) => p.daysOfCover <= 14 && p.suggestedQty > 0);
    const skus = rows.map((p) => ({
      sku: p.sku,
      asin: p.asin,
      qty: p.suggestedQty,
      days: p.daysOfCover,
    }));
    const fee = Number(skus.reduce((sum, row) => sum + row.qty * 0.35, 0).toFixed(2));
    return {
      headline: "Shipment preview",
      lines: skus.map((row) => ({
        target: row.sku,
        match: row.asin,
        before: `${row.days} days cover`,
        after: `+${row.qty}`,
        note: "Suggested quantity",
      })),
      note: "Placement and carrier fees are sandbox estimates. Approving creates a local draft only.",
      effects: {
        shipment: {
          name: `FBA-SANDBOX-${new Date().toISOString().slice(0, 10)}`,
          skus,
          dest: "SMF3 · split into 2 shipments (sample)",
          fee,
        },
      },
    };
  }

  if (name.startsWith("listing_")) {
    const draft = listingDraftFrom(ctx, input);
    return {
      headline: "Listing change preview",
      lines: [
        { target: draft.sku, match: "title", before: "live title", after: draft.title, note: "preview" },
        ...draft.bullets.map((bullet, i) => ({
          target: draft.sku,
          match: `bullet ${i + 1}`,
          before: "—",
          after: bullet,
          note: "preview",
        })),
      ],
      note: "Approving saves a listing draft in the sandbox. It is not submitted to Amazon.",
      effects: { listing: draft },
    };
  }

  return {
    headline: `${name} preview`,
    lines: Object.entries(input)
      .slice(0, 8)
      .map(([key, value]) => ({
        target: key,
        match: "",
        before: "—",
        after: String(value).slice(0, 180),
        note: "echo",
      })),
    note: "Write tools stay in approval until you allow AI execution and confirm.",
    effects: { note: name },
  };
}


function resolveSellfoxStoreId(input: Json): string | null {
  // Prefer explicit Sellfox ids. Ignore sandbox adsProfileId stuffed into store_scope.
  for (const key of ["store_id", "storeId"] as const) {
    const raw = input[key];
    if (typeof raw === "string" && raw.trim()) return raw.trim();
  }
  const scope = input.store_scope;
  if (typeof scope === "string" && scope.trim().startsWith("sellfox-store-")) {
    return scope.trim();
  }
  return null;
}

/** Prefer Sellfox ERP reads when SELLFOX_DATABASE_URL is set. Returns null if tool not mapped. */
async function trySellfoxRead(name: string, input: Json): Promise<Json | null> {
  if (!isSellfoxConfigured()) return null;
  const storeId = resolveSellfoxStoreId(input);
  const limit = input.limit;

  if (name === "meta_list_stores") {
    const stores = await listStores(limit ?? 100);
    return {
      ok: true,
      source: "sellfox",
      sandbox: false,
      tool: name,
      stores,
      count: stores.length,
    };
  }

  if (name === "orders_get_recent") {
    const rows = await salesDailyByStore({ storeId, limit: limit ?? 100 });
    return {
      ok: true,
      source: "sellfox",
      sandbox: false,
      tool: name,
      orders: rows,
      count: rows.length,
    };
  }

  if (
    name === "restock_get_stockout_alerts" ||
    name === "restock_get_plan" ||
    name === "restock_get_forecast"
  ) {
    const [inventory, products] = await Promise.all([
      fbaInventory({ storeId, limit: limit ?? 200 }),
      productDaily({ storeId, limit: limit ?? 100 }),
    ]);
    return {
      ok: true,
      source: "sellfox",
      sandbox: false,
      tool: name,
      rows: inventory,
      product_daily: products,
      count: inventory.length,
    };
  }

  if (name === "listing_get_live" || name === "listing_check_restrictions") {
    const sku = typeof input.sku === "string" ? input.sku : null;
    const asin = typeof input.asin === "string" ? input.asin : null;
    const listings = await listingSnapshots({
      storeId,
      sku,
      asin,
      limit: limit ?? 100,
    });
    return {
      ok: true,
      source: "sellfox",
      sandbox: false,
      tool: name,
      listings,
      restrictions: listings.map((p: { asin?: string; sku?: string }) => ({
        asin: p.asin,
        sku: p.sku,
        restricted: false,
      })),
      count: listings.length,
    };
  }

  if (name === "ads_list_entities") {
    const rows = await adsCampaignDaily({ storeId, limit: limit ?? 200 });
    return {
      ok: true,
      source: "sellfox",
      sandbox: false,
      tool: name,
      campaigns: rows.map((c: Record<string, unknown>) => ({
        id: c.campaignId,
        name: c.campaignName,
        type: c.adType,
        report_date: c.reportDate,
        store_id: c.storeId,
        asin: c.asin,
        msku: c.msku,
        impressions: c.impressions,
        clicks: c.clicks,
        spend: c.cost,
        sales: c.adSales,
        orders: c.adOrders,
        acos:
          c.adSales && Number(c.adSales) > 0
            ? Number(c.cost) / Number(c.adSales)
            : null,
        currency: c.currency,
      })),
      count: rows.length,
    };
  }

  if (name === "ads_get_data_health" || name === "ads_get_sync_status" || name === "data_sync_status") {
    const stores = await listStores(50);
    const withSync = stores.filter((s) => s.last_synced_at);
    return {
      ok: true,
      source: "sellfox",
      sandbox: false,
      tool: name,
      fresh: withSync.length > 0,
      complete: withSync.length > 0,
      trustworthy: withSync.length > 0,
      store_count: stores.length,
      synced_store_count: withSync.length,
      stores: stores.slice(0, 20).map((s) => ({
        id: s.id,
        name: s.name,
        last_synced_at: s.last_synced_at,
      })),
    };
  }

  if (name === "data_list_tables") {
    return {
      ok: true,
      source: "sellfox",
      sandbox: false,
      tool: name,
      tables: [
        "SellfoxStore",
        "SellfoxSalesDailySnapshot",
        "SellfoxProductDailySnapshot",
        "SellfoxFbaInventorySnapshot",
        "SellfoxListingSnapshot",
        "SellfoxAdsCampaignDaily",
        "SellfoxAdsProductDaily",
      ],
    };
  }

  // Explicit sellfox helper aliases if tool defs ever add them
  if (name === "sellfox_sales_daily") {
    const rows = await salesDailyByStore({ storeId, limit: limit ?? 200 });
    return { ok: true, source: "sellfox", sandbox: false, tool: name, rows, count: rows.length };
  }
  if (name === "sellfox_ads_product_daily") {
    const rows = await adsProductDaily({ storeId, limit: limit ?? 200 });
    return { ok: true, source: "sellfox", sandbox: false, tool: name, rows, count: rows.length };
  }
  if (name === "sellfox_product_daily") {
    const rows = await productDaily({
      storeId,
      reportDate: typeof input.report_date === "string" ? input.report_date : null,
      limit: limit ?? 200,
    });
    return { ok: true, source: "sellfox", sandbox: false, tool: name, rows, count: rows.length };
  }

  return null;
}

export async function runTool(name: string, rawInput: Json, storeId?: string | null) {
  const tool = await prisma.toolDef.findUnique({ where: { name } });
  if (!tool) return { status: 404, body: { ok: false, message: `Unknown tool ${name}` } };

  const ctx = await loadBundle(storeId);
  const schema = tool.inputSchema as { properties?: Record<string, { description?: string }> };
  const input: Json = { ...rawInput };
  if (schema.properties?.store_scope && (input.store_scope === undefined || input.store_scope === "")) {
    input.store_scope = ctx.store.adsProfileId;
  }

  // Sellfox-mapped reads: prefer ERP data before sandbox required-field checks.
  if (isSellfoxConfigured() && !needsApproval(tool)) {
    try {
      const sellfoxEarly = await trySellfoxRead(name, input);
      if (sellfoxEarly) {
        await prisma.toolRun.create({
          data: {
            id: randomUUID(),
            storeId: ctx.store.id,
            toolName: name,
            input,
            output: sellfoxEarly,
            status: "completed",
          },
        });
        return { status: 200, body: sellfoxEarly };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const body = {
        ok: false,
        source: "sellfox",
        sandbox: false,
        tool: name,
        error: message,
        message: "Sellfox query failed",
      };
      await prisma.toolRun.create({
        data: {
          id: randomUUID(),
          storeId: ctx.store.id,
          toolName: name,
          input,
          output: body,
          status: "error",
        },
      });
      return { status: 500, body };
    }
  }

  const missing = missingRequired(tool.inputSchema, input);
  if (missing.length) {
    return { status: 400, body: { ok: false, message: "Missing required fields", missing } };
  }

  const marketOn = ctx.connections.some((c) => c.allowMarketResearch);
  const cost = creditCost(name);
  if (isMarket(name) && !marketOn) {
    const body = {
      ok: false,
      blocked: "market_research",
      tool: name,
      message:
        "Allow market research is off. Turn it on for the AI connection on Get Started. This sandbox still will not call a live data vendor.",
    };
    await prisma.toolRun.create({
      data: {
        id: randomUUID(),
        storeId: ctx.store.id,
        toolName: name,
        input,
        output: body,
        status: "blocked",
      },
    });
    return { status: 403, body };
  }

  if (needsApproval(tool)) {
    const preview = buildPreview(name, input, ctx);
    const id = randomUUID();
    await prisma.approval.create({
      data: {
        id,
        storeId: ctx.store.id,
        kind: approvalKind(name),
        toolName: name,
        title: preview.headline,
        summary: preview.note,
        payload: input,
        preview,
        status: "pending",
      },
    });
    await prisma.toolRun.create({
      data: {
        id: randomUUID(),
        storeId: ctx.store.id,
        toolName: name,
        input,
        output: { approvalId: id, preview },
        status: "pending_approval",
        approvalId: id,
      },
    });
    return {
      status: 200,
      body: {
        ok: true,
        sandbox: true,
        status: "pending_approval",
        approvalId: id,
        preview,
        message: "Preview only. Confirm it in Approvals after Allow AI to execute actions is on.",
      },
    };
  }

  if (cost > 0 && (ctx.settings?.credits ?? 0) < cost) {
    return {
      status: 402,
      body: {
        ok: false,
        blocked: "credits",
        cost,
        credits: ctx.settings?.credits ?? 0,
        message: "Not enough credits. Top up in the header. No real charge is made.",
      },
    };
  }

  let output: Json;
  try {
    const sellfox = await trySellfoxRead(name, input);
    output = sellfox ?? readPayload(name, input, ctx);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const body = {
      ok: false,
      source: "sellfox",
      sandbox: false,
      tool: name,
      error: message,
      message: "Sellfox query failed",
    };
    await prisma.toolRun.create({
      data: {
        id: randomUUID(),
        storeId: ctx.store.id,
        toolName: name,
        input,
        output: body,
        status: "error",
      },
    });
    return { status: 500, body };
  }
  if (cost > 0) {
    await prisma.appSetting.update({
      where: { id: "default" },
      data: { credits: { decrement: cost } },
    });
  }
  await prisma.toolRun.create({
    data: {
      id: randomUUID(),
      storeId: ctx.store.id,
      toolName: name,
      input,
      output,
      status: "completed",
    },
  });
  return { status: 200, body: output };
}

export async function decideApproval(id: string, decision: "approved" | "rejected") {
  const approval = await prisma.approval.findUnique({ where: { id } });
  if (!approval) return { status: 404, body: { ok: false, message: "Approval not found" } };
  if (approval.status !== "pending") {
    return { status: 409, body: { ok: false, message: `Already ${approval.status}` } };
  }
  if (decision === "rejected") {
    await prisma.approval.update({
      where: { id },
      data: { status: "rejected", decidedAt: new Date() },
    });
    return { status: 200, body: { ok: true, status: "rejected" } };
  }

  const connections = await prisma.aiConnection.findMany();
  if (!connections.some((c) => c.allowAiExecute)) {
    return {
      status: 409,
      body: {
        ok: false,
        blocked: "execute",
        message:
          "Allow AI to execute actions is off. Turn it on for the connection on Get Started, then approve again. Default is off.",
      },
    };
  }

  const preview = approval.preview as {
    effects?: {
      keywordBids?: { id: string; bid: number }[];
      recommendationIds?: string[];
      shipment?: { name: string; skus: unknown; dest: string; fee: number };
      listing?: {
        sku: string;
        asin: string | null;
        title: string;
        bullets: string[];
        searchTerms: string;
      };
    };
  };
  const effects = preview.effects ?? {};
  for (const bid of effects.keywordBids ?? []) {
    await prisma.keyword.update({ where: { id: bid.id }, data: { bid: bid.bid, wasted: false } }).catch(() => null);
  }
  if (effects.recommendationIds?.length) {
    await prisma.recommendation.updateMany({
      where: { id: { in: effects.recommendationIds } },
      data: { status: "accepted" },
    });
  }
  if (effects.shipment) {
    await prisma.shipmentDraft.create({
      data: {
        id: randomUUID(),
        storeId: approval.storeId,
        name: effects.shipment.name,
        status: "confirmed in sandbox",
        skus: effects.shipment.skus as never,
        dest: effects.shipment.dest,
        fee: effects.shipment.fee,
      },
    });
  }
  if (effects.listing) {
    await prisma.listingDraft.create({
      data: {
        id: randomUUID(),
        storeId: approval.storeId,
        sku: effects.listing.sku,
        asin: effects.listing.asin,
        title: effects.listing.title,
        bullets: effects.listing.bullets,
        searchTerms: effects.listing.searchTerms,
        status: "draft saved in sandbox",
      },
    });
  }
  await prisma.approval.update({
    where: { id },
    data: { status: "approved", decidedAt: new Date() },
  });
  return {
    status: 200,
    body: {
      ok: true,
      status: "approved",
      message: "Applied inside the sandbox only.",
      applied: {
        bids: effects.keywordBids?.length ?? 0,
        shipment: Boolean(effects.shipment),
        listing: Boolean(effects.listing),
      },
    },
  };
}
