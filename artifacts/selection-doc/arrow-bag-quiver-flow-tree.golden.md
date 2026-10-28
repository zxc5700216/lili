# arrow bag quiver 全流程树、因果关系与数据血缘

生成于2026-10-27；回顾既有执行，新增付费请求0次。


## 01｜全流程树：包含分支、失败、暂停和后续归档

ROOT：把 arrow bag quiver 方向推进到可评审的开品文档
│
├─ 0. 约定边界与付费预算
│  ├─ 用户要求：五步；第1步和第5步后暂停
│  ├─ 搜索skill → 加载五个业务skill → 后续加载报告规范
│  ├─ 先估计全程18–30次市场请求 → 用户“确认”
│  └─ 采用美国站；第1步上限10次（站点为助手先声明的工作假定）
│
├─ 1. amazon-niche-finder：把宽方向拆成5个细分
│  ├─ M01/M02：arrow quiver / arrow bag 挖词
│  ├─ M03：sort_by=units → 业务错误 → 改用total_units
│  ├─ M04—M08：宽词与多词商品查询
│  │  └─ 多词混入无关商品 → 不用这些结果计算直接市场规模
│  ├─ M10：限定射箭节点 → 读取第一页100条商品
│  ├─ M09：hip quiver 52周趋势 → 支持持续搜索，不支持高速增长结论
│  ├─ 人工按用途/形态/材质分组；保留失败或候补方向
│  │  ├─ A 三管腰挂靶场箭袋 → 优先深研
│  │  ├─ B 传统皮革背负箭袋 → 可选
│  │  ├─ C 功能型布料背负箭袋 → 有条件
│  │  ├─ D 反曲弓/传统弓挂载箭筒 → 有条件
│  │  └─ E 可伸缩保护运输箭筒 → 配送成本问题，候补
│  ├─ 保存 evidence.json / report-template.html
│  ├─ JavaScript拼装第一阶段HTML → 静态检查
│  └─ 暂停门1：用户选“A” → 只深入这一方向
│
├─ 2. amazon-product-research：验证A的市场与进入门槛
│  ├─ 先声明新增付费上限20次；实际新增17次
│  ├─ M16：关键词研究 → 搜索2859、购买估计46、商品211
│  ├─ M11—M15/M22：6个竞品详情 → 价格、评分、手向、变体、费用等
│  ├─ 复用第1步月销量字段 → 六个不同父体样本合计916件
│  ├─ M17：关联竞品 → 混入其他形态，排除直接市场计算
│  └─ 结论：已有成熟竞争；常见三管/口袋不等于独家改良
│
├─ 3. amazon-review-analyzer：采集与分析是两个动作
│  ├─ 取数：M18—M21 → 4个ASIN的1–3星第一页
│  │  └─ 多宝鱼market_get_reviews → 返回正文JSON → 保存原响应
│  ├─ 取数：M23/M24 → 2个ASIN的4–5星，各20条
│  ├─ 低星清洗：15条 → 排除2条Vine且疑似混款 → 13条
│  │  └─ 排除1条无正文 → 正文主题分母12；Average保留但不猜问题
│  ├─ 人工逐条阅读、主题归类；不是运行自动NLP分类器
│  ├─ 严重度 × 重复证据 × 可改良性 → 优先级
│  │  ├─ 齐套、拉链、有效腰围 → 优先打样验证
│  │  ├─ 到货破损、掉箭个例 → 验收门槛，不扩大成普遍缺陷
│  │  └─ 噪声、旗帜章预期 → 试验/图文一致性，不承诺静音
│  └─ 样本<20 → 全部低置信度 → 不把频次当买家故障率
│
├─ 4. tariff-calculator-amazon：归类和成本情景
│  ├─ 采购取数补充：M25/M26/M27 → 1688相关offer
│  │  └─ price=0、MOQ=0、阶梯价缺失 → 认作缺数 → 没有有效报价
│  ├─ 用户确认300件试单 → 固定数量，未确定采购价/预算上限
│  ├─ skill内置2024税率过时 → 不直接运行旧税率脚本
│  ├─ 查CBP历史裁定N262343 → 2015麂皮款，不能套给纺织面
│  ├─ 查USITC → 候选4202.92.91.00基础17.6%
│  ├─ 附加税未核实 → 17.6/42.6/62.6%仅作情景
│  ├─ 运保/报关/入仓费用缺报价 → 设置显式预算假设
│  └─ 写supplement-evidence.json → 合并主证据，重复不算新请求
│
├─ 5. amazon-product-selection：比较拟开发方案，不是假装现货报价
│  ├─ 人工构造A0基础款 / A1成人可靠性款 / A2高配减振款
│  ├─ 写入价格、FOB、税率、物流、佣金、FBA、退货、广告假设
│  ├─ Python纯计算 → 关税、到岸、贡献、9格压力、目标成本、资金
│  ├─ 人工六维原始分 × 固定权重 → 情景分数
│  ├─ 硬门槛优先于评分
│  │  ├─ A0基准亏损 → NO-GO
│  │  ├─ A2定价/高配价值未证且贡献率不足 → 本次NO-GO
│  │  └─ A1计算可成立，但报价/税费/转化缺证 → HOLD
│  ├─ 写明停止线、30天验证、库存与补货条件
│  ├─ 痛点 → 设计方向 → 规格/BOM → 可测试验收标准
│  └─ 暂停门2：交付评审稿，未获得采购或量产放行
│
├─ 6. 文档工程：为什么会出现JSON、代码与HTML
│  ├─ MCP原响应 → 本地证据JSON（助手落盘，不是你原有文件）
│  ├─ 证据 + 人工判断/参数 → build_report.py
│  ├─ Python计算 → calculations.json（不是市场接口原始数据）
│  ├─ sec/table/p/doc + 内联CSS → 综合HTML与4份分报告
│  ├─ 计算/HTML结构校验；file预览被阻止 → 未做视觉验收
│  └─ 输出决策评审稿 → 等用户确认；没有下单/发供应商消息/建广告
│
└─ 7. 用户追问后的归档和核验（不属于原来27次市场请求）
   ├─ 读取保存的会话代码/调用/文件事件 → 55个顶层调用完整档案
   ├─ 补建评论逐条主题映射 → 明确为事后审计，非原自动算法
   ├─ assemble_process_document.py → 17章全过程HTML + ZIP
   ├─ 搜索其他skill/模板 → 发现market_get_reviews获取说明
   ├─ 公开卖家精灵文档 → review / POST /v1/review，size最大10
   │  └─ 与多宝鱼响应元数据size20存在差异 → 映射/版本机制未知
   └─ 本次新请求 → build_flow_tree.py → 当前流程树与因果文档


树的编号表示业务依赖；M编号来自原始市场请求完成事件。并发请求的完成次序不能解释为严格的发起次序。第2—4步有交叉取数，不是先把某一阶段彻底做完才开始下一阶段。


## 02｜谁在做什么：用户、AI、skill、MCP、第三方与本地文件

| 角色/层 | 真正负责的动作 | 不应混淆的事

 | 用户 | 提出方向、确认付费取数、选A、确认300件、要求归档 | 300件只是计划数量，不是批准采购；尚未给出真实采购报价或总预算

 | 当前AI会话 | 选择接口、发请求、读响应、人工解释、写代码、写文件、生成报告 | 判断是AI分析，不是第三方数据库自动给出的结论

 | Skill | 告诉AI怎么拆任务、用什么规则和怎样交付 | 加载skill不等于已经执行所有步骤；也不自动采集评论

 | 多宝鱼MCP服务器 | 接收market_*工具调用，向会话返回结构化数据 | 返回JSON本身不等于自动在你电脑创建JSON文件

 | 卖家精灵 | 按多宝鱼相关skill说明，提供亚马逊市场/评论数据源 | 本次没有你的卖家精灵密钥；没看到多宝鱼到上游的实际请求日志

 | Sorftime | 本案通过多宝鱼market_query_sorftime查1688货源 | 它与卖家精灵是两条数据来源，不把1688结果说成卖家精灵评论

 | 公开官网/镜像 | USITC税目、CBP历史裁定及CustomsMobile全文 | 历史案例不是当前完整税负，公开文档不是付费评论查询

 | 本地Python/JavaScript | 解析JSON、算数、拼表格/HTML、校验与打包 | 本地计算不产生新市场事实，也不必再向MCP付费取数

用户意图 → AI选工具 → 多宝鱼MCP返回JSON → AI读数据
                                  ↓
                          AI主动保存本地文件
                                  ↓
                原数据 + 人工判断 + 假设 → 本地程序 → 计算/HTML


## 03｜每个skill在何处介入、输入输出及限制

| Skill | 阶段 | 动作 | 输入 | 输出 | 边界

 | amazon-niche-finder | 第1步 | 把方向分成可比较细分；验证需求与竞争 | 关键词、节点、趋势 | 5个候选及选择理由 | 既有价格/销量为第三方估计，利润和市场规模缺数项未完成全部量化

 | amazon-product-research | 第2步 | 深入A方向 | 关键词研究、详情、关联竞品 | 需求规模信号/直接样本/价格/壁垒 | 不是完整市场普查，没有TAM

 | amazon-review-analyzer | 第3步 | 样本筛选、分母、主题、严重度、改良优先级 | 正文、星级、日期、变体/Vine字段 | 痛点清单 | 旧skill说用户提供，与当前接口/其他skill冲突；本案用当前接口取数

 | tariff-calculator-amazon | 第4步 | 归类依据与到岸拆项 | 材料假设、官网税目、物流/采购目标 | 三种税率情景 | 2024旧税率与配套计算器未使用；不是实际关税确认书

 | amazon-product-selection | 第5步 | 预筛、六维、利润、压力、停止线和验证计划 | 市场证据+成本假设+300件 | A1优先验证/HOLD | 评分不能覆盖缺报价或未验税费

 | duobaoyu-report-spec | 所有HTML交付 | 自包含HTML、来源、水印、配色、口径 | 已整理的章节与数据 | 静态单文件报告 | 不负责市场取数，也不验证数字真实性

五个业务skill在开始前先加载，用于评估流程与请求量；niche-finder执行时又加载过，报告规范在第1步写报告前加载。后续使用本地镜像阅读并应用。加载次数和付费市场取数次数是两套计数。原始skill全文与加载响应见完整代码档案，不会因本流程树省略正文而丢失。


## 04｜每一次市场请求：为何调用、具体发了什么、如何使用

