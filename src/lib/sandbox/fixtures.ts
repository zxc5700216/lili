type Product = {
  asin: string;
  sku: string;
  title: string;
  titleEn: string;
  price: number;
  fulfillable: number;
  daysOfCover: number;
  suggestedQty: number;
  bsr: number;
  rating: number;
  reviewCount: number;
  buyBox: boolean;
  buyBoxPrice?: number | null;
  refundRate: number;
  ageDays: number;
  storageFeeMo: number;
  sales30: number;
  units30: number;
};

type Campaign = {
  id: string;
  name: string;
  spend30: number;
  sales30: number;
  keywords: { text: string; matchType: string; bid: number; spend30: number; orders30: number; wasted: boolean }[];
};

type Shipment = { id: string; name: string; status: string; dest: string; fee: number; skus: unknown };

export type FixtureCtx = {
  store: { id: string; name: string; marketplace: string; adsProfileId: string; currency: string; sellerId: string };
  products: Product[];
  campaigns: Campaign[];
  shipments: Shipment[];
};

type Json = Record<string, unknown>;

function str(input: Json, key: string, fallback: string) {
  const value = input[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asin(input: Json, ctx: FixtureCtx) {
  const raw = str(input, "asin", "") || str(input, "asins", "");
  return raw.split(",")[0].trim() || ctx.products[0]?.asin || "B0SANDBOX01";
}

function product(input: Json, ctx: FixtureCtx) {
  const id = asin(input, ctx);
  return ctx.products.find((item) => item.asin === id || item.sku === id) ?? ctx.products[0];
}

function draft(input: Json, ctx: FixtureCtx) {
  return str(input, "draft_id", ctx.shipments[0]?.id ?? "ship-seed-ns");
}

export function fixtureFor(name: string, input: Json, ctx: FixtureCtx): Record<string, unknown> | null {
  const p = product(input, ctx);
  const currency = ctx.store.currency;
  switch (name) {
    case "competitor_find_similar":
      return {
        asins: str(input, "asins", p?.asin ?? ""),
        marketplace_id: str(input, "marketplace_id", "ATVPDKIKX0DER"),
        similar: (ctx.products.slice(1, 4).length ? ctx.products.slice(1, 4) : ctx.products).map((item, i) => ({
          asin: item.asin,
          title: item.titleEn,
          price: item.price,
          rating: item.rating,
          reviews: item.reviewCount,
          similarity: Number((0.86 - i * 0.07).toFixed(2)),
        })),
      };
    case "listing_create_image_upload":
      return {
        filename: str(input, "filename", "main.jpg"),
        upload_url: "https://sandbox.local/upload/once",
        public_url: `https://sandbox.local/images/${str(input, "filename", "main.jpg")}`,
        expires_in_seconds: 900,
        note: "Sandbox URL only. Amazon will not accept it.",
      };
    case "listing_get_aplus":
      return {
        content_reference_key: str(input, "content_reference_key", "aplus-sandbox-kettle"),
        name: `${p?.titleEn ?? "Listing"} A+`,
        status: "APPROVED",
        asins: [p?.asin],
        modules: [
          { type: "STANDARD_HEADER", text: p?.titleEn },
          { type: "STANDARD_THREE_IMAGE_TEXT", text: "Size, material, and what the photo does not show." },
        ],
      };
    case "listing_list_aplus":
      return {
        status_filter: input.status ?? null,
        documents: ctx.products.slice(0, 3).map((item, i) => ({
          content_reference_key: `aplus-${item.sku.toLowerCase()}`,
          name: `${item.titleEn} A+`,
          status: i === 2 ? "DRAFT" : "APPROVED",
          asins: [item.asin],
        })),
        missing_aplus: ctx.products.slice(3).map((item) => item.asin),
      };
    case "market_aba_trend":
      return {
        keyword: str(input, "keyword", "electric kettle"),
        marketplace: str(input, "marketplace", "US"),
        granularity: str(input, "granularity", "week"),
        points: [120, 118, 140, 210, 260, 190, 150].map((searches, i) => ({
          period: `W${i + 1}`,
          search_frequency_rank: 4000 - i * 120,
          searches,
        })),
      };
    case "market_find_node":
      return {
        query: str(input, "query", "Kitchen"),
        marketplace: str(input, "marketplace", "US"),
        node_id: "1055398",
        node_id_path: "1055398",
        path: ["Home & Kitchen", str(input, "query", "Kitchen")],
        product_count: 18420,
      };
    case "market_list_sorftime_tools":
      return {
        platform: input.platform ?? "all",
        tools: [
          { name: "walmart_search", platform: "Walmart" },
          { name: "tiktok_shop_search", platform: "TikTok Shop" },
          { name: "shopee_search", platform: "Shopee" },
          { name: "temu_search", platform: "Temu" },
          { name: "ali1688_sourcing", platform: "1688" },
          { name: "reddit_discussions", platform: "Reddit" },
        ],
      };
    case "market_list_xiyou_tools":
      return {
        group: input.group ?? "all",
        tools: [
          { name: "asin_keyword_reverse", group: "traffic" },
          { name: "keyword_competing_asins", group: "traffic" },
          { name: "rank_trend", group: "rank" },
        ],
      };
    case "market_query_sorftime":
      return {
        tool: str(input, "tool", "walmart_search"),
        arguments: input.arguments_json ?? "{}",
        rows: [{ title: p?.titleEn, price: p?.price, platform_rank: 42, sample: true }],
      };
    case "market_query_xiyou":
      return {
        tool: str(input, "tool", "asin_keyword_reverse"),
        arguments: input.arguments_json ?? "{}",
        rows: (ctx.campaigns[0]?.keywords ?? []).slice(0, 3).map((k) => ({
          keyword: k.text,
          organic_rank: 18,
          ad_rank: 4,
          asin: p?.asin,
        })),
      };
    case "market_scan_node":
      return {
        node_id_path: str(input, "node_id_path", "1055398"),
        marketplace: str(input, "marketplace", "US"),
        overview: { product_count: 18420, avg_price: 28.4, avg_rating: 4.3, avg_reviews: 860, new_product_share: 0.18 },
        price_bands: [
          { band: "0-20", share: 0.31 },
          { band: "20-40", share: 0.44 },
          { band: "40+", share: 0.25 },
        ],
        top: ctx.products.slice(0, 3).map((item) => ({ asin: item.asin, price: item.price, bsr: item.bsr })),
      };
    case "meta_deep_analysis":
      return {
        question: str(input, "question", ""),
        domain: str(input, "domain", "store"),
        angles: ["sales", "ads", "inventory"],
        findings: ctx.products.slice(0, 3).map((item) => ({
          asin: item.asin,
          sales_30d: item.sales30,
          days_of_cover: item.daysOfCover,
          buy_box: item.buyBox,
        })),
      };
    case "meta_get_workflow_run":
      return {
        run_id: str(input, "run_id", "run-sandbox"),
        status: "completed",
        steps: [
          { n: 1, status: "ok", writes_skipped: 0 },
          { n: 2, status: "skipped", reason: "mutating step waits for its own confirm gate" },
        ],
      };
    case "meta_run_workflow":
      return {
        workflow_id: str(input, "workflow_id", "monday-review"),
        dry_run: input.dry_run !== false,
        executed: ["read steps"],
        skipped_writes: ["any tool that would change the store"],
      };
    case "restock_check_inbound_eligibility":
      return {
        asin: p?.asin,
        program: str(input, "program", "INBOUND"),
        eligible: true,
        reasons: [],
      };
    case "restock_get_awd_status":
      return { in_use: false, inventory: [], inbound: [], note: "This sandbox store does not use AWD." };
    case "restock_get_delivery_challan":
      return {
        draft_id: draft(input, ctx),
        shipment_id: str(input, "shipment_id", "sh-sandbox-1"),
        marketplace: "IN",
        download_url: "https://sandbox.local/challan.pdf",
        expires_in_seconds: 15,
      };
    case "restock_get_hygiene":
      return {
        unmapped_skus: ctx.products.filter((item) => item.daysOfCover < 10).map((item) => item.sku),
        missing_box_specs: [],
        issues: ctx.products.filter((item) => !item.buyBox).map((item) => ({ sku: item.sku, issue: "buy_box_lost" })),
      };
    case "restock_get_inbound_plan":
      return {
        inbound_plan_id: str(input, "inbound_plan_id", "ip-sandbox"),
        status: "ACTIVE",
        source: ctx.store.name,
        items: ctx.products.slice(0, 2).map((item) => ({ sku: item.sku, fnsku: `X${item.sku.slice(0, 6)}`, qty: item.suggestedQty || 40 })),
        shipments: [{ shipment_id: "sh-sandbox-1", status: "WORKING", warehouse_id: "SMF3" }],
      };
    case "restock_get_inbound_settings":
      return {
        ship_from: { name: ctx.store.name, country: "CN", city: "Shenzhen" },
        missing_carton_dims: [],
        missing_seller_sku: [],
        ready: true,
      };
    case "restock_get_item_compliance":
      return {
        draft_id: input.draft_id ?? null,
        items: ctx.products.slice(0, 3).map((item) => ({
          sku: item.sku,
          asin: item.asin,
          fnsku: `X${item.sku.slice(0, 6)}`,
          hsn: "8516",
          declared_value: item.price,
          currency,
        })),
      };
    case "restock_get_item_labels":
      return {
        draft_id: input.draft_id ?? draft(input, ctx),
        label_type: str(input, "label_type", "STANDARD"),
        page_type: str(input, "page_type", "PackageLabel_Letter_6"),
        download_url: "https://sandbox.local/fnsku-labels.pdf",
        units: ctx.products.reduce((sum, item) => sum + Math.max(item.suggestedQty, 0), 0) || 120,
      };
    case "restock_get_mcf_order":
      return {
        order_id: str(input, "order_id", "mcf-sandbox-1"),
        status: "COMPLETE",
        speed: "Standard",
        tracking: "SANDBOXTRACK1",
        skus: [{ sku: p?.sku, quantity: 1 }],
      };
    case "restock_get_plan_contents":
      return {
        what: str(input, "what", "boxes"),
        draft_id: input.draft_id ?? draft(input, ctx),
        boxes: [{ box_id: "BOX1", skus: [{ sku: p?.sku, qty: 12 }], weight_kg: 8.4 }],
        items: [{ sku: p?.sku, qty: 12 }],
        pallets: [],
      };
    case "restock_get_reference_summary":
      return {
        tables: [
          { name: "sku_mapping", rows: ctx.products.length },
          { name: "seasonal_index", rows: 12 },
          { name: "box_specs", rows: ctx.products.length },
        ],
      };
    case "restock_get_shipment_labels":
      return {
        draft_id: draft(input, ctx),
        shipment_id: input.shipment_id ?? "sh-sandbox-1",
        page_type: str(input, "page_type", "PackageLabel_Letter_6"),
        downloads: [{ shipment_id: "sh-sandbox-1", url: "https://sandbox.local/box-labels.pdf", expires_in_seconds: 15 }],
      };
    case "restock_get_shipments":
      return {
        draft_id: draft(input, ctx),
        shipments: [
          {
            shipment_id: str(input, "shipment_id", "sh-sandbox-1"),
            warehouse_id: "SMF3",
            destination: { city: "Stockton", state: "CA", country: "US" },
            status: "WORKING",
          },
        ],
      };
    case "restock_list_inbound_plans":
      return {
        status: input.status ?? "ACTIVE",
        plans: ctx.shipments.map((s) => ({ inbound_plan_id: s.id, name: s.name, status: "ACTIVE", updated_at: "2026-10-27" })),
      };
    case "restock_list_mcf_orders":
      return {
        days: input.days ?? 14,
        orders: [{ order_id: "mcf-sandbox-1", status: "COMPLETE", speed: "Standard", sku: p?.sku }],
      };
    case "restock_prepare_cancel_plan":
      return {
        draft_id: draft(input, ctx),
        committed: { placement: false, carrier: false },
        voidable_until: null,
        effect: "Cancelling would void this sandbox plan only after approval.",
      };
    case "restock_preview_mcf":
      return {
        address: input.address_json ?? {},
        items: input.items_json ?? [{ sku: p?.sku, quantity: 1 }],
        speeds: [
          { speed: "Standard", fee: 6.4, currency, arrival_days: "5-7", feasible: true },
          { speed: "Expedited", fee: 9.1, currency, arrival_days: "2-3", feasible: true },
          { speed: "Priority", fee: 14.8, currency, arrival_days: "1", feasible: p ? p.fulfillable > 0 : false },
        ],
      };
    case "restock_query_plan":
      return {
        query: input.query ?? "",
        only_restock: Boolean(input.only_restock),
        rows: ctx.products.map((item) => ({
          sku: item.sku,
          asin: item.asin,
          velocity_30d: Number((item.units30 / 30).toFixed(2)),
          fulfillable: item.fulfillable,
          suggested_qty: item.suggestedQty,
          explain: item.daysOfCover <= 14 ? "Cover is under 14 days." : "Cover is comfortable.",
        })),
      };
    default:
      return null;
  }
}
