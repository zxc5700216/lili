# 覆盖清单

12 条工作流都能在 `/v2/workflows` 用 fixture 跑出报告。选品开品文档仍是金样粒度。其余 11 条是同一套交付物（步骤、技能表、NS 店数字、请求账本、HTML），经营数字来自种子，不是远程 MCP。`--live` 缺密钥会失败并说明原因。真钥验收：卖家精灵 `secret-key`、西柚 MCP Token、多宝鱼访问令牌（inferred）。Sorftime 无公开直连，不作为真调通过条件。

`done` 表示这条能在沙盒里打开，并按清单完成主路径。写入类的主路径是生成审批预览，不调用亚马逊。

## 仍然做不到（没有真实接口）

- 不能调用 Amazon SP-API、Ads API、Sorftime、西柚或 Shopify OAuth。所有返回都是按 schema 做的本地样本。
- 开始使用里的「连接你的 AI」已按展开实拍排。图标是自绘几何标记，不是各家商标原文件。安装地址只指向本机 `http://127.0.0.1:43123/api/mcp`。
- 工作流卡片只有标题、两行简介和复制提示词。`/v2/cases/<slug>` 会转到 `/v2/start`。完整提示词在剪贴板里。演练在支持弹层打开「沙盒演练」后才出现，地址是 `/v2/lab/cases/<slug>`。
- 技能在网格里展开：示例请求、触发词、收起、复制提示词。`/v2/skills/<slug>` 会转到 `/v2/start`。更长的笔记在同一开关后的 `/v2/lab/skills/<slug>`。
- 充值页按实拍：余额、¥1=10 积分、¥5–¥500 档位、模拟支付和已入账订单。不会发生真实扣款。
- 技能分类数量按上传的 116 条计算，和某一张实拍里的 All 114 不会相等。
- 工作流详情和充值页没有单独的实拍可逐像素对照。
- 企业微信、课程报名和付款不会离开这台机器。

## 工作流

端到端只完成选品开品文档。其余模板仍是卡片。

| 状态 | slug | 标题 |
| --- | --- | --- |
| done（fixture 可演示；真调要多宝鱼令牌） | `monday-review` | 周一经营例会 |
| done（fixture 可演示；真调要多宝鱼令牌） | `ads-stop-bleeding` | 广告止血 |
| done（fixture 可演示；真调要多宝鱼令牌） | `sales-drop` | 销量下滑诊断 |
| done（fixture 可演示；真调要多宝鱼令牌） | `new-listing-to-ads` | 新品上架到开广告 |
| done（金样粒度；真调要多宝鱼 + 卖家精灵） | `selection-doc` | 选品开品文档 |
| done（fixture 可演示；真调要多宝鱼 + 西柚） | `competitor-teardown` | 竞品全拆解 |
| done（fixture 可演示；真调要多宝鱼令牌） | `restock-to-ship` | 补货到发货 |
| done（fixture 可演示；真调要多宝鱼令牌） | `profit-checkup` | 利润体检 |
| done（fixture 可演示；真调要多宝鱼令牌） | `peak-prep` | 大促备战 |
| done（fixture 可演示；真调要多宝鱼令牌） | `sunset-sku` | 老品清退 |
| done（fixture 可演示；真调要多宝鱼令牌） | `returns-push` | 退货攻坚 |
| done（fixture 可演示；真调要多宝鱼令牌） | `monthly-report` | 月度经营报告 |

## 技能 116/116

每条详情都有摘要、分类、步骤、提示词、相关工具说明（来自工具清单），以及引用它的工作流步骤。没有被 12 条模板点名的技能会写明这一点。

