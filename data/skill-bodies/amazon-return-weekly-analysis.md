---
name: amazon-return-weekly-analysis
description: "看退货率趋势、高风险变体，以及评论里买家的原话。 Read return-rate trend, risky variations, and the buyers' own words. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"report","brand":"粒粒"}}
---

# 退货周报 / Weekly returns analysis

## 这个技能做什么

看退货率趋势、高风险变体，以及评论里买家的原话。

Read return-rate trend, risky variations, and the buyers' own words.

本手册是粒粒lili 离线/Codex 镜像。在线优先 `meta_load_skill`（slug=`amazon-return-weekly-analysis`）拉服务端最新版；工具一律经 MCP server `lili` 调用。

## 什么时候用

处理「退货周报」或用户提到 Weekly returns analysis / `amazon-return-weekly-analysis` 相关诉求时加载。也适用于 12 条粒粒工作流里点名本技能的步骤。

## 能力要点

- 统一口径：时间范围、币种、是否剔除异常订单
- 销售 / 流量 / 广告 / 库存 / 费用多模块对照上周或上月
- 三句话结论 + 按优先级的动作清单
- 输出 HTML 报告便于周会宣讲

## 本技能专项要点

- 退货率异常先看是否新品期评价或物流破损集中。

## 步骤

按下面顺序执行；每一步结束先汇报再往下（写操作必须停在预览）。

1. 先统一口径：时间范围、币种、是否剔除异常订单。 建议先调 `data_query`。
2. 先给关键数字，再和上一周期对比。
3. 不同币种不要相加。
4. 收尾写下一周期的三件要事。

### 流程补充（分类手册）

- 先对齐「看哪个店、哪段时间」。
- 每个模块只留 Top 风险与 Top 机会，避免流水账。
- 动作写明负责人角色（广告/库存/定价）与本周盯的指标。

## 相关工具

- `data_query` — Answer any question about the seller's REAL Amazon store data — 销量、订单、广告花费、ACOS、库存、退货率、利润 — with one read-only DuckDB SQL query: the primary tool for analysis, aggregation, trends, rankings, and joins across orders/ads/inventory/returns (e.g. return rate by SKU = returns joined to orders), plus slicing the restock engine's outputs. Free and instant — prefer this over paid diagnostics for any stati
- `orders_get_recent` — 实时订单（Orders API 直通，不经本地数据）: 最近 N 小时（默认 24，上限 72）的订单数、状态分布（PENDING/UNSHIPPED/SHIPPED/CANCELLED）、金额合计与按 SKU 的 Top 清单。报表表 orders 滞后数小时且看不到未结算的 Pending 单——「今天卖了多少 / 有多少单没发货」用本工具；更久的历史用 data_query。金额口径: grand_total 含税含运费, item_subtotal 为商品口径(可与业务报表对比)。
- `market_get_reviews` — Customer reviews for an ASIN — title, body, star rating, date. The voice-of-customer input: run it on COMPETITOR asins and mine the low-star reviews for the pain points your bullets should answer and your images should disprove. stars filters to specific ratings (e.g. '1,2' for the complaints). Costs credits per call.

## 输出格式

- HTML 报告
- 动作清单（负责人 + 指标）
- 需后台人工确认的开放问题

默认收尾：
1. 三句话结论（发生了什么 / 原因 / 这周先做什么）
2. 按优先级排序的动作清单（预估影响 + 负责人角色）
3. 需要运营去卖家后台确认的开放问题

## 护栏

- 查询可以直接看结果。改 Listing、广告或货件时先生成预览，放进审批。
- 市场调研和允许执行两个开关默认关闭。
- 多店场景先确认 NS 店 / TK 店，禁止串店改价或改广告。
- 付费市场数据调用前告知预计次数与费用风险。
- 不诱导评论、不违反品牌与广告政策。

## Steps (EN)

Read return-rate trend, risky variations, and the buyers' own words.

1. Lock the spec first: dates, currency, and whether odd orders are excluded.
2. Lead with the key numbers, then the comparison.
3. Do not add different currencies.
4. Close with three priorities for the next period.
## 与工作流的关系

本技能可被「周一经营例会 / 广告止血 / 销量下滑 / 新品上架到开广告 / 选品开品 / 竞品拆解 / 补货发货 / 利润体检 / 大促备战 / 老品清退 / 退货攻坚 / 月度报告」等模板引用。若当前对话来自某条工作流，保持该工作流的顺序与停顿点，不要跳步执行写操作。

## 扩展参考（同源手册：amazon-return-reduction）

## Capabilities

- Return rate reduction
- root cause analysis
- listing accuracy
- packaging improvements
- size guides

