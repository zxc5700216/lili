---
name: cross-border-bestseller-radar
description: "在目标站点找已经验证过的形态，再评估运费和关税是否还成立。 Find proven forms on the target marketplace, then test freight and duty. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"research","brand":"粒粒"}}
---

# 跨境爆款雷达 / Cross-border bestseller radar

## 这个技能做什么

在目标站点找已经验证过的形态，再评估运费和关税是否还成立。

Find proven forms on the target marketplace, then test freight and duty.

本手册是粒粒lili 离线/Codex 镜像。在线优先 `meta_load_skill`（slug=`cross-border-bestseller-radar`）拉服务端最新版；工具一律经 MCP server `lili` 调用。

## 什么时候用

处理「跨境爆款雷达」或用户提到 Cross-border bestseller radar / `cross-border-bestseller-radar` 相关诉求时加载。也适用于 12 条粒粒工作流里点名本技能的步骤。

## 能力要点

- 界定站点、类目、价格带与成本假设后再开查
- 需求、竞争、价格带、评价痛点、进入门槛多维打分
- 结合市场数据工具与站内 Listing 样本交叉验证
- 输出可交给工厂/运营的开品或拆解结论

## 本技能专项要点

- （按本技能摘要与步骤执行，遇缺口再查相邻技能）

## 步骤

按下面顺序执行；每一步结束先汇报再往下（写操作必须停在预览）。

1. 写清站点、价格带和自己的成本假设。 建议先调 `market_find_products`。
2. 用沙盒里的样本市场数据看需求、竞争和差评，并标明不是真实行情。
3. 给出做或不做的结论，以及还要人工确认的点。
4. 真实产品里的付费数据调用要先说明次数，这里只计数。

### 流程补充（分类手册）

- 先写清假设：目标毛利、可接受广告 ACOS、头程与关税。
- 样本至少覆盖头部 5–10 个 ASIN，避免只看一个爆款。
- 差评痛点按「可改良 / 不可控」分类并估改良成本。
- 付费市场数据调用前先告知预计次数。

## 相关工具

- `market_find_products` — Find products in a browse node or keyword market that match conditions — price band, monthly units, rating — sorted by sales, price, rating, reviews, profit or listed date, with per-ASIN price / units / revenue / rating / reviews / listed date / brand / seller. This is the sampler behind category scans: pull the top 100 by units to compute medians and quartiles yourself, or pull a price gap (min_p
- `market_aba_trend` — One keyword's ABA history: search-frequency rank and searches per week (or per month), newest last. Use to see seasonality, whether a term is rising or fading, and when its peak weeks are before planning launch or ad budget. last_n keeps the most recent points (default 52 weeks / 24 months; SellerSprite holds data back to 2022). Costs credits per call.
- `finance_get_fee_estimate` — 费用试算（实时，Product Fees 直通）: 「这个 ASIN/SKU 按 X 价卖，亚马逊收多少费、到手多少」。传 asin 或 sku 二选一 + price；fulfillment 默认 fba。返回费用总额、明细（referral/FBA 及内嵌子费）与 net_after_fees。注意这是**事前估算**，不含仓储费/广告/退货/采购成本——事后实收查 economics_daily 的 net_proceeds_total。定价与选品决策用。

## 输出格式

- 候选表：机会分、风险、价格带、预估利润
- 痛点/卖点清单
- 做或不做结论 + 下一步验证动作

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

Find proven forms on the target marketplace, then test freight and duty.

1. State the marketplace, price band, and your cost assumption.
2. Read demand, competition, and reviews from sandbox samples and label them as samples.
3. End with a go or no-go and the points a person still must check.
4. A live product would quote paid data calls first. Here we only count them.
## 与工作流的关系

本技能可被「周一经营例会 / 广告止血 / 销量下滑 / 新品上架到开广告 / 选品开品 / 竞品拆解 / 补货发货 / 利润体检 / 大促备战 / 老品清退 / 退货攻坚 / 月度报告」等模板引用。若当前对话来自某条工作流，保持该工作流的顺序与停顿点，不要跳步执行写操作。

## 扩展参考（同源手册：amazon-global-selling）

## Capabilities

- Compare candidate Amazon marketplaces using a consistent decision model.
- Build a directional landed-economics model with explicit assumptions.
- Map tax, customs, product, packaging, producer-responsibility, and account questions for qualified review.
- Compare cross-border fulfillment, local inventory, FBA, and 3PL operating models.
- Create a listing-localization and launch-validation brief.
- Recommend a pilot market and define go, hold, and stop gates.


## Workflow

### 1. Define the Decision and Evidence Boundary

State the target decision, evaluation date, candidate marketplaces, product scope, and evidence inspected.

Use three labels:

- **Confirmed:** supported by seller data or an inspected current source.
- **Directional:** derived from an explicit assumption or proxy.
- **Unresolved:** requires Seller Central, a current official source, a provider quote, or qualified advice.

Do not invent search volume, sales, fees, tax rates, duties, certification needs, account eligibility, or market share.

### 2. Screen for Hard Gates

Before scoring demand, check whether any candidate market has unresolved gates:

- product eligibility or restricted-product status;
- safety, labeling, language, testing, documentation, or responsible-person requirements;
- dangerous-goods, battery, chemical, cosmetic, food, medical, children's product, or radio-equipment implications;
- trademark, brand authorization, or listing-control risks;
- importer-of-record, customs, tax registration, invoicing, or producer-responsibility obligations;
- available fulfillment route and return handling;
- account, identity, banking, or payout readiness.

Do not convert an unresolved legal or compliance question into a negative conclusion. Mark the market **Hold for verification** when the answer can change feasibility.

### 3. Build the Market Comparison

Evaluate only dimensions supported by evidence:

| Dimension | Typical evidence | Decision use |
|---|---|---|
| Demand | seller search/query data, sales history, current category and competitor observations | estimate buyer interest |
| Competition | relevant listings, price bands, ratings/reviews, brand concentration, offer quality | assess entry difficulty |
| Economics | price, currency, referral/FBA fees, freight, duty, tax treatment, returns, ads | estimate contribution margin |
| Operational fit | lead time, inventory placement, returns, customer service, replenishment | assess execution burden |
| Compliance readiness | documented requirements and seller-held evidence | determine go or hold |
| Localization effort | keyword, language, images, measurements, cultural fit, support | estimate launch work |
| Strategic fit | brand objective, catalog reuse, expansion sequence, capital | prioritize the pilot |

If numerical scoring is useful, define weights before scoring, show the formula, and leave unsupported dimensions unscored rather than fabricating precision.

### 4. Model Directional Unit Economics

Use a transparent per-unit model:

```text
Net proceeds before tax treatment
= customer price and seller-paid shipping
- marketplace referral and closing fees
- fulfillment or local delivery fees
- inbound freight and handling
- duty, customs, and brokerage estimates
- storage
