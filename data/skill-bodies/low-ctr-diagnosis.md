---
name: low-ctr-diagnosis
description: "曝光够但点得少时，先看主图、价格和标题，而不是先加出价。 When impressions do not click, check image, price, and title before bids. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# 低点击率诊断 / Low CTR diagnosis

> 来源模板：`ecom:conversion-rate-optimization`，已按粒粒品牌与本店工具改写；执行以「粒粒步骤」为准。


Systematic CRO for e-commerce stores. Audit conversion funnels, identify drop-off points, implement fixes, and run experiments to increase revenue per visitor across all platforms.

## Capabilities

- Conversion funnel mapping and analysis
- Heuristic evaluation frameworks (LIFT, ResearchXL)
- User behavior analysis: heatmaps, session recordings, surveys
- Product page CRO checklist (images, copy, social proof, CTA)
- Cart and checkout optimization
- Mobile conversion optimization
- Page speed impact on conversions
- CRO testing roadmap and prioritization

## Install

```bash
通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。
```

## Usage

Ask your AI agent:

- "Audit my store's conversion funnel and identify the biggest drop-offs."
- "Give me a CRO checklist for my product pages."
- "What is a good conversion rate for my industry and how do I improve mine?"

## Output

Structured recommendations with actionable steps, benchmarks, and platform-specific guidance.

---

## 粒粒操作要点

曝光够但点得少时，先看主图、价格和标题，而不是先加出价。

在线时优先用 MCP `meta_load_skill`（slug=`low-ctr-diagnosis`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 先确认广告同步是新鲜的，再读近 7 天和近 30 天。
2. 只挑变化最大的两三个活动或搜索词，写清原因。
3. 改出价、否定或预算时生成预览，放进审批。
4. 用三句话结论和按优先级排的动作收尾。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `ads_list_entities` — Live Amazon Ads entities straight from the Ads API — the current bids, budgets, states and settings the daily report sync does not carry. Covers Sponsored Products, Sponsored Display AND Sponsored Brands: entity_type one of sp_campaigns, sp_ad_groups, sp_product_ads, sp_keywords, sp_targets, sp_negative_keywords, sp_campaign_negative_keywords, sp_negative_targets, sp_campaign_negative_targets, sd_
- `listing_get_live` — Read one listing LIVE from Amazon (not the daily snapshot): current summaries, attributes, Amazon's own issues list (the authoritative answer to why a listing is suppressed), offers and fulfillment availability. included_data is a comma list from: summaries, attributes, issues, offers, fulfillmentAvailability, relationships.
- `market_get_asin` — Full detail for ONE ASIN — price and promotions, rating and review count, first-listed date, variation count, seller and fulfilment, bullet points, Listing quality score, Best Seller / Amazon's Choice badges. Call it once per competitor to build a comparison table (price / rating / reviews / listed date / variations / selling points). Costs credits per call.

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

When impressions do not click, check image, price, and title before bids.

1. Confirm the ads sync is fresh, then read 7-day and 30-day numbers.
2. Pick the two or three campaigns or queries that moved most and say why.
3. Preview bid, negative, or budget edits and send them to approval.
4. Close with three sentences and a prioritized action list.