| 状态 | slug | 中文名 | 分类 |
| --- | --- | --- | --- |
| done | `duobaoyu-acos-reduction-plan` | ACOS 压降计划 | ads |
| done | `duobaoyu-acos-spike-triage` | ACOS 飙升分诊 | ads |
| done | `duobaoyu-acos-target-setting` | ACOS 目标设定 | ads |
| done | `duobaoyu-ads-build-from-scratch` | 从零搭建广告 | ads |
| done | `duobaoyu-ads-data-health-interpretation` | 广告数据健康解读 | ads |
| done | `duobaoyu-ads-data-pull` | 广告数据拉取 | ads |
| done | `duobaoyu-ads-metrics-glossary` | 广告指标词典 | ads |
| done | `duobaoyu-ads-playbook-interview` | 广告打法访谈 | ads |
| done | `duobaoyu-ads-sunset-wind-down` | 广告退坡收尾 | ads |
| done | `duobaoyu-ads-tune-live` | 在投广告微调 | ads |
| done | `duobaoyu-amazon-a-plus-content` | A+ 内容 | listing |
| done | `duobaoyu-amazon-ads-analysis-operator` | 广告分析操作员 | ads |
| done | `duobaoyu-amazon-ads-funnel-sop` | 广告漏斗 SOP | ads |
| done | `duobaoyu-amazon-ads-funnel-sop-keywords-negatives` | 漏斗：关键词与否定 | ads |
| done | `duobaoyu-amazon-ads-funnel-sop-pitfalls` | 漏斗：常见坑 | ads |
| done | `duobaoyu-amazon-ads-funnel-sop-report-rules` | 漏斗：报表规则 | ads |
| done | `duobaoyu-amazon-ads-funnel-sop-structure-bids` | 漏斗：结构与出价 | ads |
| done | `duobaoyu-amazon-ads-performance-report` | 广告业绩报告 | data |
| done | `duobaoyu-amazon-advertising-strategy` | 广告策略 | ads |
| done | `duobaoyu-amazon-backend-keywords` | 后台搜索词 | keywords |
| done | `duobaoyu-amazon-boutique-rank-tracker` | 精品排名追踪 | market |
| done | `duobaoyu-amazon-brand-analytics` | 品牌分析 | market |
| done | `duobaoyu-amazon-buy-box` | 购物车 | data |
| done | `duobaoyu-amazon-competitor-analysis` | 竞品分析 | market |
| done | `duobaoyu-amazon-competitor-monitoring` | 竞品监控 | market |
| done | `duobaoyu-amazon-deal-finder` | Deal 机会发现 | market |
| done | `duobaoyu-amazon-display-ads` | 展示广告 SD | ads |
| done | `duobaoyu-amazon-fba-calculator` | FBA 费用计算 | profit |
| done | `duobaoyu-amazon-fba-prep` | FBA 预处理 | restock |
| done | `duobaoyu-amazon-fba-shipment-kit` | FBA 发货资料包 | restock |
| done | `duobaoyu-amazon-global-selling` | 全球开店 | market |
| done | `duobaoyu-amazon-keyword-research` | 关键词调研 | keywords |
| done | `duobaoyu-amazon-keyword-tracker` | 关键词排名追踪 | keywords |
| done | `duobaoyu-amazon-listing-images` | Listing 图片 | listing |
| done | `duobaoyu-amazon-listing-optimization` | Listing 优化 | listing |
| done | `duobaoyu-amazon-negative-keywords` | 否定关键词 | ads |
| done | `duobaoyu-amazon-niche-finder` | 细分市场发现 | market |
| done | `duobaoyu-amazon-ppc-campaign` | PPC 广告活动 | ads |
| done | `duobaoyu-amazon-product-intelligence-report` | 产品情报报告 | market |
| done | `duobaoyu-amazon-product-photography` | 产品摄影 | listing |
| done | `duobaoyu-amazon-product-research` | 产品调研 | market |
| done | `duobaoyu-amazon-product-selection` | 选品决策 | market |
| done | `duobaoyu-amazon-profit-analysis` | 利润分析 | profit |
| done | `duobaoyu-amazon-rank-tracker` | 排名追踪 | market |
| done | `duobaoyu-amazon-repricing-strategy` | 调价策略 | profit |
| done | `duobaoyu-amazon-return-weekly-analysis` | 退货周报 | returns |
| done | `duobaoyu-amazon-review-analyzer` | 评论分析 | market |
| done | `duobaoyu-amazon-sales-estimator` | 销量估算 | market |
| done | `duobaoyu-amazon-search-optimization` | 搜索优化 | keywords |
| done | `duobaoyu-amazon-seller-analytics` | 卖家数据分析 | data |
| done | `duobaoyu-amazon-shipping-calculator` | 头程运费计算 | profit |
| done | `duobaoyu-amazon-trending-products` | 趋势产品 | market |
| done | `duobaoyu-auto-campaign-strategy` | 自动广告策略 | ads |
| done | `duobaoyu-bid-adjustment-strategy` | 出价调整策略 | ads |
| done | `duobaoyu-bid-floor-ceiling-guardrails` | 出价上下限护栏 | ads |
| done | `duobaoyu-branded-vs-generic-split` | 品牌词与通用词拆分 | ads |
| done | `duobaoyu-budget-capped-campaigns` | 预算撞线活动 | ads |
| done | `duobaoyu-budget-pacing-review` | 预算节奏复盘 | ads |
| done | `duobaoyu-buybox-competition-watch` | 购物车竞争监控 | data |
| done | `duobaoyu-campaign-structure-audit` | 广告结构审计 | ads |
| done | `duobaoyu-category-node-scan` | 类目节点扫描 | market |
| done | `duobaoyu-clearance-aging-decision` | 库龄清仓决策 | restock |
| done | `duobaoyu-competitor-playbook-teardown` | 竞品打法拆解 | market |
| done | `duobaoyu-cross-border-bestseller-radar` | 跨境爆款雷达 | market |
| done | `duobaoyu-fba-inbound-shipment` | FBA 入库货件 | restock |
| done | `duobaoyu-harvest-search-terms` | 搜索词收割 | keywords |
| done | `duobaoyu-impression-drop-diagnosis` | 曝光下跌诊断 | ads |
| done | `duobaoyu-keyword-benchmark-diagnosis` | 关键词基准诊断 | keywords |
| done | `duobaoyu-keyword-match-type-strategy` | 匹配方式策略 | keywords |
| done | `duobaoyu-keyword-role-taxonomy` | 关键词角色分类 | keywords |
| done | `duobaoyu-listing-direct-creation` | Listing 直接创建 | listing |
| done | `duobaoyu-listing-new-product-oneshot` | 新品 Listing 一次成型 | listing |
| done | `duobaoyu-low-conversion-diagnosis` | 低转化诊断 | ads |
| done | `duobaoyu-low-ctr-diagnosis` | 低点击率诊断 | ads |
| done | `duobaoyu-mcf-fulfillment` | 多渠道配送 MCF | restock |
| done | `duobaoyu-multi-marketplace-ads-review` | 多站点广告复盘 | ads |
| done | `duobaoyu-negative-keyword-strategy` | 否定词策略 | ads |
| done | `duobaoyu-new-product-launch-ads` | 新品期广告 | ads |
| done | `duobaoyu-placement-optimization` | 广告位优化 | ads |
| done | `duobaoyu-post-peak-wind-down` | 旺季后收尾 | ads |
| done | `duobaoyu-product-selection` | 选品 | market |
| done | `duobaoyu-profit-fee-analysis` | 费用与利润拆解 | profit |
| done | `duobaoyu-promotions-review` | 促销复盘 | data |
| done | `duobaoyu-recommendation-review-workflow` | 建议审核工作流 | ads |
| done | `duobaoyu-reimbursement-recovery` | 索赔追回 | profit |
| done | `duobaoyu-report-spec` | 报表口径 | data |
| done | `duobaoyu-review-solicitation` | 邀评 | orders |
| done | `duobaoyu-search-term-cleanup` | 搜索词清理 | ads |
| done | `duobaoyu-seasonal-peak-preparation` | 旺季广告备战 | ads |
| done | `duobaoyu-sorftime-multiplatform` | Sorftime 多平台 | market |
| done | `duobaoyu-sponsored-products-funnel-metrics` | SP 漏斗指标 | ads |
| done | `duobaoyu-store-weekly-review` | 店铺周复盘 | data |
| done | `duobaoyu-sync-cadence-and-freshness` | 同步节奏与新鲜度 | data |
| done | `duobaoyu-tariff-calculator-amazon` | 关税计算器 | profit |
| done | `duobaoyu-traffic-conversion-triage` | 流量转化分诊 | data |
| done | `duobaoyu-turbot-account-health-appeal` | 账户健康申诉 | compliance |
| done | `duobaoyu-turbot-ad-scheduling` | 广告分时 | ads |
| done | `duobaoyu-turbot-brand-promotions` | 品牌促销 | ads |
| done | `duobaoyu-turbot-brand-registry` | 品牌备案 | compliance |
| done | `duobaoyu-turbot-bundling` | 捆绑销售 | listing |
| done | `duobaoyu-turbot-coupon-strategy` | 优惠券策略 | profit |
| done | `duobaoyu-turbot-inventory-restock` | 库存补货 | restock |
| done | `duobaoyu-turbot-listing-localization` | Listing 本地化 | listing |
| done | `duobaoyu-turbot-private-label` | 自有品牌 | listing |
| done | `duobaoyu-turbot-product-compliance` | 产品合规 | compliance |
| done | `duobaoyu-turbot-return-reduction` | 降低退货 | returns |
| done | `duobaoyu-turbot-review-compliance` | 评价合规 | compliance |
| done | `duobaoyu-turbot-seasonal-planning` | 季节性规划 | restock |
| done | `duobaoyu-turbot-storefront` | 品牌旗舰店 | listing |
| done | `duobaoyu-turbot-subscribe-save` | 订购省 | profit |
| done | `duobaoyu-turbot-variation-strategy` | 变体策略 | listing |
| done | `duobaoyu-turbot-vine` | Vine 计划 | returns |
| done | `duobaoyu-turbot-wholesale-sourcing` | 批发采购 | profit |
| done | `duobaoyu-wasted-spend-audit` | 浪费花费审计 | ads |
| done | `duobaoyu-weekday-dayparting-review` | 工作日分时复盘 | ads |
| done | `duobaoyu-weekly-ads-review-routine` | 广告周检例行 | ads |

