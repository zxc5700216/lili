---
name: keyword-role-taxonomy
description: "把词分成品牌、核心、属性、竞品和垃圾五类角色。 Label terms as brand, core, attribute, competitor, or junk. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"ads","brand":"粒粒"}}
---

# 关键词角色分类 / Keyword role taxonomy

## 这个技能做什么

把词分成品牌、核心、属性、竞品和垃圾五类角色。

Label terms as brand, core, attribute, competitor, or junk.

本手册是粒粒lili 离线/Codex 镜像。在线优先 `meta_load_skill`（slug=`keyword-role-taxonomy`）拉服务端最新版；工具一律经 MCP server `lili` 调用。

## 什么时候用

处理「关键词角色分类」或用户提到 Keyword role taxonomy / `keyword-role-taxonomy` 相关诉求时加载。也适用于 12 条粒粒工作流里点名本技能的步骤。

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

1. 先确认广告同步是新鲜的，再读近 7 天和近 30 天。 建议先调 `market_research_keyword`。
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

- `market_research_keyword` — Is a keyword market worth entering? Monthly search volume, purchases and purchase rate, supply/demand ratio, product count, click concentration (how much the head sellers own), average price and PPC bid range, plus growth trend — for one keyword or a whole keyword market. Use before choosing what to launch, or to compare several keyword directions. Costs credits per call (SellerSprite data). For t
- `ads_list_entities` — Live Amazon Ads entities straight from the Ads API — the current bids, budgets, states and settings the daily report sync does not carry. Covers Sponsored Products, Sponsored Display AND Sponsored Brands: entity_type one of sp_campaigns, sp_ad_groups, sp_product_ads, sp_keywords, sp_targets, sp_negative_keywords, sp_campaign_negative_keywords, sp_negative_targets, sp_campaign_negative_targets, sd_
- `market_mine_keywords` — Expand one seed keyword into the keyword universe around it, each with search volume, purchases, purchase rate, product and ad-competitor counts, title density, relevancy, SPR, click concentration and PPC bid. This is the keyword-library builder: run it on the seed term, then split the results into terms worth ranking for organically, terms worth buying impressions on, and cheap long-tail for back

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

Label terms as brand, core, attribute, competitor, or junk.

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

## 扩展参考（同源手册：amazon-keyword-research）

## Capabilities

- **Long-tail keyword mining**: Extract 100-200 real search terms from Amazon's autocomplete engine
- **Competitor landscape analysis**: Product count, price range, average rating, review distribution, top brands
- **Seasonal trend detection**: 12-month Google Trends data to identify peak seasons and demand shifts
- **Market opportunity scoring**: 1-10 score combining competition density, price room, and demand signals
- **Multi-marketplace support**: US, UK, DE, FR, IT, ES, JP, CA, AU, IN, MX, BR
- **Keyword comparison**: Side-by-side analysis of multiple keywords


## Workflow

### Step 1: Gather Autocomplete Data

Run the bundled script to collect Amazon autocomplete suggestions:

```bash
<skill>/scripts/research.sh "<keyword>" [marketplace]
```

**Parameters:**
- `keyword` (required): The seed keyword to research
- `marketplace` (optional): `us` (default), `uk`, `de`, `fr`, `it`, `es`, `jp`, `ca`, `au`, `in`, `mx`, `br`

**What the script does:**
- Queries Amazon's autocomplete API with the seed keyword
- Expands with prefixes: "best [keyword]", "cheap [keyword]", "top [keyword]"
- Expands with a-z suffixes: "[keyword] a", "[keyword] b", ... "[keyword] z"
- Returns deduplicated, sorted list of real search suggestions — one per line

**Why this matters:** Amazon autocomplete reflects what real shoppers are actually typing. These aren't guesses — they're demand signals directly from Amazon's search engine. The prefix and alphabet expansion catches long-tail terms that basic autocomplete misses, which are often lower competition and higher intent.

Example:
```bash
<skill>/scripts/research.sh "portable blender" us
# Returns 100-200 long-tail keywords
```

For multi-marketplace research, run the script once per marketplace.

### Step 2: Analyze Competition

Use `web_search` to gather competitor intelligence:

1. Search `"<keyword>" site:amazon.com` — note approximate result count for competition density
2. Search `"<keyword>" amazon best sellers price review` — extract price patterns, rating averages, dominant brands
3. Summarize: total competitors, price range (min/avg/max), average star rating, top 5 brands by visibility

**Why this matters:** Raw keyword volume means nothing without competition context. A keyword with 10,000 searches but dominated by 3 entrenched brands with 10,000+ reviews each is a very different opportunity than one with the same volume but fragmented sellers. The price range reveals margin potential — if everything is under $10, margins will be razor-thin after FBA fees.

### Step 3: Check Seasonality

Use `web_fetch` on Google Trends:

```
https://trends.google.com/trends/explore?q=<keyword>&geo=US
```

If Google Trends returns a 429 error, fall back to `web_search` for seasonal data:
```
"<keyword>" seasonal trends demand peak months
```

Identify: trend direction (rising/declining/stable), seasonal peaks (which months), year-over-year change.

**Why this matters:** Seasonality determines cash flow risk. A product that sells 80% of its volume in Q4 means you need capital for inventory months in advance and may sit on dead stock the rest of the year. Rising trends mean growing demand and more room for new entrants; declining trends mean you're fighting over a shrinking pie. This context turns a keyword from a number into a business decision.

### Step 4: Synthesize Report

Combine all dat
