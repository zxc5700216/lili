---
name: harvest-search-terms
description: "从自动和广泛里挑出单的搜索词，准备加到精确组。 Harvest converting queries from auto and broad into exact. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"ads","brand":"粒粒"}}
---

# 搜索词收割 / Harvest search terms

## 这个技能做什么

从自动和广泛里挑出单的搜索词，准备加到精确组。

Harvest converting queries from auto and broad into exact.

本手册是粒粒lili 离线/Codex 镜像。在线优先 `meta_load_skill`（slug=`harvest-search-terms`）拉服务端最新版；工具一律经 MCP server `lili` 调用。

## 什么时候用

处理「搜索词收割」或用户提到 Harvest search terms / `harvest-search-terms` 相关诉求时加载。也适用于 12 条粒粒工作流里点名本技能的步骤。

## 能力要点

- 核对广告同步新鲜度（`ads_get_data_health` / `ads_get_sync_status`）
- 按近 7 天 vs 近 30 天对比花费、销售额、ACOS、CPC、CVR
- 定位异常活动 / 广告组 / 搜索词 / 投放，写清因果
- 生成出价、预算、否定、结构变更的预览（`ads_prepare_changes`）
- 输出三句话结论 + 按优先级排序的动作清单（含预计省钱/增量）

## 本技能专项要点

- 从自动/广泛搜索词收割到词组/精确，保留来源活动以便回溯。
- 收割阈值设最低点击与订单门槛，避免噪声词。

## 步骤

按下面顺序执行；每一步结束先汇报再往下（写操作必须停在预览）。

1. 先确认广告同步是新鲜的，再读近 7 天和近 30 天。 建议先调 `ads_list_entities`。
2. 只挑变化最大的两三个活动或搜索词，写清原因。
3. 改出价、否定或预算时生成预览，放进审批。 变更类调用 `ads_prepare_changes` / 对应 prepare 工具生成预览。
4. 用三句话结论和按优先级排的动作收尾。

### 流程补充（分类手册）

- 先拉实体与健康状态，确认不是同步延迟造成的假警报。
- 用统一口径：同一时区、同一币种、是否含 SB/SD。
- 只处理变化最大或浪费最大的 Top 3–5，避免一次改太多。
- 否定前检查该词是否在其他活动出单；能出单的不要否。
- 出价调整写明当前出价、建议出价、依据（目标 ACOS / 破局 ACOS）。

## 相关工具

- `ads_list_entities` — Live Amazon Ads entities straight from the Ads API — the current bids, budgets, states and settings the daily report sync does not carry. Covers Sponsored Products, Sponsored Display AND Sponsored Brands: entity_type one of sp_campaigns, sp_ad_groups, sp_product_ads, sp_keywords, sp_targets, sp_negative_keywords, sp_campaign_negative_keywords, sp_negative_targets, sp_campaign_negative_targets, sd_
- `ads_prepare_changes` — STEP 1 of changing ads yourself: validate a list of changes you authored and get a one-time write plan. changes_json is a JSON array; each item has a 'kind' plus its fields. Creating (Sponsored Products and Sponsored Display; pass family='sd' for SD): create_campaign, create_ad_group, create_product_ad, create_keyword (SP only — SD has no keywords; match_type BROAD/PHRASE/EXACT, default EXACT), cr
- `ads_get_bid_recommendations` — Amazon's own SUGGESTED BIDS (建议竞价) with ranges for keywords or auto-targeting themes — the number Seller Central shows, LIVE and free. Two modes: pass asins (up to 10, comma list) to get bids for a NEW ad group before anything is created (use when building campaigns with ads_prepare_changes), or pass campaign_id + ad_group_id for an existing one. keywords is a comma list (up to 50) scored at match

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

Harvest converting queries from auto and broad into exact.

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

## 扩展参考（同源手册：amazon-ppc-campaign）

## Capabilities

