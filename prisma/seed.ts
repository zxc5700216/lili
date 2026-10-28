import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { prisma } from "../src/lib/prisma";
import { CLASSES } from "../src/lib/classes";

type SkillRow = {
  slug: string;
  zh: string;
  en: string;
  cat: string;
  zhSum: string;
  enSum: string;
  tools: string[];
  stepsZh: string[];
  stepsEn: string[];
};

type Tax = {
  cat: string;
  sort: number;
  isNew: boolean;
  featured: boolean;
  nameEn?: string;
  summaryEn?: string;
};

type WorkflowEn = {
  index: number;
  slug: string;
  category: string;
  titleEn: string;
  summaryEn: string;
  steps: string[];
  close: string;
};

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), file), "utf8")) as T;
}

function skillOf(step: string) {
  const match = step.match(/(?:用|Use)\s+([a-z0-9-]+)/);
  return match?.[1] ?? null;
}

function parseWorkflows(raw: string) {
  return raw
    .split(/\n(?=\d{2} )/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => /^\d{2} /.test(chunk))
    .map((chunk) => {
      const lines = chunk.split("\n");
      const index = Number(lines[0].slice(0, 2));
      const title = lines[0].slice(2).trim();
      const text = lines.slice(1).join("\n");
      const summary = (text.match(/简介：([^\n]+)/)?.[1] ?? "").trim();
      const prompt = (text.split("完整提示词：")[1] ?? "").trim();
      const steps = [...prompt.matchAll(/^\d+\.\s+(.+)$/gm)].map((match) => match[1].trim());
      return { index, title, summary, prompt, steps };
    });
}

function body(title: string, summary: string, steps: string[], tools: string[], zh: boolean) {
  const head = zh ? "这个技能做什么" : "What this skill does";
  const when = zh ? "什么时候用" : "When to use it";
  const order = zh ? "步骤" : "Steps";
  const related = zh ? "相关工具" : "Related tools";
  const guard = zh ? "护栏" : "Guardrail";
  const guardText = zh
    ? "查询可以直接看结果。改 Listing、广告或货件时先生成预览。市场调研和允许执行两个开关默认关闭。"
    : "Reads return immediately. Listing, ads, and shipment changes are previewed first. Market research and execute actions default to off.";
  return [
    `## ${head}`,
    summary,
    "",
    `## ${when}`,
    zh ? `处理「${title}」时加载这份手册。` : `Load this when the job is “${title}”.`,
    "",
    `## ${order}`,
    ...steps.map((step, i) => `${i + 1}. ${step}`),
    "",
    `## ${related}`,
    ...tools.map((tool) => `- \`${tool}\``),
    "",
    `## ${guard}`,
    guardText,
  ].join("\n");
}

async function main() {
  const skills = readJson<SkillRow[]>("data/skills.json");
  const taxonomy = readJson<Record<string, Tax>>("data/taxonomy.json");
  const toolsDoc = fs.readFileSync(path.join(process.cwd(), "data/tool-docs.md"), "utf8");
  const toolsFile = readJson<{ tools: { name: string; description: string; inputSchema: unknown; annotations?: { readOnlyHint?: boolean; idempotentHint?: boolean; destructiveHint?: boolean } }[] }>("data/tools.json");
  const workflowEn = readJson<WorkflowEn[]>("data/workflows-en.json");
  const workflowZh = parseWorkflows(fs.readFileSync(path.join(process.cwd(), "data/workflows.txt"), "utf8"));
  const docs = new Map<string, string>();
  for (const part of toolsDoc.split(/\n(?=## )/)) {
    const name = part.match(/^##\s+([a-z0-9_]+)/)?.[1];
    if (name) docs.set(name, part.trim());
  }

  await prisma.keyword.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.product.deleteMany();
  await prisma.adsProfile.deleteMany();
  await prisma.shipmentDraft.deleteMany();
  await prisma.listingDraft.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.toolRun.deleteMany();
  await prisma.workflowRun.deleteMany();
  await prisma.feedbackNote.deleteMany();
  await prisma.creditOrder.deleteMany();
  await prisma.aiConnection.deleteMany();
  await prisma.toolDef.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.workflowTemplate.deleteMany();
  await prisma.course.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.store.deleteMany();
  await prisma.appSetting.deleteMany();

  const synced = new Date(Date.now() - 10 * 3600 * 1000);
  await prisma.appSetting.create({
    data: {
      id: "default",
      locale: "en",
      credits: 0,
      displayName: "学习者",
      email: "learner@sandbox.local",
      aiConnected: true,
      spAuthorized: true,
      adsAuthorized: true,
      toppedUp: false,
      shopifyShop: "",
      shopifyConnected: false,
      adsTargetAcos: 0.35,
    },
  });

  await prisma.teamMember.create({
    data: {
      id: "member-admin",
      name: "学习者",
      email: "learner@sandbox.local",
      role: "admin",
      status: "active",
      lastSeen: "Today",
    },
  });

  await prisma.aiConnection.create({
    data: {
      id: "conn-codex",
      name: "Codex",
      client: "codex",
      allowMarketResearch: false,
      allowAiExecute: false,
      connectedAt: new Date("2026-10-26T00:00:00.000Z"),
      lastUsedAt: new Date("2026-10-28T00:00:00.000Z"),
    },
  });

  const ns = await prisma.store.create({
    data: {
      id: "store_ns",
      name: "NS店-北美-US",
      code: "NS",
      marketplace: "United States",
      marketplaceId: "ATVPDKIKX0DER",
      region: "NA",
      currency: "USD",
      sellerId: "A1NSSTUDY0001",
      adsProfileId: "ap-ns-us",
      timezone: "America/Los_Angeles",
      spConnected: true,
      adsConnected: true,
      lastSyncedAt: synced,
    },
  });
  const tk = await prisma.store.create({
    data: {
      id: "store_tk",
      name: "TK店-US",
      code: "TK",
      marketplace: "United States",
      marketplaceId: "ATVPDKIKX0DER",
      region: "NA",
      currency: "USD",
      sellerId: "A1TKSTUDY0002",
      adsProfileId: "ap-tk-us",
      timezone: "America/Los_Angeles",
      spConnected: true,
      adsConnected: true,
      lastSyncedAt: synced,
    },
  });

  await prisma.adsProfile.createMany({
    data: [
      { id: "prof-ns-us", storeId: ns.id, name: "NS店-北美-US", country: "United States", countryCode: "US", enabled: true, neverSynced: false, lastSyncedAt: synced },
      { id: "prof-tk-us", storeId: tk.id, name: "TK店-US", country: "United States", countryCode: "US", enabled: true, neverSynced: false, lastSyncedAt: synced },
    ],
  });

  type P = {
    id: string; storeId: string; asin: string; sku: string; title: string; titleEn: string; brand: string; category: string;
    price: number; cost: number; shippingCost: number; fbaFee: number; referralRate: number;
    fulfillable: number; inbound: number; reserved: number; unsellable: number; daysOfCover: number; velocity30: number;
    suggestedQty: number; latestOrderIn: number; ageDays: number; storageFeeMo: number; bsr: number; rating: number;
    reviewCount: number; buyBox: boolean; buyBoxPrice?: number; sessions7: number; sessionsPrev: number;
    conversion7: number; conversionPrev: number; units7: number; units30: number; sales7: number; sales30: number;
    refundRate: number; status: string; hue: number;
  };

  const products: P[] = [
    { id: "p1", storeId: ns.id, asin: "B0NSKETTLE1", sku: "NS-KETTLE-SS", title: "1.7L 不锈钢电热水壶", titleEn: "1.7L stainless electric kettle", brand: "Northshore", category: "Kitchen", price: 32.99, cost: 9.4, shippingCost: 2.1, fbaFee: 5.8, referralRate: 0.15, fulfillable: 42, inbound: 0, reserved: 3, unsellable: 1, daysOfCover: 9, velocity30: 4.6, suggestedQty: 420, latestOrderIn: 3, ageDays: 40, storageFeeMo: 18, bsr: 4200, rating: 4.4, reviewCount: 860, buyBox: true, sessions7: 980, sessionsPrev: 1100, conversion7: 0.082, conversionPrev: 0.09, units7: 32, units30: 138, sales7: 1055, sales30: 4552, refundRate: 0.04, status: "active", hue: 18 },
    { id: "p2", storeId: ns.id, asin: "B0NSYOGMAT2", sku: "NS-YOGA-TPE", title: "TPE 瑜伽垫 6mm", titleEn: "6mm TPE yoga mat", brand: "Northshore", category: "Sports", price: 24.99, cost: 6.2, shippingCost: 3.4, fbaFee: 6.1, referralRate: 0.15, fulfillable: 180, inbound: 40, reserved: 2, unsellable: 0, daysOfCover: 46, velocity30: 3.9, suggestedQty: 0, latestOrderIn: 20, ageDays: 70, storageFeeMo: 22, bsr: 8600, rating: 4.6, reviewCount: 1420, buyBox: true, sessions7: 640, sessionsPrev: 600, conversion7: 0.11, conversionPrev: 0.1, units7: 22, units30: 90, sales7: 549, sales30: 2249, refundRate: 0.03, status: "active", hue: 150 },
    { id: "p3", storeId: ns.id, asin: "B0NSLAMP003", sku: "NS-LAMP-WD", title: "木质台灯", titleEn: "Wood desk lamp", brand: "Northshore", category: "Home", price: 39.99, cost: 11, shippingCost: 3.8, fbaFee: 6.4, referralRate: 0.15, fulfillable: 26, inbound: 0, reserved: 1, unsellable: 0, daysOfCover: 12, velocity30: 2.1, suggestedQty: 80, latestOrderIn: 5, ageDays: 160, storageFeeMo: 31, bsr: 15100, rating: 4.2, reviewCount: 310, buyBox: false, buyBoxPrice: 36.5, sessions7: 410, sessionsPrev: 520, conversion7: 0.04, conversionPrev: 0.07, units7: 8, units30: 48, sales7: 319, sales30: 1919, refundRate: 0.06, status: "active", hue: 32 },
    { id: "p4", storeId: ns.id, asin: "B0NSBOTTLE4", sku: "NS-BTL-750", title: "运动水壶 750ml", titleEn: "750ml sport bottle", brand: "Northshore", category: "Sports", price: 18.99, cost: 3.1, shippingCost: 1.6, fbaFee: 4.2, referralRate: 0.15, fulfillable: 64, inbound: 0, reserved: 4, unsellable: 0, daysOfCover: 21, velocity30: 3.0, suggestedQty: 60, latestOrderIn: 8, ageDays: 55, storageFeeMo: 12, bsr: 6200, rating: 4.5, reviewCount: 2100, buyBox: true, sessions7: 880, sessionsPrev: 840, conversion7: 0.09, conversionPrev: 0.088, units7: 28, units30: 96, sales7: 531, sales30: 1823, refundRate: 0.05, status: "active", hue: 200 },
    { id: "p5", storeId: ns.id, asin: "B0NSORG0005", sku: "NS-ORG-4P", title: "抽屉收纳盒四件套", titleEn: "4-piece drawer organizers", brand: "Northshore", category: "Home", price: 27.49, cost: 5.5, shippingCost: 2.8, fbaFee: 5.9, referralRate: 0.15, fulfillable: 15, inbound: 0, reserved: 0, unsellable: 2, daysOfCover: 8, velocity30: 1.9, suggestedQty: 240, latestOrderIn: 2, ageDays: 210, storageFeeMo: 27, bsr: 9800, rating: 4.1, reviewCount: 540, buyBox: true, sessions7: 300, sessionsPrev: 280, conversion7: 0.06, conversionPrev: 0.07, units7: 9, units30: 40, sales7: 247, sales30: 1099, refundRate: 0.08, status: "active", hue: 45 },
    { id: "p6", storeId: ns.id, asin: "B0NSPET0006", sku: "NS-PET-SLOW", title: "宠物慢食碗", titleEn: "Slow feeder pet bowl", brand: "Northshore", category: "Pet", price: 16.99, cost: 2.4, shippingCost: 1.5, fbaFee: 4.0, referralRate: 0.15, fulfillable: 90, inbound: 20, reserved: 1, unsellable: 0, daysOfCover: 38, velocity30: 2.4, suggestedQty: 0, latestOrderIn: 18, ageDays: 90, storageFeeMo: 9, bsr: 5400, rating: 4.3, reviewCount: 980, buyBox: true, sessions7: 500, sessionsPrev: 470, conversion7: 0.1, conversionPrev: 0.11, units7: 18, units30: 70, sales7: 305, sales30: 1189, refundRate: 0.11, status: "active", hue: 280 },
    { id: "t1", storeId: tk.id, asin: "B0TKCABLE01", sku: "TK-CBL-C2", title: "USB-C 编织数据线 2m", titleEn: "2m braided USB-C cable", brand: "Track", category: "Electronics", price: 12.99, cost: 1.8, shippingCost: 0.9, fbaFee: 3.4, referralRate: 0.15, fulfillable: 48, inbound: 0, reserved: 6, unsellable: 1, daysOfCover: 11, velocity30: 4.4, suggestedQty: 180, latestOrderIn: 4, ageDays: 30, storageFeeMo: 8, bsr: 2100, rating: 4.4, reviewCount: 3200, buyBox: true, sessions7: 1400, sessionsPrev: 1500, conversion7: 0.07, conversionPrev: 0.08, units7: 40, units30: 150, sales7: 519, sales30: 1948, refundRate: 0.06, status: "active", hue: 210 },
    { id: "t2", storeId: tk.id, asin: "B0TKCASE002", sku: "TK-CASE-M3", title: "透明防摔手机壳", titleEn: "Clear shockproof phone case", brand: "Track", category: "Electronics", price: 14.99, cost: 1.2, shippingCost: 0.8, fbaFee: 3.5, referralRate: 0.15, fulfillable: 120, inbound: 0, reserved: 2, unsellable: 0, daysOfCover: 33, velocity30: 3.6, suggestedQty: 0, latestOrderIn: 14, ageDays: 45, storageFeeMo: 6, bsr: 1800, rating: 4.2, reviewCount: 5400, buyBox: true, sessions7: 1600, sessionsPrev: 1400, conversion7: 0.05, conversionPrev: 0.055, units7: 36, units30: 120, sales7: 539, sales30: 1798, refundRate: 0.09, status: "active", hue: 190 },
    { id: "t3", storeId: tk.id, asin: "B0TKSTAND03", sku: "TK-STAND-AL", title: "铝合金笔记本支架", titleEn: "Aluminum laptop stand", brand: "Track", category: "Office", price: 29.99, cost: 7.5, shippingCost: 2.2, fbaFee: 5.4, referralRate: 0.15, fulfillable: 36, inbound: 0, reserved: 1, unsellable: 0, daysOfCover: 18, velocity30: 2.0, suggestedQty: 40, latestOrderIn: 7, ageDays: 80, storageFeeMo: 14, bsr: 7600, rating: 4.6, reviewCount: 890, buyBox: false, buyBoxPrice: 27.99, sessions7: 260, sessionsPrev: 340, conversion7: 0.06, conversionPrev: 0.08, units7: 10, units30: 44, sales7: 299, sales30: 1319, refundRate: 0.03, status: "active", hue: 220 },
    { id: "t4", storeId: tk.id, asin: "B0TKHUB0004", sku: "TK-HUB-7", title: "USB-C 七合一扩展坞", titleEn: "7-in-1 USB-C hub", brand: "Track", category: "Electronics", price: 42.99, cost: 14, shippingCost: 2.6, fbaFee: 6.2, referralRate: 0.15, fulfillable: 12, inbound: 0, reserved: 0, unsellable: 0, daysOfCover: 7, velocity30: 1.7, suggestedQty: 160, latestOrderIn: 2, ageDays: 25, storageFeeMo: 11, bsr: 3900, rating: 4.3, reviewCount: 670, buyBox: true, sessions7: 390, sessionsPrev: 360, conversion7: 0.07, conversionPrev: 0.075, units7: 11, units30: 42, sales7: 472, sales30: 1805, refundRate: 0.05, status: "active", hue: 250 },
    { id: "t5", storeId: tk.id, asin: "B0TKLIGHT05", sku: "TK-BAR-MON", title: "显示器挂灯", titleEn: "Monitor light bar", brand: "Track", category: "Office", price: 35.99, cost: 8.8, shippingCost: 2.4, fbaFee: 5.7, referralRate: 0.15, fulfillable: 54, inbound: 10, reserved: 2, unsellable: 0, daysOfCover: 27, velocity30: 2.0, suggestedQty: 0, latestOrderIn: 12, ageDays: 60, storageFeeMo: 13, bsr: 5100, rating: 4.5, reviewCount: 1100, buyBox: true, sessions7: 240, sessionsPrev: 230, conversion7: 0.09, conversionPrev: 0.085, units7: 12, units30: 48, sales7: 431, sales30: 1727, refundRate: 0.04, status: "active", hue: 40 },
  ];
  await prisma.product.createMany({ data: products });

  const campaigns = [
    { id: "c1", storeId: ns.id, name: "SP kettle exact", adType: "SP", targeting: "exact", status: "enabled", dailyBudget: 40, spend7: 180, spend30: 640, sales7: 260, sales30: 980, clicks7: 210, clicks30: 800, impr7: 18000, impr30: 72000, orders7: 8, orders30: 30, asin: "B0NSKETTLE1" },
    { id: "c2", storeId: ns.id, name: "SP kettle auto", adType: "SP", targeting: "auto", status: "enabled", dailyBudget: 25, spend7: 96, spend30: 310, sales7: 310, sales30: 1040, clicks7: 140, clicks30: 520, impr7: 22000, impr30: 80000, orders7: 11, orders30: 36, asin: "B0NSKETTLE1" },
    { id: "c3", storeId: ns.id, name: "SP lamp phrase", adType: "SP", targeting: "phrase", status: "enabled", dailyBudget: 30, spend7: 140, spend30: 520, sales7: 90, sales30: 410, clicks7: 160, clicks30: 600, impr7: 14000, impr30: 50000, orders7: 2, orders30: 9, asin: "B0NSLAMP003" },
    { id: "c4", storeId: ns.id, name: "SP organizer auto", adType: "SP", targeting: "auto", status: "enabled", dailyBudget: 15, spend7: 40, spend30: 150, sales7: 30, sales30: 80, clicks7: 50, clicks30: 190, impr7: 9000, impr30: 30000, orders7: 1, orders30: 3, asin: "B0NSORG0005" },
    { id: "c5", storeId: tk.id, name: "SP cable exact", adType: "SP", targeting: "exact", status: "enabled", dailyBudget: 35, spend7: 120, spend30: 400, sales7: 210, sales30: 760, clicks7: 300, clicks30: 1100, impr7: 40000, impr30: 140000, orders7: 16, orders30: 58, asin: "B0TKCABLE01" },
    { id: "c6", storeId: tk.id, name: "SP hub broad", adType: "SP", targeting: "broad", status: "enabled", dailyBudget: 28, spend7: 96, spend30: 340, sales7: 60, sales30: 220, clicks7: 90, clicks30: 300, impr7: 16000, impr30: 54000, orders7: 1, orders30: 5, asin: "B0TKHUB0004" },
  ];
  await prisma.campaign.createMany({ data: campaigns });

  await prisma.keyword.createMany({
    data: [
      { id: "k1", campaignId: "c1", text: "electric kettle", matchType: "EXACT", bid: 1.35, suggestedBid: 0.92, spend30: 220, sales30: 140, clicks30: 180, orders30: 4, wasted: false },
      { id: "k2", campaignId: "c1", text: "kettle stainless steel", matchType: "EXACT", bid: 1.1, suggestedBid: 0.7, spend30: 86, sales30: 0, clicks30: 70, orders30: 0, wasted: true },
      { id: "k3", campaignId: "c3", text: "desk lamp wood", matchType: "PHRASE", bid: 0.95, suggestedBid: 0.55, spend30: 160, sales30: 40, clicks30: 140, orders30: 1, wasted: false },
      { id: "k4", campaignId: "c3", text: "lamp for bedroom kids", matchType: "PHRASE", bid: 0.8, suggestedBid: 0.4, spend30: 74, sales30: 0, clicks30: 90, orders30: 0, wasted: true },
      { id: "k5", campaignId: "c4", text: "drawer organizer", matchType: "BROAD", bid: 0.7, suggestedBid: 0.48, spend30: 54, sales30: 0, clicks30: 60, orders30: 0, wasted: true },
      { id: "k6", campaignId: "c6", text: "usb c hub", matchType: "BROAD", bid: 1.2, suggestedBid: 0.8, spend30: 130, sales30: 40, clicks30: 150, orders30: 1, wasted: false },
      { id: "k7", campaignId: "c6", text: "usb hub for monitor", matchType: "BROAD", bid: 0.9, suggestedBid: 0.5, spend30: 68, sales30: 0, clicks30: 40, orders30: 0, wasted: true },
    ],
  });

  await prisma.recommendation.createMany({
    data: [
      { id: "r1", storeId: ns.id, campaignName: "SP kettle exact", kind: "bid_down", target: "kettle stainless steel", matchType: "EXACT", currentBid: 1.1, proposedBid: 0.7, reasonZh: "30 天有花费无订单", reasonEn: "Spend with no orders in 30 days", monthlyWaste: 86, status: "open" },
      { id: "r2", storeId: ns.id, campaignName: "SP lamp phrase", kind: "negative", target: "lamp for bedroom kids", matchType: "PHRASE", currentBid: 0.8, proposedBid: 0, reasonZh: "意图不匹配，建议词组否定", reasonEn: "Wrong intent. Preview a phrase negative.", monthlyWaste: 74, status: "open" },
      { id: "r3", storeId: ns.id, campaignName: "SP organizer auto", kind: "bid_down", target: "drawer organizer", matchType: "BROAD", currentBid: 0.7, proposedBid: 0.48, reasonZh: "自动组里的浪费词", reasonEn: "Wasted query inside auto", monthlyWaste: 54, status: "open" },
      { id: "r4", storeId: tk.id, campaignName: "SP hub broad", kind: "negative", target: "usb hub for monitor", matchType: "BROAD", currentBid: 0.9, proposedBid: 0, reasonZh: "花费无订单", reasonEn: "Spend with no orders", monthlyWaste: 68, status: "open" },
    ],
  });

  await prisma.shipmentDraft.create({
    data: {
      id: "ship-seed-ns",
      storeId: ns.id,
      name: "FBA-SANDBOX-SAMPLE",
      status: "confirmed in sandbox",
      dest: "SMF3 · sample",
      fee: 42,
      skus: [{ sku: "NS-ORG-4P", qty: 120 }],
    },
  });

  await prisma.toolDef.createMany({
    data: toolsFile.tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      category: tool.name.split("_")[0],
      readOnly: Boolean(tool.annotations?.readOnlyHint),
      idempotent: Boolean(tool.annotations?.idempotentHint),
      destructive: Boolean(tool.annotations?.destructiveHint),
      inputSchema: tool.inputSchema as never,
      docs: docs.get(tool.name) ?? tool.description,
    })),
  });

  await prisma.skill.createMany({
    data: skills.map((skill) => {
      const tax = taxonomy[skill.slug];
      const nameEn = tax?.nameEn ?? skill.en;
      const summaryEn = tax?.summaryEn ?? skill.enSum;
      const promptEn = [
        `Use the Duobaoyu skill ${skill.slug.replace(/^duobaoyu-/, "")}.`,
        summaryEn,
        "",
        "Do it in this order:",
        ...skill.stepsEn.map((step, i) => `${i + 1}. ${step}`),
        "",
        "If a step would change the store or spend money, show a preview and wait for confirmation.",
      ].join("\n");
      const promptZh = [
        `使用多宝鱼技能 ${skill.slug.replace(/^duobaoyu-/, "")}。`,
        skill.zhSum,
        "",
        "按这个顺序做：",
        ...skill.stepsZh.map((step, i) => `${i + 1}. ${step}`),
        "",
        "会修改店铺或产生费用的步骤，先给我预览，我确认后再执行。",
      ].join("\n");
      return {
        slug: skill.slug,
        nameZh: skill.zh,
        nameEn,
        category: tax?.cat ?? skill.cat,
        summaryZh: skill.zhSum,
        summaryEn,
        bodyZh: body(skill.zh, skill.zhSum, skill.stepsZh, skill.tools, true),
        bodyEn: body(nameEn, summaryEn, skill.stepsEn, skill.tools, false),
        stepsZh: skill.stepsZh,
        stepsEn: skill.stepsEn,
        relatedTools: skill.tools,
        promptZh,
        promptEn,
        featured: tax?.featured ?? false,
        isNew: tax?.isNew ?? false,
        sort: tax?.sort ?? 500,
      };
    }),
  });

  const enByIndex = new Map(workflowEn.map((item) => [item.index, item]));
  await prisma.workflowTemplate.createMany({
    data: workflowZh.map((item) => {
      const en = enByIndex.get(item.index);
      if (!en) throw new Error(`missing en workflow ${item.index}`);
      const steps = item.steps.map((zh, i) => ({
        n: i + 1,
        zh,
        en: en.steps[i] ?? zh,
        skill: skillOf(zh) ?? skillOf(en.steps[i] ?? ""),
      }));
      const promptEn = [
        "Use Duobaoyu and follow this order:",
        ...en.steps.map((step, i) => `${i + 1}. ${step}`),
        "",
        en.close,
      ].join("\n");
      return {
        slug: en.slug,
        index: item.index,
        category: en.category,
        titleZh: item.title,
        titleEn: en.titleEn,
        summaryZh: item.summary,
        summaryEn: en.summaryEn,
        promptZh: item.prompt,
        promptEn,
        steps,
      };
    }),
  });

  await prisma.course.createMany({
    data: CLASSES.map((item) => ({
      slug: item.slug,
      titleZh: item.titleZh,
      titleEn: item.titleEn,
      summaryZh: item.summaryZh,
      summaryEn: item.summaryEn,
      level: item.kind,
      minutes: item.kind === "live" ? 60 : 45,
      track: item.kind,
      lessons: { outlineZh: item.outlineZh, outlineEn: item.outlineEn, priceEn: item.priceEn },
    })),
  });

  await prisma.creditOrder.create({
    data: {
      id: "ord-seed-1",
      code: "ORD-20261027-SANDBOX01",
      credits: 50,
      amountCny: 5,
      status: "credited",
      createdAt: new Date("2026-10-27T09:42:00.000Z"),
    },
  });

  const [toolCount, skillCount, caseCount] = await Promise.all([
    prisma.toolDef.count(),
    prisma.skill.count(),
    prisma.workflowTemplate.count(),
  ]);
  console.log(`seeded tools=${toolCount} skills=${skillCount} workflows=${caseCount} stores=2`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
