---
name: turbot-subscribe-save
description: "估算订购省折扣对复购和利润的影响，再决定开不开。 Estimate how a Subscribe and Save discount hits repeat rate and margin. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# 订购省 / Subscribe and Save

Subscribe & Save optimization — enrollment, discount tiers, frequency optimization, retention analysis

**Supported platforms:** Amazon (US, UK, DE, CA, JP, AU, and all marketplaces).

Built by 粒粒lili — your AI assistant for smarter e-commerce decisions.

## Install

```bash
通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。
```

## Usage

```
Help me with amazon subscribe & save for my e-commerce business.
```

## Capabilities

- Subscribe & Save optimization
- enrollment
- discount tiers
- frequency optimization
- retention analysis

## How This Skill Works

**Step 1:** Collect information from the user's message — product, platform, current situation, and goals.

**Step 2:** Ask one follow-up with all remaining questions using multiple-choice format. Allow shorthand answers (e.g., "1b 2c 3a").

**Step 3:** Research and analyze using the frameworks and methodology below.

**Step 4:** Deliver structured, actionable output with specific recommendations, not vague advice.

## Output Format

- Start with a summary of findings
- Include specific data points and benchmarks where available
- Provide prioritized action items
- Mark estimates with ⚠️ when based on incomplete data
- End with concrete next steps

## Other Skills

More e-commerce skills: [lili/skills](https://github.com/lili/skills)

Amazon-specific skills: [lili/skills](https://github.com/lili/skills)

Built by 粒粒lili — your AI assistant for smarter e-commerce decisions.

## 粒粒操作要点

估算订购省折扣对复购和利润的影响，再决定开不开。

在线时优先用 MCP `meta_load_skill`（slug=`turbot-subscribe-save`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 列出正在跑和最近结束的券、秒杀和促销。
2. 算折扣后还能不能保住目标利润。
3. 撞档、失败或和广告叠加的，单独标出。
4. 要改促销时先预览，再审批。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `promotions_get` — Read one promotion LIVE by promotion_id (from promotions_search): full schedule, budget, benefit, purchase requirements, fee preview, customer segments, issues, and whether an edit is pending or failed (latest revision). Returns the selection id/revision needed by promotions_get_items. Free live SP-API read. Does not list the items — use promotions_get_items.
- `finance_get_fee_estimate` — 费用试算（实时，Product Fees 直通）: 「这个 ASIN/SKU 按 X 价卖，亚马逊收多少费、到手多少」。传 asin 或 sku 二选一 + price；fulfillment 默认 fba。返回费用总额、明细（referral/FBA 及内嵌子费）与 net_after_fees。注意这是**事前估算**，不含仓储费/广告/退货/采购成本——事后实收查 economics_daily 的 net_proceeds_total。定价与选品决策用。
- `orders_get_recent` — 实时订单（Orders API 直通，不经本地数据）: 最近 N 小时（默认 24，上限 72）的订单数、状态分布（PENDING/UNSHIPPED/SHIPPED/CANCELLED）、金额合计与按 SKU 的 Top 清单。报表表 orders 滞后数小时且看不到未结算的 Pending 单——「今天卖了多少 / 有多少单没发货」用本工具；更久的历史用 data_query。金额口径: grand_total 含税含运费, item_subtotal 为商品口径(可与业务报表对比)。

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

Estimate how a Subscribe and Save discount hits repeat rate and margin.

1. List running and recently ended coupons, deals, and promotions.
2. Check whether the discount still clears the target margin.
3. Flag overlaps, failures, and stacking with ads.
4. Preview any promotion change, then approve it.
