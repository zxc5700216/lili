---
name: listing-new-product-oneshot
description: "看图补属性、写标题和五点、准备图片，交一份完整预览。 Draft attributes, title, bullets, and images into one preview. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"listing","brand":"粒粒"}}
---

# 新品 Listing 一次成型 / New listing in one pass

## 这个技能做什么

看图补属性、写标题和五点、准备图片，交一份完整预览。

Draft attributes, title, bullets, and images into one preview.

本手册是粒粒lili 离线/Codex 镜像。在线优先 `meta_load_skill`（slug=`listing-new-product-oneshot`）拉服务端最新版；工具一律经 MCP server `lili` 调用。

## 什么时候用

处理「新品 Listing 一次成型」或用户提到 New listing in one pass / `listing-new-product-oneshot` 相关诉求时加载。也适用于 12 条粒粒工作流里点名本技能的步骤。

## 能力要点

- 确认站点、类目、必填属性；缺图或缺字段就停下来问
- 标题 / 五点 / 描述 / 后台词 / 图片模块分工，不堆砌重复词
- 生成 Listing 预览，进审批后再提交
- 对照竞品与搜索词意图改薄弱处

## 本技能专项要点

- 标题前 80 字符承载核心词与规格；禁止堆砌品牌词与无效符号。

## 步骤

按下面顺序执行；每一步结束先汇报再往下（写操作必须停在预览）。

1. 确认站点、类目和必填属性，缺图或缺字段就停下来问。 建议先调 `listing_prepare_change`。
2. 按搜索意图写标题、五点和后台词，避免堆砌。
3. 生成 Listing 预览，确认后再准备变更。 变更类调用 `ads_prepare_changes` / 对应 prepare 工具生成预览。
4. 在审批单里写清哪些字段会改。

### 流程补充（分类手册）

- 主图与标题各司其职：尺寸/材质不要只靠主图。
- 后台搜索词不进标题；违规词、竞品品牌词剔除。
- A+/品牌故事与五点不重复堆砌同一卖点。
- 改动前后各留一份对照，方便回滚。

## 相关工具

- `listing_prepare_change` — STEP 1 of changing or creating a listing over MCP: run Amazon's FULL server-side validation (VALIDATION_PREVIEW — nothing is written) on a listing payload you constructed, and get a one-time write plan when it passes. operation='put' creates/fully replaces (attributes_json = the complete attributes object per catalog_get_product_type); operation='patch' partially updates (patches_json = JSON Patch
- `catalog_search_product_types` — Find the Amazon product type for an item — STEP 0 of authoring a listing payload. Pass keywords (e.g. 'running shoes') or an item_name (a draft title works); returns [{name, display_name}] candidates. Feed the chosen name to catalog_get_product_type. Free live SP-API read.
- `market_research_keyword` — Is a keyword market worth entering? Monthly search volume, purchases and purchase rate, supply/demand ratio, product count, click concentration (how much the head sellers own), average price and PPC bid range, plus growth trend — for one keyword or a whole keyword market. Use before choosing what to launch, or to compare several keyword directions. Costs credits per call (SellerSprite data). For t

## 输出格式

- Listing 预览（标题、五点、描述、后台词、图位说明）
- 关键词分组：核心 / 长尾 / 否定候选
- 审批单 ID

默认收尾：
1. 三句话结论（发生了什么 / 原因 / 这周先做什么）
2. 按优先级排序的动作清单（预估影响 + 负责人角色）
3. 需要运营去卖家后台确认的开放问题

## 护栏

- 查询可以直接看结果。改 Listing、广告或货件时先生成预览，放进审批。
- 市场调研和允许执行两个开关默认关闭。
- 多店场景先确认 NS 店 / TK 店，禁止串店改价或改广告。
- 付费市场数据调用前告知预计次数与费用风险。
- 不诱导评论、不违反品牌与广告政策。

## Steps (EN)

Draft attributes, title, bullets, and images into one preview.

1. Confirm marketplace, product type, and required attributes. Stop if an image or field is missing.
2. Write the title, bullets, and backend terms for search intent.
3. Preview the listing and only then prepare a change.
4. Name the fields that would change on the approval.
## 与工作流的关系

本技能可被「周一经营例会 / 广告止血 / 销量下滑 / 新品上架到开广告 / 选品开品 / 竞品拆解 / 补货发货 / 利润体检 / 大促备战 / 老品清退 / 退货攻坚 / 月度报告」等模板引用。若当前对话来自某条工作流，保持该工作流的顺序与停顿点，不要跳步执行写操作。

## 扩展参考（同源手册：amazon-listing-optimization）

## Capabilities

- **Keyword-driven listing generation**: Import keywords (from amazon-keyword-research, manual list, or extracted from competitor ASINs), rank by priority, generate copy that maximizes keyword coverage
- **Competitor keyword extraction**: Fetch competitor listings and automatically extract their title/bullet keywords as your baseline
- **8-dimension audit & scoring**: Title, bullets, description, images, A+ content, pricing, reviews, SEO coverage
- **Keyword coverage tracking**: Visual map showing which keywords appear in title / bullets / description / missing
- **Tone selection**: Professional, Friendly, Urgent, Luxury — affects AI copywriting style
- **Competitive benchmarking**: Compare your listing against competitors
- **Multi-marketplace**: US, UK, DE, FR, IT, ES, JP, CA, AU, IN, MX, BR


## Two Modes

| Mode | When to Use | Input | Output |
|------|-------------|-------|--------|
| **A — Create** | Building a new listing | Keywords and/or competitor ASINs + product info + tone | Full listing copy + keyword coverage score |
| **B — Optimize** | Improving an existing listing | Your ASIN or URL (+ optional keywords or competitor ASINs) | Optimized listing copy + audit report + gap analysis |


## Output Formats

The primary deliverable is always a **ready-to-use listing** that the seller can copy-paste directly into Seller Central. Diagnostic data (scores, keyword analysis) comes after as supporting evidence.

### Mode A Output — New Listing

```
# ✅ Your Listing — Ready to Use

