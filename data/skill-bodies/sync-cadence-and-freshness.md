---
name: sync-cadence-and-freshness
description: "看最近一次同步是否成功，数据太旧就不要拿来改价或改广告。 Check the last sync and refuse bid or price actions on stale data. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"ops","brand":"粒粒"}}
---

# 同步节奏与新鲜度 / Sync cadence and freshness

## 这个技能做什么

看最近一次同步是否成功，数据太旧就不要拿来改价或改广告。

Check the last sync and refuse bid or price actions on stale data.

本手册是粒粒lili 离线/Codex 镜像。在线优先 `meta_load_skill`（slug=`sync-cadence-and-freshness`）拉服务端最新版；工具一律经 MCP server `lili` 调用。

## 什么时候用

处理「同步节奏与新鲜度」或用户提到 Sync cadence and freshness / `sync-cadence-and-freshness` 相关诉求时加载。也适用于 12 条粒粒工作流里点名本技能的步骤。

## 能力要点

- 先确认店铺身份，避免 NS / TK 串店
- 账户健康、合规、申诉、退货、履约异常分诊
- 只读诊断优先；写入类动作一律预览
- 给出可在卖家后台核对的证据清单

## 本技能专项要点

- （按本技能摘要与步骤执行，遇缺口再查相邻技能）

## 步骤

按下面顺序执行；每一步结束先汇报再往下（写操作必须停在预览）。

1. 先确认是哪一家店，避免 NS 店和 TK 店混在一起。 建议先调 `ads_get_sync_status`。
2. 按这个技能的检查单收集证据。
3. 需要提交给 Amazon 的动作只生成草稿。
4. 列出还要你去后台确认的事项。

### 流程补充（分类手册）

- 收集政策编号、ASIN、时间窗、截图/邮件证据。
- 申诉信事实与附件一一对应，不夸大、不甩锅买家。
- 退货归因区分产品质量 / 物流 / 期望管理 / 误购。

## 相关工具

- `ads_get_sync_status` — Recent report sync runs for an ads profile: when data was last pulled from Amazon and whether it succeeded. Each run carries per-family progress (families[]): a family with complete=true is ALREADY written and queryable — during a running sync you can answer from the landed families (campaigns usually lands first) instead of waiting for the slowest report.
- `data_sync_status` — Status of the account's data syncs: the latest run per kind (orders, inventory, returns, finance, insights) with success/failure and row counts, plus when the SQL extract was last built. Poll after data_sync_start.
- `data_sync_start` — Sync ALL account data from Amazon SP-API into the store extract: orders, inventory, returns, FBA exchanges, finance (fees, settlements, reimbursements), traffic reports, storage costs, listings, buy box, sales rank and the rest. Runs in the background — poll data_sync_status; when runs succeed, data_query sees the fresh data automatically. Use when the seller wants up-to-date numbers. (Ads reports

## 输出格式

- 问题定性 + 风险等级
- 证据包清单
- 下一步动作（含是否需人工客服）

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

Check the last sync and refuse bid or price actions on stale data.

1. Confirm which store, so NS and TK never mix.
2. Collect evidence from this skill's checklist.
3. Anything that would be sent to Amazon stays a draft.
4. List what you still have to confirm in Seller Central.
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
