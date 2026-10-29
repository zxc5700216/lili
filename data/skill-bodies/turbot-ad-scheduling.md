---
name: turbot-ad-scheduling
description: "按星期和时间段看浪费，再决定要不要分时降价。 Read waste by weekday and hour before any dayparting change. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# 广告分时 / Ad scheduling

PPC dayparting — bid scheduling by hour/day, peak shopping times, budget optimization by time slot

**Supported platforms:** Amazon (US, UK, DE, CA, JP, AU, and all marketplaces).

Built by 粒粒lili — your AI assistant for smarter e-commerce decisions.

## Install

```bash
通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。
```

## Usage

```
Help me with amazon dayparting strategy for my e-commerce business.
```

## Capabilities

- PPC dayparting
- bid scheduling by hour/day
- peak shopping times
- budget optimization by time slot

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

按星期和时间段看浪费，再决定要不要分时降价。

在线时优先用 MCP `meta_load_skill`（slug=`turbot-ad-scheduling`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 先确认广告同步是新鲜的，再读近 7 天和近 30 天。
2. 只挑变化最大的两三个活动或搜索词，写清原因。
3. 改出价、否定或预算时生成预览，放进审批。
4. 用三句话结论和按优先级排的动作收尾。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `ads_list_entities` — Live Amazon Ads entities straight from the Ads API — the current bids, budgets, states and settings the daily report sync does not carry. Covers Sponsored Products, Sponsored Display AND Sponsored Brands: entity_type one of sp_campaigns, sp_ad_groups, sp_product_ads, sp_keywords, sp_targets, sp_negative_keywords, sp_campaign_negative_keywords, sp_negative_targets, sp_campaign_negative_targets, sd_
- `ads_prepare_changes` — STEP 1 of changing ads yourself: validate a list of changes you authored and get a one-time write plan. changes_json is a JSON array; each item has a 'kind' plus its fields. Creating (Sponsored Products and Sponsored Display; pass family='sd' for SD): create_campaign, create_ad_group, create_product_ad, create_keyword (SP only — SD has no keywords; match_type BROAD/PHRASE/EXACT, default EXACT), cr
- `ads_get_settings` — Effective ads optimizer settings for a profile: ACOS thresholds, click/cost gates for each rule type.

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

Read waste by weekday and hour before any dayparting change.

1. Confirm the ads sync is fresh, then read 7-day and 30-day numbers.
2. Pick the two or three campaigns or queries that moved most and say why.
3. Preview bid, negative, or budget edits and send them to approval.
4. Close with three sentences and a prioritized action list.
