# 老品清退 / Retire an aging product

模式：fixture。缺真实密钥时这是 fixture，不会假装已经调通多宝鱼。

## 01｜步骤

1. clearance-aging-decision
2. ads-sunset-wind-down
3. turbot-coupon-strategy

## 02｜技能表

| 技能 | 介入 |
| --- | --- |
| clearance-aging-decision | 第 1 步 |
| ads-sunset-wind-down | 第 2 步 |
| turbot-coupon-strategy | 第 3 步 |

## 03｜收纳盒清退

可售 8 天但库龄 210 天，月仓储 $27。广告先降出价两周，看自然单能不能接住（inferred 阶段，不是已执行）。券要先过费用后毛利，毛利不够就不要用券换排名。

## 请求账本

模式 `fixture`。fixture 下列出本应调用的多宝鱼工具名，响应是 NS 店种子，不是远程 JSON。

| 工具 | 用途 |
| --- | --- |
| meta_list_stores | 确认店铺 |
| data_query | 销售与流量 |
| ads_list_entities | 广告花费 |
| restock_get_stockout_alerts | 断货 |


推断处标 `inferred`。没有采购放行，也没有改真实店铺。