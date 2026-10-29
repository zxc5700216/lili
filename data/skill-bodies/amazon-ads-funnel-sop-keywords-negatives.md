---
name: amazon-ads-funnel-sop-keywords-negatives
description: "把出单词留在精确组，把花钱不出单的词做成否定预览。 Keep converting terms on exact and preview negatives for wasted queries. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"ads","brand":"粒粒"}}
---

# 漏斗：关键词与否定 / Funnel: keywords and negatives

## 这个技能做什么

把出单词留在精确组，把花钱不出单的词做成否定预览。

Keep converting terms on exact and preview negatives for wasted queries.

本手册是粒粒lili 离线/Codex 镜像。在线优先 `meta_load_skill`（slug=`amazon-ads-funnel-sop-keywords-negatives`）拉服务端最新版；工具一律经 MCP server `lili` 调用。

## 什么时候用

处理「漏斗：关键词与否定」或用户提到 Funnel: keywords and negatives / `amazon-ads-funnel-sop-keywords-negatives` 相关诉求时加载。也适用于 12 条粒粒工作流里点名本技能的步骤。

## 能力要点

- 核对广告同步新鲜度（`ads_get_data_health` / `ads_get_sync_status`）
- 按近 7 天 vs 近 30 天对比花费、销售额、ACOS、CPC、CVR
- 定位异常活动 / 广告组 / 搜索词 / 投放，写清因果
- 生成出价、预算、否定、结构变更的预览（`ads_prepare_changes`）
- 输出三句话结论 + 按优先级排序的动作清单（含预计省钱/增量）

## 本技能专项要点

- 否定层级：广告组否优于活动否；精准否优于词组否（除非大面积浪费）。
- 否之前用搜索词报告确认该词在其他活动是否出单。
- 漏斗分层：自动发现 → 广泛/词组测款 → 精确收割 → 否定清洗。
- 同词不要多活动重复精确硬怼，除非明确品牌防守。

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
- `ads_list_recommendations` — Latest ads optimization recommendations (negatives, bid changes, budget reviews, harvest opportunities) with evidence. Filter by handled status.

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

Keep converting terms on exact and preview negatives for wasted queries.

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

