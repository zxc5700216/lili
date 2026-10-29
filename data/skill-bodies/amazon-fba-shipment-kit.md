---
name: amazon-fba-shipment-kit
description: "把箱唛、提货交接和报价整理成一票货的资料清单。 Assemble labels, handoff notes, and the quote into one shipment kit. Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili."
metadata: {"lili":{"category":"inventory","brand":"粒粒"}}
---

# FBA 发货资料包 / FBA shipment kit

## 这个技能做什么

把箱唛、提货交接和报价整理成一票货的资料清单。

Assemble labels, handoff notes, and the quote into one shipment kit.

本手册是粒粒lili 离线/Codex 镜像。在线优先 `meta_load_skill`（slug=`amazon-fba-shipment-kit`）拉服务端最新版；工具一律经 MCP server `lili` 调用。

## 什么时候用

处理「FBA 发货资料包」或用户提到 FBA shipment kit / `amazon-fba-shipment-kit` 相关诉求时加载。也适用于 12 条粒粒工作流里点名本技能的步骤。

## 能力要点

- 按可售天数列出两周内可能断货的 SKU
- 结合在途、预留、促销峰值估补货量与最晚下单日
- 生成货件/入库计划预览
- 标出滞销与老化库存处理选项

## 本技能专项要点

- （按本技能摘要与步骤执行，遇缺口再查相邻技能）

## 步骤

按下面顺序执行；每一步结束先汇报再往下（写操作必须停在预览）。

1. 按可售天数列出两周内可能断货的 SKU。 建议先调 `restock_get_shipment_labels`。
2. 给出建议数量和最晚下单日期，等确认实际发货量。
3. 货件、分仓和承运进入审批。箱规和重量不明就不要猜。
4. 批准后只在沙盒生成货件草稿，不会提交 Amazon。

### 流程补充（分类手册）

- 补货量 = 目标可售天数 × 日均 − 在途 − 可售，再加安全库存。
- 大促前单独拉高峰系数，不要用平销日均硬套。
- 货件标签、箱唛、预处理要求按站点核对。

## 相关工具

- `restock_get_shipment_labels` — STEP 10 — box label (箱唛) download links, one per shipment (optional shipment_id narrows to one). NOTE: Amazon's links expire in ~15 SECONDS — tell the seller to download immediately, and simply re-call this tool for a fresh link anytime. page_type: PackageLabel_Letter_4 (default) / PackageLabel_Letter_2 / PackageLabel_Letter_6 and other v0 enums; label_type: BARCODE_2D (default) / UNIQUE / PALLET 
- `restock_get_shipment_draft` — One FBA inbound draft in full: stage, items, totals, the options Amazon returned for the current step (packing/placement), selected option ids, last error if a step failed, and next_action saying exactly which tool to call next.
- `restock_list_shipment_drafts` — Recent FBA inbound shipment drafts: draft_id, name, stage, unit/box totals, created time, and what to do next for the latest one. The draft walks stages created → packing → placement →（二期）transportation → labels.

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

Assemble labels, handoff notes, and the quote into one shipment kit.

1. List SKUs that may stock out within two weeks by days of cover.
2. Give a suggested quantity and last order date, then wait for the real ship quantity.
3. Shipment, placement, and carrier steps go to approval. Do not guess carton facts.
4. Approval creates a sandbox draft only. Nothing is sent to Amazon.
## 与工作流的关系

本技能可被「周一经营例会 / 广告止血 / 销量下滑 / 新品上架到开广告 / 选品开品 / 竞品拆解 / 补货发货 / 利润体检 / 大促备战 / 老品清退 / 退货攻坚 / 月度报告」等模板引用。若当前对话来自某条工作流，保持该工作流的顺序与停顿点，不要跳步执行写操作。

## 扩展参考（同源手册：amazon-fba-prep）

## Capabilities

- Build a SKU-level prep and labeling matrix.
- Identify product attributes that trigger additional review or preparation.
- Plan barcode choice, label placement, unit packaging, sets, case packs, and carton QA.
- Create supplier, factory, warehouse, or prep-center work instructions.
- Compare self-prep, supplier prep, prep-center, and available Amazon service options.
- Produce a shipment-readiness audit with evidence, owners, and blocking issues.


## Workflow

### 1. Establish the Evidence Boundary

State what was inspected: product specification, packaging photos, barcode files, compliance documents, Seller Central instructions, shipment plan, carton labels, or provider quote.

Classify each finding:

- **Confirmed:** supported by inspected evidence or current official instructions.
- **Needs verification:** plausible, but requires the target marketplace's Seller Central workflow or current official source.
- **Blocked:** missing information could make the prep plan unsafe or noncompliant.

Do not infer that a product is non-hazardous, unrestricted, non-expiring, or standard-size because the seller did not mention otherwise.

### 2. Run the Product Attribute Triage

For every SKU, explicitly screen for:

- liquid, gel, cream, powder, granular, or aerosol contents;
- glass, ceramic, sharp, fragile, crushable, or leak-prone parts;
- apparel, textiles, plush, footwear, jewelry, or exposed surfaces;
- loose pieces, sets, multipacks, bundles, or items requiring assembly;
- batteries, electronics, magnets, chemicals, or dangerous-goods indicators;
- expiration, best-before, lot, serial, temperature, or shelf-life controls;
- adult products, children's products, food, supplements, cosmetics, medical, or other regulated categories;
- existing UPC/EAN/ISBN, Amazon barcode, Transparency code, serial label, or other scannable marks.

Route any positive result to the current product-specific requirements. Do not reuse a generic prep decision across variants without confirming that their attributes match.

### 3. Select and Verify Identification

Document the barcode path shown in Seller Central for the SKU. Amazon may use manufacturer barcodes, Amazon barcodes, or other program-specific codes depending on product and account eligibility.

For each unit:

- identify the required scannable code and source file;
- confirm that the label text matches SKU, condition, and product;
- specify who prints and applies the label;
- place it on a flat, readable surface and outside any final prep layer when required;
- identify other barcodes that must remain visible, be covered, or be rendered unscannable;
- run a scan test after final packaging.

Never generate, alter, or assign identifiers from guesswork.

### 4. Define Unit Preparation

Write a per-SKU instruction that covers:

- final sellable unit and what the customer should receive;
- primary packaging and closure method;
- required bagging, wrapping, boxing, sealing, cushioning, or set labeling;
- protection for leakage, sharp edges, breakage, dust, and loose parts;
- warning, expiration, suffocation, lot, or other labels only when current rules require them;
- barcode position after preparation;
- drop, leak, seal, scan, or visual QA tests appropriate to the
