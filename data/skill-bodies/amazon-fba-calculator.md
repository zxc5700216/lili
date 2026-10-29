---
name: amazon-fba-calculator
description: "按尺寸重量估算配送费，并和当前 SKU 的费用并排看。 Estimate FBA fulfillment from size and weight next to the live SKU fee. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"amazon","brand":"粒粒"}}
---

# FBA 费用计算 / FBA fee calculator

Precise FBA fee calculation based on product dimensions and weight.

## Features

- **Size Tier Detection** - Automatic classification
- **FBA Fulfillment Fee** - 2024 rates
- **Monthly Storage Fee** - Standard & Peak season
- **Long-term Storage Fee** - 271+ days aging
- **Referral Fee** - By category
- **Profit Analysis** - Gross/Net margin, ROI
- **Optimization Tips** - Size, weight, inventory

## Size Tiers (2024)

| Tier | Max Weight | Max Dimensions |
|------|------------|----------------|
| Small Standard | 1 lb | 15"×12"×0.75" |
| Large Standard | 20 lb | 18"×14"×8" |
| Small Oversize | 70 lb | 60"×30" |
| Medium Oversize | 150 lb | L+Girth ≤108" |
| Large Oversize | 150 lb | L+Girth ≤165" |
| Special Oversize | >150 lb | >165" |

## Input

```json
{
  "length": 10.0,
  "width": 6.0,
  "height": 3.0,
  "weight": 1.2,
  "selling_price": 29.99,
  "product_cost": 8.00,
  "inbound_shipping_cost": 1.50,
  "category": "kitchen"
}
```

## Output

- Size tier classification
- Fee breakdown table
- Profit metrics (margin, ROI)
- Optimization suggestions

## Usage

```bash
python3 scripts/calculator.py
python3 scripts/calculator.py '{"length": 10, "width": 6, ...}' --zh
```

---

_Version 1.0.0 | Platform: Amazon | Variant: Lite_

---

**Part of [粒粒lili AI](https://lili.local) — AI tools for e-commerce sellers.**

## 粒粒操作要点

按尺寸重量估算配送费，并和当前 SKU 的费用并排看。

在线时优先用 MCP `meta_load_skill`（slug=`amazon-fba-calculator`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

1. 用售价、采购、头程、佣金、FBA 和广告费拆每个 SKU。
2. 标出亏损和费用占比异常的款，并写明不含哪些成本。
3. 能索赔或该清仓的，单独折成每月金额。
4. 动作按金额从大到小排。

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

- `finance_get_fee_estimate` — 费用试算（实时，Product Fees 直通）: 「这个 ASIN/SKU 按 X 价卖，亚马逊收多少费、到手多少」。传 asin 或 sku 二选一 + price；fulfillment 默认 fba。返回费用总额、明细（referral/FBA 及内嵌子费）与 net_after_fees。注意这是**事前估算**，不含仓储费/广告/退货/采购成本——事后实收查 economics_daily 的 net_proceeds_total。定价与选品决策用。
- `finance_get_balances` — 账户余额（实时，Finances v2024-06-19 直通，不经本地数据）: 各站点/账户类型的 AVAILABLE（可放款）与 RESERVED（预留/押款）余额；传 as_of_date (YYYY-MM-DD) 可查历史时点。回答「账上现在有多少钱 / 这期能放多少款 / 被预留多少」。押款明细（哪些交易、为什么、几时放）用 data_query 查 finance_transactions WHERE transaction_status='DEFERRED'。
- `data_query` — Answer any question about the seller's REAL Amazon store data — 销量、订单、广告花费、ACOS、库存、退货率、利润 — with one read-only DuckDB SQL query: the primary tool for analysis, aggregation, trends, rankings, and joins across orders/ads/inventory/returns (e.g. return rate by SKU = returns joined to orders), plus slicing the restock engine's outputs. Free and instant — prefer this over paid diagnostics for any stati

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。

## Steps (EN)

Estimate FBA fulfillment from size and weight next to the live SKU fee.

1. Split each SKU into price, cost, freight, referral, FBA, and ads.
2. Flag losses and odd fee ratios, and say which costs are excluded.
3. Turn claims and clearance into a monthly amount.
4. Sort actions by money.
