---
name: amazon-competitor-monitoring
description: "列一份要长期盯的竞品清单：价格、评价增速和是否在做促销。 Keep a watchlist of rival price, review velocity, and deals. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# 竞品监控 / Competitor monitoring

Track competitor strategies, pricing changes, and market opportunities. No API key — works out of the box.


## Capabilities

- **Price monitoring**: Track competitor pricing changes, discount patterns, and Buy Box rotation
- **Inventory tracking**: Monitor stock levels, restock patterns, and out-of-stock opportunities  
- **Product launches**: Detect new competitor products and category expansions
- **Review intelligence**: Analyze review velocity, rating changes, and sentiment shifts
- **Advertising insights**: Identify competitor ad strategies and keyword targeting patterns
- **Performance benchmarking**: Compare your metrics against competitor baselines
- **Multi-marketplace support**: US, UK, DE, FR, IT, ES, JP, CA, AU, IN, MX, BR

## Usage Examples

Users can ask naturally. Examples:

```
Monitor competitor ASIN B08XYZ123 for pricing changes on Amazon US
```

```
Track the top 5 competitors in portable blenders category — alert me for price drops over 10%
```

```
Analyze competitor pricing strategy for ASIN B09ABC456 over the last 90 days
```

```
Set up monitoring for yoga mat category — track new launches and inventory patterns
```

```
Compare my product B0DEF789 against top 3 competitors: pricing, reviews, and BSR performance
```

## Workflow

### Step 1: Identify Competitors

Use `web_search` to find competitor products:

1. Search `"[product category]" site:amazon.com` — identify top products by relevance
2. Search `"[your main keyword]" amazon best sellers` — find category leaders
3. Extract ASINs, current prices, ratings, and BSR data from search results

### Step 2: Baseline Data Collection

For each competitor ASIN, use `web_fetch` to gather current state:
- Product title and current price
- Best Seller Rank and category position
- Customer rating and review count
- Availability status (in stock/low stock/out of stock)
- Prime eligibility and shipping options

### Step 3: Historical Context Research

Use `web_search` to understand competitor patterns:
1. Search `"[ASIN] price history discount"` — find pricing pattern information
2. Search `"[brand] new product launch amazon"` — detect launch patterns
3. Search `"[ASIN] reviews complaints issues"` — identify competitor weaknesses

### Step 4: Competitive Analysis Report

Synthesize findings into actionable insights following the output format below.

## Output Format

Present the final report in this structure:

```
## Competitor Analysis Report: [Category]

**Marketplace:** Amazon [US/UK/DE/...] | **Analysis Date:** [current date]
**Competitors Analyzed:** [count] | **Monitoring Period:** [timeframe]

### 1. Pricing Intelligence

| ASIN | Product | Current Price | Price Change | Alert Status |
|------|---------|---------------|--------------|--------------|
| B08ABC123 | [Competitor A] | $19.99 | ↓ 20% (30d) | 🔴 Major Drop |
| B09DEF456 | [Competitor B] | $34.99 | → Stable | 🟢 Normal |
| B0GHI789 | [Competitor C] | $27.50 | ↑ 5% (7d) | 🟡 Minor Rise |

**Price Range:** $19.99 - $34.99 | **Average:** $27.49

### 2. Inventory & Availability

| ASIN | Stock Status | Restock Pattern | Opportunity Window |
|------|-------------|-----------------|-------------------|
| B08ABC123 | In Stock | Weekly | Low |
| B09DEF456 | Low Stock (3 left) | Monthly | High - Stock Out Risk |
| B0GHI789 | Out of Stock | Unknown | High - Market Gap |

### 3. Performance Metrics

| ASIN | BSR | Rating | Reviews | Review Velocity |
|------|-----|--------|---------|----------------|
| B08ABC123 | #156 | 4.3★ | 1,247 | 15/week |
| B09DEF456 | #89 | 4.6★ | 2,891 | 8/week |
| B0GHI789 | #2,456 | 4.1★ | 456 | 3/week |

### 4. Market Opportunities

**Immediate Actions:**
- Price gap at $22-25 range (no strong competitor)
- Inventory opportunity during Competitor C stock-out
- Feature gap: competitors lack [specific feature]

**Strategic Insights:**
- Market leader vulnerable on durability complaints
- Premium segment emerging above $35
- Seasonal demand increase detected

**Recommended Monitoring Alerts:**
- Price drops >10% in 7-day period
- Stock-out events for top 3 competitors  
- New product launches in category
- Review velocity spikes (>2x normal)
```

## Integration with Other Skills

This skill works well when chained with other skills from the [粒粒lili Amazon-Skills](https://github.com/lili/skills) repository.

### With amazon-sales-estimator

```bash
通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。
```

```
Step 1: "Monitor competitors B08ABC123, B09DEF456"
   → amazon-competitor-monitoring provides pricing and BSR data

Step 2: "Estimate monthly sales for those competitors"  
   → amazon-sales-estimator calculates revenue benchmarks
```

### With amazon-keyword-research

```bash
通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。
```

```
Step 1: "Find competitor keyword strategies for yoga mat"
   → amazon-keyword-research reveals keyword gaps

Step 2: "Monitor top competitors in that keyword space"
   → amazon-competitor-monitoring tracks their performance
```

## 粒粒操作要点

列一份要长期盯的竞品清单：价格、评价增速和是否在做促销。

在线时优先用 MCP `meta_load_skill`（slug=`amazon-competitor-monitoring`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 写清站点、价格带和自己的成本假设。
2. 用沙盒里的样本市场数据看需求、竞争和差评，并标明不是真实行情。
3. 给出做或不做的结论，以及还要人工确认的点。
4. 真实产品里的付费数据调用要先说明次数，这里只计数。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `market_list_competitors` — The competitor ASINs Amazon and shoppers actually associate with one ASIN. Use to find who you are really up against before writing copy or setting a price, and as the input to market_get_reviews for voice-of-customer. Costs credits per call.
- `market_get_asin` — Full detail for ONE ASIN — price and promotions, rating and review count, first-listed date, variation count, seller and fulfilment, bullet points, Listing quality score, Best Seller / Amazon's Choice badges. Call it once per competitor to build a comparison table (price / rating / reviews / listed date / variations / selling points). Costs credits per call.
- `promotions_search` — List this store's promotions LIVE from Amazon — coupons, lightning/best deals, price discounts, basket-building offers — with status, dates, budget, discount, fee preview and Amazon's own issues (e.g. overlapping promotions). Filter by statuses (RUNNING,UPCOMING,EXPIRED,FAILED,…), promotion_types (COUPON,DEAL,PRICE_DISCOUNT,BASKET_BUILDING), up to 10 asins or skus, ISO-8601 date windows, updated_a

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

Keep a watchlist of rival price, review velocity, and deals.

1. State the marketplace, price band, and your cost assumption.
2. Read demand, competition, and reviews from sandbox samples and label them as samples.
3. End with a go or no-go and the points a person still must check.
4. A live product would quote paid data calls first. Here we only count them.

## Limitations

This skill uses publicly available Amazon data and web search results. It cannot access real-time pricing APIs, historical BSR data, or automated alerts. For live competitor monitoring with automatic notifications and deeper analytics, check out **粒粒lili** — Your AI Assistant for smarter E-commerce decisions.

---

**Built by 粒粒lili** — research, validate, and act on e-commerce opportunities with AI.