# arrow bag quiver 全流程树、因果关系与数据血缘

生成于学习沙盒；fixture 回放金样账本，新增付费请求 0 次。`inferred` 表示公开 skill 或金样行为推断，不是粒粒私有配置。

## 01｜全流程树：包含分支、失败、暂停和后续归档

```
ROOT：把 arrow bag quiver 方向推进到可评审的开品文档
│
├─ 0. 约定边界与付费预算
│  ├─ 用户要求：五步；第 1 步和第 5 步后暂停
│  ├─ 加载 amazon-niche-finder / product-research / review-analyzer / tariff-calculator-amazon
│  ├─ amazon-product-selection：`inferred` 用 private-label + profit-analyzer + 金样硬门槛，不是私有 skill 原文
│  └─ 站点假定 US；第 1 步上限 10 次市场请求
├─ 1. amazon-niche-finder：拆成 5 个细分
│  ├─ M03 sort_by=units 失败 → 改 total_units
│  ├─ 多词结果污染 → 不直接加销量
│  └─ 暂停门 1：选择 A
│     ├─ A 三管腰挂靶场箭袋 → 优先深研
│     ├─ B 传统皮革背负箭袋 → 可选
│     ├─ C 功能型布料背负箭袋 → 有条件
│     ├─ D 反曲弓/传统弓挂载箭筒 → 有条件
│     ├─ E 可伸缩保护运输箭筒 → 候补
├─ 2. amazon-product-research：只深入所选细分
├─ 3. amazon-review-analyzer：采集与编码分开；样本 < 20 → 低置信度
├─ 4. tariff-calculator-amazon：旧税率不直接跑；17.6/42.6/62.6 只是情景
├─ 5. 选品比较 A0/A1/A2：评分不能压过缺报价 → HOLD
├─ 6. 文档工程：MCP 形状的账本 → evidence JSON → 本地计算 → HTML
└─ 7. 本沙盒不把事后归档算进 27 次市场请求
```

## 02｜谁在做什么：用户、AI、skill、MCP、第三方与本地文件

| 角色/层 | 真正负责的动作 | 不应混淆的事 |
| --- | --- | --- |
| 用户 | 给出方向、在门 1 选细分、确认试单数量 | 试单数量不是采购放行 |
| 学习沙盒执行器 | 按模板回放账本、算数、写 md/json/html | 不是粒粒远程会话 |
| Skill | 公开 nexscope 原文规定拆法；选品步标 inferred | 加载 skill 不等于已经取数 |
| 粒粒 MCP 形状 | market_* 名称和参数对齐金样 §04 | 本回合 fixture，没有付费调用 |
| 卖家精灵 / Sorftime | 金样说明的上游 | 沙盒没有密钥，也没有上游 HTTP 日志 |
| 本地计算 | calculations.json 与 HTML | 不产生新的市场事实 |

## 03｜每个 skill 在何处介入、输入输出及限制

| Skill | 阶段 | 动作 | 输入 | 输出 | 边界 |
| --- | --- | --- | --- | --- | --- |
| amazon-niche-finder | 第 1 步 | 把宽方向分成可比较细分 | 关键词、节点、趋势 | 5 个候选 | 第三方估计，不做完整 TAM |
| amazon-product-research | 第 2 步 | 深入所选细分 | 关键词研究、详情、关联竞品 | 样本价格与月销 | 不是市场普查 |
| amazon-review-analyzer | 第 3 步 | 筛选、分母、主题、优先级 | 星级、日期、Vine 字段 | 痛点清单 | 人工编码，不是自动 NLP |
| tariff-calculator-amazon | 第 4 步 | 归类情景与到岸拆项 | 材料假设、公开税目 | 三种税率情景 | 不用 skill 内过时税率脚本 |
| amazon-product-selection | 第 5 步 | 预筛、六维、硬门槛 | 证据 + 成本假设 + 数量 | HOLD / NO-GO | `inferred`：公开库无同名 skill |
| lili-report-spec | HTML | 自包含、来源、水印、口径 | 已整理章节 | 静态单文件 | 不负责取数 |

## 04｜每一次市场请求：为何调用、具体发了什么、如何使用

本次回放 27 次市场请求形状。技能查询和本地读写不计入。未核验真实计费。

