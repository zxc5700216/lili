---
name: category-node-scan
description: "定位类目节点，看这个节点里的价格带和评分门槛。 Locate a category node and read its price band and rating bar. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"research","brand":"粒粒"}}
---

# 类目节点扫描 / Category node scan

## 这个技能做什么

定位类目节点，看这个节点里的价格带和评分门槛。

Locate a category node and read its price band and rating bar.

本手册是粒粒lili 离线/Codex 镜像。在线优先 `meta_load_skill`（slug=`category-node-scan`）拉服务端最新版；工具一律经 MCP server `lili` 调用。

## 什么时候用

处理「类目节点扫描」或用户提到 Category node scan / `category-node-scan` 相关诉求时加载。也适用于 12 条粒粒工作流里点名本技能的步骤。

## 能力要点

- 界定站点、类目、价格带与成本假设后再开查
- 需求、竞争、价格带、评价痛点、进入门槛多维打分
- 结合市场数据工具与站内 Listing 样本交叉验证
- 输出可交给工厂/运营的开品或拆解结论

## 本技能专项要点

- （按本技能摘要与步骤执行，遇缺口再查相邻技能）

## 步骤

按下面顺序执行；每一步结束先汇报再往下（写操作必须停在预览）。

1. 写清站点、价格带和自己的成本假设。 建议先调 `market_find_node`。
2. 用沙盒里的样本市场数据看需求、竞争和差评，并标明不是真实行情。
3. 给出做或不做的结论，以及还要人工确认的点。
4. 真实产品里的付费数据调用要先说明次数，这里只计数。

### 流程补充（分类手册）

- 先写清假设：目标毛利、可接受广告 ACOS、头程与关税。
- 样本至少覆盖头部 5–10 个 ASIN，避免只看一个爆款。
- 差评痛点按「可改良 / 不可控」分类并估改良成本。
- 付费市场数据调用前先告知预计次数。

## 相关工具

- `market_find_node` — Resolve an Amazon browse node: give a category name (e.g. 'Cat Houses & Condos') or a node id / id path and get back the full category path, node id path and the number of products listed in it. The node id path is what market_scan_node and market_find_products take. Costs credits per call.
- `market_scan_node` — Category-node health check in one call: overview (product count, average price / profit margin / rating / review count, new-product share, head vs. overall), price-band distribution, rating distribution, listed-date distribution and head-N product concentration (share of units the top N ASINs own). Optionally brand and seller concentration. node_id_path comes from market_find_node. Each section is
- `market_find_products` — Find products in a browse node or keyword market that match conditions — price band, monthly units, rating — sorted by sales, price, rating, reviews, profit or listed date, with per-ASIN price / units / revenue / rating / reviews / listed date / brand / seller. This is the sampler behind category scans: pull the top 100 by units to compute medians and quartiles yourself, or pull a price gap (min_p

## 输出格式

- 候选表：机会分、风险、价格带、预估利润
- 痛点/卖点清单
- 做或不做结论 + 下一步验证动作

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

Locate a category node and read its price band and rating bar.

1. State the marketplace, price band, and your cost assumption.
2. Read demand, competition, and reviews from sandbox samples and label them as samples.
3. End with a go or no-go and the points a person still must check.
4. A live product would quote paid data calls first. Here we only count them.
## 与工作流的关系

本技能可被「周一经营例会 / 广告止血 / 销量下滑 / 新品上架到开广告 / 选品开品 / 竞品拆解 / 补货发货 / 利润体检 / 大促备战 / 老品清退 / 退货攻坚 / 月度报告」等模板引用。若当前对话来自某条工作流，保持该工作流的顺序与停顿点，不要跳步执行写操作。

## 扩展参考（同源手册：amazon-niche-finder）

## Capabilities

- **Niche opportunity scoring**: Multi-factor analysis for market viability
- **Market gap identification**: Find underserved customer segments  
- **Competition density mapping**: Identify low-competition high-demand areas
- **Profit potential assessment**: Margin analysis and pricing opportunities
- **Growth trajectory analysis**: Expanding vs. saturating markets
- **Customer pain point discovery**: Unmet needs in existing categories
- **Cross-category opportunities**: Adjacent market expansion possibilities
- **Multi-marketplace support**: US, UK, DE, FR, IT, ES, JP, CA, AU, IN, MX, BR


## Workflow

### Step 1: Category Exploration & Mapping

Identify potential niche areas within broader categories:

1. **Category deep dive**: `"Amazon subcategories [main category]"` - map category structure
2. **Long-tail exploration**: `"[category] + specific use case"` - find specialized applications  
3. **Problem-based search**: `"[category] problems complaints reviews"` - identify pain points
4. **Demographic targeting**: `"[category] for [specific group]"` - underserved segments

**Niche Discovery Methods:**
- **Subcategory analysis**: Find less competitive subcategories within popular categories
- **Use case specialization**: Products designed for specific situations/users  
- **Geographic/cultural needs**: Region-specific or culturally-adapted products
- **Size/age/lifestyle segments**: Products for specific demographics
- **Quality tiers**: Premium or budget alternatives in established categories

### Step 2: Demand Validation

Verify there's real customer demand for identified niches:

1. **Search volume indicators**: `"[niche product]" Amazon search suggestions autocomplete`
2. **Social proof**: `"[niche product]" reddit Facebook groups communities` 
3. **Content validation**: `"[niche product]" YouTube reviews tutorials how-to`
4. **Trend analysis**: `web_fetch` Google Trends for `[niche keywords]`

**Demand Signals to Look For:**
- Active communities discussing the niche problem
- YouTube content with engagement around niche topics  
- Amazon autocomplete suggestions for niche-specific terms
- Growing search trends over 6-12 months
- Social media hashtags and influencer content

**Demand Scoring (1-10):**
- 9-10: Strong community, growing search trends, multiple content creators
- 7-8: Active discussions, stable search volume, some content
- 5-6: Moderate signals, niche but consistent interest
- 3-4: Limited signals, very specific or declining interest  
- 1-2: Little to no validation, may not be viable market

### Step 3: Competition Gap Analysis  

Identify where competition is weak or missing:

1. **Direct competition count**: `"[niche product]" site:amazon.com` - total results
2. **Quality assessment**: `"best [niche product]" Amazon reviews ratings`
3. **Price gap analysis**: `"[niche product]" Amazon price range $X-$Y`  
4. **Feature gap identification**: `"[niche product]" reviews complaints missing features`

**Competition Gap Indicators:**
- **Low result count**: <1,000 results for specific niche terms
- **Poor quality leaders**: Top products have <4.0 stars or <100 reviews
- **Price gaps**: Missing products in key price ranges ($15-30, $50-100, etc.)
- **Feature gaps**: Common complaints about missing functionality
- **Brand gaps**: No established brands, mostly generic products

**Competition Scoring (1-10, where 10 = lowest
