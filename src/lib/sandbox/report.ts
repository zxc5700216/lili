import { randomUUID } from "node:crypto";
import { prisma } from "../prisma";
import type { Locale } from "../tx";
import { buildPreview, loadBundle } from "./engine";

function esc(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function runWorkflow(slug: string, storeId: string | undefined, locale: Locale) {
  const template = await prisma.workflowTemplate.findUnique({ where: { slug } });
  if (!template) return { status: 404, body: { ok: false, message: "Workflow not found" } };
  const ctx = await loadBundle(storeId);
  const sales7 = ctx.products.reduce((sum, p) => sum + p.sales7, 0);
  const sales30 = ctx.products.reduce((sum, p) => sum + p.sales30, 0);
  const spend7 = ctx.campaigns.reduce((sum, c) => sum + c.spend7, 0);
  const adSales7 = ctx.campaigns.reduce((sum, c) => sum + c.sales7, 0);
  const acos = adSales7 ? spend7 / adSales7 : 0;
  const stockouts = ctx.products.filter((p) => p.daysOfCover <= 14);
  const lost = ctx.products.filter((p) => !p.buyBox);
  const wasted = ctx.campaigns.flatMap((c) => c.keywords.filter((k) => k.wasted));
  const waste = wasted.reduce((sum, k) => sum + k.spend30, 0);
  const worst = [...ctx.campaigns].sort(
    (a, b) => b.spend7 / Math.max(b.sales7, 1) - a.spend7 / Math.max(a.sales7, 1),
  )[0];

  const zh = locale !== "en";
  const title = zh ? template.titleZh : template.titleEn;
  const lines = [
    zh
      ? `${ctx.store.name} 近 7 天销售额 ${sales7.toFixed(0)} 美元，广告花费 ${spend7.toFixed(0)}，ACOS ${(acos * 100).toFixed(1)}%。`
      : `${ctx.store.name}: 7-day sales $${sales7.toFixed(0)}, ad spend $${spend7.toFixed(0)}, ACOS ${(acos * 100).toFixed(1)}%.`,
    zh
      ? `${stockouts.length} 个 SKU 可售天数不超过 14 天，${lost.length} 个 ASIN 不在购物车。`
      : `${stockouts.length} SKU have 14 days of cover or less. ${lost.length} ASIN${lost.length === 1 ? " is" : "s are"} off the Buy Box.`,
    zh
      ? `近 30 天浪费花费约 ${waste.toFixed(0)} 美元。变化最大的活动是 ${worst?.name ?? "—"}。`
      : `About $${waste.toFixed(0)} of 30-day spend had no orders. The loudest campaign is ${worst?.name ?? "—"}.`,
  ];
  const actions = [
    ...stockouts.slice(0, 3).map((p) =>
      zh
        ? `库存：${p.sku} 还够 ${p.daysOfCover} 天，建议补 ${p.suggestedQty}，${p.latestOrderIn} 天内下单。`
        : `Inventory: ${p.sku} has ${p.daysOfCover} days of cover. Suggest ${p.suggestedQty} units within ${p.latestOrderIn} days.`,
    ),
    ...wasted.slice(0, 3).map((k) =>
      zh
        ? `广告：搜索词「${k.text}」30 天花费 ${k.spend30.toFixed(0)} 且没有订单，先做否定预览。`
        : `Ads: “${k.text}” spent $${k.spend30.toFixed(0)} in 30 days with no orders. Preview a negative.`,
    ),
    ...lost.slice(0, 2).map((p) =>
      zh
        ? `定价：${p.asin} 购物车在 $${p.buyBoxPrice?.toFixed(2) ?? "—"}，先确认是不是价格问题。`
        : `Pricing: ${p.asin} Buy Box is at $${p.buyBoxPrice?.toFixed(2) ?? "—"}. Confirm whether price is the cause.`,
    ),
  ];

  const steps = template.steps as { n: number; zh: string; en: string; skill: string | null }[];
  const log = steps.map((step) => ({
    n: step.n,
    skill: step.skill,
    note: zh ? "已用沙盒数据演练，没有调用外部接口。" : "Rehearsed on sandbox data. No external API was called.",
    text: zh ? step.zh : step.en,
  }));

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title>
<style>body{font-family:Inter,sans-serif;background:#f6f3ef;color:#1f1a17;margin:0;padding:24px}main{max-width:760px;margin:0 auto;background:#fff;border:1px solid #efe8e1;border-radius:16px;padding:24px}h1{font-size:22px;margin:0 0 8px}li{margin:8px 0}.muted{color:#8d847b;font-size:13px}</style></head>
<body><main><p class="muted">${zh ? "沙盒报告" : "Sandbox report"} · ${esc(ctx.store.name)}</p><h1>${esc(title)}</h1>
<ol>${lines.map((line) => `<li>${esc(line)}</li>`).join("")}</ol>
<h2>${zh ? "动作" : "Actions"}</h2><ol>${actions.map((line) => `<li>${esc(line)}</li>`).join("")}</ol>
<p class="muted">${zh ? "数字来自本地种子数据，不含真实结算。采购成本和头程未计入利润口径。" : "Figures come from local seed data, not a settlement. Product cost and inbound freight are excluded from profit."}</p>
</main></body></html>`;

  const approvals: { id: string; tool: string; title: string }[] = [];
  const toolFor =
    template.category === "ads"
      ? "ads_prepare_changes"
      : template.category === "restock"
        ? "restock_create_shipment_draft"
        : template.category === "listing"
          ? "listing_prepare_change"
          : null;
  if (toolFor) {
    const preview = buildPreview(
      toolFor,
      toolFor === "ads_prepare_changes"
        ? { store_scope: ctx.store.adsProfileId, changes_json: JSON.stringify({ source: slug }) }
        : toolFor === "restock_create_shipment_draft"
          ? { rows_json: JSON.stringify(stockouts.map((p) => ({ sku: p.sku, qty: p.suggestedQty }))) }
          : { product_type: "PRODUCT", sku: ctx.products[0]?.sku ?? "", operation: "UPDATE" },
      ctx,
    );
    const id = randomUUID();
    await prisma.approval.create({
      data: {
        id,
        storeId: ctx.store.id,
        kind: template.category === "listing" ? "listing" : template.category === "restock" ? "restock" : "ads",
        toolName: toolFor,
        title: `${title} · ${preview.headline}`,
        summary: preview.note,
        payload: { workflow: slug },
        preview,
        status: "pending",
      },
    });
    approvals.push({ id, tool: toolFor, title: preview.headline });
  }

  const runId = randomUUID();
  await prisma.workflowRun.create({
    data: {
      id: runId,
      templateSlug: slug,
      storeId: ctx.store.id,
      status: "completed",
      reportHtml: html,
      log,
    },
  });

  return {
    status: 200,
    body: { ok: true, runId, reportHtml: html, log, approvals, store: ctx.store.name },
  };
}
