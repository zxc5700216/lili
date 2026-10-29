---
name: report-spec
description: "先写时间范围、时区、币种和是否含促销，再开始报数字。 Write the date range, timezone, currency, and promo treatment before any number. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"report","brand":"粒粒"}}
---

# 报表口径 / Report specification

## 这个技能做什么

先写时间范围、时区、币种和是否含促销，再开始报数字。

Write the date range, timezone, currency, and promo treatment before any number.

本手册是粒粒lili 离线/Codex 镜像。在线优先 `meta_load_skill`（slug=`report-spec`）拉服务端最新版；工具一律经 MCP server `lili` 调用。

## 什么时候用

处理「报表口径」或用户提到 Report specification / `report-spec` 相关诉求时加载。也适用于 12 条粒粒工作流里点名本技能的步骤。

## 能力要点

- 统一口径：时间范围、币种、是否剔除异常订单
- 销售 / 流量 / 广告 / 库存 / 费用多模块对照上周或上月
- 三句话结论 + 按优先级的动作清单
- 输出 HTML 报告便于周会宣讲

## 本技能专项要点

- 报告开头三句：发生了什么、为什么、这周先做什么。

## 步骤

按下面顺序执行；每一步结束先汇报再往下（写操作必须停在预览）。

1. 先统一口径：时间范围、币种、是否剔除异常订单。 建议先调 `data_describe_table`。
2. 先给关键数字，再和上一周期对比。
3. 不同币种不要相加。
4. 收尾写下一周期的三件要事。

### 流程补充（分类手册）

- 先对齐「看哪个店、哪段时间」。
- 每个模块只留 Top 风险与 Top 机会，避免流水账。
- 动作写明负责人角色（广告/库存/定价）与本周盯的指标。

## 相关工具

- `data_describe_table` — Column names and types for one table in the store extract, plus what the table means. Call before writing SQL against an unfamiliar table.
- `data_list_tables` — START HERE whenever the user asks anything about their Amazon business — 销量/订单/广告花费/ACOS/库存/退货/换货/利润/流量 (sales, orders, ad spend, inventory, returns, exchanges, profit, traffic). Lists the SQL tables in this seller's REAL store extract (orders, inventory, returns, replacements = FBA exchanges, ads daily metrics, finance, restock engine outputs) with row counts and descriptions. Use data_describe_t
- `ads_get_sync_status` — Recent report sync runs for an ads profile: when data was last pulled from Amazon and whether it succeeded. Each run carries per-family progress (families[]): a family with complete=true is ALREADY written and queryable — during a running sync you can answer from the landed families (campaigns usually lands first) instead of waiting for the slowest report.

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

Write the date range, timezone, currency, and promo treatment before any number.

1. Lock the spec first: dates, currency, and whether odd orders are excluded.
2. Lead with the key numbers, then the comparison.
3. Do not add different currencies.
4. Close with three priorities for the next period.
## 与工作流的关系

本技能可被「周一经营例会 / 广告止血 / 销量下滑 / 新品上架到开广告 / 选品开品 / 竞品拆解 / 补货发货 / 利润体检 / 大促备战 / 老品清退 / 退货攻坚 / 月度报告」等模板引用。若当前对话来自某条工作流，保持该工作流的顺序与停顿点，不要跳步执行写操作。

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
