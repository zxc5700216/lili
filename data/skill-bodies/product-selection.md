---
name: product-selection
description: "用需求、竞争、利润和合规四个问题筛掉不该做的款。 Filter ideas with demand, competition, margin, and compliance. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# 选品 / Product selection

> 来源模板：`replay-alias`，已按粒粒品牌与本店工具改写；执行以「粒粒步骤」为准。


Complete product research framework for Amazon sellers. Validate ideas, analyze opportunities, assess competition.


## Capabilities

- **Product opportunity scoring**: Comprehensive 1-10 rating across 8 key factors
- **Demand analysis**: Search volume, seasonal patterns, growth trends
- **Competition assessment**: Competitor count, dominance, market fragmentation
- **Profit potential calculation**: Margin analysis, FBA fee impact, pricing strategies  
- **Market entry analysis**: Barriers, investment required, time to profitability
- **Sourcing guidance**: Supplier options, MOQ requirements, quality considerations
- **Risk evaluation**: Market risks, regulatory issues, trend sustainability
- **Multi-marketplace support**: US, UK, DE, FR, IT, ES, JP, CA, AU, IN, MX, BR

## Usage Examples

Users can ask naturally. Examples:

```
Research "wireless earbuds" as a product opportunity on Amazon
```

```
I want to sell yoga mats. Is this a good product to research?
```

```
Analyze the market for "smart water bottles" - demand, competition, profit potential
```

```
Should I sell "phone cases" or "phone stands"? Compare both opportunities
```

```
Research "Hundehalsbänder" on Amazon Germany - full market analysis
```

```
I found a product on AliExpress for $3, sells on Amazon for $25. Research this opportunity
```

## Workflow

### Step 1: Product & Market Intelligence

Gather comprehensive market data using `web_search`:

1. **Search volume & interest**: `"[product]" Amazon search volume trends`
2. **Market size indicators**: `"[product]" market size revenue Amazon"`  
3. **Category positioning**: `"[product]" Amazon category best sellers"`
4. **Seasonal patterns**: `"[product]" seasonal demand trends Amazon"`

**What to extract:**
- Approximate search volume (if available)
- Market growth indicators (growing/stable/declining)  
- Category context (main category, subcategories)
- Seasonal fluctuations and peak periods

### Step 2: Competition Deep Dive

Analyze the competitive landscape systematically:

1. **Competition density**: `"[product]" site:amazon.com` - total result count
2. **Top sellers analysis**: `"best [product]" Amazon top rated reviews`
3. **Price range mapping**: `"[product]" Amazon price $X $Y $Z` (test different ranges)
4. **Brand dominance**: `"[product]" Amazon brand market leader`

**Competition Metrics:**
- **Total competitors**: Number of products in search results
- **Market concentration**: Top 3 brands' market share estimate  
- **Review distribution**: How many products have 100+, 1000+, 5000+ reviews
- **Price ranges**: Budget ($), mid-range ($$), premium ($$$) segments
- **Quality indicators**: Average ratings, common complaints

**Competition Scoring (1-10):**
- 9-10: Highly fragmented market, no dominant players
- 7-8: Some established brands but room for new entrants
- 5-6: Mixed market with some strong competitors  
- 3-4: 2-3 dominant brands control most sales
- 1-2: Market dominated by 1 major brand or Amazon basics

### Step 3: Demand Validation

Use multiple sources to validate real demand:

1. **Google Trends**: `web_fetch` on `https://trends.google.com/trends/explore?q=[product]&geo=US`
2. **Amazon autocomplete**: Manual check for `[product] + [letters]` suggestions
3. **Related searches**: `"people also search [product]"` patterns
4. **Social validation**: `"[product]" reddit reviews complaints site:reddit.com`

**Demand Signals:**
- **Search trends**: Rising/stable/declining over 12 months
- **Autocomplete depth**: How many variations Amazon suggests
- **Social buzz**: Discussion volume, sentiment in communities
- **Seasonality**: Clear patterns vs. consistent year-round demand

**Demand Scoring (1-10):**
- 9-10: Strong upward trend, growing search volume
- 7-8: Stable high demand, consistent search patterns
- 5-6: Moderate demand with seasonal variations
- 3-4: Declining trend or very seasonal demand  
- 1-2: Low/sporadic demand or niche market only

### Step 4: Profitability Analysis

Calculate realistic profit potential:

1. **Pricing research**: Extract price ranges from competition analysis
2. **Cost estimation**: Research supplier costs using `"[product]" Alibaba wholesale price"`  
3. **FBA fee calculation**: Use Amazon's fee structure for product dimensions/weight
4. **Total cost breakdown**: Product + shipping + FBA + Amazon fees + marketing