本次原选品阶段共27次市场请求：第1步10次；后续17次。第2步8次（关键词1、详情6、关联1），评论6次，1688货源3次。技能查询、模板目录、本地代码/文件读写和公开官网浏览不计入这27次。这里是请求数，未核验真实计费流水，不能推定错误请求是否扣费或27次共多少钱。

 | 编号 | 上海完成时刻 | 接口 | 原始参数 | 目的/后续影响

 | M01 | 10-27 01:55:59 | market_mine_keywords | 
{
  "keyword": "arrow quiver",
  "marketplace": "US",
  "size": 100,
  "page": 1
}
 | 找arrow quiver相关表达；不是直接确定市场规模

 | M02 | 10-27 01:56:18 | market_mine_keywords | 
{
  "keyword": "arrow bag",
  "marketplace": "US",
  "size": 100,
  "page": 1
}
 | 补arrow bag相关需求；相近词不相加为独立买家

 | M03 | 10-27 01:56:31 | market_find_products | 
{
  "keyword": "quiver",
  "marketplace": "US",
  "size": 100,
  "page": 1,
  "sort_by": "units",
  "sort_desc": true
}
 | 尝试按销量排序，sort_by=units触发参数错误；不用于市场结论

 | M04 | 10-27 01:56:57 | market_find_products | 
{
  "keyword": "quiver",
  "marketplace": "US",
  "size": 50,
  "page": 1,
  "sort_by": "total_units",
  "sort_desc": true
}
 | 修正total_units；宽词结果仍需识别形态

 | M05 | 10-27 01:56:57 | market_find_products | 
{
  "keyword": "back quiver",
  "marketplace": "US",
  "size": 50,
  "page": 1,
  "sort_by": "total_units",
  "sort_desc": true
}
 | 探索背负款；多词结果污染，不能直接加销量

 | M06 | 10-27 01:56:57 | market_find_products | 
{
  "keyword": "hip quiver",
  "marketplace": "US",
  "size": 50,
  "page": 1,
  "sort_by": "total_units",
  "sort_desc": true
}
 | 探索腰挂款；多词结果污染，改用节点和人工识别

 | M07 | 10-27 01:56:57 | market_find_products | 
{
  "keyword": "arrow tube",
  "marketplace": "US",
  "size": 50,
  "page": 1,
  "sort_by": "total_units",
  "sort_desc": true
}
 | 探索运输筒；多词误匹配不用于规模

 | M08 | 10-27 01:56:58 | market_find_products | 
{
  "keyword": "recurve bow quiver",
  "marketplace": "US",
  "size": 50,
  "page": 1,
  "sort_by": "total_units",
  "sort_desc": true
}
 | 探索弓挂款；标题含recurve不足以证明结构相同

 | M09 | 10-27 01:57:26 | market_aba_trend | 
{
  "keyword": "hip quiver",
  "marketplace": "US",
  "granularity": "week",
  "last_n": 52
}
 | 52周hip quiver搜索轨迹；检查持续性

 | M10 | 10-27 01:57:27 | market_find_products | 
{
  "node_id_path": "3375251:706813011:3395321:3395631",
  "marketplace": "US",
  "size": 100,
  "page": 1,
  "sort_by": "total_units",
  "sort_desc": true
}
 | 限定射箭节点读取第一页100行；为候选与月销样本提供证据

 | M11 | 10-27 02:17:47 | market_get_asin | 
{
  "asin": "B0DQKBHSMK",
  "marketplace": "US"
}
 | SPG详情，核对价格/变体/包规/卖点

 | M12 | 10-27 02:17:47 | market_get_asin | 
{
  "asin": "B09CQ7DGD8",
  "marketplace": "US"
}
 | SUNYA详情，核对右手款、材料冲突、包规与FBA估计

 | M13 | 10-27 02:17:47 | market_get_asin | 
{
  "asin": "B0D8XSZQDS",
  "marketplace": "US"
}
 | SHENG-RUI详情，核对粉色右手子体和低ratings样本

 | M14 | 10-27 02:17:47 | market_get_asin | 
{
  "asin": "B00IEPFDLO",
  "marketplace": "US"
}
 | Easton详情，核对AMZ/多卖家、可反向口袋、未明确附带腰带

 | M15 | 10-27 02:17:47 | market_get_asin | 
{
  "asin": "B082P5JF2M",
  "marketplace": "US"
}
 | LEGEND详情，核对42in腰围宣传及右手变体

 | M16 | 10-27 02:17:48 | market_research_keyword | 
{
  "keywords": "hip quiver",
  "marketplace": "US",
  "size": 50,
  "page": 1
}
 | hip quiver需求与供给指标；12%广告CVR并非由此得出

 | M17 | 10-27 02:17:51 | market_list_competitors | 
{
  "asin": "B09CQ7DGD8",
  "marketplace": "US",
  "size": 20
}
 | 寻找关联竞品，但混有其他产品，排除直接样本

 | M18 | 10-27 02:18:21 | market_get_reviews | 
{
  "asin": "B082P5JF2M",
  "marketplace": "US",
  "stars": "1,2,3",
  "size": 100,
  "page": 1
}
 | LEGEND 1–3星，5条；留下围度/噪声/拉链等线索

 | M19 | 10-27 02:18:21 | market_get_reviews | 
{
  "asin": "B00IEPFDLO",
  "marketplace": "US",
  "stars": "1,2,3",
  "size": 100,
  "page": 1
}
 | Easton 1–3星，返回0；不证明无差评

 | M20 | 10-27 02:18:21 | market_get_reviews | 
{
  "asin": "B0D7LJVMDX",
  "marketplace": "US",
  "stars": "1,2,3",
  "size": 100,
  "page": 1
}
 | KRATARC 1–3星，5条；父体历史和无正文需过滤

 | M21 | 10-27 02:18:21 | market_get_reviews | 
{
  "asin": "B09CQ7DGD8",
  "marketplace": "US",
  "stars": "1,2,3",
  "size": 100,
  "page": 1
}
 | SUNYA 1–3星，5条；排除2条Vine疑似软袋混款

 | M22 | 10-27 02:19:41 | market_get_asin | 
{
  "asin": "B0D7LJVMDX",
  "marketplace": "US"
}
 | 补KRATARC当前详情，对照历史评论和子体日期

 | M23 | 10-27 02:19:41 | market_get_reviews | 
{
  "asin": "B09CQ7DGD8",
  "marketplace": "US",
  "stars": "4,5",
  "size": 20,
  "page": 1
}
 | SUNYA 4–5星20条；检查用户认可功能与反例

 | M24 | 10-27 02:19:41 | market_get_reviews | 
{
  "asin": "B082P5JF2M",
  "marketplace": "US",
  "stars": "4,5",
  "size": 20,
  "page": 1
}
 | LEGEND 4–5星20条，其中1无正文；不算满意率

 | M25 | 10-27 02:19:46 | market_query_sorftime | 
{
  "tool": "ali1688_similar_product",
  "arguments_json": "{\"search_name\":\"射箭 三管 腰挂 箭袋\",\"page\":1}"
}
 | 1688三管腰挂箭袋搜索；相关offer价格等缺失

 | M26 | 10-27 02:20:20 | market_query_sorftime | 
{
  "tool": "ali1688_product_request",
  "arguments_json": "{\"product_id\":\"681213530361\"}"
}
 | 查该offer详情；仍无有效报价/MOQ

 | M27 | 10-27 02:22:56 | market_query_sorftime | 
{
  "tool": "ali1688_similar_product",
  "arguments_json": "{\"search_name\":\"三管箭袋\",\"page\":1}"
}
 | 再换中文词搜索；仍缺数据，停止重复花费

27次请求的原始完整返回保存在process-archive/market-call-ledger.json。页面表格保留原传参size=100，不在回顾时改写成“当时传了10”；后续发现官方分页上限与多宝鱼返回不同属于新证据，需要另行核实，不能篡改历史。


## 05｜因果关系表：证据怎样导致动作和结论

下表是可核查的决策依据，不代表已通过实验证明产品改良能带来某个收益。市场数据与评论先产生假说，打样和真实经营验证才能检查假说。

 | 触发 | 证据 | 处理/规则 | 产物 | 为什么改变下一步 | 不能推出什么

 | 关键词“大方向”太宽 | 多词查询误匹配、混入无关商品 | 按节点限定，再人工核对形态 | 100条节点明细、五个细分 | 避免把其他类目的销量加进来 | 节点不等于全市场，第一页仍不完整

 | 用户选A | 用户明示a | 把后续预算集中到三管腰挂 | 6竞品与相关评论 | B—E不继续花费深研 | 不是证明B—E一定不可做

 | 成熟竞品有销量和高评分 | 六个不同父体样本、4.6–4.9星 | 把基础配置与真正改良区分 | 可靠性方向 | 不能只加口袋就宣称创新 | 数据商估算不等于真实账户订单

 | 需要找可做的改良 | 评论正文中的重复故障/预期 | 排除不适用样本后人工编码 | 12条正文的主题计数 | 优先齐套/拉链/围度 | 小样本无法得出总体发生率

 | 缺腰带涉及使用前提 | DGD8-1与VMDX-5 | P0齐套管理 | BOM清单和100%装箱核对 | 减少漏件风险，检查实际漏件数 | 没有证据能承诺降低多少退货

 | 腰带宣传与体验不符 | JF2M-1与JF2M-4 | 验证扣合有效围度 | 70–125cm提案与测试 | 页面改为实测范围 | 该范围由开发提案设置，未实测

 | 拉链功能损坏 | DGD8-4与JF2M-2 | 严重度高于20%频次阈值 | 止口/循环/拉力检查 | 优先样品验证 | 未知根因：不能断言材质或工艺已查明

 | 旗帜章预期和当前子体不一致 | 旧KRATARC家族评论 | 先修图片与BOM对应 | 不承诺随附旗帜 | 避免增加无证据的装饰成本 | 不能认定当前库存均漏发

 | 报价查询缺失 | price/MOQ为0且无阶梯价 | 把0记缺失 | 采购价不可确认 | 使用反推目标而非真实利润承诺 | 真实供应商可能做不到目标

 | 关税skill税率过时 | 2024快照说明 | 公开查询归类与基础税 | 17.6候选、42.6/62.6假设 | 下单前必须补证 | 总附加税及最后归类未确定

 | 用户确认300件 | 用户回复 | 将数量带入资金计算 | 到岸库存、广告预算、机动 | 估计可能需4562.62美元 | 未设总预算上限或回款周期

 | 目标需要留贡献 | 内部15%门槛+费用假设 | 反推到岸≤6.02 / FOB≤2.82 | 拟FOB目标2.80 | 采购询价的约束 | 没有证明制造可行

 | 模型九格正但关键参数未证 | A1最差约2.28，报价/税费/CVR缺失 | 硬门槛高于评分 | HOLD而非GO | 可以准备验证，不能直接下单 | 59/100只是情景判断分

 | 用户要求全过程 | 已有原始会话记录与文件 | 归档而不重新取数 | 17章代码档案/ZIP | 可核对每一来源 | 事后编码映射标为补建


## 06｜评论采集、排除、编码、排名：完整数据链

请求4个竞品1–3星第一页
├─ SUNYA：5条 → 排除2条Vine且疑似软袋混款 → 3条
├─ Easton：0条 → 无可分析样本，不能说没有差评
├─ LEGEND：5条 → 5条
└─ KRATARC：5条 → 排除1条无正文 → 4条
   合计：15 − 2 − 1 = 12条有效正文

另取高星：SUNYA20 + LEGEND20 = 40条
└─ 排除1条无正文 → 39条用于交叉阅读
   原报告未给所有正面主题逐条编码，不计算总体满意率。

每条正文 → 人工标主题 → 每主题每评价最多计1次
                  └─ 同条可多个主题 → 所有比例不必相加为100%
