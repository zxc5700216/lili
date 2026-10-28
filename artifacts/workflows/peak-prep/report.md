# 大促备战 / Get ready for a sales peak

模式：fixture。缺真实密钥时这是 fixture，不会假装已经调通多宝鱼。

## 01｜步骤

1. turbot-seasonal-planning
2. turbot-inventory-restock
3. amazon-deal-finder
4. seasonal-peak-preparation

## 02｜技能表

| 技能 | 介入 |
| --- | --- |
| turbot-seasonal-planning | 第 1 步 |
| turbot-inventory-restock | 第 2 步 |
| amazon-deal-finder | 第 3 步 |
| seasonal-peak-preparation | 第 4 步 |

## 03｜四周时间表（inferred 节奏）

| 周 | 事项 |
| --- | --- |
| 1 | 确认水壶和收纳的补货量 |
| 2 | 只给在购物车的款加预算 |
| 3 | 算券后还能不能保住费用后毛利 |
| 4 | 冻结匹配方式和否定，不再改结构 |

台灯丢了购物车，不作为大促主推。

## 请求账本

模式 `fixture`。fixture 下列出本应调用的多宝鱼工具名，响应是 NS 店种子，不是远程 JSON。

| 工具 | 用途 |
| --- | --- |
| meta_list_stores | 确认店铺 |
| data_query | 销售与流量 |
| ads_list_entities | 广告花费 |
| restock_get_stockout_alerts | 断货 |


推断处标 `inferred`。没有采购放行，也没有改真实店铺。