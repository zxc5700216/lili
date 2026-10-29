# 利润体检 / Profit health check

模式：fixture。缺真实密钥时这是 fixture，不会假装已经调通粒粒。

## 01｜步骤

1. profit-fee-analysis
2. reimbursement-recovery
3. clearance-aging-decision
4. amazon-return-weekly-analysis

## 02｜技能表

| 技能 | 介入 |
| --- | --- |
| profit-fee-analysis | 第 1 步 |
| reimbursement-recovery | 第 2 步 |
| clearance-aging-decision | 第 3 步 |
| amazon-return-weekly-analysis | 第 4 步 |

## 03｜不含采购的费用后毛利

| SKU | 售价 | 费用后 |
| --- | --- | --- |
| NS-KETTLE-SS | $32.99 | $10.74 |
| NS-YOGA-TPE | $24.99 | $5.54 |
| NS-LAMP-WD | $39.99 | $12.79 |
| NS-BTL-750 | $18.99 | $7.24 |
| NS-ORG-4P | $27.49 | $9.17 |
| NS-PET-SLOW | $16.99 | $6.54 |

库龄最长的是收纳盒（210 天，月仓储 $27）。退货最高的是宠物碗 11%。这些数字不含头程以外的广告。

## 请求账本

模式 `fixture`。fixture 下列出本应调用的粒粒工具名，响应是 NS 店种子，不是远程 JSON。

| 工具 | 用途 |
| --- | --- |
| meta_list_stores | 确认店铺 |
| data_query | 销售与流量 |
| ads_list_entities | 广告花费 |
| restock_get_stockout_alerts | 断货 |


推断处标 `inferred`。没有采购放行，也没有改真实店铺。