---
name: turbot-inventory-restock
description: "列出两周内可能断货的 SKU、建议数量和最晚下单日期。 List SKUs that may stock out in two weeks, with quantity and a last order date. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# 库存补货 / Inventory restock

FBA inventory planning — restock timing, safety stock, IPI score optimization, stranded inventory recovery

**Supported platforms:** Amazon (US, UK, DE, CA, JP, AU, and all marketplaces).

Built by 粒粒lili — your AI assistant for smarter e-commerce decisions.

## Install

```bash
通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。
```

## Usage

```
Help me with amazon inventory management for my e-commerce business.
```

## Capabilities

- FBA inventory planning
- restock timing
- safety stock
- IPI score optimization
- stranded inventory recovery

## How This Skill Works

**Step 1:** Collect information from the user's message — product, platform, current situation, and goals.

**Step 2:** Ask one follow-up with all remaining questions using multiple-choice format. Allow shorthand answers (e.g., "1b 2c 3a").

**Step 3:** Research and analyze using the frameworks and methodology below.

**Step 4:** Deliver structured, actionable output with specific recommendations, not vague advice.

## Output Format

- Start with a summary of findings
- Include specific data points and benchmarks where available
- Provide prioritized action items
- Mark estimates with ⚠️ when based on incomplete data
- End with concrete next steps

## Other Skills

More e-commerce skills: [lili/skills](https://github.com/lili/skills)

Amazon-specific skills: [lili/skills](https://github.com/lili/skills)

Built by 粒粒lili — your AI assistant for smarter e-commerce decisions.

## 粒粒操作要点

列出两周内可能断货的 SKU、建议数量和最晚下单日期。

在线时优先用 MCP `meta_load_skill`（slug=`turbot-inventory-restock`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 按可售天数列出两周内可能断货的 SKU。
2. 给出建议数量和最晚下单日期，等确认实际发货量。
3. 货件、分仓和承运进入审批。箱规和重量不明就不要猜。
4. 批准后只在沙盒生成货件草稿，不会提交 Amazon。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `restock_get_stockout_alerts` — SKUs at risk of stocking out soon — the stockout alert list from the restock engine. Stores selling in several marketplaces get one plan per inventory pool: pool='EU' (Pan-EU countries combined), 'UK', 'US', 'CA'…, or a country code ('DE') for that country alone; empty = the store's main pool. The response names the pool and lists the store's pools.
- `restock_get_plan` — The FBA restock plan: per-SKU quantities to reorder now (velocity, seasonality and lead time applied), with plan KPIs. Stores selling in several marketplaces get one plan per inventory pool: pool='EU' (Pan-EU countries combined), 'UK', 'US', 'CA'…, or a country code ('DE') for that country alone; empty = the store's main pool. The response names the pool and lists the store's pools.
- `restock_get_forecast` — The 12-month demand forecast by month (deseasonalized velocity re-seasonalized), plus monthly sales history. Stores selling in several marketplaces get one plan per inventory pool: pool='EU' (Pan-EU countries combined), 'UK', 'US', 'CA'…, or a country code ('DE') for that country alone; empty = the store's main pool. The response names the pool and lists the store's pools.

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

List SKUs that may stock out in two weeks, with quantity and a last order date.

1. List SKUs that may stock out within two weeks by days of cover.
2. Give a suggested quantity and last order date, then wait for the real ship quantity.
3. Shipment, placement, and carrier steps go to approval. Do not guess carton facts.
4. Approval creates a sandbox draft only. Nothing is sent to Amazon.