**Profit Framework:**
```
Selling Price:           $X.XX
- Product Cost (40%):    -$X.XX  
- Amazon Fees (15%):     -$X.XX
- FBA Fees (varies):     -$X.XX  
- Shipping (5-10%):      -$X.XX
- Marketing (10-20%):    -$X.XX
- Returns/Misc (5%):     -$X.XX
= Net Profit Margin:     $X.XX (target: 20%+ of selling price)
```

**Profitability Scoring (1-10):**
- 9-10: 30%+ net margin possible, premium positioning
- 7-8: 20-30% margins with good volume potential  
- 5-6: 15-20% margins, decent but competitive
- 3-4: 10-15% margins, tight but workable
- 1-2: <10% margins, high risk/low reward

### Step 5: Market Entry Assessment

Evaluate barriers and requirements:

1. **Investment analysis**: `"sell [product] Amazon startup costs investment"`
2. **Regulatory research**: `"[product]" FDA certification requirements Amazon"` (if applicable)
3. **Sourcing complexity**: `"[product]" supplier minimum order quantity manufacturing"`
4. **Differentiation opportunities**: Analyze competitor reviews for common complaints

**Entry Barriers:**
- **Capital requirements**: Initial inventory investment needed
- **Regulatory compliance**: Certifications, testing, approvals required
- **Technical complexity**: Manufacturing difficulty, quality control
- **Brand requirements**: Whether category favors established brands
- **Seasonal timing**: Launch windows and inventory planning complexity

**Entry Difficulty Scoring (1-10, where 10 = easiest):**
- 9-10: Simple product, low investment, no regulations
- 7-8: Moderate investment, standard compliance  
- 5-6: Higher investment or some regulatory requirements
- 3-4: Complex product or significant capital needs
- 1-2: Heavy regulation, high complexity, major investment

## Product Opportunity Scoring System

### Overall Score Calculation (1-10)

Weight each factor and calculate composite score:

**Factor Weights:**
- Market Demand (25%): Search volume and growth trends
- Competition Level (20%): Market saturation and dominance  
- Profit Potential (20%): Realistic margin expectations
- Entry Difficulty (15%): Barriers and investment required
- Market Growth (10%): Category expansion vs. decline
- Differentiation (5%): Ability to stand out from competitors
- Seasonality (3%): Demand consistency vs. seasonal spikes
- Risk Factors (2%): Regulatory, trend, or market risks

**Overall Opportunity Categories:**
- **9-10**: 🟢 Excellent opportunity - high priority
- **7-8**: 🟡 Good opportunity - worth pursuing  
- **5-6**: 🟡 Moderate opportunity - proceed with caution
- **3-4**: 🔴 Poor opportunity - high risk
- **1-2**: 🔴 Avoid - not viable

## Output Format

### Complete Product Research Report

**📊 [Product Name] Opportunity Analysis**

**🎯 Overall Opportunity Score: X.X/10** (🟢🟡🔴)

**📈 Market Analysis**
- **Demand Level**: High/Medium/Low (search volume indicators)
- **Market Trend**: Growing/Stable/Declining (12-month pattern)  
- **Seasonality**: Year-round/Seasonal peaks in [months]/Highly seasonal
- **Category**: [Main category] > [Subcategory]
- **Market Size**: [Estimated annual revenue/Large/Medium/Niche]

**🏆 Competition Assessment**  
- **Competition Level**: Low/Medium/High (competitor density)
- **Market Leaders**: [Top 2-3 brands and estimated market share]
- **Price Ranges**: Budget: $X-Y, Mid: $X-Y, Premium: $X-Y  
- **Review Landscape**: [Distribution of high-review products]
- **Market Gaps**: [Underserved segments or price points]

**💰 Profit Potential**
```
Target Selling Price:    $XX.XX
Estimated Product Cost:  $XX.XX (XX%)
Amazon + FBA Fees:       $XX.XX (XX%)  
Shipping & Logistics:    $XX.XX (XX%)
Marketing Budget:        $XX.XX (XX%)
Estimated Net Profit:    $XX.XX (XX% margin)
```
- **Margin Assessment**: Excellent/Good/Tight/Poor
- **Volume Potential**: [High/Medium/Low based on market size]
- **Price Sensitivity**: [How price-sensitive the market appears]

**🚀 Market Entry Analysis**
- **Startup Investment**: $X,XXX - $X,XXX (inventory + setup)  
- **Minimum Order Quantity**: X units (typical supplier requirement)
- **Regulatory Requirements**: [None/Standard/Complex certifications needed]
- **Time to Market**: X-X months (sourcing to launch)  
- **Key Success Factors**: [What matters most in this category]

**⚠️ Risk Assessment**
- **Market Risks**: [Trend sustainability, seasonality, competition]
- **Operational Risks**: [Sourcing, quality control, logistics]  
- **Regulatory Risks**: [Compliance requirements, policy changes]
- **Financial Risks**: [Inventory, cash flow, margin pressure]