| 编号 | 时刻 | 接口 | 原始参数 | 目的 | 是否进入结论 |
| --- | --- | --- | --- | --- | --- |
| M01 | 10-27 01:55:59 | market_mine_keywords | `{"keyword":"arrow quiver","marketplace":"US","size":100,"page":1}` | 找 arrow quiver 相关表达；不是直接确定市场规模 | 是 |
| M02 | 10-27 01:56:18 | market_mine_keywords | `{"keyword":"arrow bag","marketplace":"US","size":100,"page":1}` | 补 arrow bag 相关需求；相近词不相加为独立买家 | 是 |
| M03 | 10-27 01:56:31 | market_find_products | `{"keyword":"quiver","marketplace":"US","size":100,"page":1,"sort_by":"units","sort_desc":true}` | sort_by=units 触发参数错误；不用于市场结论 | 否 |
| M04 | 10-27 01:56:57 | market_find_products | `{"keyword":"quiver","marketplace":"US","size":50,"page":1,"sort_by":"total_units","sort_desc":true}` | 修正 total_units；宽词结果仍需识别形态 | 是 |
| M05 | 10-27 01:56:57 | market_find_products | `{"keyword":"back quiver","marketplace":"US","size":50,"page":1,"sort_by":"total_units","sort_desc":true}` | 探索背负款；多词结果污染，不能直接加销量 | 否 |
| M06 | 10-27 01:56:57 | market_find_products | `{"keyword":"hip quiver","marketplace":"US","size":50,"page":1,"sort_by":"total_units","sort_desc":true}` | 探索腰挂款；多词结果污染，改用节点和人工识别 | 否 |
| M07 | 10-27 01:56:57 | market_find_products | `{"keyword":"arrow tube","marketplace":"US","size":50,"page":1,"sort_by":"total_units","sort_desc":true}` | 探索运输筒；多词误匹配不用于规模 | 否 |
| M08 | 10-27 01:56:58 | market_find_products | `{"keyword":"recurve bow quiver","marketplace":"US","size":50,"page":1,"sort_by":"total_units","sort_desc":true}` | 探索弓挂款；标题含 recurve 不足以证明结构相同 | 否 |
| M09 | 10-27 01:57:26 | market_aba_trend | `{"keyword":"hip quiver","marketplace":"US","granularity":"week","last_n":52}` | 52 周搜索轨迹支持持续搜索，不支持高速增长结论 | 是 |
| M10 | 10-27 01:57:27 | market_find_products | `{"node_id_path":"3375251:706813011:3395321:3395631","marketplace":"US","size":100,"page":1,"sort_by":"total_units","sort_desc":true}` | 限定射箭节点读取第一页 100 行 | 是 |
| M11 | 10-27 02:17:47 | market_get_asin | `{"asin":"B0DQKBHSMK","marketplace":"US"}` | SPG 详情 | 是 |
| M12 | 10-27 02:17:47 | market_get_asin | `{"asin":"B09CQ7DGD8","marketplace":"US"}` | SUNYA 详情，FBA 费用估计参考 | 是 |
| M13 | 10-27 02:17:47 | market_get_asin | `{"asin":"B0D8XSZQDS","marketplace":"US"}` | SHENG-RUI 详情 | 是 |
| M14 | 10-27 02:17:47 | market_get_asin | `{"asin":"B00IEPFDLO","marketplace":"US"}` | Easton 详情 | 是 |
| M15 | 10-27 02:17:47 | market_get_asin | `{"asin":"B082P5JF2M","marketplace":"US"}` | LEGEND 详情，42in 腰围宣传 | 是 |
| M16 | 10-27 02:17:48 | market_research_keyword | `{"keywords":"hip quiver","marketplace":"US","size":50,"page":1}` | 搜索 2859、购买估计 46、商品 211；12% 广告 CVR 并非由此得出 | 是 |
| M17 | 10-27 02:17:51 | market_list_competitors | `{"asin":"B09CQ7DGD8","marketplace":"US","size":20}` | 关联竞品混有其他形态，排除直接市场计算 | 否 |
| M18 | 10-27 02:18:21 | market_get_reviews | `{"asin":"B082P5JF2M","marketplace":"US","stars":"1,2,3","size":100,"page":1}` | LEGEND 1–3 星 5 条 | 是 |
| M19 | 10-27 02:18:21 | market_get_reviews | `{"asin":"B00IEPFDLO","marketplace":"US","stars":"1,2,3","size":100,"page":1}` | Easton 1–3 星 0 条；不证明没有差评 | 是 |
| M20 | 10-27 02:18:21 | market_get_reviews | `{"asin":"B0D7LJVMDX","marketplace":"US","stars":"1,2,3","size":100,"page":1}` | KRATARC 1–3 星 5 条 | 是 |
| M21 | 10-27 02:18:21 | market_get_reviews | `{"asin":"B09CQ7DGD8","marketplace":"US","stars":"1,2,3","size":100,"page":1}` | SUNYA 1–3 星 5 条；排除 2 条 Vine 疑似软袋混款 | 是 |
| M22 | 10-27 02:19:41 | market_get_asin | `{"asin":"B0D7LJVMDX","marketplace":"US"}` | 补 KRATARC 当前详情 | 是 |
| M23 | 10-27 02:19:41 | market_get_reviews | `{"asin":"B09CQ7DGD8","marketplace":"US","stars":"4,5","size":20,"page":1}` | SUNYA 高星 20 条 | 是 |
| M24 | 10-27 02:19:41 | market_get_reviews | `{"asin":"B082P5JF2M","marketplace":"US","stars":"4,5","size":20,"page":1}` | LEGEND 高星 20 条，其中 1 条无正文 | 是 |
| M25 | 10-27 02:19:46 | market_query_sorftime | `{"tool":"ali1688_similar_product","arguments_json":"{\"search_name\":\"射箭 三管 腰挂 箭袋\",\"page\":1}"}` | 1688 搜索；price/MOQ 缺失 | 是 |
| M26 | 10-27 02:20:20 | market_query_sorftime | `{"tool":"ali1688_product_request","arguments_json":"{\"product_id\":\"681213530361\"}"}` | offer 详情仍无有效报价 | 是 |
| M27 | 10-27 02:22:56 | market_query_sorftime | `{"tool":"ali1688_similar_product","arguments_json":"{\"search_name\":\"三管箭袋\",\"page\":1}"}` | 换词再搜仍缺数，停止重复花费 | 是 |

