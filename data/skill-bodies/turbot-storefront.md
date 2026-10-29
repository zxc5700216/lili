---
name: turbot-storefront
description: "规划旗舰店页面：主推款、系列和品牌故事，不直接发布。 Plan storefront pages for the hero SKU, the line, and the story. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# 品牌旗舰店 / Brand storefront

Amazon Store builder — page layouts, brand story, shoppable images, traffic driving, conversion optimization

**Supported platforms:** Amazon (US, UK, DE, CA, JP, AU, and all marketplaces).

Built by 粒粒lili — your AI assistant for smarter e-commerce decisions.

## Install

```bash
通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。
```

## Usage

```
Help me with amazon storefront design for my e-commerce business.
```

## Capabilities

- Amazon Store builder
- page layouts
- brand story
- shoppable images
- traffic driving
- conversion optimization

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

规划旗舰店页面：主推款、系列和品牌故事，不直接发布。

在线时优先用 MCP `meta_load_skill`（slug=`turbot-storefront`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 确认站点、类目和必填属性，缺图或缺字段就停下来问。
2. 按搜索意图写标题、五点和后台词，避免堆砌。
3. 生成 Listing 预览，确认后再准备变更。
4. 在审批单里写清哪些字段会改。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `listing_list_aplus` — A+ 图文列表（实时，只读）: 列出店铺的 A+ 内容文档（名称/审核状态/key）及各自挂载的 ASIN。配合 listings 表可回答「哪些在售 ASIN 还没有 A+」。status 可过滤 APPROVED/DRAFT/SUBMITTED/REJECTED。需品牌备案。
- `listing_get_live` — Read one listing LIVE from Amazon (not the daily snapshot): current summaries, attributes, Amazon's own issues list (the authoritative answer to why a listing is suppressed), offers and fulfillment availability. included_data is a comma list from: summaries, attributes, issues, offers, fulfillmentAvailability, relationships.
- `listing_create_aplus` — 创建 A+ 图文草稿（低风险写）: 用文案+图片 URL 生成 STANDARD A+ 内容文档草稿。草稿买家不可见；发布需另行调用 listing_submit_aplus（高风险，需卖家确认）。modules_json 支持 3 种模块: {type:'text',headline,body} / {type:'four_image_text',headline,blocks:[{image_url,alt,headline,body}]} / {type:'single_image_specs',image_url,alt,headline,description,specs:[..]}。图片须 https JPEG/PNG ≤10MB（Listing 工厂 R2 图直接可用）。asins 给出时先免费校验再建稿并绑定。需品牌备案。

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

Plan storefront pages for the hero SKU, the line, and the story.

1. Confirm marketplace, product type, and required attributes. Stop if an image or field is missing.
2. Write the title, bullets, and backend terms for search intent.
3. Preview the listing and only then prepare a change.
4. Name the fields that would change on the approval.