## 工具 107/107

| 状态 | 工具 | 路径 |
| --- | --- | --- |
| done | `ads_generate_recommendations` | 写入：审批预览，默认不执行 |
| done | `ads_get_bid_recommendations` | 只读：按店铺种子数据的专用结构 |
| done | `ads_get_connection_status` | 只读：按店铺种子数据的专用结构 |
| done | `ads_get_data_health` | 只读：按店铺种子数据的专用结构 |
| done | `ads_get_settings` | 只读：按店铺种子数据的专用结构 |
| done | `ads_get_sync_status` | 只读：按店铺种子数据的专用结构 |
| done | `ads_list_entities` | 只读：按店铺种子数据的专用结构 |
| done | `ads_list_recommendations` | 只读：按店铺种子数据的专用结构 |
| done | `ads_mark_recommendation` | 写入：审批预览，默认不执行 |
| done | `ads_prepare_apply` | 只读：按店铺种子数据的专用结构 |
| done | `ads_prepare_changes` | 只读：按店铺种子数据的专用结构 |
| done | `ads_start_sync` | 写入：审批预览，默认不执行 |
| done | `ads_update_settings` | 写入：审批预览，默认不执行 |
| done | `brand_get_search_query_performance` | 只读：按店铺种子数据的专用结构 |
| done | `catalog_get_product_type` | 只读：按店铺种子数据的专用结构 |
| done | `catalog_search_product_types` | 只读：按店铺种子数据的专用结构 |
| done | `competitor_find_similar` | 按该工具 schema 的独立样本 |
| done | `data_describe_table` | 只读：按店铺种子数据的专用结构 |
| done | `data_list_tables` | 只读：按店铺种子数据的专用结构 |
| done | `data_query` | 只读：按店铺种子数据的专用结构 |
| done | `data_sync_start` | 写入：审批预览，默认不执行 |
| done | `data_sync_status` | 只读：按店铺种子数据的专用结构 |
| done | `finance_get_balances` | 只读：按店铺种子数据的专用结构 |
| done | `finance_get_fee_estimate` | 只读：按店铺种子数据的专用结构 |
| done | `listing_check_restrictions` | 只读：按店铺种子数据的专用结构 |
| done | `listing_create_aplus` | 写入：审批预览，默认不执行 |
| done | `listing_create_image_upload` | 按该工具 schema 的独立样本 |
| done | `listing_get_aplus` | 按该工具 schema 的独立样本 |
| done | `listing_get_live` | 只读：按店铺种子数据的专用结构 |
| done | `listing_import_image_from_url` | 写入：审批预览，默认不执行 |
| done | `listing_list_aplus` | 按该工具 schema 的独立样本 |
| done | `listing_prepare_change` | 只读：按店铺种子数据的专用结构 |
| done | `market_aba_keywords` | 只读：按店铺种子数据的专用结构 |
| done | `market_aba_trend` | 按该工具 schema 的独立样本 |
| done | `market_find_node` | 按该工具 schema 的独立样本 |
| done | `market_find_products` | 只读：按店铺种子数据的专用结构 |
| done | `market_get_asin` | 只读：按店铺种子数据的专用结构 |
| done | `market_get_reviews` | 只读：按店铺种子数据的专用结构 |
| done | `market_list_competitors` | 只读：按店铺种子数据的专用结构 |
| done | `market_list_sorftime_tools` | 按该工具 schema 的独立样本 |
| done | `market_list_xiyou_tools` | 按该工具 schema 的独立样本 |
| done | `market_mine_keywords` | 只读：按店铺种子数据的专用结构 |
| done | `market_query_sorftime` | 按该工具 schema 的独立样本 |
| done | `market_query_xiyou` | 按该工具 schema 的独立样本 |
| done | `market_research_keyword` | 只读：按店铺种子数据的专用结构 |
| done | `market_scan_node` | 按该工具 schema 的独立样本 |
| done | `meta_deep_analysis` | 按该工具 schema 的独立样本 |
| done | `meta_get_usage` | 只读：按店铺种子数据的专用结构 |
| done | `meta_get_workflow_run` | 按该工具 schema 的独立样本 |
| done | `meta_list_stores` | 只读：按店铺种子数据的专用结构 |
| done | `meta_list_workflows` | 只读：按店铺种子数据的专用结构 |
| done | `meta_load_skill` | 只读：按店铺种子数据的专用结构 |
| done | `meta_run_workflow` | 按该工具 schema 的独立样本 |
| done | `meta_save_workflow` | 写入：审批预览，默认不执行 |
| done | `meta_search_skills` | 只读：按店铺种子数据的专用结构 |
| done | `meta_set_workflow_schedule` | 写入：审批预览，默认不执行 |
| done | `meta_submit_feedback` | 写入：审批预览，默认不执行 |
| done | `orders_check_review_eligibility` | 只读：按店铺种子数据的专用结构 |
| done | `orders_get_recent` | 只读：按店铺种子数据的专用结构 |
| done | `orders_request_reviews` | 写入：审批预览，默认不执行 |
| done | `promotions_get` | 只读：按店铺种子数据的专用结构 |
| done | `promotions_get_items` | 只读：按店铺种子数据的专用结构 |
| done | `promotions_search` | 只读：按店铺种子数据的专用结构 |
| done | `restock_cancel_mcf_order` | 写入：审批预览，默认不执行 |
| done | `restock_check_inbound_eligibility` | 按该工具 schema 的独立样本 |
| done | `restock_confirm_delivery_window` | 写入：审批预览，默认不执行 |
| done | `restock_confirm_packing` | 写入：审批预览，默认不执行 |
| done | `restock_create_shipment_draft` | 写入：审批预览，默认不执行 |
| done | `restock_get_awd_status` | 按该工具 schema 的独立样本 |
| done | `restock_get_clearance` | 只读：按店铺种子数据的专用结构 |
| done | `restock_get_delivery_challan` | 按该工具 schema 的独立样本 |
| done | `restock_get_delivery_windows` | 写入：审批预览，默认不执行 |
| done | `restock_get_forecast` | 只读：按店铺种子数据的专用结构 |
| done | `restock_get_hygiene` | 按该工具 schema 的独立样本 |
| done | `restock_get_inbound_plan` | 按该工具 schema 的独立样本 |
| done | `restock_get_inbound_settings` | 按该工具 schema 的独立样本 |
| done | `restock_get_item_compliance` | 按该工具 schema 的独立样本 |
| done | `restock_get_item_labels` | 按该工具 schema 的独立样本 |
| done | `restock_get_mcf_order` | 按该工具 schema 的独立样本 |
| done | `restock_get_packing_options` | 写入：审批预览，默认不执行 |
| done | `restock_get_placement_options` | 写入：审批预览，默认不执行 |
| done | `restock_get_plan` | 只读：按店铺种子数据的专用结构 |
| done | `restock_get_plan_contents` | 按该工具 schema 的独立样本 |
| done | `restock_get_reference_summary` | 按该工具 schema 的独立样本 |
| done | `restock_get_self_ship_slots` | 写入：审批预览，默认不执行 |
| done | `restock_get_shipment_draft` | 只读：按店铺种子数据的专用结构 |
| done | `restock_get_shipment_labels` | 按该工具 schema 的独立样本 |
| done | `restock_get_shipments` | 按该工具 schema 的独立样本 |
| done | `restock_get_stockout_alerts` | 只读：按店铺种子数据的专用结构 |
| done | `restock_get_transportation_options` | 写入：审批预览，默认不执行 |
| done | `restock_list_inbound_plans` | 按该工具 schema 的独立样本 |
| done | `restock_list_mcf_orders` | 按该工具 schema 的独立样本 |
| done | `restock_list_shipment_drafts` | 只读：按店铺种子数据的专用结构 |
| done | `restock_manage_self_ship_appointment` | 写入：审批预览，默认不执行 |
| done | `restock_prepare_cancel_plan` | 按该工具 schema 的独立样本 |
| done | `restock_prepare_content_update` | 写入：审批预览，默认不执行 |
| done | `restock_prepare_placement` | 只读：按店铺种子数据的专用结构 |
| done | `restock_prepare_transportation` | 只读：按店铺种子数据的专用结构 |
| done | `restock_preview_mcf` | 按该工具 schema 的独立样本 |
| done | `restock_preview_shipment` | 只读：按店铺种子数据的专用结构 |
| done | `restock_query_plan` | 按该工具 schema 的独立样本 |
| done | `restock_rename_shipment` | 写入：审批预览，默认不执行 |
| done | `restock_set_inbound_settings` | 写入：审批预览，默认不执行 |
| done | `restock_set_item_compliance` | 写入：审批预览，默认不执行 |
| done | `restock_set_prep_details` | 写入：审批预览，默认不执行 |
| done | `restock_set_shipment_tracking` | 写入：审批预览，默认不执行 |
| done | `restock_update_source_address` | 写入：审批预览，默认不执行 |
