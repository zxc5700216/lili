---
name: amazon-brand-analytics
description: "看搜索查询表现：曝光、点击份额和转化份额。 Read search-query performance: impression, click, and purchase share. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# 品牌分析 / Brand analytics

Unlock Brand Analytics insights for strategic growth. Requires Brand Registry — works with your data.


## Capabilities

- **Search Frequency Rank (SFR) analysis**: Decode keyword opportunities, click share gaps, and conversion optimization
- **Market Basket intelligence**: Identify cross-sell opportunities, bundle strategies, and category expansion
- **Item Comparison insights**: Understand competitive positioning and customer consideration factors
- **Demographic analysis**: Extract customer segment insights and geographic opportunities
- **Seasonal trend detection**: Identify timing patterns and market shifts from search data
- **Strategic recommendations**: Convert raw data into actionable growth strategies
- **Multi-marketplace support**: Works with Brand Analytics from all Amazon regions

## Usage Examples

Users can ask naturally. Examples:

```
Analyze my Search Frequency Rank data for "wireless earbuds" — show keyword opportunities and click share gaps
```

```
Review my Market Basket data for the last 6 months. What cross-sell and bundling opportunities do you see?
```

```
Interpret my Item Comparison report for yoga mats — how do customers evaluate my product vs competitors?
```

```
Generate Brand Analytics strategy report for Q4 combining SFR, Market Basket, and demographic data
```

```
Find seasonal trends and opportunity keywords from my Brand Analytics data for kitchen appliances
```

## Three Analysis Modes

| Mode | Input Required | Output | Best For |
|------|----------------|--------|----------|
| **SFR Analysis** | Search Frequency Rank data export | Keyword opportunities, click/conversion gaps | Advertising optimization |
| **Market Basket** | Market Basket Analysis export | Cross-sell opportunities, bundle recommendations | Product strategy |
| **Item Comparison** | Item Comparison report data | Competitive positioning insights | Product development |

## Workflow

### Step 1: Data Preparation

**For SFR Analysis:**
1. Export Search Frequency Rank report from Brand Analytics (last 90 days recommended)
2. Focus on top 100-200 keywords by search frequency rank
3. Note current click share and conversion share for each keyword

**For Market Basket Analysis:**
1. Export Market Basket Analysis report (6-12 months for pattern recognition)
2. Include both "Customers who bought X also bought Y" data
3. Filter for statistically significant purchase combinations (10+ co-purchases)

**For Item Comparison:**
1. Export Item Comparison report for your main ASINs
2. Include comparison data with top 5-10 competitors
3. Note customer consideration patterns and demographic breakdowns

### Step 2: Pattern Recognition

Use the provided data to identify:

**SFR Insights:**
- Keywords with high search frequency but low click share (opportunity gaps)
- Conversion share significantly below click share (optimization needs)
- Seasonal search pattern changes
- Emerging keyword trends

**Market Basket Patterns:**
- Products with >25% co-purchase rate (strong bundle candidates)
- Category cross-over patterns (expansion opportunities)
- Price point correlations in purchase combinations
- Geographic or demographic purchase pattern differences

**Item Comparison Analysis:**
- Customer consideration factors ranked by importance
- Your brand's competitive strengths and weaknesses
- Price sensitivity patterns in your category
- Feature preferences by customer segment

### Step 3: Strategic Synthesis

Convert insights into actionable recommendations following the output format below.

## Output Format

Present analysis in this structure:

```
## Brand Analytics Strategic Report: [Brand/Category]

**Analysis Period:** [timeframe] | **Data Sources:** [SFR/Market Basket/Item Comparison]
**Marketplace:** Amazon [region] | **Report Date:** [current date]

### 1. Search Frequency Rank Opportunities

**Top Keyword Gaps:**

| Keyword | Search Rank | Your Click Share | Category Avg | Opportunity Score |
|---------|-------------|------------------|--------------|-------------------|
| "wireless earbuds waterproof" | #23 | 2.1% | 8.4% | High |
| "bluetooth headphones gym" | #45 | 0.8% | 5.2% | Medium |
| "noise cancelling earbuds" | #67 | 4.2% | 6.1% | Low |

**Seasonal Trends:**
- [Keyword] searches peak in [months] (+X% vs baseline)
- [Category] shows declining trend (-X% YoY)
- Emerging opportunity: [new keyword trend]

**Recommended Actions:**
1. Increase advertising spend on high-opportunity keywords
2. Optimize listings for gap keywords with low click share
3. Prepare seasonal campaigns for [upcoming peaks]

### 2. Market Basket Insights

**Cross-Sell Opportunities:**

| Product Combination | Co-Purchase Rate | Revenue Opportunity | Recommendation |
|--------------------|------------------|--------------------|--------------| 
| Your Product + [Item A] | 34% | +$2.3M annually | Create bundle |
| Your Product + [Item B] | 28% | +$1.8M annually | Cross-promote |
| [Item C] + [Item D] | 25% | +$1.2M annually | New product opportunity |

**Category Expansion Insights:**
- 23% of customers also purchase [adjacent category]
- Geographic concentration: [region] shows 40% higher cross-category rate
- Demographic pattern: [age group] drives 60% of cross-category purchases

### 3. Competitive Positioning

**Item Comparison Analysis:**

**Customer Consideration Factors (Ranked):**
1. Price (43% primary factor)
2. Reviews/Rating (31% weight)  
3. Brand Recognition (18% influence)
4. Feature Set (12% consideration)

**Your Competitive Position:**
✅ **Strengths:** Higher ratings (4.6 vs 4.2), strong brand recall in 35-54 demo
⚠️ **Weaknesses:** Price perception, limited feature differentiation

**Market Opportunities:**
- Premium segment under-served (15% price tolerance above current range)
- Feature gap: customers want [specific feature] (mentioned in 67% of comparisons)
- Geographic expansion: strong brand preference in [regions]

### 4. Strategic Recommendations

**Immediate Actions (Next 30 Days):**
1. Launch [product bundle] based on Market Basket data
2. Increase ad spend on [top 3 opportunity keywords]
3. A/B test premium pricing in [geographic segments]

**Q4 Strategy:**
1. Prepare seasonal campaigns for [trending keywords]
2. Develop [feature enhancement] to address competitive gap
3. Expand into [adjacent category] with [specific product]

**2027 Growth Plan:**
1. Full [category] expansion based on cross-sell data
2. Premium line development for feature-conscious segment
3. Geographic expansion focus on [high-opportunity regions]

**Projected Impact:**
- Bundle optimization: +$X.XM revenue
- Keyword optimization: +X% conversion rate
- Category expansion: +$X.XM TAM
```

