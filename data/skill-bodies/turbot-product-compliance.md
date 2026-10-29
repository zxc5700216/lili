---
name: turbot-product-compliance
description: "按类目列出可能要的认证和受限风险，不确定就标成待确认。 List likely certifications and restricted-product risk, and mark unknowns. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# 产品合规 / Product compliance

Product compliance and safety — certifications, labeling requirements, restricted substances, documentation

**Supported platforms:** Amazon (US, UK, DE, CA, JP, AU, and all marketplaces).

Built by 粒粒lili — your AI assistant for smarter e-commerce decisions.

## Install

```bash
通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。
```

## Usage

```
Help me with amazon product compliance for my e-commerce business.
```

## Capabilities

- Product compliance and safety
- certifications
- labeling requirements
- restricted substances
- documentation

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

按类目列出可能要的认证和受限风险，不确定就标成待确认。

在线时优先用 MCP `meta_load_skill`（slug=`turbot-product-compliance`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 先确认是哪一家店，避免 NS 店和 TK 店混在一起。
2. 按这个技能的检查单收集证据。
3. 需要提交给 Amazon 的动作只生成草稿。
4. 列出还要你去后台确认的事项。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `listing_check_restrictions` — 可售性检查（实时，Listings Restrictions 直通）: 「这个 ASIN 我能卖吗」——返回品牌门槛/类目限制与申请链接（中文原因）。选品或准备上新之前先查，免得文案图片都做完才发现不能上。无限制 = can_sell true。condition 默认全新。
- `catalog_get_product_type` — Amazon's current requirements for one product type in the seller's marketplace, normalized for payload authoring: fields[] (name, path/arrays/value_key show where the leaf sits in the nested attributes object, plus type, constraints, allowed_values), required_fields, conditional_fields, property_groups. Read this before constructing or debugging listing attribute payloads. Product type names come 
- `restock_get_item_compliance` — Item compliance details (listItemComplianceDetails) for a draft's SKUs (draft_id) or mskus_json [..]: ASIN, FNSKU and tax details (HSN code, declared value, GST/cess rates). Tax details matter for the India marketplace. Read-only.

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

List likely certifications and restricted-product risk, and mark unknowns.

1. Confirm which store, so NS and TK never mix.
2. Collect evidence from this skill's checklist.
3. Anything that would be sent to Amazon stays a draft.
4. List what you still have to confirm in Seller Central.