正文少于20 → 全部标低置信度
主题次数/12 → 只是该筛选样本的比例 → 不是总体故障率


 | 证据ID | 星级 / UTC日期 | 正文 | 纳入与主题

 | DGD8-1 | 2★ / 2026-04-16 | Didnt come with belt | 纳入：缺腰带

 | DGD8-2 | 1★ / 2025-08-09 | They were broken when I took them out of package | 纳入：到货破损-部件未明

 | DGD8-3 | 3★ / 2023-11-02 | One thing right off is that this type of quiver is just material, no tube shape inside to hold it open like a plastic or cardboard form.  Once empty it just flops.  I may have to go find a plastic tube insert to hold it wide open round so it hangs properly.  But i do like this quiver.  If i get it to sit right, i may end up very happy with this form compared to more elaborate brand-name compositions, which i don't care for at all. | 排除：Vine且疑似软袋混款

 | DGD8-4 | 3★ / 2023-01-24 | The bag itself looks good and seems like it’ll work well, however I think that they might have some quality control issues as the zipper on the main pocket of mine came detached. After a little fiddling I realized that if the zipper is held 90 degree’s perpendicular it easily comes on or off. For now I’m just gonna hope that it stays attached but a little bit disappointing from a brand new product. | 纳入：拉链

 | DGD8-5 | 1★ / 2022-10-16 | I saw this quiver and being an avid traditional archery you can never have too many good quivers. What really had caught my eye was the ability to use as a hip or over the shoulder. Seemed like a great option to have especially if you want to mix it up. And it was all down hill from there. While the quiver looks great to the eye the material is verythin and flops around like a wet noodle. I first set it up to go over the shoulder as this is my preferred quiver set up. Only to find realized what I missed on open is there is only one strap. As such the quiver needles to saw moved around more than a toddler on sugar, and really kills the mood when you are chasing yourself around like one of the 3 stooges. Next I though maybe we will just use it as a hip quiver. This was a no go, as just to make sure this would work I held the s-clip to my side as if to have it locked in just to see how it would sit before diving all in only to find myself playing the archery version of pick up sticks. Because with my full length (uncut) trad arrows the quiver ended up being to forward heavy to be useable. This being said for anyone who may have bought this I do know how to correct this to make it useable. 1. To correct the noodle like consistency of the quiver I would by a dollar store place mat and cut to size to use as an insert. This will make the quiver a bit more rigid and useable all around. 2. If you are wanting to use this I've the shoulder you will need to purchase/make a 2nd strap. If you want to go fancy single point rifle sling would be perfect. And 3. If you wish to use this on the hip with full length arrows you will want to add some counter weight ie a heavy bean bag or something similar would work fine. That being said if you purchase a quiver you should not have to heavily modify or purchase other items inorder to make it serviceable, do not recommend. | 排除：Vine且疑似软袋混款

 | JF2M-1 | 3★ / 2023-02-18 | For what it is it is good. I like quiet thing this is not. I have removed the tube and that seems to be good for that at the moment. I am a 40” waist so the belt just barely fit. | 纳入：腰带围度、噪声

 | JF2M-2 | 2★ / 2022-03-09 | Está bonito pero llegó con zipper dañado, tuve que utilizarlo para un evento y agregarle un Velcro por el momento | 纳入：拉链

 | JF2M-3 | 3★ / 2021-07-06 | Happy with the product even though the color I ordered isn’t what I received,(ordered purple , got black) | 纳入：错色

 | JF2M-4 | 3★ / 2021-05-11 | Looks good. But description says up to 42in waist. But it came up at least 4in short on my 40in waist. I had to use my own belt. Aside from that. I like it. I use on my home range. Way to noisey for hunting. | 纳入：腰带围度、噪声

 | JF2M-5 | 1★ / 2020-12-31 | It was a month late.  I emailed the seller and got no response back.  When it finally arrived, it was smaller than described.  So short that the arrows fall out with the slightest movement. | 纳入：短袋掉箭、交付延迟-补充、客服未回复-补充

 | VMDX-1 | 3★ / 2026-09-10 | Average | 纳入：无明确问题

 | VMDX-2 | 3★ / 2026-02-03 | [无正文] | 排除：无正文

 | VMDX-3 | 3★ / 2022-04-16 | Product arrived without the American Flag as shown in pics. There was no flag included in bag to be put onto the velcro either. Hoping the company will fix otherwise we will be returning. Seems great otherwise | 纳入：旗帜章预期

 | VMDX-4 | 1★ / 2019-10-15 | The whole reason I bought this quiver was because of the American flag on it and when I received it, there was no American flag.  Apparently you can buy a patch from somewhere and put t on there if you would like.  Very misleading! | 纳入：旗帜章预期

 | VMDX-5 | 1★ / 2019-06-12 | Missing the belt and flag patch! | 纳入：缺腰带、旗帜章预期

缺腰带、拉链、腰带围度、噪声各2/12；旗帜章3/12；错色、短袋掉箭、到货部件破损各1/12。补建映射还标记了同条中的交付延迟、客服未回复，这两项没有在原报告主痛点排名中单列。Average保留在分母，只标“无明确问题”。归档脚本校验这些计数，但不是运行关键词分类器自动得出根因。

采集接口的实际链路：AI发market_get_reviews给多宝鱼，当前会话收到多宝鱼工具返回的JSON。其他skill明确称该类market_*直连卖家精灵；但本案未见多宝鱼后台源代码或上游HTTP日志。因此卖家精灵review的starList数组怎样从stars字符串转换、size怎样处理、缓存/实时性如何，均不能保证。


## 07｜税费为什么只能算情景，不能当成已核准成本

7.1 获取路径

先读tariff-calculator-amazon，发现2024快照过时；公开检索找到CBP N262343。官方正文加载不出，Python请求又因证书校验失败，未关闭校验；之后通过浏览器读CustomsMobile镜像。案例为2015麂皮肩背箭袋4202.91.0090、4.5%，与拟开发纺织面材料不同，不能套编码税率。

7.2 当前查到的范围

USITC页面显示2026 HTS Revision21；4202.92.91.00列示17.6%基础税率。该代码只是候选，需按最终外表面材料、结构和成套配件确认。301和其他附加税、豁免、入境日期适用性没有完整验证，所以不写实际综合税率。

 | 情景 | 计算 | 作用 | 不能怎么用

 | 17.6% | 只有候选基础税 | 观察下界结构 | 不能认定进口只交这项

 | 42.6% | 17.6%+假设25个百分点 | 本案主预算压力输入 | 不是声明当前301必为25%

 | 62.6% | 42.6%再+假设20个百分点 | 额外税负压力测试 | 不是声明某现行IEEPA税率

7.3 货源与物流缺口

三次1688查询仍无有效价格、MOQ或交期。运费0.95、保险0.05、报关港杂0.60、入仓0.40合计2美元/件均为预算预留，没有货代逐项报价。最低报关费、保证金、港杂和placement可能不同，不能说实际落地一定是2美元。美国一般估价情景用FOB作海关货值代理，不自动将国际运保加进税基；assists等调整仍需报关行核实。

7.4 材料还没定版

早期方向讨论使用“尼龙/纺织面”表述，后续规格数组提出600D聚酯牛津布候选，尚未由样品定版。尼龙与聚酯不能在最终BOM中混写。最终材料决定成本、质量与税目意见，不能凭文档名把它当已锁定。


## 08｜每一个成本数字的来源、计算与因果方向

# A1：所有未有报价或实测依据的数字均是规划假设
Q = 300                 # 用户计划，非采购放行
P = 27.99               # 拟售价；样本最高25.99，溢价约7.7%未验证
F = 2.80                # FOB目标，含零售包装；非报价
t = 0.426               # 假设综合税率
L = 0.95+0.05+0.60+0.40 # 非货值物流预留=2.00
r = 0.15                # 佣金假设；最终SKU未官方试算
fba = 6.37              # 参考竞品SUNYA的第三方费用估计
s = 0.25                # 仓储/售出件预留，非全部库存周期精算
ret = 0.04              # 售价的损失预留，不是4%退货率
cpc = 0.70              # 第三方关键词建议竞价参考，非实际CPC
cvr = 0.12              # 纯假设；不是关键词市场购买率1.62%

关税 = F*t = 1.1928
到岸 = F+F*t+L = 5.9928
佣金 = P*r = 4.1985
退货损失预留 = P*ret = 1.1196
广告CPA = cpc/cvr = 5.8333333333
广告前贡献 = P-到岸-佣金-fba-s-退货损失预留 = 10.0591
单位销售贡献 = 广告前贡献-广告CPA = 4.2257666667
贡献率 = 单位销售贡献/P ≈ 15.10%

# 非会计净利润：没有扣固定工资、所得税、全部积压成本等。
# 全单按广告获客，未假定自然流量稀释广告成本。

压力格 = 广告前贡献 - cpc*(1+涨幅)/(cvr*(1-降幅))
涨幅∈[0,10%,20%]；降幅∈[0,5%,10%]（均相对变化）
最差格 = 10.0591-0.84/0.108 = 2.2813222222

目标贡献率 = 15%（内部经验门槛，不是用户原始要求）
到岸上限 = P*(1-r-ret-目标贡献率)-fba-s-cpc/cvr
         = 6.0200666667
FOB上限 = (到岸上限-L)/(1+t) = 2.8191210846
拟采购目标 = 2.80（由上限取整形成询价目标，未证明可制造）

库存到岸资金 = 300*5.9928 = 1797.84
售完300件广告 = 300*(0.70/0.12) = 1750
一次性样品/QC/素材预算 = 600（假设）
加10%机动 = (1797.84+1750+600)*1.10 = 4562.624


这里有一个必须理解的方向：并不是“找到2.80美元真实供应价，所以利润15%”；实际是“希望保留15%贡献，在拟售价和费用假设下反推出FOB须约2.82以内，于是提出2.80目标”。若供应商不能做到、市场不接受27.99、广告CVR达不到12%，这条利润推演就失效。

 | 变化 | 对结果的影响 | 结论

 | 真实售价只能25.99 | 其他不变，单位贡献约2.61，低于15%目标 | 须重新定位或降本，不能照旧宣称15%

 | 综合税假设42.6→62.6% | 2.80×20%=0.56/件额外成本 | 九格结果需再减0.56

 | 运费0.95翻倍 | 再减0.95/件 | 原预算不足的直接影响

 | FBA费用增加1美元 | 再减1美元/件 | 包规与费用必须实测

 | 上述三项叠加最差广告格 | 2.2813−0.56−0.95−1≈−0.23 | 单一广告九格为正并不保证总体风险可承受

佣金和FBA从销售结算扣除，预备现金表没有再全额加一次，避免与成本/贡献重复。未拿到支付条款、结算保留金和交期，无法给出真实峰值资金占用或回款天数。4562.62是规划准备金额，不是用户确认预算，不是已经支付。


## 09｜评分为什么没有直接变成“做”

六维按需求25%、单位经济25%、竞争20%、差异15%、物流10%、风险5%加权。各原始1–5分为分析后人工判断，有数据点支持但不是数据库客观排名。总分为sum(原始分×权重)，先按5分制再乘20。

 | 方案 | 原始分 | 加权分 | 基准贡献 | 最差广告格 | 结果

 | A0 同质基础款 | [3, 1, 2, 1, 3, 3] | 2.00/5 → 40/100 | $-1.02 | $-2.96 | NO-GO

 | A1 成人可靠性改良款 | [3, 3, 2, 4, 3, 3] | 2.95/5 → 59/100 | $4.23 | $2.28 | HOLD

 | A2 高配减振款 | [2, 2, 2, 3, 2, 2] | 2.15/5 → 43/100 | $3.75 | $1.80 | NO-GO

三方案来自人工拟开发，不是三家供应商报价，也不是三款现成可采购SKU。A0便宜同质但基准负贡献，直接淘汰；A2即使广告九格为正，32.99价格超样本且高配价值未证，贡献率也低于15%，本次不做；A1原始分较高但与其他方案在5分制内相差不足1分，缺失数据带来的误差很大，不能声称精确优胜。

放行逻辑（完整含义）
有市场/痛点信号？
├─ 否 → 不继续投入
└─ 是 → 有没有可验收的改良假说？
         ├─ 否 → 同质竞争，重新定位
         └─ 是 → 情景贡献能否成立？
                  ├─ 否 → 换成本结构/价格/定位，不能靠高评分救回
                  └─ 是 → 真实报价、税费、样品、包规与转化是否验证？
                           ├─ 否 → HOLD（本次走到这里）
                           └─ 是 → 再审300件订单与资金，才可能GO


实际没有批准采购、联系供应商、支付货款或建立广告。此前第5步后的确认请求是“是否按这个方案定稿HTML”，与“同意下300件订单”不同。后续用户要求归档与追问接口，也不构成采购授权。


## 10｜痛点怎样变成卖点、规格、BOM与验收

转换分四步：评论说明使用问题→提出改良方向→写成可供询价的规格→设计能判通过/失败的测试。只有最后两步明确、样品真正通过，才能把它变成对消费者的承诺。三管、多口袋和D环本就是类目常见配置，属于基础价值，不能说独有创新。

 | 信号 | 设计动作 | 拟规格 | 验收 | 责任与状态

 | 缺腰带/图片预期 | 齐套管理 | 袋1+管3+带1+说明1，不含箭与旗帜章 | 首批300件100%清点 | QC/包装；尚未执行

 | 有效围度不足 | 实测扣合后的佩戴范围 | 38mm带、70–125cm拟范围，余带≥50mm | 3样不同围度、1kg30min，滑移≤10mm | 开发/QC；待样品签版

 | 拉链失效 | 拉头/止口装配和耐用 | 主辅拉链口袋 | 3样每拉链500次循环，20N10s不脱头开链 | QC；拟测试，不是行业认证

 | 短袋掉箭/连接风险 | 携带与承载验证 | 12支28in、外径6–8mm靶箭；三管可拆 | 取放100轮、步行10min、45°弯腰10次；连接100N10s | 开发/QC；不能宣传任意箭型通用

 | 到货破损个例 | 包装保护和复测 | 拟包规≤445×160×75mm，毛重≤600g | 3样包装1m六面跌落，无裂/锐边并功能正常 | 包装/QC；不冒称ISTA

 | 管噪声 | 试验可拆减振垫片 | 不进入基础BOM与成本承诺 | 不挡箭、不刮箭羽，再评效果 | 开发；暂不承诺静音狩猎