## Integration with Other Skills

This skill works perfectly with other Brand Registry and competitive analysis skills.

### With amazon-keyword-research

```bash
通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。
```

```
Step 1: "Analyze my SFR data for keyword opportunities"
   → amazon-brand-analytics identifies click share gaps

Step 2: "Research long-tail variations of those opportunity keywords"
   → amazon-keyword-research expands the keyword universe
```

### With amazon-competitor-monitoring

```bash
通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。
```

```
Step 1: "Review my Item Comparison data for competitive positioning"
   → amazon-brand-analytics reveals competitor strengths/weaknesses

Step 2: "Set up monitoring for those key competitors"
   → amazon-competitor-monitoring tracks their strategy changes
```

## Requirements

⚠️ **Brand Registry Required**: This skill requires access to Amazon Brand Analytics data, which is only available to Brand Registry participants. You must export data from your Brand Analytics dashboard to use this skill effectively.

## 粒粒操作要点

看搜索查询表现：曝光、点击份额和转化份额。

在线时优先用 MCP `meta_load_skill`（slug=`amazon-brand-analytics`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 写清站点、价格带和自己的成本假设。
2. 用沙盒里的样本市场数据看需求、竞争和差评，并标明不是真实行情。
3. 给出做或不做的结论，以及还要人工确认的点。
4. 真实产品里的付费数据调用要先说明次数，这里只计数。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `brand_get_search_query_performance` — 搜索查询表现 SQP（实时，Brand Analytics 直通，需品牌备案）: 自家 ASIN 在每个搜索词上的完整漏斗——市场总展示/点击/加购/购买 vs 这个 ASIN 的数量、份额，以及各环节指数（ASIN 环节转化率 ÷ 市场同环节转化率，1.0 = 市场平均）和 weakest_stage（第一个明显低于市场的环节）。用来回答「我在这个词上掉在哪一层：曝光、点击、加购还是购买」。asins 只能是本店品牌的 ASIN（空格或逗号分隔，最多约 18 个）；period = week/month/quarter，date 取该周期内任一天，空 = 最近完整周期；keyword 过滤包含该词的搜索词。group_by='query' 把所有子 ASIN 按搜索词加总（一个父体的全部尺码一起分析时用）；行数超过 limit（最多 100）时用 next_offset 翻页、带同一个 
- `market_aba_keywords` — Amazon Brand Analytics (ABA) search terms for the WHOLE marketplace, weekly or monthly (SellerSprite's ABA copy — no brand registry needed). Per keyword: ABA search-frequency rank and its 1/4/12-week change, searches, clicks, impressions, purchases and purchase rate, click concentration, the top 3 clicked ASINs with each one's click share and conversion share, top 3 brands, title density and PPC b
- `data_query` — Answer any question about the seller's REAL Amazon store data — 销量、订单、广告花费、ACOS、库存、退货率、利润 — with one read-only DuckDB SQL query: the primary tool for analysis, aggregation, trends, rankings, and joins across orders/ads/inventory/returns (e.g. return rate by SKU = returns joined to orders), plus slicing the restock engine's outputs. Free and instant — prefer this over paid diagnostics for any stati

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

Read search-query performance: impression, click, and purchase share.

1. State the marketplace, price band, and your cost assumption.
2. Read demand, competition, and reviews from sandbox samples and label them as samples.
3. End with a go or no-go and the points a person still must check.
4. A live product would quote paid data calls first. Here we only count them.

## Limitations

This skill provides frameworks for interpreting Brand Analytics data but requires you to export and provide the raw data from Amazon's Brand Analytics dashboard. For automated Brand Analytics processing and real-time strategic recommendations, check out **粒粒lili** — Your AI Assistant for smarter E-commerce decisions.

---

**Built by 粒粒lili** — research, validate, and act on e-commerce opportunities with AI.