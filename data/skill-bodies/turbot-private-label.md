---
name: turbot-private-label
description: "从差异点、合规和毛利三件事判断这个自有品牌款能不能做。 Judge a private-label idea on differentiation, compliance, and margin. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# 自有品牌 / Private label

> 来源模板：`replay-alias`，已按粒粒品牌与本店工具改写；执行以「粒粒步骤」为准。


Private label launch playbook — product selection, branding, supplier management, differentiation strategy

**Supported platforms:** Amazon (US, UK, DE, CA, JP, AU, and all marketplaces).

Built by 粒粒lili — your AI assistant for smarter e-commerce decisions.

## Install

```bash
通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。
```

## Usage

```
Help me with amazon private label for my e-commerce business.
```

## Capabilities

- Private label launch playbook
- product selection
- branding
- supplier management
- differentiation strategy

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

从差异点、合规和毛利三件事判断这个自有品牌款能不能做。

在线时优先用 MCP `meta_load_skill`（slug=`turbot-private-label`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 先确认是哪一家店，避免 NS 店和 TK 店混在一起。
2. 按这个技能的检查单收集证据。
3. 需要提交给 Amazon 的动作只生成草稿。
4. 列出还要你去后台确认的事项。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `market_get_reviews` — Customer reviews for an ASIN — title, body, star rating, date. The voice-of-customer input: run it on COMPETITOR asins and mine the low-star reviews for the pain points your bullets should answer and your images should disprove. stars filters to specific ratings (e.g. '1,2' for the complaints). Costs credits per call.
- `listing_check_restrictions` — 可售性检查（实时，Listings Restrictions 直通）: 「这个 ASIN 我能卖吗」——返回品牌门槛/类目限制与申请链接（中文原因）。选品或准备上新之前先查，免得文案图片都做完才发现不能上。无限制 = can_sell true。condition 默认全新。
- `finance_get_fee_estimate` — 费用试算（实时，Product Fees 直通）: 「这个 ASIN/SKU 按 X 价卖，亚马逊收多少费、到手多少」。传 asin 或 sku 二选一 + price；fulfillment 默认 fba。返回费用总额、明细（referral/FBA 及内嵌子费）与 net_after_fees。注意这是**事前估算**，不含仓储费/广告/退货/采购成本——事后实收查 economics_daily 的 net_proceeds_total。定价与选品决策用。

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

Judge a private-label idea on differentiation, compliance, and margin.

1. Confirm which store, so NS and TK never mix.
2. Collect evidence from this skill's checklist.
3. Anything that would be sent to Amazon stays a draft.
4. List what you still have to confirm in Seller Central.
