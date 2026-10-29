# 新品从上架到开广告 / Launch: listing to ads

模式：fixture。缺真实密钥时这是 fixture，不会假装已经调通粒粒。

## 01｜步骤

1. amazon-keyword-research
2. listing-new-product-oneshot
3. acos-target-setting
4. ads-build-from-scratch

## 02｜技能表

| 技能 | 介入 |
| --- | --- |
| amazon-keyword-research | 第 1 步 |
| listing-new-product-oneshot | 第 2 步 |
| acos-target-setting | 第 3 步 |
| ads-build-from-scratch | 第 4 步 |

## 03｜Listing 预览（inferred 文案，未提交）

标题：Northshore 1.7L stainless kettle。五点先写容量、自动断电、材质，搜索词不重复标题。

## 04｜起步广告

自动组 + 精确词 electric kettle。新品期 ACOS 按成本倒推，目标先放宽到 45%（inferred）。预算 $25/天。否定词等收割后再加。

## 请求账本

模式 `fixture`。fixture 下列出本应调用的粒粒工具名，响应是 NS 店种子，不是远程 JSON。

| 工具 | 用途 |
| --- | --- |
| meta_list_stores | 确认店铺 |
| data_query | 销售与流量 |
| ads_list_entities | 广告花费 |
| restock_get_stockout_alerts | 断货 |


推断处标 `inferred`。没有采购放行，也没有改真实店铺。