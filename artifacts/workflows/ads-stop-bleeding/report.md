# 广告止血 / Stop the ad bleed

模式：fixture。缺真实密钥时这是 fixture，不会假装已经调通粒粒。

## 01｜步骤

1. acos-spike-triage
2. wasted-spend-audit
3. negative-keyword-strategy
4. bid-adjustment-strategy

## 02｜技能表

| 技能 | 介入 |
| --- | --- |
| acos-spike-triage | 第 1 步 |
| wasted-spend-audit | 第 2 步 |
| negative-keyword-strategy | 第 3 步 |
| bid-adjustment-strategy | 第 4 步 |

## 03｜ACOS 变化

| 活动 | 7天花费 | 7天销售 | ACOS |
| --- | --- | --- | --- |
| SP kettle exact | $180.00 | $260.00 | 69.2% |
| SP kettle auto | $96.00 | $310.00 | 31.0% |
| SP lamp phrase | $140.00 | $90.00 | 155.6% |
| SP organizer auto | $40.00 | $30.00 | 133.3% |

## 04｜否定与出价预览

| 词 | 匹配 | 30天花费 | 建议 |
| --- | --- | --- | --- |
| kettle stainless steel | exact | $86.00 | 出价降到 0.7 |
| lamp for bedroom kids | phrase | $74.00 | 词组否定 |
| drawer organizer | phrase | $54.00 | 出价降到 0.48 |

任何改价都先审批。

## 请求账本

模式 `fixture`。fixture 下列出本应调用的粒粒工具名，响应是 NS 店种子，不是远程 JSON。

| 工具 | 用途 |
| --- | --- |
| meta_list_stores | 确认店铺 |
| data_query | 销售与流量 |
| ads_list_entities | 广告花费 |
| restock_get_stockout_alerts | 断货 |


推断处标 `inferred`。没有采购放行，也没有改真实店铺。