- **ACoS financial framework**: Calculate break-even ACoS, target ACoS, and Max CPC from product margins — the foundation for every bid decision
- **Campaign architecture design**: Build a structured Auto → Broad → Exact funnel with proper negative keyword isolation between campaigns
- **Keyword grouping**: Organize keywords into campaign buckets with match types and initial bids based on confidence level
- **Bid optimization**: Apply ACoS-based bid adjustment rules using industry-standard formulas (cut/increase by percentage based on ACoS range)
- **Keyword funnel analysis**: Identify migration opportunities (Auto→Broad→Exact) and wasted spend (high-click zero-sale terms)
- **Negative keyword management**: Generate seed lists (cross-campaign, irrelevant terms, generic waste modifiers) and ongoing additions from search term data
- **Search term report analysis**: Parse user-provided campaign data to find profitable terms, wasteful terms, and optimization gaps
- **Competitor ASIN targeting**: Build product targeting campaigns aimed at competitor product pages
- **Integration chain**: Works with [amazon-keyword-research](https://github.com/lili/skills/tree/main/amazon-keyword-research) for keyword input and [amazon-listing-optimization](https://github.com/lili/skills/tree/main/amazon-listing-optimization) for pre-launch listing quality checks


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


## Two Modes

| Mode | When to Use | Input | Output |
|------|-------------|-------|--------|
| **A — Build** | Launching PPC for a new product | Product info + keywords + margins | Complete campaign blueprint + keyword groupings + initial bids |
| **B — Optimize** | Improving existing campaigns | Campaign data + search term reports + current ACoS | Optimization plan + bid adjustments + negative keyword list |


## Mode A Workflow — Build Campaign Structure

### Step A1: Collect Product Info

The following details are needed. Many can be extracted automatically (see "How This Skill Collects Information" above) — only ask for what's truly missing.

| Detail | How to Get It | Critical? |
|--------|--------------|:---------:|
| ASIN | From user's prompt | Helpful |
| Product name and category | Fetch from ASIN or ask | Helpful |
| Selling price | Fetch from ASIN or ask | ✅ Yes |
| Product cost (landed) | Must ask user | ✅ Yes |
| Monthly ad budget | Must ask user | ✅ Yes |
| Amazon fees (referral + FBA) | Estimate ~15% referral + FBA by size | Can estimate |
| Launch vs mature product | Ask or infer from context | Helpful |

### Step A2: Calculate ACoS Targets

Using the formulas from Key Concepts, compute the financial framework that governs all bid decisions:

```
📊 PPC FINANCIAL FRAMEWORK

Selling Price:           $39.99
Total Costs:             $18.50 (product $8 + shipping $3 + Amazon fees $7.50)
Profit Before Ads:       $21.49
Profit Margin:           53.7%

Break-even ACoS:         53.7% (spending ALL profit on ads)
Target ACoS (Mature):    30.0% (keeps ~24% profit margin)
Target ACoS (Launch):    50.0% (aggressive — acceptable for first 4-8 weeks)

Max CPC at Target ACoS:  $1.20 (at 10% conversion rate)
Formula: Max CPC = Selling Price × Target ACoS × Conversion Rate
```

If user doesn't know their conversion rate, use category benchmarks: 10-15% is average.

### Step A3: Collect Keywords

Keywords can come from three sources (use one or combine):

1. **From [amazon-keyword-research](https://github.com/lili/skills/tree/main/amazon-keyword-research) skill** (recommended): Run keyword research first, then feed the ranked keyword list into this skill.
2. **From competitor ASINs**: User provides 1-3 competitor ASINs → run `scripts/fetch-competitor.sh <ASIN>` for each → extract keywords from their titles and bullet points. The script returns title, brand, bullets, price, category, BSR, and review count.
3. **From user's list**: User provides their own keywords (e.g., from Helium 10, search term reports, or manual research).

Additionally, expand keywords using Amazon autocomplete: `curl -s "https://completion.amazon.com/api/2017/suggestions?mid=ATVPDKIKX0DER&alias=aps&prefix=<URL-ENCODED-KEYWORD>" | python3 -c "import sys,json; [print(s['value']) for s in json.load(sys.stdin).get('suggestions',[])]"`

### Step A4: Build Campaign Structure and Group Keywords

**Default: 4 campaigns.** This is the standard structure for a new product launch:

| Priority | Campaign | What It Does | Always Include? |
|:--------:|----------|--------------|:---------------:|
| 1 | **Auto Discovery** | Amazon auto-matches your ad to search terms — collects data on wha

## Output Formats

The primary deliverable is always an **actionable campaign plan** the seller can implement directly in Seller Central.

### Mode A Output — New Campaign Blueprint

```
# ✅ PPC Campaign Blueprint — Ready to Implement

