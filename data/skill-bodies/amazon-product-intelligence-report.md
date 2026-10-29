---
name: amazon-product-intelligence-report
description: "把销量、价格带、评价和广告收成一页产品情报。 Combine sales, price band, reviews, and ads into one product brief. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"report","brand":"粒粒"}}
---

# 产品情报报告 / Product intelligence report

## 这个技能做什么

把销量、价格带、评价和广告收成一页产品情报。

Combine sales, price band, reviews, and ads into one product brief.

本手册是粒粒lili 离线/Codex 镜像。在线优先 `meta_load_skill`（slug=`amazon-product-intelligence-report`）拉服务端最新版；工具一律经 MCP server `lili` 调用。

## 什么时候用

处理「产品情报报告」或用户提到 Product intelligence report / `amazon-product-intelligence-report` 相关诉求时加载。也适用于 12 条粒粒工作流里点名本技能的步骤。

## 能力要点

- 统一口径：时间范围、币种、是否剔除异常订单
- 销售 / 流量 / 广告 / 库存 / 费用多模块对照上周或上月
- 三句话结论 + 按优先级的动作清单
- 输出 HTML 报告便于周会宣讲

## 本技能专项要点

- 报告开头三句：发生了什么、为什么、这周先做什么。

## 步骤

按下面顺序执行；每一步结束先汇报再往下（写操作必须停在预览）。

1. 先统一口径：时间范围、币种、是否剔除异常订单。 建议先调 `market_get_asin`。
2. 先给关键数字，再和上一周期对比。
3. 不同币种不要相加。
4. 收尾写下一周期的三件要事。

### 流程补充（分类手册）

- 先对齐「看哪个店、哪段时间」。
- 每个模块只留 Top 风险与 Top 机会，避免流水账。
- 动作写明负责人角色（广告/库存/定价）与本周盯的指标。

## 相关工具

- `market_get_asin` — Full detail for ONE ASIN — price and promotions, rating and review count, first-listed date, variation count, seller and fulfilment, bullet points, Listing quality score, Best Seller / Amazon's Choice badges. Call it once per competitor to build a comparison table (price / rating / reviews / listed date / variations / selling points). Costs credits per call.
- `market_get_reviews` — Customer reviews for an ASIN — title, body, star rating, date. The voice-of-customer input: run it on COMPETITOR asins and mine the low-star reviews for the pain points your bullets should answer and your images should disprove. stars filters to specific ratings (e.g. '1,2' for the complaints). Costs credits per call.
- `ads_list_entities` — Live Amazon Ads entities straight from the Ads API — the current bids, budgets, states and settings the daily report sync does not carry. Covers Sponsored Products, Sponsored Display AND Sponsored Brands: entity_type one of sp_campaigns, sp_ad_groups, sp_product_ads, sp_keywords, sp_targets, sp_negative_keywords, sp_campaign_negative_keywords, sp_negative_targets, sp_campaign_negative_targets, sd_

## 输出格式

- HTML 报告
- 动作清单（负责人 + 指标）
- 需后台人工确认的开放问题

默认收尾：
1. 三句话结论（发生了什么 / 原因 / 这周先做什么）
2. 按优先级排序的动作清单（预估影响 + 负责人角色）
3. 需要运营去卖家后台确认的开放问题

## 护栏

- 查询可以直接看结果。改 Listing、广告或货件时先生成预览，放进审批。
- 市场调研和允许执行两个开关默认关闭。
- 多店场景先确认 NS 店 / TK 店，禁止串店改价或改广告。
- 付费市场数据调用前告知预计次数与费用风险。
- 不诱导评论、不违反品牌与广告政策。

## Steps (EN)

Combine sales, price band, reviews, and ads into one product brief.

1. Lock the spec first: dates, currency, and whether odd orders are excluded.
2. Lead with the key numbers, then the comparison.
3. Do not add different currencies.
4. Close with three priorities for the next period.
## 与工作流的关系

