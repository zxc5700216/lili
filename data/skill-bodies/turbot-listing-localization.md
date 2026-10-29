---
name: turbot-listing-localization
description: "把 Listing 改成目标站点的语言和单位，而不是只做机器翻译。 Adapt copy to the marketplace language and units, not word-for-word translation. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# Listing 本地化 / Listing localization

Multi-marketplace listing management — translation, pricing localization, BIL (Build International Listings)

**Supported platforms:** Amazon (US, UK, DE, CA, JP, AU, and all marketplaces).

Built by 粒粒lili — your AI assistant for smarter e-commerce decisions.

## Install

```bash
通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。
```

## Usage

```
Help me with amazon international listings for my e-commerce business.
```

## Capabilities

- Multi-marketplace listing management
- translation
- pricing localization
- BIL (Build International Listings)

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

把 Listing 改成目标站点的语言和单位，而不是只做机器翻译。

在线时优先用 MCP `meta_load_skill`（slug=`turbot-listing-localization`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 确认站点、类目和必填属性，缺图或缺字段就停下来问。
2. 按搜索意图写标题、五点和后台词，避免堆砌。
3. 生成 Listing 预览，确认后再准备变更。
4. 在审批单里写清哪些字段会改。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `listing_get_live` — Read one listing LIVE from Amazon (not the daily snapshot): current summaries, attributes, Amazon's own issues list (the authoritative answer to why a listing is suppressed), offers and fulfillment availability. included_data is a comma list from: summaries, attributes, issues, offers, fulfillmentAvailability, relationships.
- `listing_prepare_change` — STEP 1 of changing or creating a listing over MCP: run Amazon's FULL server-side validation (VALIDATION_PREVIEW — nothing is written) on a listing payload you constructed, and get a one-time write plan when it passes. operation='put' creates/fully replaces (attributes_json = the complete attributes object per catalog_get_product_type); operation='patch' partially updates (patches_json = JSON Patch
- `market_research_keyword` — Is a keyword market worth entering? Monthly search volume, purchases and purchase rate, supply/demand ratio, product count, click concentration (how much the head sellers own), average price and PPC bid range, plus growth trend — for one keyword or a whole keyword market. Use before choosing what to launch, or to compare several keyword directions. Costs credits per call (SellerSprite data). For t

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

Adapt copy to the marketplace language and units, not word-for-word translation.

1. Confirm marketplace, product type, and required attributes. Stop if an image or field is missing.
2. Write the title, bullets, and backend terms for search intent.
3. Preview the listing and only then prepare a change.
4. Name the fields that would change on the approval.