尺寸430mm/管420mm、600D、成品500g、测试样本3件、500循环、20N/100N、量产抽32件等都是本案工程提案。它们不是评论原文建议、不是工具测量结果、也不是已引用的强制标准。按经验值明示并由开发/QC/供应商签版才可执行。对成人靶场右手黑色单SKU先验证，不能推广为儿童、左右手通用或狩猎款。


## 11｜所有JSON和代码究竟从哪里来：逐文件数据流

| 文件 | 创建者/时机 | 内容 | 用途 | 事实属性

 | evidence.json | 第1步助手汇总落盘 | 关键词、节点样本、趋势、部分原响应 | 保存阶段1证据 | 真实接口返回与汇总口径混合，需看字段

 | report-template.html | 第1步保存报告规范模板 | skill模板 | 供生成器复用视觉/结构 | 模板自身不是市场证据

 | stage2-5-evidence.json | 第2—5步助手汇总，后来补入第17次请求 | research、reviews、tariff等 | 主证据文件 | 多数取数响应+整理字段；paidRequests为阶段计数17

 | supplement-evidence.json | 助手保存后补请求与关税笔记 | sourcing2、tariff | 补充快照后并入主证据 | 与主证据有重叠，不能当额外付费请求

 | build_report.py | 助手编写的本地Python | 人工参数/文字/评分/规格+读取证据+计算函数 | 生成calculations与综合/分报告 | 不是多宝鱼发给你的代码；没有重新取数

 | calculations.json | build_report.py运行写出 | 候选成本、利润、9格、分数、300件预算 | 保存精确计算结果 | 假设的算术结果，非报价/市场原始事实

 | 赛道评估-arrow-bag-quiver-20261027.html | 第1步JavaScript拼装 | 5个细分、节点明细、趋势、缺口 | 门1用户选择 | 依赖当时会话store；不是独立一键跨环境脚本

 | 开品决策评审稿-三管腰挂箭袋-20261027.html | build_report.py拼装 | 市场/评论/关税/十章选品/规格QC | 门2评审 | 尚非量产放行书

 | 市场/评论/关税/选品分报告HTML | 同一build_report.py | 从综合章节按ID抽取 | 便于单独阅读 | 非再次分析/取数

 | process-archive/execution-records.json | assemble_process_document.py读取会话日志 | 55个顶层调用、59个MCP事件、18命令、5文件事件等 | 还原公开执行过程 | 不同层事件可能重叠，不能相加当市场请求数

 | process-archive/review-coding-map.json/.csv | 归档时补建 | 逐条评价→主题及排除理由 | 复核原报告人工计数 | 事后审计映射；不冒充当时自动分类

 | assemble_process_document.py | 用户要求全过程后助手编写 | 记录抽取、skill快照、源代码转义嵌入、ZIP打包 | 17章完整代码档案 | 本地归档，不执行历史付费代码

 | build_flow_tree.py | 本次请求助手编写 | 复用前述数据、账本、显式因果说明 | 当前流程树HTML和可编辑Markdown | 本次新增付费0次

MCP响应先进入会话，并没有自动写到本地
  ↓ AI执行写文件代码
evidence.json / stage2-5-evidence.json / supplement-evidence.json
  ↓ build_report.py读取 + 人工写入参数/判断/规格
  ├─ calculations.json（计算结果）
  ├─ 综合开品决策评审稿HTML
  └─ 市场/评论/关税/选品4个分报告HTML

已保存会话日志 + 上述文件 + skill镜像
  ↓ assemble_process_document.py
  ├─ 执行记录/skill快照/市场账本/逐条评论映射
  ├─ 全过程与代码档案HTML
  └─ ZIP，内部人为设置arrow-quiver/目录
      ↓ 若用户解压到原有arrow-quiver目录
      可能看到arrow-quiver/arrow-quiver/，属于路径副本
      不代表多宝鱼又返回了一次，更不代表额外付费


原始落盘在当前外层arrow-quiver目录。用户提到的双层路径与ZIP内部目录相符，但未据此检查或删除任何解压副本。没有因为文件名是evidence就把全部内容称真实原始证据：其中关税笔记、样本计数、成本假设和阶段元信息依然是助手整理。


## 12｜HTML生成的每一层：从JSON字段到页面

| 层 | 代码/对象 | 实际动作 | 输出或原因

 | 输入解析 | unwrap / result_data | 优先structuredContent，否则解析content文本；再到data.data | 接口嵌套不统一；只看status会漏掉业务错误

 | 清理呈现 | esc=html.escape | 转义评论、文本的尖括号/引号 | 原文作为文字显示，避免误当HTML

 | 样本常量 | comps | 写入6竞品核验后的字段 | 916件与样本销售额由列表求和

 | 情景定义 | cs / weights / bases | 写入A0/A1/A2、费用、原始分及依据 | 这些是分析参数，不是API新事实

 | 数值循环 | for c in cs | 计算duty/landed/referral/returns/ad/net/matrix/score | 写出calculations.json

 | 评论循环 | reviewrows | 逐条输出原文、日期、星级、排除理由 | 日期用UTC转换，避免本地时区改变评论日期

 | 人工主题表 | pain | 直接填入人工阅读后的频次和优先级 | 原始代码没有NLP自动分类器

 | 章节函数 | p / table / sec | 字符串拼接段落与表格，按ID存入sections | 形成市场/评论/关税/selection1..10/brief14节

 | 页面外壳 | css / head / verdict / kpis / foot / doc | 内联CSS、中文标题、固定水印、导航、来源 | 无CDN/远程图片/网络字体；外链为参考

 | 主报告 | doc(all sections) | 写入开品决策评审稿HTML | 14节、22表、168行的原结构检查

 | 分报告 | 按章节ID筛选 | 市场/评论/关税各抽对应节；选品抽十章与brief | 复用内容，不再调用市场接口

 | 档案 | pre转义源码+折叠details | 把原始代码与响应嵌入大文件 | 约13MB，折叠正文阅读；不能执行其中代码

 | 当前流程树 | tree+表格+账本+源码附录 | 静态树、因果图、参数和文件血缘 | 当前文档独立HTML，原完整档案另保留

原第1步生成代码由functions.exec中的JavaScript运行，依赖store/load临时变量；后续生成器build_report.py是Python标准库程序。它们不是一套已经产品化的全自动选品系统：调用、判断、规格、源数据筛选与长段报告文字均有人工编排。


## 13｜失败、修正、验证和明确没有完成的事

| 问题 | 实际处理 | 验证/缺口

 | sort_by=units参数无效 | 改total_units，保留失败请求 | M03不能产生有效销量结论；是否扣费未知

 | 多词与关联误匹配 | 节点限制+人工核验 | 排除噪声，不假装所有原响应有用

 | 采购0值 | 按缺数 | 没有有效报价/MOQ/交期，不能审批采购

 | 旧税率/历史皮革材质 | 查当前候选与保留情景 | 完整附加税/最终归类仍未完成

 | 大段生成代码失败 | 保留错误和最终成功版本 | 失败代码不是已经执行成功的流程

 | A0手写分数曾41/100 | 按计算40/100修正并重新生成 | 最终score100=40

 | HTTPS证书失败 | 没有关闭验证 | 转用浏览器读公开镜像

 | 本地file浏览器策略阻止 | 未绕过 | 未截图/视觉验收；只完成静态和计算检查

 | 原报告计算校验 | 核对4.23/2.28、916、15/12、九格正负、权重100 | 算术一致不证明假设真实

 | 原报告HTML校验 | HTMLParser检查ID、锚点、水印、禁外部资产 | 没跑项目构建/TypeScript/E2E：这是仓库外静态文档

 | 原skill输出不全 | 归档中公开差距 | 评论独立报告未扩为全部9章，正面主题未逐条量化；不称完全执行全部条款

 | 服务器/GitHub | 未修改应用仓库，不部署服务器 | 本次产物位于可视化目录，不属于应用代码发布

 | 商业缺口 | 清楚列在决策和假设表 | 报价、税费、样品、费用、广告转化、现金周期/IP均待验证


## 14｜后续问答增加了哪些证据：不能反写成原来已知

原报告交付后，用户询问调用方式、JSON来源、其他skill和卖家精灵配置。这些都是后续调查。读取本地skill、搜索多宝鱼技能库/工作流目录，以及浏览公开官方文档，没有新增评论数据采集。

 | 后续发现 | 证据 | 影响

 | 其他skill明确写用market_get_reviews | listing-new-product-oneshot、duobaoyu-product-selection、keyword-benchmark-diagnosis等 | 解释当前获取路径；旧review-analyzer“用户提供”说明已不一致

 | skill称market_*直连卖家精灵 | 新品一次上架skill与Sorftime路由说明 | 来源有文档依据；不是看到了后台请求日志

 | 工作流目录没有评论模板 | 当前返回workflows=[]；3个内置为广告/补货/数据保鲜 | 没有专门模板可解释其实现，不运行工作流

 | 官方评论接口为review | https://open.sellersprite.com/api/25；POST https://api.sellersprite.com/v1/review | 与多宝鱼market_get_reviews名称不同，可能有封装，但代码未见

 | 官方starList/typeList/page/size | starList数组、typeList类型，size默认5最大10 | 多宝鱼stars字符串和响应size20不能自动等同官方分页

 | 鉴权配置 | 官方HTTP示例secret-key请求头 | 本会话使用多宝鱼连接，未配置用户卖家精灵密钥

 | 数据新鲜度仍未知 | 公开字段文档无本案缓存/抓取日志 | 不能声称实时抓Amazon全部评论或完整翻页

 | 另一Sorftime接口 | product_reviews(review_type="Negative")技能写上限100/近一年 | 这是另一接口限制，不能套给market_get_reviews

此前“请求100、响应元数据20”是一次原响应观察；公开官方文档“最大10”是后查到的说明。二者不一致只能明确待核查，不能擅自推断多宝鱼做了两页聚合，也不能把size100解释为实际拿到了100条。


## 15｜未完成事项和下一阶段的条件树

本次最终状态：A1可优先验证；300件采购HOLD
│
├─ 用户是否确认开发方案/文档？ → 当前没有把该确认等同订单授权
├─ 采购：至少2份同BOM可追溯报价
│  ├─ MOQ≤300；贸易条款/交期/付款方式明确
│  └─ 实际到岸≤6.02只是本次假设体系的目标，费用改变须重算
├─ 税费：最终材质/结构 → 书面归类 → 入境日附加税/豁免 → 重算
├─ 样品：至少3件 → 关键验收通过 → 材料/手向/标签/图文签版
├─ 物流：实测包规/重量 → 逐项运保报关入仓报价 → 官方FBA费用
├─ 合规/IP：成人定位、品牌与外观/专利初筛；必要要求按实物核查
├─ 用户审批实际订单和资金 → 才能考虑生产采购（本次未做）
└─ 若获准上市验证（仍属未来，不是本次已执行）
   ├─ ≥300有效广告点击且≥30单才做初步经济判断
   ├─ CPC>0.84或CVR<10.8% → 暂停扩量、查词/页面/产品
   ├─ 单位贡献<2或贡献率<15% → 停补货/降本/重定位
   ├─ 任何安全缺陷 → 立即停发隔离；功能不良≥2/30 → 复检
   └─ 质量经济通过 + 实际交期 + 库存覆盖 → 重新审批补货


