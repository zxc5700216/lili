---
name: low-conversion-diagnosis
description: "找出点击多但不出单的词，分清是流量不对还是详情页的问题。 Find high-click, no-order terms and separate bad traffic from the detail page. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# 低转化诊断 / Low conversion diagnosis

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

找出点击多但不出单的词，分清是流量不对还是详情页的问题。

在线时优先用 MCP `meta_load_skill`（slug=`low-conversion-diagnosis`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 先确认广告同步是新鲜的，再读近 7 天和近 30 天。
2. 只挑变化最大的两三个活动或搜索词，写清原因。
3. 改出价、否定或预算时生成预览，放进审批。
4. 用三句话结论和按优先级排的动作收尾。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `ads_list_entities` — Live Amazon Ads entities straight from the Ads API — the current bids, budgets, states and settings the daily report sync does not carry. Covers Sponsored Products, Sponsored Display AND Sponsored Brands: entity_type one of sp_campaigns, sp_ad_groups, sp_product_ads, sp_keywords, sp_targets, sp_negative_keywords, sp_campaign_negative_keywords, sp_negative_targets, sp_campaign_negative_targets, sd_
- `listing_get_live` — Read one listing LIVE from Amazon (not the daily snapshot): current summaries, attributes, Amazon's own issues list (the authoritative answer to why a listing is suppressed), offers and fulfillment availability. included_data is a comma list from: summaries, attributes, issues, offers, fulfillmentAvailability, relationships.
- `market_get_reviews` — Customer reviews for an ASIN — title, body, star rating, date. The voice-of-customer input: run it on COMPETITOR asins and mine the low-star reviews for the pain points your bullets should answer and your images should disprove. stars filters to specific ratings (e.g. '1,2' for the complaints). Costs credits per call.

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

Find high-click, no-order terms and separate bad traffic from the detail page.

1. Confirm the ads sync is fresh, then read 7-day and 30-day numbers.
2. Pick the two or three campaigns or queries that moved most and say why.
3. Preview bid, negative, or budget edits and send them to approval.
4. Close with three sentences and a prioritized action list.

## 扩展参考（同源手册：amazon-listing-optimization）

## Capabilities

- **Keyword-driven listing generation**: Import keywords (from amazon-keyword-research, manual list, or extracted from competitor ASINs), rank by priority, generate copy that maximizes keyword coverage
- **Competitor keyword extraction**: Fetch competitor listings and automatically extract their title/bullet keywords as your baseline
- **8-dimension audit & scoring**: Title, bullets, description, images, A+ content, pricing, reviews, SEO coverage
- **Keyword coverage tracking**: Visual map showing which keywords appear in title / bullets / description / missing
- **Tone selection**: Professional, Friendly, Urgent, Luxury — affects AI copywriting style
- **Competitive benchmarking**: Compare your listing against competitors
- **Multi-marketplace**: US, UK, DE, FR, IT, ES, JP, CA, AU, IN, MX, BR


## Two Modes

| Mode | When to Use | Input | Output |
|------|-------------|-------|--------|
| **A — Create** | Building a new listing | Keywords and/or competitor ASINs + product info + tone | Full listing copy + keyword coverage score |
| **B — Optimize** | Improving an existing listing | Your ASIN or URL (+ optional keywords or competitor ASINs) | Optimized listing copy + audit report + gap analysis |


## Output Formats

The primary deliverable is always a **ready-to-use listing** that the seller can copy-paste directly into Seller Central. Diagnostic data (scores, keyword analysis) comes after as supporting evidence.

### Mode A Output — New Listing

```
# ✅ Your Listing — Ready to Use

