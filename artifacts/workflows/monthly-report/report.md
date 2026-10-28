# 月度经营报告 / Monthly business report

模式：fixture。缺真实密钥时这是 fixture，不会假装已经调通多宝鱼。

## 01｜步骤

1. amazon-ads-performance-report
2. profit-fee-analysis
3. promotions-review
4. multi-marketplace-ads-review

## 02｜技能表

| 技能 | 介入 |
| --- | --- |
| amazon-ads-performance-report | 第 1 步 |
| profit-fee-analysis | 第 2 步 |
| promotions-review | 第 3 步 |
| multi-marketplace-ads-review | 第 4 步 |

## 03｜一个月的四块

广告花费与销售分开列，不和别的币种相加。NS 店只有美元。促销本月没有第二档秒杀（fixture）。下月三件事：补两周内会断货的 SKU、清浪费词、看台灯购物车。

## 请求账本

模式 `fixture`。fixture 下列出本应调用的多宝鱼工具名，响应是 NS 店种子，不是远程 JSON。

| 工具 | 用途 |
| --- | --- |
| meta_list_stores | 确认店铺 |
| data_query | 销售与流量 |
| ads_list_entities | 广告花费 |
| restock_get_stockout_alerts | 断货 |


推断处标 `inferred`。没有采购放行，也没有改真实店铺。