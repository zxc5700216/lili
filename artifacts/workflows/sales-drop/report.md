# 销量下滑全链路诊断 / Diagnose a sales drop end to end

模式：fixture。缺真实密钥时这是 fixture，不会假装已经调通多宝鱼。

## 01｜步骤

1. traffic-conversion-triage
2. buybox-competition-watch
3. impression-drop-diagnosis
4. low-conversion-diagnosis

## 02｜技能表

| 技能 | 介入 |
| --- | --- |
| traffic-conversion-triage | 第 1 步 |
| buybox-competition-watch | 第 2 步 |
| impression-drop-diagnosis | 第 3 步 |
| low-conversion-diagnosis | 第 4 步 |

## 03｜分诊

| ASIN | 会话 7天/前 | 转化 7天/前 | 购物车 | 判断 |
| --- | --- | --- | --- | --- |
| B0NSKETTLE1 | 980/1100 | 8.2%/9.0% | 在 | 流量 |
| B0NSYOGMAT2 | 640/600 | 11.0%/10.0% | 在 | 持平 |
| B0NSLAMP003 | 410/520 | 4.0%/7.0% | 丢给 36.5 | 购物车 |
| B0NSBOTTLE4 | 880/840 | 9.0%/8.8% | 在 | 持平 |
| B0NSORG0005 | 300/280 | 6.0%/7.0% | 在 | 转化 |
| B0NSPET0006 | 500/470 | 10.0%/11.0% | 在 | 转化 |

## 请求账本

模式 `fixture`。fixture 下列出本应调用的多宝鱼工具名，响应是 NS 店种子，不是远程 JSON。

| 工具 | 用途 |
| --- | --- |
| meta_list_stores | 确认店铺 |
| data_query | 销售与流量 |
| ads_list_entities | 广告花费 |
| restock_get_stockout_alerts | 断货 |


推断处标 `inferred`。没有采购放行，也没有改真实店铺。