这些数量/时间/阈值是本案内部验证提案，需用自有账户历史和真实波动校准，不是统计显著性或成功保证。30天计划从评审确认后开始，未有交期不能承诺30天到仓或售完。补货点需实际交期与最近销量，不因害怕断货跳过经济门槛。


## 16｜逐项复查入口与离线复现

当前文件写清业务树和因果；每一句原始代码、原响应和全部skill原文仍完整保存在既有13MB档案中。以下文件按相对路径链接，同目录打开即可核对。没有为了生成本树重跑任何付费请求。

 | 文件 | 用途

 | build_report.py | 原评审稿生成器；下方也内嵌全文

 | assemble_process_document.py | 原全过程档案生成器

 | process-archive/market-call-ledger.json | 27次原始请求及响应

 | process-archive/execution-records.json | 公开执行完整记录，包括代码和失败

 | process-archive/review-coding-map.json | 事后补建逐条主题映射

 | calculations.json | 精确计算值

 | evidence.json | 第1步证据

 | stage2-5-evidence.json | 后续主证据

 | supplement-evidence.json | 后补原响应和税目笔记

 | 选品全过程与代码档案-arrow-bag-quiver-20261027.html | 55次顶层调用、6skill全文、全部源码

 | 开品决策评审稿-三管腰挂箭袋-20261027.html | 原业务结论与规格/QC

# 离线重建原评审稿与计算结果（不会刷新市场数据）
python3 build_report.py
# 重建完整代码档案（需要原会话日志和现有文件）
python3 assemble_process_document.py
# 重建本流程树（读取现有账本/计算/评论映射）
python3 build_flow_tree.py


原始functions.exec中的store/load/ALL_TOOLS/tools.*依赖当时工具运行时，不可直接作为本地Node程序执行。不要批量重放历史付费调用；若以后刷新市场，需重新核对工具schema、分页规则、费用上限与授权。


## 17｜原评审稿生成器全文：直接核对每一步计算和拼装

展开 build_report.py 全文

import json, html, re
from pathlib import Path
from datetime import datetime, timezone

ROOT=Path(__file__).resolve().parent
raw=json.loads((ROOT/'stage2-5-evidence.json').read_text())
supp=json.loads((ROOT/'supplement-evidence.json').read_text())
raw['paidRequests']=17
raw['research']['sourcing2']=supp['sourcing2']
raw['tariff']=supp['tariff']
raw['tariff']['candidateHTS']='4202.92.91.00'
raw['tariff']['candidateBaseRate']=.176
raw['tariff']['currentAdditionalRatesVerified']=False
(ROOT/'stage2-5-evidence.json').write_text(json.dumps(raw,ensure_ascii=False,indent=2))

def unwrap(v):
    v=v.get('structuredContent') or json.loads(v['content'][0]['text'])
    return v['data']['data']
def esc(x): return html.escape(str(x))
def money(x): return f'${x:,.2f}'
def table(head,rows):
    return '<div class="scroll"><table><thead><tr>'+''.join('<th>'+str(v)+'</th>' for v in head)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+str(v)+'</td>' for v in row)+'</tr>' for row in rows)+'</tbody></table></div>'
def p(s): return '<p>'+s+'</p>'
def date(t): return datetime.fromtimestamp(t/1000,timezone.utc).strftime('%Y-%m-%d')

comps=[('SUNYA','B09CQ7DGD8',232,24.99,4.7,387,6.37,'17.3 × 6.2 × 2.5 in','12','右手子体；材料字段 Nylon / Polyester 冲突'),('Easton','B00IEPFDLO',213,20.99,4.7,982,6.39,'17.5 × 5.5 × 3.1 in','—','可反向安装口袋；10 卖家、AMZ；未明确附腰带'),('SHENG-RUI','B0D8XSZQDS',203,22.99,4.9,27,6.02,'17.5 × 6 × 2.6 in','13','粉色右手子体，另有左手；24 支容量未验证'),('SPG','B0DQKBHSMK',97,20.99,4.8,59,6.01,'17.4 × 4.4 × 3.9 in','2','附腰带；15–20 支容量未验证'),('LEGEND','B082P5JF2M',91,25.50,4.6,480,5.61,'17.4 × 4.4 × 2.6 in','5','右手款；42 in 腰围宣传有差评反证'),('KRATARC','B0D7LJVMDX',80,25.99,4.7,434,6.75,'17.6 × 6.2 × 3.5 in','5','3 管可拆；有魔术贴面，当前要点未承诺旗帜章')]

# Each candidate is a proposed design, not a quoted supplier SKU.
cs=[dict(id='A0',name='同质基础款',price=20.99,fob=2.50,other=2.,fba=6.37,scores=[3,1,2,1,3,3],status='NO-GO'),dict(id='A1',name='成人可靠性改良款',price=27.99,fob=2.80,other=2.,fba=6.37,scores=[3,3,2,4,3,3],status='HOLD'),dict(id='A2',name='高配减振款',price=32.99,fob=5.50,other=2.30,fba=6.75,scores=[2,2,2,3,2,2],status='NO-GO')]
weights=[25,25,20,15,10,5]
for c in cs:
    c['duty']=c['fob']*.426
    c['landed']=c['fob']+c['duty']+c['other']
    c['referral']=c['price']*.15
    c['returns']=c['price']*.04
    c['storage']=.25
    c['ad']=.70/.12
    c['preAd']=c['price']-c['landed']-c['referral']-c['fba']-c['returns']-.25
    c['net']=c['preAd']-c['ad']
    c['matrix']=[[c['preAd']-.70*(1+a)/(.12*(1-b)) for b in [0,.05,.10]] for a in [0,.1,.2]]
    c['score5']=sum(s*w/100 for s,w in zip(c['scores'],weights))
    c['score100']=c['score5']*20
b=cs[1]
cap=b['price']*(1-.15-.04-.15)-b['fba']-.25-.7/.12
budget=(300*b['landed']+300*b['ad']+600)*1.10
calc=dict(candidates=cs,quantity=300,cpc=.70,cvr=.12,taxScenario=.426,landedCapFor15Percent=cap,fobCap=(cap-2)/1.426,cashReserve=budget,setup=600)
(ROOT/'calculations.json').write_text(json.dumps(calc,ensure_ascii=False,indent=2))

sections=[]
def sec(id,title,body):
    s=f'<section id="{id}"><h2>{title}</h2>{body}</section>'
    sections.append((id,title,s))

sec('market','第 2 步｜需求、竞争与进入门槛',p('美国站 hip quiver 的 2026 年 9 月搜索量为 <b>2,859</b>、关键词关联购买量估计 <b>46</b>、商品数 <b>211</b>。购买率 1.62% 是该关键词的市场指标，不能当作新 Listing 的广告转化率。其搜索量环比 +2.69%；另一个增长字段约 −7.33%，比较窗口未定义，不作同比。相近词 hip / archery / arrow 表达会重叠，不能累加为独立买家。')+table(['证据','数值 / 窗口','含义与限制'],[
['52 周趋势','2025-10-25—2026-10-17；周搜索 270–785；最近三周 447 / 410 / 462','有持续搜索；没有证据支持高速增长或明显短期爆发'],
['六个不同父体的直接竞品','月销量估算合计 916 件；前三个合计 648 件，占本样本 70.74%','是所检查样本，既不是全市场规模，也不是市场份额；月销量具体窗口由数据商定义'],
['样本月销售额估算',money(sum(c[2]*c[3] for c in comps)),'单价 × 月销量估算；未扣优惠、退货，非真实结算收入'],
['关键词广告竞价参考','$0.70；区间 $0.46–$0.91','第三方建议竞价，非本账户实际 CPC'],
['价格与信任壁垒','$20.99–$25.99；评分 4.6–4.9；ratings 27–982','高评分成熟产品居多；新产品 27 / 59 ratings 样本也有销量估计，但不证明容易进入'],
['变体与履约','多数 FBA；部分多颜色 / 左右手变体；Easton 为 AMZ','销量和评论可能跨变体聚合，不能分配成每个子体的独立销量'],
['进入门槛','缝制软品可打样；采购价 / MOQ / 交期未知','核心难点是长条包装费用、低价竞品、广告经济性和品质一致性']])+table(['品牌 / ASIN','估算月销量','售价','评分 / ratings','FBA 估算','包装尺寸','变体数','核验发现'],[[f'<a href="https://www.amazon.com/dp/{a}">{n}<br>{a}</a>',v,money(pr),f'{rt} / {rn}',money(fba),size,vari,note] for n,a,v,pr,rt,rn,fba,size,vari,note in comps])+p('以上为多宝鱼 MCP 调用卖家精灵的 2026-10-27 快照。ratings 是星级评价人数，reviews 为数据接口另一个字段；两者不得混用。空 coupon 字段只表示未报告，不能断言没有优惠。SUNYA 详情返回的 387 ratings 与初筛 386 存在快照差异。自动关联竞品接口混入弓装箭架和无关商品，已排除；宽词搜索也不用于直接竞品规模。')+p('<b>进入策略：</b>定位成人靶场使用、右手黑色单 SKU，先验证完整交付和佩戴可靠性。竞品已有三管、口袋、可拆管等功能，不能把这些常见配置写成独有创新。$27.99 比样本最高价 $25.99 高约 7.7%，是待验证的定价假设。'))

reviewrows=[]
for asin,res in raw['reviews'].items():
    for i,r in enumerate(unwrap(res)['items'],1):
        rid=f'{asin[-4:]}-{i}'
        content=r.get('content')
        reason='纳入正文编码'
        if r.get('vine'): reason='排除主分析：Vine，且描述软袋与三管款不一致'
        elif not content: reason='排除正文编码：仅标题 Small，正文缺失'
        elif asin=='B0D7LJVMDX': reason+='；父体历史评论，不能归责当前子体'
        reviewrows.append([rid,asin,str(r['star'])+'★',date(r['date']),esc(', '.join(r.get('skus') or [])),esc(content or '[正文缺失]'),reason])
pain=[['P0','配件完整 / 缺腰带','2 / 12，16.7%','低；SUNYA + KRATARC 历史家族','齐套是使用前提；100% 装箱核对，腰带和 3 管固定位置，包装清单可视化'],['P1','拉链损坏 / 拉头脱落','2 / 12，16.7%','低；SUNYA + LEGEND','直接影响收纳，虽不到 20% 仍按严重度前置；止口、装配和循环测试'],['P1','腰带实际围度不足','2 / 12，16.7%','低；均 LEGEND；高星另有腰带反馈','验证扣合后的有效围度，页面用实测围度而非织带原长'],['P1','防跌落与到货破损','各 1 / 12，8.3%','低；破损部件不明；短袋掉箭为个例','作为验收门槛，不能据此断言特定管材普遍开裂'],['P2','管体噪声','2 / 12，16.7%','低；均 LEGEND，高星亦有反馈','靶场可用可拆垫片试验；不作静音狩猎承诺'],['P2','图片 / 配件预期不符','旗帜章 3 / 12，25%；错色 1 / 12','低；旗帜章均 KRATARC 旧家族','先修图片与 BOM 一致性；不能直接判定当前子体漏发，亦不必为此增加旗帜配件']]
sec('reviews','第 3 步｜差评痛点与改良优先级',p('针对 SUNYA、Easton、LEGEND、KRATARC 请求 1–3 星评价，接口共返回 15 条；Easton 返回 0 条不代表没有差评。排除 SUNYA 两条 Vine 且疑似软袋混款评价后，剩 13 条非 Vine；KRATARC 一条没有正文，再排除后，<b>正文编码分母为 12</b>。其中一条只说 Average，保留在分母但不推断具体缺陷。主题可以重叠，所以下列比例不相加。所有比例仅指这个按星级筛选的小样本，不能当作总体不良率。')+table(['优先级','主题','样本计数','证据置信度','改良价值 / 动作'],pain)+p('另取 SUNYA 与 LEGEND 各 20 条高星评论，共 40 条，其中 1 条无正文；39 条正文用于交叉阅读。好评支持多口袋、分管取箭和佩戴便利的价值，也出现腰带和噪声反馈。由于高低星分别检索，不能据此计算满意率、真实差评率或评论趋势。KRATARC 若干评论早于当前子体上架，明确按父体历史信号处理。')+p('排序依据为影响使用的严重度、跨品牌重复、改良成本与可验收性；不是频次简单排序。旗帜预期虽达到样本 25%，但家族年代和图片承诺不一致，优先采取信息与齐套管理，暂不投入新装饰件。低于 20 条正文，以上全部标为低置信度，打样后再验证。')+ '<details><summary>查看全部 15 条低星原文、星级、UTC 日期与排除记录</summary>'+table(['证据 ID','ASIN','星级','UTC 日期','变体','原文（未经翻译）','处理'],reviewrows)+'</details>')