本技能可被「周一经营例会 / 广告止血 / 销量下滑 / 新品上架到开广告 / 选品开品 / 竞品拆解 / 补货发货 / 利润体检 / 大促备战 / 老品清退 / 退货攻坚 / 月度报告」等模板引用。若当前对话来自某条工作流，保持该工作流的顺序与停顿点，不要跳步执行写操作。

## 扩展参考（同源手册：amazon-product-research）

## Capabilities

- **Product opportunity scoring**: Comprehensive 1-10 rating across 8 key factors
- **Demand analysis**: Search volume, seasonal patterns, growth trends
- **Competition assessment**: Competitor count, dominance, market fragmentation
- **Profit potential calculation**: Margin analysis, FBA fee impact, pricing strategies  
- **Market entry analysis**: Barriers, investment required, time to profitability
- **Sourcing guidance**: Supplier options, MOQ requirements, quality considerations
- **Risk evaluation**: Market risks, regulatory issues, trend sustainability
- **Multi-marketplace support**: US, UK, DE, FR, IT, ES, JP, CA, AU, IN, MX, BR


## Workflow

### Step 1: Product & Market Intelligence

Gather comprehensive market data using `web_search`:

1. **Search volume & interest**: `"[product]" Amazon search volume trends`
2. **Market size indicators**: `"[product]" market size revenue Amazon"`  
3. **Category positioning**: `"[product]" Amazon category best sellers"`
4. **Seasonal patterns**: `"[product]" seasonal demand trends Amazon"`

**What to extract:**
- Approximate search volume (if available)
- Market growth indicators (growing/stable/declining)  
- Category context (main category, subcategories)
- Seasonal fluctuations and peak periods

### Step 2: Competition Deep Dive

Analyze the competitive landscape systematically:

1. **Competition density**: `"[product]" site:amazon.com` - total result count
2. **Top sellers analysis**: `"best [product]" Amazon top rated reviews`
3. **Price range mapping**: `"[product]" Amazon price $X $Y $Z` (test different ranges)
4. **Brand dominance**: `"[product]" Amazon brand market leader`

**Competition Metrics:**
- **Total competitors**: Number of products in search results
- **Market concentration**: Top 3 brands' market share estimate  
- **Review distribution**: How many products have 100+, 1000+, 5000+ reviews
- **Price ranges**: Budget ($), mid-range ($$), premium ($$$) segments
- **Quality indicators**: Average ratings, common complaints

**Competition Scoring (1-10):**
- 9-10: Highly fragmented market, no dominant players
- 7-8: Some established brands but room for new entrants
- 5-6: Mixed market with some strong competitors  
- 3-4: 2-3 dominant brands control most sales
- 1-2: Market dominated by 1 major brand or Amazon basics

### Step 3: Demand Validation

Use multiple sources to validate real demand:

1. **Google Trends**: `web_fetch` on `https://trends.google.com/trends/explore?q=[product]&geo=US`
2. **Amazon autocomplete**: Manual check for `[product] + [letters]` suggestions
3. **Related searches**: `"people also search [product]"` patterns
4. **Social validation**: `"[product]" reddit reviews complaints site:reddit.com`

**Demand Signals:**
- **Search trends**: Rising/stable/declining over 12 months
- **Autocomplete depth**: How many variations Amazon suggests
- **Social buzz**: Discussion volume, sentiment in communities
- **Seasonality**: Clear patterns vs. consistent year-round demand

**Demand Scoring (1-10):**
- 9-10: Strong upward trend, growing search volume
- 7-8: Stable high demand, consistent search patterns
- 5-6: Moderate demand with seasonal variations
- 3-4: Declining trend or very seasonal demand  
- 1-2: Low/sporadic demand or niche market only

### Step 4: Profitability Analysis

Calculate realistic profit potential:

1. **Pricing research**: Extract price ranges from competition analysis
2. **Cost estimation**:
