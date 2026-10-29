---
name: traffic-conversion-triage
description: "按 ASIN 对比近 7 天和前四周，分清是访问少了、转化掉了还是购物车掉了。 Split each ASIN's drop into sessions, conversion, or Buy Box. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# 流量转化分诊 / Traffic and conversion triage

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

按 ASIN 对比近 7 天和前四周，分清是访问少了、转化掉了还是购物车掉了。

在线时优先用 MCP `meta_load_skill`（slug=`traffic-conversion-triage`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 先统一口径：时间范围、币种、是否剔除异常订单。
2. 先给关键数字，再和上一周期对比。
3. 不同币种不要相加。
4. 收尾写下一周期的三件要事。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `data_query` — Answer any question about the seller's REAL Amazon store data — 销量、订单、广告花费、ACOS、库存、退货率、利润 — with one read-only DuckDB SQL query: the primary tool for analysis, aggregation, trends, rankings, and joins across orders/ads/inventory/returns (e.g. return rate by SKU = returns joined to orders), plus slicing the restock engine's outputs. Free and instant — prefer this over paid diagnostics for any stati
- `ads_list_entities` — Live Amazon Ads entities straight from the Ads API — the current bids, budgets, states and settings the daily report sync does not carry. Covers Sponsored Products, Sponsored Display AND Sponsored Brands: entity_type one of sp_campaigns, sp_ad_groups, sp_product_ads, sp_keywords, sp_targets, sp_negative_keywords, sp_campaign_negative_keywords, sp_negative_targets, sp_campaign_negative_targets, sd_
- `market_get_asin` — Full detail for ONE ASIN — price and promotions, rating and review count, first-listed date, variation count, seller and fulfilment, bullet points, Listing quality score, Best Seller / Amazon's Choice badges. Call it once per competitor to build a comparison table (price / rating / reviews / listed date / variations / selling points). Costs credits per call.

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

Split each ASIN's drop into sessions, conversion, or Buy Box.

1. Lock the spec first: dates, currency, and whether odd orders are excluded.
2. Lead with the key numbers, then the comparison.
3. Do not add different currencies.
4. Close with three priorities for the next period.

## 扩展参考（同源手册：amazon-seller-analytics）

## Capabilities

- **Revenue estimation**: Calculate seller monthly/annual revenue from visible data
- **Product portfolio analysis**: Category diversification, pricing strategy, product mix
- **Growth trajectory tracking**: Historical expansion patterns and launch sequences  
- **Market positioning assessment**: Brand positioning, customer targeting, competitive advantages
- **Inventory strategy analysis**: Stock depth, product lifecycle management, seasonal planning
- **Pricing strategy evaluation**: Margin optimization, competitive positioning, price changes
- **Launch pattern identification**: How successful sellers introduce new products  
- **Multi-marketplace tracking**: Cross-platform seller presence and strategy


## Workflow

### Step 1: Seller Identification & Basic Intelligence

Gather foundational seller information:

1. **Seller discovery**: `"top Amazon sellers [category]"` or analyze specific seller names
2. **Storefront access**: `"[seller name] Amazon storefront"` - find their seller page
3. **Basic metrics**: `"[seller name] Amazon seller feedback rating reviews"`
4. **Market presence**: `"[seller name] brand Amazon marketplace years"`

**Key Data Points:**
- Seller name and brand(s) operated
- Years active on Amazon (account age)
- Overall seller feedback score and review count  
- Estimated number of active products
- Primary categories/markets served

### Step 2: Product Portfolio Deep Dive

Analyze their complete product strategy:

1. **Product catalog**: `"[seller name] products Amazon site:amazon.com"`
2. **Category spread**: Map products across different Amazon categories
3. **Price range analysis**: Identify pricing tiers and market positioning
4. **Product relationships**: Look for complementary products, bundles, variations

**Portfolio Analysis Framework:**

**A. Category Diversification**
- **Focused**: 80%+ revenue from single category (specialist strategy)
- **Diversified**: Revenue spread across 3-5 categories (risk mitigation)
- **Scattered**: Many unrelated categories (testing/opportunistic)

**B. Product Depth**
- **SKU count**: How many total products they offer
- **Variations**: Colors, sizes, bundles of core products  
- **Accessories**: Complementary products to main offerings
- **Seasonal items**: Products for specific times/holidays

**C. Price Architecture**
- **Entry level**: Budget options to capture price-sensitive customers
- **Core range**: Main revenue drivers in sweet spot pricing
- **Premium tier**: High-margin flagship products

### Step 3: Revenue Estimation

Calculate approximate seller revenue using available signals:

1. **Best seller rank data**: `"[seller product]" Amazon BSR rank category"`
2. **Review velocity**: `"[product]" Amazon reviews per month timeline"`  
3. **Inventory indicators**: Stock levels, "only X left" messages
4. **Price tracking**: `"[product]" Amazon price history changes"`

**Revenue Estimation Methods:**

**Method 1: BSR-Based Calculation**
- Use BSR to sales conversion rates by category
- Estimate units sold per month per product
- Multiply by product price for revenue estimate  
- Aggregate across entire product portfolio

**Method 2: Review Velocity Analysis**  
- Count reviews added per month for each product
- Apply review-to-sales conversion ratios (typically 1-5%)
- Calculate implied sales volume and revenue

**Method 3: Market Share Estimation**
- Estimate category market size  
- Assess seller's market share based on visibility/dominance
- Calculate proportional revenue

**Reven
