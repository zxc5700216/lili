import fs from "node:fs";
import path from "node:path";
import { runSelectionDoc } from "../selection-doc/run";
import { isProviderReady, requiredProviders, type ProviderId } from "../tool-config/providers";
import { loadConfig } from "../tool-config/store";
import { MissingConfigError, testProvider } from "../tool-config/test-connection";

export const WORKFLOWS = [
  { slug: "monday-review", title: "周一经营例会", titleEn: "Monday business review", skills: ["store-weekly-review", "weekly-ads-review-routine", "buybox-competition-watch", "turbot-inventory-restock"] },
  { slug: "ads-stop-bleeding", title: "广告止血", titleEn: "Stop the ad bleed", skills: ["acos-spike-triage", "wasted-spend-audit", "negative-keyword-strategy", "bid-adjustment-strategy"] },
  { slug: "sales-drop", title: "销量下滑全链路诊断", titleEn: "Diagnose a sales drop end to end", skills: ["traffic-conversion-triage", "buybox-competition-watch", "impression-drop-diagnosis", "low-conversion-diagnosis"] },
  { slug: "new-listing-to-ads", title: "新品从上架到开广告", titleEn: "Launch: listing to ads", skills: ["amazon-keyword-research", "listing-new-product-oneshot", "acos-target-setting", "ads-build-from-scratch"] },
  { slug: "selection-doc", title: "从选品到开品文档", titleEn: "From idea to product brief", skills: ["amazon-niche-finder", "amazon-product-research", "amazon-review-analyzer", "tariff-calculator-amazon", "amazon-product-selection"] },
  { slug: "competitor-teardown", title: "竞品全拆解", titleEn: "Full competitor teardown", skills: ["competitor-playbook-teardown", "amazon-competitor-analysis", "amazon-review-analyzer"] },
  { slug: "restock-to-ship", title: "补货到发货一条龙", titleEn: "Restock through to shipment", skills: ["turbot-inventory-restock", "fba-inbound-shipment", "amazon-fba-shipment-kit"] },
  { slug: "profit-checkup", title: "利润体检", titleEn: "Profit health check", skills: ["profit-fee-analysis", "reimbursement-recovery", "clearance-aging-decision", "amazon-return-weekly-analysis"] },
  { slug: "peak-prep", title: "大促备战", titleEn: "Get ready for a sales peak", skills: ["turbot-seasonal-planning", "turbot-inventory-restock", "amazon-deal-finder", "seasonal-peak-preparation"] },
  { slug: "sunset-sku", title: "老品清退", titleEn: "Retire an aging product", skills: ["clearance-aging-decision", "ads-sunset-wind-down", "turbot-coupon-strategy"] },
  { slug: "returns-push", title: "退货攻坚", titleEn: "Bring returns down", skills: ["amazon-return-weekly-analysis", "turbot-return-reduction", "amazon-listing-optimization"] },
  { slug: "monthly-report", title: "月度经营报告", titleEn: "Monthly business report", skills: ["amazon-ads-performance-report", "profit-fee-analysis", "promotions-review", "multi-marketplace-ads-review"] },
] as const;

export type WorkflowSlug = (typeof WORKFLOWS)[number]["slug"];