tariffbody=p('<b>实际税负尚不能锁定。</b>2026-10-27 查询 USITC 页面显示 2026 HTS Revision 21。候选税目 <b>4202.92.91.00</b>（外表面为人造纤维的其他容器）列示基础税率 <b>17.6%</b>；该税率只有最终归类成立才适用。历史 NY N262343（2015-03-23）把麂皮箭袋归为 4202.91.0090，旧基础税率 4.5%。本品拟为尼龙纺织面，不能沿用皮革编码或 4.5%。')+p('4202 的依据是其储存、保护、整理并携带箭的容器功能；但需结合最终外表面材质、结构、腰带是否成套等判断 4202.92 下的具体分支。9506 不能只因用于射箭便自动采用；需要报关行针对样品给出书面归类意见。当前 301、其他附加税及排除措施未完成逐项验证，不能把技能内置 2024 表或历史 IEEPA 数字当作现行税率。')+table(['税费项','本次使用 / 状态','来源与时效'],[['基础税','候选 17.6%；归类未定','USITC 2026 HTS Revision 21，2026-10-27 查询'],['Section 301','未核实；预算另加 25 个百分点，仅为压力假设','不是当期政策结论，须核对 chapter 99 与排除条款'],['其他附加税','未核实；高压力情景再增加 20 个百分点','并非断言存在特定 IEEPA 或对等税'],['进口 VAT / GST','美国无联邦进口 VAT，本表未加 VAT','MPF/HMF、报关、保证金等另需报价；不意味着进口无其他费用'],['优惠协定','未主张中国产享有优惠，预算不减税','不能靠中转改变原产地；若申请任何减免须有对应证明']])+p('计算按美国一般交易价格估价思路：关税 = 可接受的海关货值 × 适用合并从价税率。此处仅以 FOB 作为海关货值代理，未计 assists 等调整；国际运费和保险单列，不自动加进关税基数。最终入境日期及有效政策决定实际税负。')
tariffrows=[]
for t,label in [(.176,'仅候选基础税；非实际总税'),(.426,'基础 + 假设 25 个百分点'),(.626,'前情景 + 假设 20 个百分点')]:
    duty=2.8*t; landed=2.8+duty+2
    tariffrows.append([label,f'{t*100:.1f}%',money(840*t),money(duty),money(landed),money(300*landed)])
tariffbody+=table(['情景（全为规划，不是报价）','合并税率','300 件关税','单位关税','单位到岸','300 件到岸'],tariffrows)+table(['A1 到岸拆项','单件 USD','300 件 USD','依据'],[['FOB 含产品与零售包装','2.80','840.00','反推采购目标，未获得供应商报价'],['国际运费','0.95','285.00','预算假设，非货代报价'],['保险','0.05','15.00','预算假设'],['报关 / 港杂 / MPF/HMF / 保证金预留','0.60','180.00','预算合并预留，可能不够最低收费；待逐项报价'],['境内运输及入仓费用预留','0.40','120.00','预算合并预留，含仓前 / placement；不得重复计费'],['关税（42.6% 压力情景）',money(2.8*.426),money(840*.426),'非现行税率结论'],['到岸合计',money(b['landed']),money(300*b['landed']),'不含 FBA 出库、销售佣金、广告与退货']])+p('所有成本以 USD 规划，无人民币换算或实时报价汇率。若供应商以人民币报价，按付款日可成交汇率重算。FOB 的美元成本增加 5%，在 42.6% 情景下到岸增加约 $0.20/件；运费翻倍则增加 $0.95/件。没有航线、箱规、贸易术语和申报日期，不能给出已核准的实际到岸成本。')+p('归类来源：<a href="https://hts.usitc.gov/search?query=4202.92">USITC 当前 HTS</a>；<a href="https://rulings.cbp.gov/ruling/N262343">CBP N262343</a> 官方页面正文未成功加载，案例全文由 <a href="https://www.customsmobile.com/rulings/docview?doc_id=NY%20N262343&amp;highlight=quiver">CustomsMobile 镜像</a>读取。两类来源分别标识，不把镜像当作当前官方税率。')
sec('tariff','第 4 步｜中国至美国关税与到岸成本',tariffbody)

sec('selection1','第 5 步 · 1｜候选、约束与来源',p('用户确认的唯一数量约束是 <b>300 件试单</b>。以下 A0 / A1 / A2 为同一细分市场中的拟开发方案，不是用户提供的三个成品，也不是供应商现货报价。美国站，Sports &amp; Outdoors → Archery → Quivers，节点 3395631。未提供决策截止日期、资金上限、可承受回款周期、仓储能力或上市时间，因此不得承诺交期。暂按一次只推进 A1 一个右手黑色 SKU 规划。')+table(['ID','方案','价格假设','采购线索 / 状态'],[[c['id'],c['name'],money(c['price']),'<a href="https://detail.1688.com/offer/681213530361.html">1688 offer 681213530361</a> 仅为三管箭袋线索，不代表该设计可供货或报价'] for c in cs])+p('Sorftime 两次相似品搜索与一次详情查询，相关 offer 返回 price=0、MOQ=0、无有效阶梯价与完整店铺信息，全部按缺失处理，绝不能把 0 当作免费、零 MOQ 或已核验工厂。未发消息、询价、下单。')+table(['官方来源','第三方估算 / 检索','用户提供'],[['USITC 当前税目页面，2026-10-27；CBP 历史案例由镜像读取','多宝鱼 MCP → 卖家精灵：关键词、趋势、ASIN、评论；Sorftime：1688 线索；均 2026-10-27 拉取','arrow bag quiver 方向；选 A 三管腰挂；300 件试单']])+p('本轮市场数据请求 17 次，含供应链数据；加第一阶段 10 次，共 27 次。该数字是请求计数，不是 credits 或人民币费用，各接口计费不同；没有据此推算总费用。后续确认前停止付费取数。'))

sec('selection2','第 5 步 · 2｜结论卡',p(f'<b>A1 为优先验证方案，300 件采购当前 HOLD。</b>在 $27.99 售价、FOB $2.80 目标、42.6% 假设综合税率、CPC $0.70 与 CVR 12% 的规划组合下，单位销售贡献为 {money(b["net"])}（{b["net"]/b["price"]*100:.1f}%），最差九宫格为 {money(b["matrix"][2][2])}。这只证明该组输入在算术上能承受指定广告压力，不能证明市场会给出这个售价或转化率。A1 的采购价格来自反推，真实 MOQ、税率和运费也未锁定；若 $27.99 无法成交或到岸超过约 $6.02，15% 贡献目标就不能成立。A0 低价方案在基准广告假设下亏损，A2 的高价与成本缺少需求支撑。下一步应确认是否按 A1 规格进入询价与打样准备，取得报价、归类和样品验收后再决定是否释放 300 件订单。'))

sec('selection3','第 5 步 · 3｜预筛规则与淘汰项',p('规则 v1，2026-10-27：基准贡献率目标 ≥15%、广告压力最差格不得为负、所有实际下单须有可追溯报价 / MOQ≤300 / 交期与现金安排 / 样品通过 / 书面税目与费用确认。这些阈值为本次规划经验值，需以自有账户历史校准。缺证据时 HOLD，不用高评分替代硬门槛。')+table(['方案','触发规则','证据','结果','重新进入条件'],[['A0 同质基础款','利润无法吸收广告成本，且差异只是外观',money(cs[0]['net'])+' 基准单位贡献','NO-GO','成本或可实现售价实质改变，并形成可验收差异'],['A1 成人可靠性款','报价、税费、售价/CVR 尚未实测','$27.99 高于样本价格；FOB $2.80 为目标','HOLD，可做打样准备','满足报价、税费、样品与经济性门槛；MOQ≤300'],['A2 高配减振款','定价及差异未验证，增加材料成本','$32.99 高于样本最高价约 26.9%；尚无付费意愿证据','NO-GO（本次300件）','先证明可持续售价与减振价值，再降本；不得用静音狩猎宣传代替证据']]))

dims=['需求质量','单位经济','竞争压力（高分更好）','差异化潜力','物流韧性','合规 / 缺陷风险（高分更好）']
bases={
'A0':['2,859 关键词搜索，稳定周序列；规模有限，第三方估算，中等','基准贡献为负；成本和 CVR 为规划，低','同价 Easton 982 ratings、AMZ，多数 FBA，中等','三管+口袋为竞品现成功能；仅同质，判断，低','样本 FBA $5.61–$6.75；长条包装约17in，低','非电成人用品但归类/IP/材质未清；判断，低'],
'A1':['共享同一需求，无独立高价需求证据，中等','目标成本下约15%；报价和12%CVR缺失，低','需面对同一成熟品牌与 $20.99 起售，中等','12条差评支持齐套/拉链/腰带改善方向；小样本，低','目标包规接近样本；实测费用与运输未知，低','同类质量风险可验收，但尚无样品与税目确认，低'],
'A2':['$32.99 高出样本，未测支付意愿，低','高配成本使贡献率低于15%；规划，低','并未避开相同关键词和品牌，中等','噪声两条低星+高星信号；只证明测试价值，低','衬垫和结构可能增加体积；无箱规，低','静音/狩猎承诺无法支持，耐用性未知，低']}
scoreRows=[]
for c in cs:
    for d,s,w,reason in zip(dims,c['scores'],weights,bases[c['id']]): scoreRows.append([c['id'],d,s,f'{w}%',f'{s*w/100:.2f}',reason])
    scoreRows.append([c['id'],'合计','—','100%',f'{c["score5"]:.2f}/5 = {c["score100"]:.0f}/100','筛选辅助，不能解除采购门槛'])
sec('selection4','第 5 步 · 4｜六维评分',p('采用默认 25 / 25 / 20 / 15 / 10 / 5 权重。每项 1–5 分，分越高越有利；加权总分先按 5 分制，再乘 20 转为 100 分。判断项明确低置信度；未拿到报价的单位经济评分只作情景评分。')+table(['方案','维度','原始分','权重','加权分','依据与置信度'],scoreRows))

