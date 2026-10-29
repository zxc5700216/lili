---
name: mcf-fulfillment
description: "预览用 FBA 库存给站外订单发货的费用和时效。 Preview fee and speed for fulfilling an off-Amazon order from FBA. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"inventory","brand":"粒粒"}}
---

# 多渠道配送 MCF / Multi-channel fulfillment

## 这个技能做什么

预览用 FBA 库存给站外订单发货的费用和时效。

Preview fee and speed for fulfilling an off-Amazon order from FBA.

本手册是粒粒lili 离线/Codex 镜像。在线优先 `meta_load_skill`（slug=`mcf-fulfillment`）拉服务端最新版；工具一律经 MCP server `lili` 调用。

## 什么时候用

处理「多渠道配送 MCF」或用户提到 Multi-channel fulfillment / `mcf-fulfillment` 相关诉求时加载。也适用于 12 条粒粒工作流里点名本技能的步骤。

## 能力要点

- 按可售天数列出两周内可能断货的 SKU
- 结合在途、预留、促销峰值估补货量与最晚下单日
- 生成货件/入库计划预览
- 标出滞销与老化库存处理选项

## 本技能专项要点

- （按本技能摘要与步骤执行，遇缺口再查相邻技能）

## 步骤

按下面顺序执行；每一步结束先汇报再往下（写操作必须停在预览）。

1. 按可售天数列出两周内可能断货的 SKU。 建议先调 `restock_preview_mcf`。
2. 给出建议数量和最晚下单日期，等确认实际发货量。
3. 货件、分仓和承运进入审批。箱规和重量不明就不要猜。
4. 批准后只在沙盒生成货件草稿，不会提交 Amazon。

### 流程补充（分类手册）

- 补货量 = 目标可售天数 × 日均 − 在途 − 可售，再加安全库存。
- 大促前单独拉高峰系数，不要用平销日均硬套。
- 货件标签、箱唛、预处理要求按站点核对。

## 相关工具

- `restock_preview_mcf` — MCF 履约预览（实时，免费，只读）: 用 FBA 库存给站外订单（如 Shopify）发货前，先看三档速度的运费/时效/可行性。address_json={name,addressLine1,city,stateOrRegion,postalCode,countryCode}；items_json=[{sku,quantity}]。不产生任何费用或订单。
- `restock_list_mcf_orders` — MCF 履约单列表（实时，只读）: 最近 days 天内的多渠道履约单（含非粒粒建的），看单号/状态/速度。详情与追踪用 restock_get_mcf_order。
- `restock_get_mcf_order` — 查 MCF 履约单（实时，只读）: 按建单时的 order_id 查状态、货件与包裹追踪号。

## 输出格式

- 补货清单（数量、最晚下单日）
- 货件预览 / 资料包
- 滞销处理建议

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

Preview fee and speed for fulfilling an off-Amazon order from FBA.

1. List SKUs that may stock out within two weeks by days of cover.
2. Give a suggested quantity and last order date, then wait for the real ship quantity.
3. Shipment, placement, and carrier steps go to approval. Do not guess carton facts.
4. Approval creates a sandbox draft only. Nothing is sent to Amazon.
## 与工作流的关系

本技能可被「周一经营例会 / 广告止血 / 销量下滑 / 新品上架到开广告 / 选品开品 / 竞品拆解 / 补货发货 / 利润体检 / 大促备战 / 老品清退 / 退货攻坚 / 月度报告」等模板引用。若当前对话来自某条工作流，保持该工作流的顺序与停顿点，不要跳步执行写操作。
