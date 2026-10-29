---
name: turbot-account-health-appeal
description: "整理绩效通知、证据和申诉草稿，不假装已经提交。 Assemble the notice, evidence, and an appeal draft without pretending it was sent. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# 账户健康申诉 / Account health appeal

Account suspension prevention and appeal — policy violations, Plan of Action writing, reinstatement process

**Supported platforms:** Amazon (US, UK, DE, CA, JP, AU, and all marketplaces).

Built by 粒粒lili — your AI assistant for smarter e-commerce decisions.

## Install

```bash
通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。
```

## Usage

```
Help me with amazon suspension appeal for my e-commerce business.
```

## Capabilities

- Account suspension prevention and appeal
- policy violations
- Plan of Action writing
- reinstatement process

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

整理绩效通知、证据和申诉草稿，不假装已经提交。

在线时优先用 MCP `meta_load_skill`（slug=`turbot-account-health-appeal`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 先确认是哪一家店，避免 NS 店和 TK 店混在一起。
2. 按这个技能的检查单收集证据。
3. 需要提交给 Amazon 的动作只生成草稿。
4. 列出还要你去后台确认的事项。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `meta_list_stores` — All stores connected to this account, with the store_scope id to pass to other tools: Amazon Ads profiles (for ads_* tools) and the Amazon store connection (for restock_* tools). Each Amazon store's label is its store name — use it when confirming with the seller which store they mean.
- `data_query` — Answer any question about the seller's REAL Amazon store data — 销量、订单、广告花费、ACOS、库存、退货率、利润 — with one read-only DuckDB SQL query: the primary tool for analysis, aggregation, trends, rankings, and joins across orders/ads/inventory/returns (e.g. return rate by SKU = returns joined to orders), plus slicing the restock engine's outputs. Free and instant — prefer this over paid diagnostics for any stati
- `meta_submit_feedback` — 把卖家的功能需求、问题反馈或其它意见提交给粒粒团队。只在卖家明确要求反馈 / 提需求 / 报问题时调用，不要把普通抱怨或你自己的想法替卖家提交。调用前先把要提交的内容用一两句话复述给卖家，得到同意后再提交。kind 取 request（功能需求）/ bug（问题）/ other（其它）；body 用卖家的原意写清楚想要什么或遇到了什么。只收文字——卖家要附截图、表格等文件时，告诉他在粒粒网页右上角的「反馈」里上传。

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

Assemble the notice, evidence, and an appeal draft without pretending it was sent.

1. Confirm which store, so NS and TK never mix.
2. Collect evidence from this skill's checklist.
3. Anything that would be sent to Amazon stays a draft.
4. List what you still have to confirm in Seller Central.