econrows=[]
for label,key,source in [('拟售价','price','A0 为样本低端；A1/A2 是待验证定价'),('FOB 含零售包装','fob','采购目标 / 假设，不是报价'),('关税','duty','42.6% 情景 × FOB，非实际税率'),('运保 / 报关 / 港杂 / 入仓预留','other','A0/A1 $2.00；A2 $2.30，预算假设'),('到岸成本','landed','FOB + 关税 + 上述预留'),('销售佣金','referral','售价15%假设，未获取新SKU官方费用试算'),('FBA 出库','fba','参考 SUNYA / KRATARC 第三方费用估算，不是新SKU保证价'),('仓储预留','storage','$0.25 / 每售出件假设；未售库存累积费用另算'),('退货退款损失预留','returns','售价4%预算；不是4%退货率'),('广告 / 每广告订单','ad','CPC $0.70 ÷ CVR 12%；假设全为广告获客'),('单位销售贡献','net','售价扣除上述成本；不含固定开支/所得税/工资')]: econrows.append([label]+[money(c[key]) for c in cs]+[source])
econrows.append(['贡献率']+[f'{c["net"]/c["price"]*100:.1f}%' for c in cs]+['非会计净利润'])
sec('selection5','第 5 步 · 5｜逐项利润与300件资金',table(['项目','A0','A1','A2','来源 / 假设'],econrows)+p(f'口径：广告转化率 12% 是规划输入，非关键词市场购买率 1.62%。模型将每一销售件视为广告获客，广告单成本 $5.83，A1 对应 ACOS 约 {b["ad"]/b["price"]*100:.1f}%；没有假设自然流量来降低成本，也没有把 ACOS 冒充实测 TACOS。销售税不计作销售收入；其他未列固定费用未扣，故这里只能称销售贡献。')+p(f'<b>A1 的反推目标：</b>在该价格与费用组合下，为保留15%贡献，到岸成本须≤{money(cap)}，FOB须≤{money((cap-2)/1.426)}。拟定 $2.80 FOB 只是把这条门槛变成可询价目标，是否能生产尚未知。在原价 $25.99 成交时贡献降为 {money(25.99*.81-b["landed"]-6.37-.25-.7/.12)}，低于15%目标。')+table(['300 件 A1 资金规划','USD','说明'],[['到岸库存',money(300*b['landed']),'全批到岸，税费/物流均假设'],['售完300件的广告支出',money(300*b['ad']),'对应约2500点击和12%CVR；不是首月销量承诺'],['打样 / QC / 图片文案等一次性预算','$600.00','未报价的合并预算；不含新增模具或认证'],['上述现金项目 +10%机动',money(budget),'约需准备的资金情景；不是用户预算或精确现金流'],['300件全部售完的销售贡献',money(300*b['net']),'已扣单件广告与销售费用；再扣600约 '+money(300*b['net']-600)+'，仍非净利润']])+p('销售佣金和 FBA 费用通常从销售结算中扣除，未再次加到上述预备现金，避免与库存/广告重复。由于结算保留金、交期、退货到账节奏未知，无法计算峰值资金占用或回款天数。300 件在新店需要多久卖完没有证据；按50/100/150件月销的纯规划情景分别为6/3/2个月，不作为销量预测。'))

stress=p('每格为单位贡献 USD；CVR 下调为相对变化（12%→11.4%→10.8%）。其他输入不变，负数标红。轻度压力定义为 CPC+10% / CVR−5%，是本次经验值，需以自有账户历史校准。')
for c in cs:
    stress+=f'<h3>{c["id"]} {c["name"]}</h3>'+table(['CPC / CVR','12.0%','11.4%','10.8%'],[[['+0%','+10%','+20%'][i]]+[f'<span class="{"bad" if n<0 else "ok"}">{money(n)}</span>' for n in row] for i,row in enumerate(c['matrix'])])+p(f'盈亏广告 CPA 上限 {money(c["preAd"])}；CPC $0.70 时盈亏 CVR {(.7/c["preAd"]*100):.2f}%；CVR12%时盈亏CPC {money(c["preAd"]*.12)}。')
stress+=p(f'A0 基准已经为负，所有九格均负，直接淘汰。A1 九格为正不代表税费或售价风险消失：综合税率从42.6%假设升到62.6%会再减 $0.56/件；运费翻倍再减 $0.95/件；FBA 上涨 $1 再减 $1/件。若这三项同时发生，A1最差格将降到 {money(b["matrix"][2][2]-.56-.95-1)}。按 $25.99 成交时也会失去15%基准目标，应重新测算，不以压力九格替代所有风险。')
sec('selection6','第 5 步 · 6｜广告九宫格压力测试',stress)

win='A1 的切入点是成人靶场与日常练习中的可靠交付，而不是把成熟竞品已有的三管、口袋和可拆结构重新命名。现有六个直接竞品有月度销量估计，关键词也有连续一年的搜索记录，因此这个使用场景确实有人购买，但这些数据只能支持进行有限验证。初次上架先做右手黑色一个 SKU，把预算集中在扣合后有效围度、拉链耐用和配件齐套三个容易被用户检查的价值上。十二条可用低星正文中，缺腰带、拉链故障和腰带偏短各有两条；数量不足以证明大规模机会，却足以指导样品测试。产品需要让买家在页面上直接看到腰带是否随附、成人围度如何测量、左右手如何选择，减少错买和预期落差。与装饰配件相比，这些改良更接近实际使用失败的原因，也更容易在工厂形成操作标准。现有品牌并非没有这些功能，而是样本显示交付和描述仍可能不一致；我们不能断言所有品牌都没有解决，也不能靠单一差评宣称竞品普遍有问题。\n\n经济性是这条路线能否继续的关键。$27.99 已高于已查价格带，因此需要实物展示和小规模付费流量证据，不能先假定买家会为改良付钱。$2.80 的 FOB 目标是由15%贡献目标反推，而非工厂已承诺价格。若供应商能在这一范围提供符合验收的样品，且最终税费与 FBA 没有把到岸拉高，300 件可以成为有边界的验证批次。真正的赢法是让改良有测试记录、让清单与图片一致、让广告获客后的每一件仍留有贡献。对使用场景的置信度为中，对溢价、真实采购成本和新 Listing 转化率的置信度为低，所以建议顺序是先确认开发方向、再询价和打样、最后判断能否下单。'
fail='最可能失效的是售价与转化率组合。A1 用12%广告转化率和$0.70 CPC测算，但这两项并不是用户店铺历史，关键词的1.62%市场购买率也不能转换成该广告 CVR。成熟竞品评分普遍很高，新品在没有评论时可能需要降价或付出更高点击成本。早期信号是点击持续产生而订单不足，或者只有降到$25.99才有成交；这会立即压缩贡献，不能用增加广告预算掩盖。应先限制测试支出，达到足够点击再判断；样本不足时只记为未验证。第二个风险是目标 FOB 不能落地。改良拉链、腰带长度、包装与检查都要成本，若供应商只愿以更高单价供货，反推出来的利润自然不成立。处理方式是取得明确 BOM、贸易条款和合格率承诺，进行两轮样品核对；不能删掉承诺的配件来偷偷满足价格目标。\n\n第三个风险来自非需求环节：长条包装、低起运量、最低报关收费和未知附加税可能使物流预留不足。尤其当前税目只确定到候选分支，没有完整附加税依据，实际采购前必须补齐书面归类和逐项费用。第四个风险是执行与库存。300件只是数量约束，不是已知的一个月销量，若首批形成积压，仓储和现金占用会超过模型的单件预留；交期未知也无法制定真实补货日期。第五个风险是样品通过而量产漏件、错手、错色或拉链装配变差。这需要装箱核对、批次追溯与抽样功能测试，遇到安全性缺陷立即停发并复检。供应商重新打样、复检和延长周期都需要预算，当前$600一次性费用并不保证足够。以上风险使采购结论维持HOLD，只有证据逐项闭合才能释放订单；这不是用评分为缺失数据兜底。'
sec('selection7','第 5 步 · 7｜A1的成立逻辑与失败路径','<h3>成立逻辑｜场景中等置信度，商业化低置信度</h3>'+''.join(p(x) for x in win.split('\n\n'))+'<h3>失败路径｜按优先排查顺序</h3>'+''.join(p(x) for x in fail.split('\n\n')))

sec('selection8','第 5 步 · 8｜排序、做或不做及停止线',table(['验证优先级','方案','情景分数','最差广告格','结论','原因'],[[1,'A1 成人可靠性改良款',f'{b["score5"]:.2f}/5（59/100）',money(b['matrix'][2][2]),'HOLD：可以准备询价打样，暂不下300件','目标经济性可成立，但报价、税费和溢价未验证'],['—','A2 高配减振款',f'{cs[2]["score5"]:.2f}/5（43/100）',money(cs[2]['matrix'][2][2]),'NO-GO：本次不做','售价与高配价值均缺证据，基准贡献低于15%'],['—','A0 同质基础款',f'{cs[0]["score5"]:.2f}/5（40/100）',money(cs[0]['matrix'][2][2]),'NO-GO','基准即负，不能被评分救回']])+p('三案评分在5分制内相差不到1分，且共用同一市场估算，不能当作可靠的精确名次；A1 的优先级来自硬门槛和可检验的改良路线。当前没有无条件 GO 方案，300 件是计划数量而非已授权订单。我们希望改良后减少缺件和功能性退货，检查实际缺件件数、拉链失效件数和退货原因，不承诺改善百分比。')+table(['阶段','指标 / 窗口 / 最小样本','停止或重算标准','动作'],[['下单前','完整报价、税费、箱规、MOQ、交期与样品；至少3件产前样','MOQ>300；有效到岸>$6.02；样品任一安全缺陷；无法验证材料 / 手向','继续询价或修改方案；不释放订单'],['流量验证','累计≥300有效广告点击且≥30广告订单后，或30天仍未达样本','CPC>$0.84或CVR<10.8%：暂停扩量；按实际费用重算','样本不足视为未验证，不强行补货；先排查页面、词与产品'],['经济验证','累计≥30单并覆盖可得退货窗口；30天滚动','按实际费用单位贡献<$2或基准贡献率<15%','停止补货，评估降本/重新定位；贡献为负暂停付费获客'],['质量验证','首批100%清点；售后累计≥30已妥投订单','任一可伤人结构缺陷立即停发；功能缺陷≥2件/30单触发复检','隔离库存、复检并向供应商纠正，未闭环不补货'],['库存验证','库存覆盖>90天（按最近14天有效销量，排除缺货）','不满足贡献或无明确转化信号仍积压','停止补货，按现金回收情景审阅清货；不自动降价亏损']]))

sec('selection9','第 5 步 · 9｜30天验证计划',p('第1天从本次评审确认后开始；未有交期，不把到仓与开售硬塞进30天。若第2周仍未拿到合格样品或书面税费，则后续销售验证顺延，30天结论是未满足启动条件。所有样本、费用、时间与验收阈值都是本次规划经验值，需以自有账户历史校准。')+table(['周次 / 责任角色','里程碑','通过标准','跟踪指标','未通过处理'],[['第1周 · 采购 / 开发','规格询价、BOM、供应商和关税核验','至少2份可追溯同口径报价；MOQ≤300；有贸易条款、交期及书面税目 / 附加税','FOB、到岸、交期、现金条件','不得下单；报价不达目标则反推重新定位'],['第2周 · 开发 / QC','至少3件产前样；包规和关键功能验收','全部关键功能通过；包装后尺寸重量可复核，取得实际FBA费用与货代费用','腰带、拉链、漏件、箱材积、入仓费','改样，更新成本；任一关键不合格不量产'],['第3周 · 运营','准备Listing图、手向 / 腰围 / 配件图、关键词与广告图谱','图与BOM逐项一致；不宣称静音 / 24支 / 全人群；关键词按使用场景拆分','hip quiver / 3 tube hip quiver / archery quiver；右手与左手分清','没有合格库存不启动；不做与实物不符图片'],['第4周 · 运营 / 财务','若具备开售条件，小预算验证；否则汇总缺口','≥300点击且≥30单才做初步经济判断；触达CPC / CVR门槛；低样本仅观察','实际CPC、CVR、单位贡献、退货原因、库存覆盖','不追求30天强行售完；未验证不追加PO']])+p('广告图谱草案：靶场三管款用 hip quiver / 3 tube hip quiver 做核心相关词，再测试 archery quiver。确认无关的 bow-mounted、back quiver、broadhead 等意图后再做否词；不因词表面相近就批量否定，也不把左手需求误导至右手产品。实际竞价和预算需以账户表现调整，本次没有创建广告。')+p('补货触发需在供应商交期确认后计算：补货点 = 最近14天日均有效销量 ×（生产 + 海运 + 清关入仓天数）+ 安全库存。暂按14天需求作安全库存规划；这些天数必须用实际报价/历史补齐。只有贡献与质量通过才允许触发，不能为防断货而跳过经济门槛。'))