## 05｜因果关系表：证据怎样导致动作和结论

| 触发 | 证据 | 处理/规则 | 产物 | 为什么改变下一步 | 不能推出什么 |
| --- | --- | --- | --- | --- | --- |
| 方向太宽 | 多词查询混入无关商品 | 节点限定后再分组 | 五个细分 | 不把其他类目销量加进来 | 第一页不是全市场 |
| 门 1 选择 | 用户明示细分 | 后续预算只打这一支 | 6 个竞品与评论 | 其余方向不继续花钱深研 | 不是证明其他方向不可做 |
| M03 失败 | sort_by=units | 改 total_units 并保留失败记录 | 修正后的查询 | 失败请求不进入销量结论 | 未知是否扣费 |
| 评论重复故障 | 正文主题 | 排除 Vine 混款和无正文 | 有效正文分母 | 优先齐套/拉链/围度 | 小样本不是故障率 |
| 1688 报价为 0 | price/MOQ 缺失 | 记为缺数 | 不能确认采购价 | 用反推目标而不是真实利润 | 供应商未必做得到目标价 |
| 旧税率 | skill 快照过时 | 只保留情景 | 17.6/42.6/62.6 | 下单前必须补证 | 不是已核准税负 |
| 九格为正但缺证 | A1 最差格仍为正 | 硬门槛高于评分 | HOLD | 可以准备验证，不能下单 | 分数不是 GO |

## 06｜评论采集、排除、编码、排名：完整数据链

低星请求返回 15 条 → 排除 2 条 Vine 疑似混款 → 排除 1 条无正文 → 有效正文 12。高星另取 40 条，不计算总体满意率。全部标低置信度。

