---
name: turbot-vine
description: "说明 Vine 适合评论少的新品，并提醒沙盒里的 Vine 订单应单独看待。 Use Vine for new listings with few reviews, and keep Vine orders separate in analysis. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# Vine 计划 / Vine program

Vine review program strategy — enrollment, product selection, timing, review quality maximization

**Supported platforms:** Amazon (US, UK, DE, CA, JP, AU, and all marketplaces).

Built by 粒粒lili — your AI assistant for smarter e-commerce decisions.

## Install

```bash
通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。
```

## Usage

```
Help me with amazon vine program for my e-commerce business.
```

## Capabilities

- Vine review program strategy
- enrollment
- product selection
- timing
- review quality maximization

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

说明 Vine 适合评论少的新品，并提醒沙盒里的 Vine 订单应单独看待。

在线时优先用 MCP `meta_load_skill`（slug=`turbot-vine`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 列出正在跑和最近结束的券、秒杀和促销。
2. 算折扣后还能不能保住目标利润。
3. 撞档、失败或和广告叠加的，单独标出。
4. 要改促销时先预览，再审批。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `orders_get_recent` — 实时订单（Orders API 直通，不经本地数据）: 最近 N 小时（默认 24，上限 72）的订单数、状态分布（PENDING/UNSHIPPED/SHIPPED/CANCELLED）、金额合计与按 SKU 的 Top 清单。报表表 orders 滞后数小时且看不到未结算的 Pending 单——「今天卖了多少 / 有多少单没发货」用本工具；更久的历史用 data_query。金额口径: grand_total 含税含运费, item_subtotal 为商品口径(可与业务报表对比)。
- `listing_get_live` — Read one listing LIVE from Amazon (not the daily snapshot): current summaries, attributes, Amazon's own issues list (the authoritative answer to why a listing is suppressed), offers and fulfillment availability. included_data is a comma list from: summaries, attributes, issues, offers, fulfillmentAvailability, relationships.
- `data_query` — Answer any question about the seller's REAL Amazon store data — 销量、订单、广告花费、ACOS、库存、退货率、利润 — with one read-only DuckDB SQL query: the primary tool for analysis, aggregation, trends, rankings, and joins across orders/ads/inventory/returns (e.g. return rate by SKU = returns joined to orders), plus slicing the restock engine's outputs. Free and instant — prefer this over paid diagnostics for any stati

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

Use Vine for new listings with few reviews, and keep Vine orders separate in analysis.

1. List running and recently ended coupons, deals, and promotions.
2. Check whether the discount still clears the target margin.
3. Flag overlaps, failures, and stacking with ads.
4. Preview any promotion change, then approve it.
