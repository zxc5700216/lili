---
name: turbot-variation-strategy
description: "决定哪些属性做成变体，避免把不相关的款硬塞进一个父体。 Choose variation themes and keep unrelated products out of the parent. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# 变体策略 / Variation strategy

Parent-child variation planning — when to merge/split, color/size variations, ranking benefits

**Supported platforms:** Amazon (US, UK, DE, CA, JP, AU, and all marketplaces).

Built by 粒粒lili — your AI assistant for smarter e-commerce decisions.

## Install

```bash
通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。
```

## Usage

```
Help me with amazon variation strategy for my e-commerce business.
```

## Capabilities

- Parent-child variation planning
- when to merge/split
- color/size variations
- ranking benefits

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

决定哪些属性做成变体，避免把不相关的款硬塞进一个父体。

在线时优先用 MCP `meta_load_skill`（slug=`turbot-variation-strategy`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 确认站点、类目和必填属性，缺图或缺字段就停下来问。
2. 按搜索意图写标题、五点和后台词，避免堆砌。
3. 生成 Listing 预览，确认后再准备变更。
4. 在审批单里写清哪些字段会改。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `listing_get_live` — Read one listing LIVE from Amazon (not the daily snapshot): current summaries, attributes, Amazon's own issues list (the authoritative answer to why a listing is suppressed), offers and fulfillment availability. included_data is a comma list from: summaries, attributes, issues, offers, fulfillmentAvailability, relationships.
- `listing_prepare_change` — STEP 1 of changing or creating a listing over MCP: run Amazon's FULL server-side validation (VALIDATION_PREVIEW — nothing is written) on a listing payload you constructed, and get a one-time write plan when it passes. operation='put' creates/fully replaces (attributes_json = the complete attributes object per catalog_get_product_type); operation='patch' partially updates (patches_json = JSON Patch
- `catalog_get_product_type` — Amazon's current requirements for one product type in the seller's marketplace, normalized for payload authoring: fields[] (name, path/arrays/value_key show where the leaf sits in the nested attributes object, plus type, constraints, allowed_values), required_fields, conditional_fields, property_groups. Read this before constructing or debugging listing attribute payloads. Product type names come 

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

Choose variation themes and keep unrelated products out of the parent.

1. Confirm marketplace, product type, and required attributes. Stop if an image or field is missing.
2. Write the title, bullets, and backend terms for search intent.
3. Preview the listing and only then prepare a change.
4. Name the fields that would change on the approval.