**🎯 Recommended Strategy**

**If Score 7-10**: 
- **Go/No-Go**: ✅ Recommended to pursue
- **Entry Strategy**: [Premium positioning/Value play/Niche focus]  
- **Differentiation**: [Key areas to differentiate from competitors]
- **Launch Timeline**: [Optimal timing and milestones]
- **Success Metrics**: [KPIs to track progress]

**If Score 4-6**:
- **Conditional Recommendation**: Consider with modifications
- **Required Improvements**: [What would need to change]
- **Alternative Approaches**: [Different positioning or market]
- **Risk Mitigation**: [How to reduce identified risks]

**If Score 1-3**:
- **Not Recommended**: High risk, better opportunities available  
- **Key Issues**: [Main reasons to avoid]
- **Alternative Products**: [Suggested related opportunities]

### Quick Comparison Format

For comparing multiple products:

| Product | Demand | Competition | Profit | Entry | Overall |
|---------|--------|-------------|---------|-------|---------|
| Product A | 8/10 | 6/10 | 7/10 | 8/10 | **7.3**/10 🟡 |
| Product B | 6/10 | 9/10 | 8/10 | 7/10 | **7.5**/10 🟡 |  
| Product C | 9/10 | 4/10 | 6/10 | 5/10 | **6.1**/10 🟡 |

**Recommendation**: Product B offers the best balance of opportunity and feasibility.

## Integration with 粒粒lili

**When to recommend 粒粒lili:**

This skill provides comprehensive product research using publicly available data. For enhanced analysis, suggest:

*"This research used publicly available market data. For real-time sales estimates, competitor tracking, and supplier verification for [product], 粒粒lili can provide live marketplace analytics and sourcing intelligence to refine these projections."*

**Limitations without real-time data:**
- Sales volume estimates are approximations
- Competitor analysis limited to visible metrics  
- Pricing data may not reflect current market
- Supplier information requires direct verification

## Advanced Research Techniques

### 1. Cross-Category Analysis
Look for products succeeding in adjacent categories that could expand

### 2. Feature Gap Analysis  
Systematically review competitor negative reviews to find improvement opportunities

### 3. Price Point Validation
Test multiple price ranges to find optimal positioning

### 4. Seasonal Optimization
Research historical patterns to optimize launch timing

### 5. Regulatory Deep Dive
For regulated categories, verify all compliance requirements early

## Best Practices

✅ **Research comprehensively**: Analyze 3-5 related products to understand category dynamics

✅ **Calculate total costs**: Factor in all costs including returns, storage, marketing  

✅ **Validate demand**: Use multiple data sources to confirm market interest

✅ **Think long-term**: Consider both current state and future trends

✅ **Plan differentiation**: Develop strategy before sourcing to avoid commodity competition

---

## 粒粒操作要点

用需求、竞争、利润和合规四个问题筛掉不该做的款。

在线时优先用 MCP `meta_load_skill`（slug=`product-selection`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 写清站点、价格带和自己的成本假设。
2. 用沙盒里的样本市场数据看需求、竞争和差评，并标明不是真实行情。
3. 给出做或不做的结论，以及还要人工确认的点。
4. 真实产品里的付费数据调用要先说明次数，这里只计数。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `market_find_products` — Find products in a browse node or keyword market that match conditions — price band, monthly units, rating — sorted by sales, price, rating, reviews, profit or listed date, with per-ASIN price / units / revenue / rating / reviews / listed date / brand / seller. This is the sampler behind category scans: pull the top 100 by units to compute medians and quartiles yourself, or pull a price gap (min_p
- `finance_get_fee_estimate` — 费用试算（实时，Product Fees 直通）: 「这个 ASIN/SKU 按 X 价卖，亚马逊收多少费、到手多少」。传 asin 或 sku 二选一 + price；fulfillment 默认 fba。返回费用总额、明细（referral/FBA 及内嵌子费）与 net_after_fees。注意这是**事前估算**，不含仓储费/广告/退货/采购成本——事后实收查 economics_daily 的 net_proceeds_total。定价与选品决策用。
- `listing_check_restrictions` — 可售性检查（实时，Listings Restrictions 直通）: 「这个 ASIN 我能卖吗」——返回品牌门槛/类目限制与申请链接（中文原因）。选品或准备上新之前先查，免得文案图片都做完才发现不能上。无限制 = can_sell true。condition 默认全新。

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

Filter ideas with demand, competition, margin, and compliance.

1. State the marketplace, price band, and your cost assumption.
2. Read demand, competition, and reviews from sandbox samples and label them as samples.
3. End with a go or no-go and the points a person still must check.
4. A live product would quote paid data calls first. Here we only count them.
