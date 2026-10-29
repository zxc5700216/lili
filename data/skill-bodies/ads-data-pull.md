---
name: ads-data-pull
description: "按活动、关键词、搜索词把同步下来的广告数据拉出来核对。 Pull synced campaign, keyword, and search-term data for a check. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"ads","brand":"粒粒"}}
---

# 广告数据拉取 / Ads data pull

## 这个技能做什么

按活动、关键词、搜索词把同步下来的广告数据拉出来核对。

Pull synced campaign, keyword, and search-term data for a check.

本手册是粒粒lili 离线/Codex 镜像。在线优先 `meta_load_skill`（slug=`ads-data-pull`）拉服务端最新版；工具一律经 MCP server `lili` 调用。

## 什么时候用

处理「广告数据拉取」或用户提到 Ads data pull / `ads-data-pull` 相关诉求时加载。也适用于 12 条粒粒工作流里点名本技能的步骤。

## 能力要点

- 核对广告同步新鲜度（`ads_get_data_health` / `ads_get_sync_status`）
- 按近 7 天 vs 近 30 天对比花费、销售额、ACOS、CPC、CVR
- 定位异常活动 / 广告组 / 搜索词 / 投放，写清因果
- 生成出价、预算、否定、结构变更的预览（`ads_prepare_changes`）
- 输出三句话结论 + 按优先级排序的动作清单（含预计省钱/增量）

## 本技能专项要点

- （按本技能摘要与步骤执行，遇缺口再查相邻技能）

## 步骤

按下面顺序执行；每一步结束先汇报再往下（写操作必须停在预览）。

1. 先确认广告同步是新鲜的，再读近 7 天和近 30 天。 建议先调 `ads_start_sync`。
2. 只挑变化最大的两三个活动或搜索词，写清原因。
3. 改出价、否定或预算时生成预览，放进审批。
4. 用三句话结论和按优先级排的动作收尾。

### 流程补充（分类手册）

- 先拉实体与健康状态，确认不是同步延迟造成的假警报。
- 用统一口径：同一时区、同一币种、是否含 SB/SD。
- 只处理变化最大或浪费最大的 Top 3–5，避免一次改太多。
- 否定前检查该词是否在其他活动出单；能出单的不要否。
- 出价调整写明当前出价、建议出价、依据（目标 ACOS / 破局 ACOS）。

## 相关工具

- `ads_start_sync` — Pull fresh ad reports from Amazon for a profile (campaign, search term, targeting, placement).
- `ads_get_sync_status` — Recent report sync runs for an ads profile: when data was last pulled from Amazon and whether it succeeded. Each run carries per-family progress (families[]): a family with complete=true is ALREADY written and queryable — during a running sync you can answer from the landed families (campaigns usually lands first) instead of waiting for the slowest report.
- `ads_list_entities` — Live Amazon Ads entities straight from the Ads API — the current bids, budgets, states and settings the daily report sync does not carry. Covers Sponsored Products, Sponsored Display AND Sponsored Brands: entity_type one of sp_campaigns, sp_ad_groups, sp_product_ads, sp_keywords, sp_targets, sp_negative_keywords, sp_campaign_negative_keywords, sp_negative_targets, sp_campaign_negative_targets, sd_

## 输出格式

- 诊断表：活动 × 花费/销售/ACOS 变化与原因标签
- 动作清单：否定词 / 降出价 / 加出价 / 预算 / 暂停（各带预览 ID）
- HTML 小结：三句结论 + 本周复盘指标

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

Pull synced campaign, keyword, and search-term data for a check.

1. Confirm the ads sync is fresh, then read 7-day and 30-day numbers.
2. Pick the two or three campaigns or queries that moved most and say why.
3. Preview bid, negative, or budget edits and send them to approval.
4. Close with three sentences and a prioritized action list.
## 与工作流的关系

本技能可被「周一经营例会 / 广告止血 / 销量下滑 / 新品上架到开广告 / 选品开品 / 竞品拆解 / 补货发货 / 利润体检 / 大促备战 / 老品清退 / 退货攻坚 / 月度报告」等模板引用。若当前对话来自某条工作流，保持该工作流的顺序与停顿点，不要跳步执行写操作。

## 广告公共参考（漏斗 / 财务 / 否定）

## Key Concepts

Three formulas drive every recommendation in this skill. They're introduced here and applied in Step A2 (for Mode A) and Step B2 (for Mode B).

**Break-even ACoS** = Profit margin before ad spend. If your product sells for $40 with $15 in costs after Amazon fees, your margin is $25/$40 = 62.5%. At 62.5% ACoS you spend all profit on ads — break even.

**Target ACoS** = Break-even ACoS − Desired profit margin. Want 25% profit after ads? Target ACoS = 62.5% − 25% = 37.5%.

**Keyword Funnel** = The core PPC optimization loop, applied in Steps A4/A6 (building) and B3 (optimizing):
```
Auto Campaign (discover new terms)
    ↓ terms with 2+ orders
Manual Broad (test at broader match)
    ↓ terms with 2+ sales
Manual Exact (scale winners with precision)

At each step: add the migrated term as NEGATIVE in the source campaign to prevent duplicate spend.
```

---


## Financial Framework
Selling Price: $XX.XX | Profit Before Ads: $XX.XX | Break-even ACoS: XX%
Target ACoS (Launch): XX% | Target ACoS (Mature): XX%
Max CPC: $X.XX (at XX% conversion rate)


## How These Campaigns Work Together

Standard: 4 campaigns. If budget is tight, start P1+P2, add the rest later.

  Auto (P1) → finds new search terms        ↓ terms with 2+ orders
  Broad (P3) → tests keywords at wider match ↓ terms with 2+ sales
  Exact (P2) → best keywords, lowest ACoS
  Product Targeting (P4) → ads on competitor pages

Separate campaigns prevent internal competition (bidding against yourself).

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