const PRODUCTS = [
  { sku: "NS-KETTLE-SS", asin: "B0NSKETTLE1", title: "1.7L 不锈钢电热水壶", price: 32.99, cost: 9.4, ship: 2.1, fba: 5.8, sales7: 1055, sales30: 4552, sessions7: 980, sessionsPrev: 1100, conv7: 0.082, convPrev: 0.09, buyBox: true, buyBoxPrice: null as number | null, days: 9, suggest: 420, refund: 0.04, age: 40, storage: 18 },
  { sku: "NS-YOGA-TPE", asin: "B0NSYOGMAT2", title: "TPE 瑜伽垫", price: 24.99, cost: 6.2, ship: 3.4, fba: 6.1, sales7: 549, sales30: 2249, sessions7: 640, sessionsPrev: 600, conv7: 0.11, convPrev: 0.1, buyBox: true, buyBoxPrice: null, days: 46, suggest: 0, refund: 0.03, age: 70, storage: 22 },
  { sku: "NS-LAMP-WD", asin: "B0NSLAMP003", title: "木质台灯", price: 39.99, cost: 11, ship: 3.8, fba: 6.4, sales7: 319, sales30: 1919, sessions7: 410, sessionsPrev: 520, conv7: 0.04, convPrev: 0.07, buyBox: false, buyBoxPrice: 36.5, days: 12, suggest: 80, refund: 0.06, age: 160, storage: 31 },
  { sku: "NS-BTL-750", asin: "B0NSBOTTLE4", title: "运动水壶", price: 18.99, cost: 3.1, ship: 1.6, fba: 4.2, sales7: 531, sales30: 1823, sessions7: 880, sessionsPrev: 840, conv7: 0.09, convPrev: 0.088, buyBox: true, buyBoxPrice: null, days: 21, suggest: 60, refund: 0.05, age: 55, storage: 12 },
  { sku: "NS-ORG-4P", asin: "B0NSORG0005", title: "抽屉收纳盒", price: 27.49, cost: 5.5, ship: 2.8, fba: 5.9, sales7: 247, sales30: 1099, sessions7: 300, sessionsPrev: 280, conv7: 0.06, convPrev: 0.07, buyBox: true, buyBoxPrice: null, days: 8, suggest: 240, refund: 0.08, age: 210, storage: 27 },
  { sku: "NS-PET-SLOW", asin: "B0NSPET0006", title: "宠物慢食碗", price: 16.99, cost: 2.4, ship: 1.5, fba: 4, sales7: 305, sales30: 1189, sessions7: 500, sessionsPrev: 470, conv7: 0.1, convPrev: 0.11, buyBox: true, buyBoxPrice: null, days: 38, suggest: 0, refund: 0.11, age: 90, storage: 9 },
];

const CAMPAIGNS = [
  { name: "SP kettle exact", spend7: 180, sales7: 260, spend30: 640, sales30: 980 },
  { name: "SP kettle auto", spend7: 96, sales7: 310, spend30: 310, sales30: 1040 },
  { name: "SP lamp phrase", spend7: 140, sales7: 90, spend30: 520, sales30: 410 },
  { name: "SP organizer auto", spend7: 40, sales7: 30, spend30: 150, sales30: 80 },
];

const WASTED = [
  { term: "kettle stainless steel", match: "EXACT", spend30: 86, bid: 1.1, suggested: 0.7, negative: "exact" },
  { term: "lamp for bedroom kids", match: "PHRASE", spend30: 74, bid: 0.8, suggested: 0, negative: "phrase" },
  { term: "drawer organizer", match: "BROAD", spend30: 54, bid: 0.7, suggested: 0.48, negative: "phrase" },
];

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

function profit(p: (typeof PRODUCTS)[number]) {
  const referral = p.price * 0.15;
  return p.price - p.cost - p.ship - p.fba - referral;
}

function mdTable(headers: string[], rows: string[][]) {
  return [`| ${headers.join(" | ")} |`, `| ${headers.map(() => "---").join(" | ")} |`, ...rows.map((row) => `| ${row.join(" | ")} |`)].join("\n");
}

function shell(title: string, mode: string, body: string) {
  return [`# ${title}`, "", `模式：${mode}。缺真实密钥时这是 fixture，不会假装已经调通多宝鱼。`, "", body, "", "推断处标 `inferred`。没有采购放行，也没有改真实店铺。"].join("\n");
}

function htmlOf(title: string, markdown: string) {
  const escaped = markdown.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>${title}</title><style>body{margin:0;background:#f6f3ef;color:#1f1a17;font:15px/1.6 sans-serif}main{max-width:880px;margin:24px auto;background:#fff;border:1px solid #efe8e1;border-radius:16px;padding:24px}pre{white-space:pre-wrap}.wm{position:fixed;inset:0;display:grid;place-items:center;font-size:40px;color:rgba(232,106,44,.08);transform:rotate(-16deg);pointer-events:none}</style></head><body><div class="wm">多宝鱼学习沙盒</div><main><pre>${escaped}</pre></main></body></html>`;
}

function reportFor(slug: WorkflowSlug, mode: string) {
  const meta = WORKFLOWS.find((item) => item.slug === slug)!;
  const sales7 = PRODUCTS.reduce((s, p) => s + p.sales7, 0);
  const spend7 = CAMPAIGNS.reduce((s, c) => s + c.spend7, 0);
  const adSales7 = CAMPAIGNS.reduce((s, c) => s + c.sales7, 0);
  const acos = adSales7 ? spend7 / adSales7 : 0;
  const stock = PRODUCTS.filter((p) => p.days <= 14);
  const lost = PRODUCTS.filter((p) => !p.buyBox);
  const waste = WASTED.reduce((s, w) => s + w.spend30, 0);
  const skills = mdTable(["技能", "介入"], meta.skills.map((skill, i) => [skill, `第 ${i + 1} 步`]));
  let body = `## 01｜步骤\n\n${meta.skills.map((skill, i) => `${i + 1}. ${skill}`).join("\n")}\n\n## 02｜技能表\n\n${skills}\n`;

  if (slug === "monday-review") {
    body += `\n## 03｜三句话\n\n1. NS店近 7 天销售 ${money(sales7)}，广告花费 ${money(spend7)}，ACOS ${(acos * 100).toFixed(1)}%。\n2. ${stock.length} 个 SKU 两周内可能断货，${lost.length} 个 ASIN 不在购物车。\n3. 近 30 天浪费花费约 ${money(waste)}，先做否定预览。\n\n## 04｜动作\n\n${mdTable(["优先级", "环节", "动作", "本周指标"], [
      ["1", "库存", `${stock.map((p) => p.sku).join("、")} 按建议量补货`, "可售天数"],
      ["2", "广告", "浪费词先预览否定，不直接改", "花费无订单"],
      ["3", "定价", "台灯购物车在 $36.50，先确认是不是价格", "Buy Box"],
    ])}`;
  } else if (slug === "ads-stop-bleeding") {
    body += `\n## 03｜ACOS 变化\n\n${mdTable(["活动", "7天花费", "7天销售", "ACOS"], CAMPAIGNS.map((c) => [c.name, money(c.spend7), money(c.sales7), c.sales7 ? `${((c.spend7 / c.sales7) * 100).toFixed(1)}%` : "—"]))}\n\n## 04｜否定与出价预览\n\n${mdTable(["词", "匹配", "30天花费", "建议"], WASTED.map((w) => [w.term, w.negative, money(w.spend30), w.suggested ? `出价降到 ${w.suggested}` : "词组否定"]))}\n\n任何改价都先审批。`;
  } else if (slug === "sales-drop") {
    body += `\n## 03｜分诊\n\n${mdTable(["ASIN", "会话 7天/前", "转化 7天/前", "购物车", "判断"], PRODUCTS.map((p) => [p.asin, `${p.sessions7}/${p.sessionsPrev}`, `${(p.conv7 * 100).toFixed(1)}%/${(p.convPrev * 100).toFixed(1)}%`, p.buyBox ? "在" : `丢给 ${p.buyBoxPrice}`, !p.buyBox ? "购物车" : p.sessions7 < p.sessionsPrev ? "流量" : p.conv7 < p.convPrev ? "转化" : "持平"]))}`;
  } else if (slug === "new-listing-to-ads") {
    body += `\n## 03｜Listing 预览（inferred 文案，未提交）\n\n标题：Northshore 1.7L stainless kettle。五点先写容量、自动断电、材质，搜索词不重复标题。\n\n## 04｜起步广告\n\n自动组 + 精确词 electric kettle。新品期 ACOS 按成本倒推，目标先放宽到 45%（inferred）。预算 $25/天。否定词等收割后再加。`;
  } else if (slug === "competitor-teardown") {
    body += `\n## 03｜对照\n\n自己的水壶 4.4 星、在购物车。竞品样本沿用选品账本里的 SUNYA / LEGEND（fixture）。弱点：齐套和围度，不是再做一个普通口袋。\n\n西柚关键词反查需要 MCP Token。没有令牌时这里只保留多宝鱼 market_list_competitors 的计划，不把样本说成西柚实时结果。`;
  } else if (slug === "restock-to-ship") {
    body += `\n## 03｜建议发货\n\n${mdTable(["SKU", "可售天", "建议量"], stock.map((p) => [p.sku, String(p.days), String(p.suggest)]))}\n\n分仓和承运费必须等人确认。箱规不明不猜。批准后只在沙盒生成货件草稿。`;
  } else if (slug === "profit-checkup") {
    body += `\n## 03｜不含采购的费用后毛利\n\n${mdTable(["SKU", "售价", "费用后"], PRODUCTS.map((p) => [p.sku, money(p.price), money(profit(p))]))}\n\n库龄最长的是收纳盒（${PRODUCTS.find((p) => p.sku === "NS-ORG-4P")?.age} 天，月仓储 $${PRODUCTS.find((p) => p.sku === "NS-ORG-4P")?.storage}）。退货最高的是宠物碗 11%。这些数字不含头程以外的广告。`;
  } else if (slug === "peak-prep") {
    body += `\n## 03｜四周时间表（inferred 节奏）\n\n| 周 | 事项 |\n| --- | --- |\n| 1 | 确认水壶和收纳的补货量 |\n| 2 | 只给在购物车的款加预算 |\n| 3 | 算券后还能不能保住费用后毛利 |\n| 4 | 冻结匹配方式和否定，不再改结构 |\n\n台灯丢了购物车，不作为大促主推。`;
  } else if (slug === "sunset-sku") {
    body += `\n## 03｜收纳盒清退\n\n可售 8 天但库龄 210 天，月仓储 $27。广告先降出价两周，看自然单能不能接住（inferred 阶段，不是已执行）。券要先过费用后毛利，毛利不够就不要用券换排名。`;
  } else if (slug === "returns-push") {
    body += `\n## 03｜先改不用动产品的\n\n${mdTable(["SKU", "退货率", "先改"], PRODUCTS.filter((p) => p.refund >= 0.06).map((p) => [p.sku, `${(p.refund * 100).toFixed(0)}%`, p.sku.includes("PET") ? "图片和尺寸说明" : "Listing 预期"]))}\n\n宠物碗 11% 先改文案和图片，不动模具。`;
  } else if (slug === "monthly-report") {
    body += `\n## 03｜一个月的四块\n\n广告花费与销售分开列，不和别的币种相加。NS 店只有美元。促销本月没有第二档秒杀（fixture）。下月三件事：补两周内会断货的 SKU、清浪费词、看台灯购物车。`;
  }

  body += `\n\n## 请求账本\n\n模式 \`${mode}\`。fixture 下列出本应调用的多宝鱼工具名，响应是 NS 店种子，不是远程 JSON。\n\n| 工具 | 用途 |\n| --- | --- |\n| meta_list_stores | 确认店铺 |\n| data_query | 销售与流量 |\n| ads_list_entities | 广告花费 |\n| restock_get_stockout_alerts | 断货 |\n`;
  return shell(`${meta.title} / ${meta.titleEn}`, mode, body);
}

export function workflowDir(slug: string) {
  return path.join(process.cwd(), "artifacts", "workflows", slug);
}

export async function runWorkflowPack(slug: string, mode: "fixture" | "live") {
  const known = WORKFLOWS.find((item) => item.slug === slug);
  if (!known) throw new Error(`未知工作流 ${slug}`);
  if (mode === "live") {
    const config = loadConfig();
    const missing = requiredProviders(slug).filter((id) => !isProviderReady(id, config[id]));
    if (missing.length) throw new MissingConfigError(missing);
    const probe = await testProvider(requiredProviders(slug)[0] as ProviderId);
    if (!probe.ok) throw new Error(probe.message);
  }
  const dir = slug === "selection-doc"
    ? path.join(process.cwd(), "artifacts", "selection-doc", "arrow-bag-quiver")
    : workflowDir(slug);
  if (slug === "selection-doc") {
    const result = runSelectionDoc({ keyword: "arrow bag quiver", marketplace: "US", nicheChoice: "A", quantity: 300, deliver: true }, dir);
    return { ...result, mode, slug };
  }
  fs.mkdirSync(dir, { recursive: true });
  const markdown = reportFor(slug as WorkflowSlug, mode);
  const evidence = { slug, mode, store: "NS店-北美-US", products: PRODUCTS, campaigns: CAMPAIGNS, wasted: WASTED, inferred: true };
  fs.writeFileSync(path.join(dir, "report.md"), markdown);
  fs.writeFileSync(path.join(dir, "evidence.json"), JSON.stringify(evidence, null, 2));
  fs.writeFileSync(path.join(dir, "report.html"), htmlOf(known.title, markdown));
  return { status: "delivered", dir, files: ["report.md", "evidence.json", "report.html"], mode, slug, paidRequests: 0 };
}
