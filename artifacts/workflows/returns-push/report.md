# 退货攻坚 / Bring returns down

模式：fixture。缺真实密钥时这是 fixture，不会假装已经调通多宝鱼。

## 01｜步骤

1. amazon-return-weekly-analysis
2. turbot-return-reduction
3. amazon-listing-optimization

## 02｜技能表

| 技能 | 介入 |
| --- | --- |
| amazon-return-weekly-analysis | 第 1 步 |
| turbot-return-reduction | 第 2 步 |
| amazon-listing-optimization | 第 3 步 |

## 03｜先改不用动产品的

| SKU | 退货率 | 先改 |
| --- | --- | --- |
| NS-LAMP-WD | 6% | Listing 预期 |
| NS-ORG-4P | 8% | Listing 预期 |
| NS-PET-SLOW | 11% | 图片和尺寸说明 |

宠物碗 11% 先改文案和图片，不动模具。

## 请求账本

模式 `fixture`。fixture 下列出本应调用的多宝鱼工具名，响应是 NS 店种子，不是远程 JSON。

| 工具 | 用途 |
| --- | --- |
| meta_list_stores | 确认店铺 |
| data_query | 销售与流量 |
| ads_list_entities | 广告花费 |
| restock_get_stockout_alerts | 断货 |


推断处标 `inferred`。没有采购放行，也没有改真实店铺。