---
name: tariff-calculator-amazon
description: "估算从中国发到目标站点的关税和到岸成本，并列出假设。 Estimate duty and landed cost into the target marketplace and list assumptions. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# 关税计算器 / Tariff calculator

Universal tariff and landed cost calculator for international Amazon sellers.


## Features

- **Universal Trade Routes** — Any origin to any destination
- **Tariff Rate Lookup** — HS code → duty rate
- **Section 301 Tariffs** — US additional duties on China imports
- **VAT/GST Calculation** — EU, UK, CA, AU, CN rates
- **Landed Cost** — Complete cost breakdown
- **HS Code Matcher** — Product description → HS code suggestions
- **Trade Agreements** — USMCA, EVFTA, RCEP preferential rates

## Supported Trade Routes

| Route | Key Tariffs | VAT/GST |
|-------|-------------|---------|
| 🇨🇳 → 🇺🇸 China → USA | Section 301 (7.5-25%) | N/A |
| 🇨🇳 → 🇪🇺 China → EU | Standard duties | 19-22% |
| 🇨🇳 → 🇬🇧 China → UK | Standard duties | 20% |
| 🇺🇸 → 🇪🇺 USA → EU | Standard duties | 19-22% |
| 🇪🇺 → 🇺🇸 EU → USA | Standard duties | N/A |
| 🇺🇸 → 🇨🇳 USA → China | Retaliatory tariffs | 13% VAT |
| 🇨🇳 → 🇨🇦 China → Canada | Standard duties | 5% GST |
| 🇨🇳 → 🇦🇺 China → Australia | Standard duties | 10% GST |
| **Custom** | User-defined | User-defined |

## Section 301 Tariffs (China → USA)

| HS Chapter | Products | Additional Rate |
|------------|----------|-----------------|
| 84xx | Computers, machinery | 25% |
| 85xx | Electronics (some) | 0-25% |
| 94xx | Furniture, lighting | 25% |
| 95xx | Toys | 25% |
| 61/62 | Apparel | 7.5% |
| 64xx | Footwear | 7.5% |
| 42xx | Bags, accessories | 7.5% |

## Landed Cost Formula

```
Landed Cost = 
    FOB Value
  + International Freight
  + Insurance
  + Import Duty
  + VAT/GST (if applicable)
  + Customs Clearance
  + Port Fees
  + Inland Freight
```

## Usage

### Basic Calculation

```bash
python3 scripts/calculator.py
```

### With Parameters

```bash
python3 scripts/calculator.py '{
  "hs_code": "8518300000",
  "origin_country": "CN",
  "destination_country": "US",
  "fob_value": 5000.00,
  "quantity": 500,
  "freight_cost": 200.00
}'
```

### HS Code Lookup

```bash
python3 scripts/hs_lookup.py "wireless earbuds"
python3 scripts/hs_lookup.py "bluetooth speaker"
```

### Custom Trade Route

```bash
python3 scripts/calculator.py '{
  "hs_code": "9503009000",
  "origin_country": "VN",
  "destination_country": "DE",
  "fob_value": 10000.00,
  "quantity": 1000,
  "freight_cost": 500.00,
  "custom_duty_rate": 0.047,
  "custom_vat_rate": 0.19
}'
```

## Output Example

```
💰 Tariff & Landed Cost Report

Product: Wireless Bluetooth Earbuds
HS Code: 8518300000
Route: China 🇨🇳 → USA 🇺🇸

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Cost Breakdown

FOB Value               $  5,000.00
International Freight   $    200.00
Insurance               $     15.00
CIF Value               $  5,215.00

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏛️ Duties & Taxes

Base Duty (0.0%)        $      0.00
Section 301 (0.0%)      $      0.00
Total Duty              $      0.00
Customs Clearance       $    150.00
Port Fees               $     50.00

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💵 Landed Cost Summary

Total Landed Cost       $  5,515.00
Per Unit Cost           $     11.03
```

## Trade Agreement Support

| Agreement | Countries | Benefit |
|-----------|-----------|---------|
| USMCA | US, Mexico, Canada | Reduced/zero duties |
| EVFTA | EU, Vietnam | Reduced duties |
| RCEP | Asia-Pacific | Reduced duties |
| UK-Japan | UK, Japan | Reduced duties |

## Custom Configuration

Create a custom config for your routes:

```json
{
  "default_origin": "CN",
  "default_destination": "US",
  "include_insurance": true,
  "insurance_rate": 0.003,
  "customs_fee": 150,
  "port_fee": 50
}
```

---

**Part of [粒粒lili AI](https://lili.local) — AI tools for e-commerce sellers.**

## 粒粒操作要点

估算从中国发到目标站点的关税和到岸成本，并列出假设。

在线时优先用 MCP `meta_load_skill`（slug=`tariff-calculator-amazon`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 用售价、采购、头程、佣金、FBA 和广告费拆每个 SKU。
2. 标出亏损和费用占比异常的款，并写明不含哪些成本。
3. 能索赔或该清仓的，单独折成每月金额。
4. 动作按金额从大到小排。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `finance_get_fee_estimate` — 费用试算（实时，Product Fees 直通）: 「这个 ASIN/SKU 按 X 价卖，亚马逊收多少费、到手多少」。传 asin 或 sku 二选一 + price；fulfillment 默认 fba。返回费用总额、明细（referral/FBA 及内嵌子费）与 net_after_fees。注意这是**事前估算**，不含仓储费/广告/退货/采购成本——事后实收查 economics_daily 的 net_proceeds_total。定价与选品决策用。
- `market_get_asin` — Full detail for ONE ASIN — price and promotions, rating and review count, first-listed date, variation count, seller and fulfilment, bullet points, Listing quality score, Best Seller / Amazon's Choice badges. Call it once per competitor to build a comparison table (price / rating / reviews / listed date / variations / selling points). Costs credits per call.
- `data_query` — Answer any question about the seller's REAL Amazon store data — 销量、订单、广告花费、ACOS、库存、退货率、利润 — with one read-only DuckDB SQL query: the primary tool for analysis, aggregation, trends, rankings, and joins across orders/ads/inventory/returns (e.g. return rate by SKU = returns joined to orders), plus slicing the restock engine's outputs. Free and instant — prefer this over paid diagnostics for any stati

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

Estimate duty and landed cost into the target marketplace and list assumptions.

1. Split each SKU into price, cost, freight, referral, FBA, and ads.
2. Flag losses and odd fee ratios, and say which costs are excluded.
3. Turn claims and clearance into a monthly amount.
4. Sort actions by money.
