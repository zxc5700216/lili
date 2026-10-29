---
name: turbot-bundling
description: "判断捆绑是否能提高客单，同时写清捆绑后的费用和退货风险。 Judge whether a bundle lifts order value without hiding fee and return risk. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# 捆绑销售 / Bundling

Product bundling strategy — virtual bundles, multi-pack pricing, cross-sell bundles, bundle listing optimization

**Supported platforms:** Amazon (US, UK, DE, CA, JP, AU, and all marketplaces).

Built by 粒粒lili — your AI assistant for smarter e-commerce decisions.

## Install

```bash
通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。
```

## Usage

```
Help me with amazon product bundling for my e-commerce business.
```

## Capabilities

- Product bundling strategy
- virtual bundles
- multi-pack pricing
- cross-sell bundles
- bundle listing optimization

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

判断捆绑是否能提高客单，同时写清捆绑后的费用和退货风险。

在线时优先用 MCP `meta_load_skill`（slug=`turbot-bundling`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 确认站点、类目和必填属性，缺图或缺字段就停下来问。
2. 按搜索意图写标题、五点和后台词，避免堆砌。
3. 生成 Listing 预览，确认后再准备变更。
4. 在审批单里写清哪些字段会改。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `listing_prepare_change` — STEP 1 of changing or creating a listing over MCP: run Amazon's FULL server-side validation (VALIDATION_PREVIEW — nothing is written) on a listing payload you constructed, and get a one-time write plan when it passes. operation='put' creates/fully replaces (attributes_json = the complete attributes object per catalog_get_product_type); operation='patch' partially updates (patches_json = JSON Patch
- `finance_get_fee_estimate` — 费用试算（实时，Product Fees 直通）: 「这个 ASIN/SKU 按 X 价卖，亚马逊收多少费、到手多少」。传 asin 或 sku 二选一 + price；fulfillment 默认 fba。返回费用总额、明细（referral/FBA 及内嵌子费）与 net_after_fees。注意这是**事前估算**，不含仓储费/广告/退货/采购成本——事后实收查 economics_daily 的 net_proceeds_total。定价与选品决策用。
- `listing_get_live` — Read one listing LIVE from Amazon (not the daily snapshot): current summaries, attributes, Amazon's own issues list (the authoritative answer to why a listing is suppressed), offers and fulfillment availability. included_data is a comma list from: summaries, attributes, issues, offers, fulfillmentAvailability, relationships.

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

Judge whether a bundle lifts order value without hiding fee and return risk.

1. Confirm marketplace, product type, and required attributes. Stop if an image or field is missing.
2. Write the title, bullets, and backend terms for search intent.
3. Preview the listing and only then prepare a change.
4. Name the fields that would change on the approval.
