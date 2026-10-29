# 补货到发货一条龙 / Restock through to shipment

模式：fixture。缺真实密钥时这是 fixture，不会假装已经调通粒粒。

## 01｜步骤

1. turbot-inventory-restock
2. fba-inbound-shipment
3. amazon-fba-shipment-kit

## 02｜技能表

| 技能 | 介入 |
| --- | --- |
| turbot-inventory-restock | 第 1 步 |
| fba-inbound-shipment | 第 2 步 |
| amazon-fba-shipment-kit | 第 3 步 |

## 03｜建议发货

| SKU | 可售天 | 建议量 |
| --- | --- | --- |
| NS-KETTLE-SS | 9 | 420 |
| NS-LAMP-WD | 12 | 80 |
| NS-ORG-4P | 8 | 240 |

分仓和承运费必须等人确认。箱规不明不猜。批准后只在沙盒生成货件草稿。

## 请求账本

模式 `fixture`。fixture 下列出本应调用的粒粒工具名，响应是 NS 店种子，不是远程 JSON。

| 工具 | 用途 |
| --- | --- |
| meta_list_stores | 确认店铺 |
| data_query | 销售与流量 |
| ads_list_entities | 广告花费 |
| restock_get_stockout_alerts | 断货 |


推断处标 `inferred`。没有采购放行，也没有改真实店铺。