assumptions=[['300件','批量与资金','用户确认','高','正式数量不再擅改'],['A0/A1/A2售价20.99/27.99/32.99','利润','A0参考已查低价；A1/A2待测定价','低','获取转化与成交价格证据'],['FOB2.50/2.80/5.50','采购成本','A1由15%目标反推，其余预算情景','低','书面BOM报价，确认含包装'],['非货值物流2.00/2.00/2.30','到岸','含运费保险、报关港杂、入仓；未报价','低','箱规与逐项货代报价，防重复计费'],['42.6% / 62.6%综合税率','压力情景','17.6%候选基础税 + 假设25 / 再20个百分点','低','书面归类及入境日现行chapter99清单'],['佣金15%','费用','规划费率，不是实时新SKU试算','低','按最终SKU品类与官方费率核对'],['FBA6.37/6.37/6.75','费用','第三方竞品估算代理，费表版本未知','低','最终包规官方估算'],['仓储0.25 / 退货损失售价4%','费用','规划经验值，需以自有账户历史校准','低','按实际库存周期和售后财务调整'],['CPC0.70 / CVR12%','获客','前者关键词建议竞价参考，后者纯假设','低','有效点击与订单实测；不复用1.62%市场购买率'],['贡献目标15% / 最差格≥0','决策','内部经验门槛，需以自有账户历史校准','低','根据资金与经营目标确认'],['3件样 / 2份报价 / QC数值','打样','拟定验收设计，经验值，需以自有账户历史校准','低','按样品与供应能力修订并签版'],['一次性600 / 现金机动10%','资金','未报价预算，不含未知模具认证','低','实际样品、QC和素材报价'],['300点击 / 30单 / 30天 / 14天 / 90天','验证与补货','本次观察阈值与库存策略，非统计显著性保证','低','结合实际波动与交期校准']]
sec('selection10','第 5 步 · 10｜假设登记与无法得出的结论',table(['数字 / 参数','用途','依据','置信度','补齐方式'],assumptions)+p('完全缺失的数据层：真实供应商报价、实际 MOQ 与交期 → 无法批准采购；最终物料和样品 → 无法确认规格与缺陷率；现行完整附加税 / 海关归类 → 无法确定实际税负；新SKU实际FBA / 入仓费 → 无法确认费用；自有产品 CPC / CVR / 退货财务与现金周期 → 无法给出可靠净利润或回款周期；全市场销量和独立买家数 → 无法声称 TAM 或市场份额；专利与商标排查 → 无法给出无侵权结论。')+p('技能镜像中关于“竞品数据不在MCP内”的旧说明与当前可用 market_* 工具不一致。本次真实调用了多宝鱼第三方市场接口，故标为多宝鱼转接卖家精灵 / Sorftime，未标作 Amazon 官方卖家账户数据。关税技能配套2024脚本未使用。计算可从 calculations.json 与本目录 build_report.py 重现。'))

specs=[['定位 / 人群','成人靶场练习；右手黑色首款','确认手向后再报价；不默认为儿童、左手或狩猎款'],['尺寸 / 重量目标','袋长约430mm；3支可拆管约420mm；成品含腰带≤500g','提案目标，需样品定版；尺寸允差±5mm，重量不当作实测'],['管体与容量','3管；先验证12支靶箭，单管4支','管口无锐边，端部保护；用明确箭径/箭长测试后再写容量，不宣传任意箭型'],['面料与结构','600D聚酯牛津布候选；加强底、受力点回针','供应商须书面确认纤维成分、涂层、厚度；不可混写Nylon/Polyester'],['腰带','38mm宽，扣合有效围度70–125cm拟定','页面标扣合后实际范围；保留≥50mm安全余带；样品核验后才能宣称适配'],['收纳','主/辅拉链口袋 + T尺位 + D环','口袋不压缩三管；附件图只展示实际随附物'],['BOM','箭袋1、管3、腰带1、说明书1；不含箭 / 旗帜章','装箱照片与包装清单逐项对应，禁止示意配件造成误导'],['减振','仅试验可拆垫片，不进入基础BOM成本承诺','须不阻挡取箭、不刮箭羽；无测试不宣传静音'],['价格 / 成本目标','$27.99待验证；FOB≤$2.80目标；到岸≤$6.02门槛','均在前述费用与42.6%假设税率成立时；不是供应商报价'],['包装目标','≤445×160×75mm，毛重≤600g；防压保护管口','不是已验证FBA档位；量产前复核箱规、费用、标签与Made in China']]
qc=[['齐套 / 手向 / 颜色','首批300件100%目检计数，逐件留批次记录','无缺腰带、缺管、错色、错手；不合格返工复检'],['腰带扣合','3样分别在70/100/125cm围度验证，挂1kg载荷30min','不自行解扣；滑移≤10mm；仍保留≥50mm余带'],['拉链可靠性','3样，每个拉链500次全行程循环，再做20N拉力10s','无脱头、开链、咬布；止口无脱落；20N为本次验收提案'],['缝线 / D环 / 腰带连接','3样，每个承载连接100N静拉10s','无缝线断裂、连接脱开或可接触锐边；按安全关键项处理'],['插拔与留箭','3样，用12支28in、外径6–8mm靶箭，取放100轮；穿戴步行10min、弯腰45°10次','不掉管、不自行掉箭、不刮伤手；不声称可倒置或持锐利猎头'],['跌落 / 防压','3个完整零售包装，1m高度六面各跌1次，拆包后功能复测','管体无裂纹或锐边，拉链与带扣可用；这是内部筛查，不冒称ISTA认证'],['量产功能抽检','300件中随机32件功能检查；全检齐套另执行','关键安全缺陷0；主要功能不良0，出现则整批隔离复检；非正式AQL抽样声明'],['材质 / 标签 / 照片','样品签版核对BOM、纤维成分、原产地与使用警示','图文与实物一致；保留成分证明、样品与批次追溯；美国合规要求另确认']]
sec('brief','开品文档评审稿｜卖点、规格、改良与验收',p('<b>版本状态：待第5步确认，尚非量产放行书。</b>建议卖点为“腰带随附且有效围度清楚”“拉链止口与关键连接有验收记录”“三管可拆、靶场配件有序收纳”。其中前三管、多口袋属类目基础价值，不能说独家；可靠性和围度表述须经测试才可对外发布。')+table(['项目','拟定规格 / 目标','边界与验证'],specs)+table(['验收项','样本 / 方法（提案）','通过标准'],qc)+p('以上测试数值为内部工程提案与经验值，需以自有账户历史校准，并由供应商与QC签版，不是引用行业认证标准。若最终产品面向儿童，需另行评估适用法规与测试；本方案只按成人用品规划。生产前还须完成品牌名、外观与专利初筛，未经调查不声称无侵权。'))

css='''*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#f4ede0;color:#2a2419;font:15px/1.8 -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}main{max-width:1180px;margin:auto;padding:64px 24px}header,section,.verdict,nav{background:#fffdf9;border:1px solid #e1d8c4;padding:26px;margin-bottom:18px}h1{font-size:29px;margin:6px 0}h2{font-size:21px;line-height:1.5;color:#8c3f1c;margin:0 0 18px}h3{font-size:17px;margin:23px 0 12px}p{margin:13px 0}a{color:#8c3f1c}small,.muted{color:#736e60}.dby-watermark{position:fixed;top:16px;right:20px;background:#2a2419;color:#f4ede0;padding:7px 14px;border-radius:999px;font-size:13px;font-weight:700;z-index:999}.verdict{border-left:7px solid #8c3f1c;background:#fbf6ec}.label{font-size:12px;letter-spacing:2px;color:#8c3f1c}.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0}.kpi{padding:16px;background:#ede4d2}.kpi b{display:block;font-size:24px}.scroll{overflow:auto}table{width:100%;border-collapse:collapse;font-size:13px;line-height:1.65;margin:15px 0}th{background:#ede4d2;text-align:left;white-space:nowrap}th,td{padding:11px;border:1px solid #e1d8c4;vertical-align:top}td{min-width:82px}nav{display:flex;gap:16px;flex-wrap:wrap;font-size:14px}summary{cursor:pointer;color:#8c3f1c;font-weight:700}details td:nth-child(6){min-width:340px}.bad{color:#96382e;font-weight:700}.ok{color:#3f6b4f;font-weight:700}footer{font-size:12px;color:#736e60;padding:20px}section{scroll-margin-top:60px}@media(max-width:720px){main{padding:65px 12px 30px}header,section,.verdict{padding:18px}.kpis{grid-template-columns:repeat(2,1fr)}h1{font-size:24px}}@media print{body{background:white}.dby-watermark{position:fixed}main{max-width:none;padding:20px}section{break-inside:auto}nav{display:none}details{display:block}.scroll{overflow:visible}table{font-size:10px}th,td{padding:5px}}'''
head='<header><span class="label">ARROW BAG QUIVER / US / 300 件试单</span><h1>三管腰挂箭袋 · 开品决策评审稿</h1><p class="muted">2026-10-27 · USD · 第2—5步研究与拟开发规格 · 未释放采购订单</p></header>'
verdict='<div class="verdict"><h2>建议验证 A1，300 件采购暂缓</h2><p>配件齐套、腰带有效围度与拉链可靠性值得打样验证。拟售价 $27.99、FOB 目标 $2.80 的情景下，单位贡献约 $4.23；真实采购价、完整税率及新品转化率未确定，当前结论是 HOLD。</p></div>'
kpis='<div class="kpis">'+''.join(f'<div class="kpi"><span>{label}</span><b>{v}</b><small>{note}</small></div>' for label,v,note in [('月搜索估算','2,859','hip quiver · 2026.09'),('直接竞品样本','916 件','六个父体的月销量估算'),('低星有效正文','12 条','小样本，全部低置信度'),('用户计划','300 件','尚未下单')])+'</div>'
foot='<footer>来源：🐟 多宝鱼AI · skills：amazon-niche-finder、amazon-product-research、amazon-review-analyzer、tariff-calculator-amazon、amazon-product-selection、duobaoyu-report-spec。实际数据源：多宝鱼 MCP 转接卖家精灵、Sorftime；USITC；CBP历史裁定镜像 CustomsMobile；用户选择与数量约束。市场数据拉取2026-10-27，关键词月度2026.09、趋势截至2026-10-17，评论日期各列UTC；生成2026-10-27。27次市场数据请求不等同于27 credits。内部评审稿，所有未验证假设均需补证。</footer>'
def doc(title,parts,navlinks=True):
    nav='<nav>'+''.join(f'<a href="#{i}">{t}</a>' for i,t in [('market','市场'),('reviews','差评'),('tariff','关税成本'),('selection2','决策'),('selection5','利润'),('selection8','停止线'),('brief','规格与验收')])+'</nav>' if navlinks else ''
    return '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><style>'+css+'</style></head><body><div class="dby-watermark">🐟 多宝鱼AI</div><main>'+head+verdict+kpis+nav+''.join(parts)+foot+'</main></body></html>'
out=ROOT/'开品决策评审稿-三管腰挂箭袋-20261027.html'
out.write_text(doc('三管腰挂箭袋 · 开品决策评审稿',[s for _,_,s in sections]))
for filename,ids in [('市场调研-三管腰挂箭袋-20261027.html',['market']),('评论分析-三管腰挂箭袋-20261027.html',['reviews']),('关税与到岸成本-三管腰挂箭袋-20261027.html',['tariff']),('选品决策-三管腰挂箭袋-20261027.html',[f'selection{i}' for i in range(1,11)]+['brief'])]:
    (ROOT/filename).write_text(doc(filename[:-5],[s for i,_,s in sections if i in ids],False))
assert abs(b['net']-4.225766666666667)<1e-8
assert len(reviewrows)==15
assert sum(c[2] for c in comps)==916
assert sum(1 for r in reviewrows if r[-1].startswith('纳入'))==12
assert all(n>0 for row in b['matrix'] for n in row)
assert all(n<0 for row in cs[0]['matrix'] for n in row)
assert sum(weights)==100
assert not re.search(r'<(?:script|link|img)\b',out.read_text())
assert '{{' not in out.read_text()
print(json.dumps({'report':str(out),'a1Net':b['net'],'worst':b['matrix'][2][2],'landed':b['landed'],'landedCap':cap,'cashReserve':budget,'lowStarBodyN':12,'marketCallsTotal':27},ensure_ascii=False,indent=2))
