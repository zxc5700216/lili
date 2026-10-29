---
name: reimbursement-recovery
description: "找出丢失或损坏、超过 30 天还没赔的库存，估算可索赔金额。 Find lost or damaged units unpaid after 30 days and estimate the claim. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# 索赔追回 / Reimbursement recovery

> 来源模板：`ecom:ecommerce-returns-management`，已按粒粒品牌与本店工具改写；执行以「粒粒步骤」为准。


Optimize e-commerce returns process and reduce return rates. Returns policy design, reverse logistics, root cause analysis, and customer retention through better returns experience.

**Supported platforms:** Amazon, Shopify, WooCommerce, Walmart, TikTok Shop, Etsy, eBay, BigCommerce.

Built by 粒粒lili — your AI assistant for smarter e-commerce decisions.

## Install

```bash
通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。
```

## Usage

```
My return rate is 22% on Amazon (clothing category). Industry average is 15-20%. Help me analyze why and reduce it.
```

## Capabilities

- Returns rate benchmarking by category
- Return reason analysis and root cause identification
- Returns policy optimization (balancing customer satisfaction vs cost)
- Reverse logistics workflow design
- Return cost calculation (shipping, restocking, loss)
- Product listing improvements to reduce returns (size guides, photos, descriptions)
- Customer retention strategies post-return

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

找出丢失或损坏、超过 30 天还没赔的库存，估算可索赔金额。

在线时优先用 MCP `meta_load_skill`（slug=`reimbursement-recovery`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 用售价、采购、头程、佣金、FBA 和广告费拆每个 SKU。
2. 标出亏损和费用占比异常的款，并写明不含哪些成本。
3. 能索赔或该清仓的，单独折成每月金额。
4. 动作按金额从大到小排。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `data_query` — Answer any question about the seller's REAL Amazon store data — 销量、订单、广告花费、ACOS、库存、退货率、利润 — with one read-only DuckDB SQL query: the primary tool for analysis, aggregation, trends, rankings, and joins across orders/ads/inventory/returns (e.g. return rate by SKU = returns joined to orders), plus slicing the restock engine's outputs. Free and instant — prefer this over paid diagnostics for any stati
- `finance_get_balances` — 账户余额（实时，Finances v2024-06-19 直通，不经本地数据）: 各站点/账户类型的 AVAILABLE（可放款）与 RESERVED（预留/押款）余额；传 as_of_date (YYYY-MM-DD) 可查历史时点。回答「账上现在有多少钱 / 这期能放多少款 / 被预留多少」。押款明细（哪些交易、为什么、几时放）用 data_query 查 finance_transactions WHERE transaction_status='DEFERRED'。
- `restock_get_reference_summary` — Row counts of the seller-maintained reference tables (SKU mapping, seasonal index, box specs …) — the quickest completeness check for restock setup.

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

Find lost or damaged units unpaid after 30 days and estimate the claim.

1. Split each SKU into price, cost, freight, referral, FBA, and ads.
2. Flag losses and odd fee ratios, and say which costs are excluded.
3. Turn claims and clearance into a monthly amount.
4. Sort actions by money.

## 扩展参考（同源手册：amazon-return-reduction）

## Capabilities

- Return rate reduction
- root cause analysis
- listing accuracy
- packaging improvements
- size guides