| 证据 ID | 星级 / 日期 | 摘录 | 纳入与主题 |
| --- | --- | --- | --- |
| DGD8-1 | 2★ / 2026-04-16 | Didnt come with belt | 纳入：缺腰带 |
| DGD8-2 | 1★ / 2025-08-09 | They were broken when I took them out of package | 纳入：部件未明，不扩大成普遍缺陷：到货破损 |
| DGD8-3 | 3★ / 2023-11-02 | no tube shape inside… flops | 排除：Vine 且疑似软袋混款 |
| DGD8-4 | 3★ / 2023-01-24 | zipper on the main pocket came detached | 纳入：拉链 |
| DGD8-5 | 1★ / 2022-10-16 | material is very thin and flops | 排除：Vine 且疑似软袋混款 |
| JF2M-1 | 3★ / 2023-02-18 | 40in waist so the belt just barely fit | 纳入：腰带围度、噪声 |
| JF2M-2 | 2★ / 2022-03-09 | llegó con zipper dañado | 纳入：拉链 |
| JF2M-3 | 3★ / 2021-07-06 | ordered purple, got black | 纳入：错色 |
| JF2M-4 | 3★ / 2021-05-11 | up to 42in waist… short on my 40in waist | 纳入：腰带围度、噪声 |
| JF2M-5 | 1★ / 2020-12-31 | arrows fall out with the slightest movement | 纳入：短袋掉箭 |
| VMDX-1 | 3★ / 2026-09-10 | Average | 纳入：保留在分母，不猜问题：无明确问题 |
| VMDX-2 | 3★ / 2026-02-03 | [无正文] | 排除：无正文 |
| VMDX-3 | 3★ / 2022-04-16 | arrived without the American Flag | 纳入：旗帜章预期 |
| VMDX-4 | 1★ / 2019-10-15 | no American flag | 纳入：旗帜章预期 |
| VMDX-5 | 1★ / 2019-06-12 | Missing the belt and flag patch | 纳入：缺腰带、旗帜章预期 |

有效正文 12 条。缺腰带、拉链、腰带围度、噪声在样本中重复出现；旗帜章是图文预期，不扩成普遍质量缺陷。

## 07｜税费为什么只能算情景，不能当成已核准成本

tariff-calculator-amazon 的过时税率脚本不直接运行（`inferred`：按金样行为，而不是执行 skill 自带 2024 快照）。候选税目 4202.92.91.00 基础 17.6%。附加税未核实。

| 情景 | 计算 | 作用 | 不能怎么用 |
| --- | --- | --- | --- |
| 17.6% | 只有候选基础税 | 下界 | 不能认定进口只交这项 |
| 42.6% | 17.6% + 假设 25 个百分点 | 主预算压力 | 不是声明当前 301 必为 25% |
| 62.6% | 再加假设 20 个百分点 | 压力测试 | 不是现行附加税确认 |

三次 1688 查询无有效价格、MOQ 或交期。运保报关入仓合计 $2/件是预算预留，不是货代报价。

## 08｜每一个成本数字的来源、计算与因果方向

方向是反推：希望留下贡献，所以提出 FOB 目标；不是先拿到真实供应价再宣布利润。A1 主情景：

```
关税 = 1.1928
到岸 = 5.9928
单位销售贡献 = 4.2258
贡献率 ≈ 15.10%
最差广告格 = 2.2813
FOB 上限 ≈ 2.8191
300 件规划现金 ≈ 4562.62
```

| 变化 | 对结果的影响 | 结论 |
| --- | --- | --- |
| 售价只能停在样本高位 | 贡献率掉到目标以下 | 不能照旧宣称 15% |
| 税率从 42.6% 到 62.6% | 每件再增加 FOB 的 20% | 九格要重算 |
| 运费翻倍或 FBA 加 1 美元 | 贡献直接减少 | 包规必须实测 |

## 09｜评分为什么没有直接变成“做”

六维权重：需求 25%、单位经济 25%、竞争 20%、差异 15%、物流 10%、风险 5%。`inferred` 权重来自金样公开说明，不是粒粒私有打分表。

| 方案 | 原始分 | 加权分 | 单位贡献 | 最差广告格 | 结果 |
| --- | --- | --- | --- | --- | --- |
| A0 同质基础款 | [3, 1, 2, 1, 3, 3] | 2.00/5 → 40/100 | $-0.68 | $-2.62 | NO-GO |
| A1 成人可靠性改良款 | [3, 3, 2, 4, 3, 3] | 2.95/5 → 59/100 | $4.23 | $2.28 | HOLD |
| A2 高配减振款 | [2, 2, 2, 3, 2, 2] | 2.15/5 → 43/100 | $6.28 | $4.33 | NO-GO |

