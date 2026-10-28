# 竞品全拆解 / Full competitor teardown

模式：fixture。缺真实密钥时这是 fixture，不会假装已经调通多宝鱼。

## 01｜步骤

1. competitor-playbook-teardown
2. amazon-competitor-analysis
3. amazon-review-analyzer

## 02｜技能表

| 技能 | 介入 |
| --- | --- |
| competitor-playbook-teardown | 第 1 步 |
| amazon-competitor-analysis | 第 2 步 |
| amazon-review-analyzer | 第 3 步 |

## 03｜对照

自己的水壶 4.4 星、在购物车。竞品样本沿用选品账本里的 SUNYA / LEGEND（fixture）。弱点：齐套和围度，不是再做一个普通口袋。

西柚关键词反查需要 MCP Token。没有令牌时这里只保留多宝鱼 market_list_competitors 的计划，不把样本说成西柚实时结果。

## 请求账本

模式 `fixture`。fixture 下列出本应调用的多宝鱼工具名，响应是 NS 店种子，不是远程 JSON。

| 工具 | 用途 |
| --- | --- |
| meta_list_stores | 确认店铺 |
| data_query | 销售与流量 |
| ads_list_entities | 广告花费 |
| restock_get_stockout_alerts | 断货 |


推断处标 `inferred`。没有采购放行，也没有改真实店铺。