---
name: turbot-review-compliance
description: "区分正常邀评和违规索评，只保留合规动作。 Separate a normal review request from an incentive, and keep only the compliant step. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# 评价合规 / Review compliance

Review generation strategy — Request a Review, follow-up emails, insert cards, Vine, early reviewer programs

**Supported platforms:** Amazon (US, UK, DE, CA, JP, AU, and all marketplaces).

Built by 粒粒lili — your AI assistant for smarter e-commerce decisions.

## Install

```bash
通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。
```

## Usage

```
Help me with amazon review strategy for my e-commerce business.
```

## Capabilities

- Review generation strategy
- Request a Review
- follow-up emails
- insert cards
- Vine
- early reviewer programs

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

区分正常邀评和违规索评，只保留合规动作。

在线时优先用 MCP `meta_load_skill`（slug=`turbot-review-compliance`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 先确认是哪一家店，避免 NS 店和 TK 店混在一起。
2. 按这个技能的检查单收集证据。
3. 需要提交给 Amazon 的动作只生成草稿。
4. 列出还要你去后台确认的事项。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `orders_check_review_eligibility` — 请求评价·资格检查（实时，只读）: 传订单号列表（逗号分隔，≤20），逐单查「请求评价」动作是否可用。不可用 = 已请求过/买家退订/不在妥投后 5-30 天窗口——Amazon 自己判定。规划批量发送前先用本工具 dry-run。候选订单从 data_query 的 orders 表选（Shipped、6-29 天前）。
- `orders_request_reviews` — 批量请求评价（写操作，低风险）: 对可用的订单发送 Amazon 官方模板的评价+反馈请求邮件（卖家不能自定义任何内容，无政策风险）。每订单一生只能请求一次。逐单先查资格再发送，不可用的跳过并注明原因。一次最多 20 单。先用 orders_check_review_eligibility 规划，向卖家确认数量后再调本工具。
- `market_get_reviews` — Customer reviews for an ASIN — title, body, star rating, date. The voice-of-customer input: run it on COMPETITOR asins and mine the low-star reviews for the pain points your bullets should answer and your images should disprove. stars filters to specific ratings (e.g. '1,2' for the complaints). Costs credits per call.

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

Separate a normal review request from an incentive, and keep only the compliant step.

1. Confirm which store, so NS and TK never mix.
2. Collect evidence from this skill's checklist.
3. Anything that would be sent to Amazon stays a draft.
4. List what you still have to confirm in Seller Central.