```
有市场/痛点信号？
└─ 是 → 情景贡献能否成立？
         └─ 是 → 报价、税费、样品、转化是否验证？
                  └─ 否 → HOLD（本次停在这里）
```

## 10｜痛点怎样变成卖点、规格、BOM 与验收

| 信号 | 设计动作 | 拟规格 | 验收 | 状态 |
| --- | --- | --- | --- | --- |
| 缺腰带 | 齐套管理 | 袋 1 + 管 3 + 带 1 + 说明 1，不含箭与旗帜章 | 首批 100% 清点 | 提案，未执行 |
| 围度不足 | 实测扣合范围 | 70–125cm 提案 | 3 样、1kg、30min，滑移 ≤ 10mm | 待样品 |
| 拉链失效 | 止口与循环 | 主辅拉链口袋 | 500 次循环，20N 不脱头 | 拟测试，不是认证 |
| 掉箭 | 承载验证 | 12 支 28in 靶箭 | 取放 100 轮、步行、弯腰 | 不能宣传任意箭型 |
| 破损个例 | 包装复测 | 包规与毛重上限提案 | 1m 六面跌落 | 不冒称 ISTA |
| 管噪声 | 可拆垫片试验 | 不进基础 BOM | 不挡箭再评估 | 不承诺静音 |

## 11｜所有 JSON 和代码究竟从哪里来：逐文件数据流

| 文件 | 创建者 | 内容 | 事实属性 |
| --- | --- | --- | --- |
| evidence.json | 本执行器 | 账本、细分、竞品、评论 | fixture 回放，不是新的 MCP 响应 |
| calculations.json | 本执行器纯计算 | 关税、到岸、九格、分数、现金 | 假设的算术结果 |
| review.html | 本执行器 | 自包含评审稿 | 水印标明沙盒；不是量产放行书 |
| flow-tree.md | 本执行器 | 01–16 章骨架 | 正文相对金样压缩 |

账本 JSON → calculations.json → HTML。本地计算不向 MCP 再付费。

## 12｜HTML 生成的每一层：从 JSON 字段到页面

| 层 | 动作 | 输出 |
| --- | --- | --- |
| 账本 | 写入 27 次工具名和参数 | evidence.json |
| 转义 | HTML escape | 评论文字不当标签 |
| 计算 | A0/A1/A2 循环 | calculations.json |
| 外壳 | 内联 CSS、水印、来源 | 无 CDN、无远程字体 |
| 结论条 | 硬门槛后的 HOLD | 首屏可见 |

## 13｜失败、修正、验证和明确没有完成的事

| 问题 | 实际处理 | 缺口 |
| --- | --- | --- |
| sort_by=units | 保留失败并改 total_units | 不产生销量结论 |
| 多词污染 | 不把那些请求加进规模 | 节点第一页仍不完整 |
| 采购价为 0 | 记缺失 | 不能审批采购 |
| 真实 MCP | 本回合未调用 | 账本是金样回放 |

## 14｜后续问答增加了哪些证据：不能反写成原来已知

本沙盒运行没有新增付费请求，也没有把后来查到的卖家精灵分页上限写回历史参数。历史参数仍按金样记录的 size=100 / size=20 保留。

## 15｜未完成事项和下一阶段的条件树

```
A1 可优先验证；采购 HOLD
├─ 至少 2 份同 BOM 报价，且到岸仍落在本次假设上限内
├─ 书面归类和入境日附加税
├─ 至少 3 件样品通过齐套、围度、拉链、掉箭、跌落
└─ 用户另行批准订单和资金之后，才可能离开 HOLD
```

## 16｜逐项复查入口与离线复现

| 文件 | 用途 |
| --- | --- |
| evidence.json | 27 次请求形状、细分、竞品、评论链 |
| calculations.json | A0/A1/A2 精确计算 |
| review.html | 自包含评审稿 |
| flow-tree.md | 本文件 |

```bash
npm run workflow:selection -- --keyword "arrow bag quiver"
```

重跑不会刷新市场数据，也不会调用付费粒粒 API。