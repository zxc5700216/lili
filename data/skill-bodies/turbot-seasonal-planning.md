---
name: turbot-seasonal-planning
description: "从现在排到大促结束，每周该完成备货、广告和促销里的哪一件。 Lay out each week through the peak: stock, ads, or promotion. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# 季节性规划 / Seasonal planning

Seasonal sales calendar — Prime Day, Black Friday, Q4 prep, inventory planning, promotion scheduling

**Supported platforms:** Amazon (US, UK, DE, CA, JP, AU, and all marketplaces).

Built by 粒粒lili — your AI assistant for smarter e-commerce decisions.

## Install

```bash
通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。
```

## Usage

```
Help me with amazon seasonal planning for my e-commerce business.
```

## Capabilities

- Seasonal sales calendar
- Prime Day
- Black Friday
- Q4 prep
- inventory planning
- promotion scheduling

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

从现在排到大促结束，每周该完成备货、广告和促销里的哪一件。

在线时优先用 MCP `meta_load_skill`（slug=`turbot-seasonal-planning`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 按可售天数列出两周内可能断货的 SKU。
2. 给出建议数量和最晚下单日期，等确认实际发货量。
3. 货件、分仓和承运进入审批。箱规和重量不明就不要猜。
4. 批准后只在沙盒生成货件草稿，不会提交 Amazon。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `restock_get_forecast` — The 12-month demand forecast by month (deseasonalized velocity re-seasonalized), plus monthly sales history. Stores selling in several marketplaces get one plan per inventory pool: pool='EU' (Pan-EU countries combined), 'UK', 'US', 'CA'…, or a country code ('DE') for that country alone; empty = the store's main pool. The response names the pool and lists the store's pools.
- `ads_list_entities` — Live Amazon Ads entities straight from the Ads API — the current bids, budgets, states and settings the daily report sync does not carry. Covers Sponsored Products, Sponsored Display AND Sponsored Brands: entity_type one of sp_campaigns, sp_ad_groups, sp_product_ads, sp_keywords, sp_targets, sp_negative_keywords, sp_campaign_negative_keywords, sp_negative_targets, sp_campaign_negative_targets, sd_
- `promotions_search` — List this store's promotions LIVE from Amazon — coupons, lightning/best deals, price discounts, basket-building offers — with status, dates, budget, discount, fee preview and Amazon's own issues (e.g. overlapping promotions). Filter by statuses (RUNNING,UPCOMING,EXPIRED,FAILED,…), promotion_types (COUPON,DEAL,PRICE_DISCOUNT,BASKET_BUILDING), up to 10 asins or skus, ISO-8601 date windows, updated_a

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

Lay out each week through the peak: stock, ads, or promotion.

1. List SKUs that may stock out within two weeks by days of cover.
2. Give a suggested quantity and last order date, then wait for the real ship quantity.
3. Shipment, placement, and carrier steps go to approval. Do not guess carton facts.
4. Approval creates a sandbox draft only. Nothing is sent to Amazon.
