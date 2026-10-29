import { ASSUMPTIONS, evaluate, PLANS, type PlanInputs } from "./calc";
import { COMPETITORS, LEDGER, NICHES, REVIEWS } from "./ledger";
import type { SelectionInput } from "./types";

function n(value: number, digits = 4) {
  return value.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
}

function args(value: Record<string, unknown>) {
  return "`" + JSON.stringify(value) + "`";
}

export function renderFlowTree(input: SelectionInput, plans: ReturnType<typeof evaluate>[]) {
  const a1 = plans.find((plan) => plan.id === "A1")!;
  const included = REVIEWS.filter((row) => row.included);
  const lines: string[] = [];
  lines.push(`# ${input.keyword} 全流程树、因果关系与数据血缘`);
  lines.push("");
  lines.push("生成于学习沙盒；fixture 回放金样账本，新增付费请求 0 次。`inferred` 表示公开 skill 或金样行为推断，不是粒粒lili私有配置。");
  lines.push("");
  lines.push("## 01｜全流程树：包含分支、失败、暂停和后续归档");
  lines.push("");
  lines.push("```");
  lines.push(`ROOT：把 ${input.keyword} 方向推进到可评审的开品文档`);
  lines.push("│");
  lines.push("├─ 0. 约定边界与付费预算");
  lines.push("│  ├─ 用户要求：五步；第 1 步和第 5 步后暂停");
  lines.push("│  ├─ 加载 amazon-niche-finder / product-research / review-analyzer / tariff-calculator-amazon");
  lines.push("│  ├─ amazon-product-selection：`inferred` 用 private-label + profit-analyzer + 金样硬门槛，不是私有 skill 原文");
  lines.push("│  └─ 站点假定 US；第 1 步上限 10 次市场请求");
  lines.push("├─ 1. amazon-niche-finder：拆成 5 个细分");
  lines.push("│  ├─ M03 sort_by=units 失败 → 改 total_units");
  lines.push("│  ├─ 多词结果污染 → 不直接加销量");
  lines.push("│  └─ 暂停门 1：选择 " + (input.nicheChoice ?? "（未选，停在这里）"));
  for (const niche of NICHES) lines.push(`│     ├─ ${niche.id} ${niche.name} → ${niche.stance}`);
  lines.push("├─ 2. amazon-product-research：只深入所选细分");
  lines.push("├─ 3. amazon-review-analyzer：采集与编码分开；样本 < 20 → 低置信度");
  lines.push("├─ 4. tariff-calculator-amazon：旧税率不直接跑；17.6/42.6/62.6 只是情景");
  lines.push("├─ 5. 选品比较 A0/A1/A2：评分不能压过缺报价 → HOLD");
  lines.push("├─ 6. 文档工程：MCP 形状的账本 → evidence JSON → 本地计算 → HTML");
  lines.push("└─ 7. 本沙盒不把事后归档算进 27 次市场请求");
  lines.push("```");
  lines.push("");
  lines.push("## 02｜谁在做什么：用户、AI、skill、MCP、第三方与本地文件");
  lines.push("");
  lines.push("| 角色/层 | 真正负责的动作 | 不应混淆的事 |");
  lines.push("| --- | --- | --- |");
  lines.push("| 用户 | 给出方向、在门 1 选细分、确认试单数量 | 试单数量不是采购放行 |");
  lines.push("| 学习沙盒执行器 | 按模板回放账本、算数、写 md/json/html | 不是粒粒lili远程会话 |");
  lines.push("| Skill | 公开 nexscope 原文规定拆法；选品步标 inferred | 加载 skill 不等于已经取数 |");
  lines.push("| 粒粒lili MCP 形状 | market_* 名称和参数对齐金样 §04 | 本回合 fixture，没有付费调用 |");
  lines.push("| 卖家精灵 / Sorftime | 金样说明的上游 | 沙盒没有密钥，也没有上游 HTTP 日志 |");
  lines.push("| 本地计算 | calculations.json 与 HTML | 不产生新的市场事实 |");
  lines.push("");
  lines.push("## 03｜每个 skill 在何处介入、输入输出及限制");
  lines.push("");
  lines.push("| Skill | 阶段 | 动作 | 输入 | 输出 | 边界 |");
  lines.push("| --- | --- | --- | --- | --- | --- |");
  lines.push("| amazon-niche-finder | 第 1 步 | 把宽方向分成可比较细分 | 关键词、节点、趋势 | 5 个候选 | 第三方估计，不做完整 TAM |");
  lines.push("| amazon-product-research | 第 2 步 | 深入所选细分 | 关键词研究、详情、关联竞品 | 样本价格与月销 | 不是市场普查 |");
  lines.push("| amazon-review-analyzer | 第 3 步 | 筛选、分母、主题、优先级 | 星级、日期、Vine 字段 | 痛点清单 | 人工编码，不是自动 NLP |");
  lines.push("| tariff-calculator-amazon | 第 4 步 | 归类情景与到岸拆项 | 材料假设、公开税目 | 三种税率情景 | 不用 skill 内过时税率脚本 |");
  lines.push("| amazon-product-selection | 第 5 步 | 预筛、六维、硬门槛 | 证据 + 成本假设 + 数量 | HOLD / NO-GO | `inferred`：公开库无同名 skill |");
  lines.push("| lili-report-spec | HTML | 自包含、来源、水印、口径 | 已整理章节 | 静态单文件 | 不负责取数 |");
  lines.push("");
  lines.push("## 04｜每一次市场请求：为何调用、具体发了什么、如何使用");
  lines.push("");
  lines.push(`本次回放 ${LEDGER.length} 次市场请求形状。技能查询和本地读写不计入。未核验真实计费。`);
  lines.push("");
  lines.push("| 编号 | 时刻 | 接口 | 原始参数 | 目的 | 是否进入结论 |");
  lines.push("| --- | --- | --- | --- | --- | --- |");
  for (const call of LEDGER) {
    lines.push(`| ${call.id} | ${call.at} | ${call.tool} | ${args(call.args).replaceAll("\n", "<br>")} | ${call.purpose} | ${call.usedForConclusion ? "是" : "否"} |`);
  }
  lines.push("");
  lines.push("## 05｜因果关系表：证据怎样导致动作和结论");
  lines.push("");
  lines.push("| 触发 | 证据 | 处理/规则 | 产物 | 为什么改变下一步 | 不能推出什么 |");
  lines.push("| --- | --- | --- | --- | --- | --- |");
  lines.push("| 方向太宽 | 多词查询混入无关商品 | 节点限定后再分组 | 五个细分 | 不把其他类目销量加进来 | 第一页不是全市场 |");
  lines.push("| 门 1 选择 | 用户明示细分 | 后续预算只打这一支 | 6 个竞品与评论 | 其余方向不继续花钱深研 | 不是证明其他方向不可做 |");
  lines.push("| M03 失败 | sort_by=units | 改 total_units 并保留失败记录 | 修正后的查询 | 失败请求不进入销量结论 | 未知是否扣费 |");
  lines.push("| 评论重复故障 | 正文主题 | 排除 Vine 混款和无正文 | 有效正文分母 | 优先齐套/拉链/围度 | 小样本不是故障率 |");
  lines.push("| 1688 报价为 0 | price/MOQ 缺失 | 记为缺数 | 不能确认采购价 | 用反推目标而不是真实利润 | 供应商未必做得到目标价 |");
  lines.push("| 旧税率 | skill 快照过时 | 只保留情景 | 17.6/42.6/62.6 | 下单前必须补证 | 不是已核准税负 |");
  lines.push("| 九格为正但缺证 | A1 最差格仍为正 | 硬门槛高于评分 | HOLD | 可以准备验证，不能下单 | 分数不是 GO |");
  lines.push("");
  lines.push("## 06｜评论采集、排除、编码、排名：完整数据链");
  lines.push("");
  lines.push("低星请求返回 15 条 → 排除 2 条 Vine 疑似混款 → 排除 1 条无正文 → 有效正文 12。高星另取 40 条，不计算总体满意率。全部标低置信度。");
  lines.push("");
  lines.push("| 证据 ID | 星级 / 日期 | 摘录 | 纳入与主题 |");
  lines.push("| --- | --- | --- | --- |");
  for (const row of REVIEWS) {
    lines.push(`| ${row.id} | ${row.stars}★ / ${row.date} | ${row.excerpt} | ${row.reason}${row.themes.length ? "：" + row.themes.join("、") : ""} |`);
  }
  lines.push("");
  lines.push(`有效正文 ${included.length} 条。缺腰带、拉链、腰带围度、噪声在样本中重复出现；旗帜章是图文预期，不扩成普遍质量缺陷。`);
  lines.push("");
  lines.push("## 07｜税费为什么只能算情景，不能当成已核准成本");
  lines.push("");
  lines.push("tariff-calculator-amazon 的过时税率脚本不直接运行（`inferred`：按金样行为，而不是执行 skill 自带 2024 快照）。候选税目 " + ASSUMPTIONS.hts + " 基础 " + (ASSUMPTIONS.taxLow * 100).toFixed(1) + "%。附加税未核实。");
  lines.push("");
  lines.push("| 情景 | 计算 | 作用 | 不能怎么用 |");
  lines.push("| --- | --- | --- | --- |");
  lines.push("| 17.6% | 只有候选基础税 | 下界 | 不能认定进口只交这项 |");
  lines.push("| 42.6% | 17.6% + 假设 25 个百分点 | 主预算压力 | 不是声明当前 301 必为 25% |");
  lines.push("| 62.6% | 再加假设 20 个百分点 | 压力测试 | 不是现行附加税确认 |");
  lines.push("");
  lines.push("三次 1688 查询无有效价格、MOQ 或交期。运保报关入仓合计 $" + n(ASSUMPTIONS.freight + ASSUMPTIONS.insurance + ASSUMPTIONS.customs + ASSUMPTIONS.inbound, 2) + "/件是预算预留，不是货代报价。");
  lines.push("");
  lines.push("## 08｜每一个成本数字的来源、计算与因果方向");
  lines.push("");
  lines.push("方向是反推：希望留下贡献，所以提出 FOB 目标；不是先拿到真实供应价再宣布利润。A1 主情景：");
  lines.push("");
  lines.push("```");
  lines.push(`关税 = ${n(a1.duty)}`);
  lines.push(`到岸 = ${n(a1.landed)}`);
  lines.push(`单位销售贡献 = ${n(a1.unit)}`);
  lines.push(`贡献率 ≈ ${(a1.margin * 100).toFixed(2)}%`);
  lines.push(`最差广告格 = ${n(a1.worst)}`);
  lines.push(`FOB 上限 ≈ ${n(a1.fobCap)}`);
  lines.push(`300 件规划现金 ≈ ${n(a1.cash, 2)}`);
  lines.push("```");
  lines.push("");
  lines.push("| 变化 | 对结果的影响 | 结论 |");
  lines.push("| --- | --- | --- |");
  lines.push("| 售价只能停在样本高位 | 贡献率掉到目标以下 | 不能照旧宣称 15% |");
  lines.push("| 税率从 42.6% 到 62.6% | 每件再增加 FOB 的 20% | 九格要重算 |");
  lines.push("| 运费翻倍或 FBA 加 1 美元 | 贡献直接减少 | 包规必须实测 |");
  lines.push("");
  lines.push("## 09｜评分为什么没有直接变成“做”");
  lines.push("");
  lines.push("六维权重：需求 25%、单位经济 25%、竞争 20%、差异 15%、物流 10%、风险 5%。`inferred` 权重来自金样公开说明，不是粒粒lili私有打分表。");
  lines.push("");
  lines.push("| 方案 | 原始分 | 加权分 | 单位贡献 | 最差广告格 | 结果 |");
  lines.push("| --- | --- | --- | --- | --- | --- |");
  for (const plan of plans) {
    lines.push(`| ${plan.id} ${plan.name} | [${plan.raw.join(", ")}] | ${plan.weighted5.toFixed(2)}/5 → ${plan.score100}/100 | $${plan.unit.toFixed(2)} | $${plan.worst.toFixed(2)} | ${plan.verdict} |`);
  }
  lines.push("");
  lines.push("```");
  lines.push("有市场/痛点信号？");
  lines.push("└─ 是 → 情景贡献能否成立？");
  lines.push("         └─ 是 → 报价、税费、样品、转化是否验证？");
  lines.push("                  └─ 否 → HOLD（本次停在这里）");
  lines.push("```");
  lines.push("");
  lines.push("## 10｜痛点怎样变成卖点、规格、BOM 与验收");
  lines.push("");
  lines.push("| 信号 | 设计动作 | 拟规格 | 验收 | 状态 |");
  lines.push("| --- | --- | --- | --- | --- |");
  lines.push("| 缺腰带 | 齐套管理 | 袋 1 + 管 3 + 带 1 + 说明 1，不含箭与旗帜章 | 首批 100% 清点 | 提案，未执行 |");
  lines.push("| 围度不足 | 实测扣合范围 | 70–125cm 提案 | 3 样、1kg、30min，滑移 ≤ 10mm | 待样品 |");
  lines.push("| 拉链失效 | 止口与循环 | 主辅拉链口袋 | 500 次循环，20N 不脱头 | 拟测试，不是认证 |");
  lines.push("| 掉箭 | 承载验证 | 12 支 28in 靶箭 | 取放 100 轮、步行、弯腰 | 不能宣传任意箭型 |");
  lines.push("| 破损个例 | 包装复测 | 包规与毛重上限提案 | 1m 六面跌落 | 不冒称 ISTA |");
  lines.push("| 管噪声 | 可拆垫片试验 | 不进基础 BOM | 不挡箭再评估 | 不承诺静音 |");
  lines.push("");
  lines.push("## 11｜所有 JSON 和代码究竟从哪里来：逐文件数据流");
  lines.push("");
  lines.push("| 文件 | 创建者 | 内容 | 事实属性 |");
  lines.push("| --- | --- | --- | --- |");
  lines.push("| evidence.json | 本执行器 | 账本、细分、竞品、评论 | fixture 回放，不是新的 MCP 响应 |");
  lines.push("| calculations.json | 本执行器纯计算 | 关税、到岸、九格、分数、现金 | 假设的算术结果 |");
  lines.push("| review.html | 本执行器 | 自包含评审稿 | 水印标明沙盒；不是量产放行书 |");
  lines.push("| flow-tree.md | 本执行器 | 01–16 章骨架 | 正文相对金样压缩 |");
  lines.push("");
  lines.push("账本 JSON → calculations.json → HTML。本地计算不向 MCP 再付费。");
  lines.push("");
  lines.push("## 12｜HTML 生成的每一层：从 JSON 字段到页面");
  lines.push("");
  lines.push("| 层 | 动作 | 输出 |");
  lines.push("| --- | --- | --- |");
  lines.push("| 账本 | 写入 27 次工具名和参数 | evidence.json |");
  lines.push("| 转义 | HTML escape | 评论文字不当标签 |");
  lines.push("| 计算 | A0/A1/A2 循环 | calculations.json |");
  lines.push("| 外壳 | 内联 CSS、水印、来源 | 无 CDN、无远程字体 |");
  lines.push("| 结论条 | 硬门槛后的 HOLD | 首屏可见 |");
  lines.push("");
  lines.push("## 13｜失败、修正、验证和明确没有完成的事");
  lines.push("");
  lines.push("| 问题 | 实际处理 | 缺口 |");
  lines.push("| --- | --- | --- |");
  lines.push("| sort_by=units | 保留失败并改 total_units | 不产生销量结论 |");
  lines.push("| 多词污染 | 不把那些请求加进规模 | 节点第一页仍不完整 |");
  lines.push("| 采购价为 0 | 记缺失 | 不能审批采购 |");
  lines.push("| 真实 MCP | 本回合未调用 | 账本是金样回放 |");
  lines.push("");
  lines.push("## 14｜后续问答增加了哪些证据：不能反写成原来已知");
  lines.push("");
  lines.push("本沙盒运行没有新增付费请求，也没有把后来查到的卖家精灵分页上限写回历史参数。历史参数仍按金样记录的 size=100 / size=20 保留。");
  lines.push("");
  lines.push("## 15｜未完成事项和下一阶段的条件树");
  lines.push("");
  lines.push("```");
  lines.push("A1 可优先验证；采购 HOLD");
  lines.push("├─ 至少 2 份同 BOM 报价，且到岸仍落在本次假设上限内");
  lines.push("├─ 书面归类和入境日附加税");
  lines.push("├─ 至少 3 件样品通过齐套、围度、拉链、掉箭、跌落");
  lines.push("└─ 用户另行批准订单和资金之后，才可能离开 HOLD");
  lines.push("```");
  lines.push("");
  lines.push("## 16｜逐项复查入口与离线复现");
  lines.push("");
  lines.push("| 文件 | 用途 |");
  lines.push("| --- | --- |");
  lines.push("| evidence.json | 27 次请求形状、细分、竞品、评论链 |");
  lines.push("| calculations.json | A0/A1/A2 精确计算 |");
  lines.push("| review.html | 自包含评审稿 |");
  lines.push("| flow-tree.md | 本文件 |");
  lines.push("");
  lines.push("```bash");
  lines.push("npm run workflow:selection -- --keyword \"arrow bag quiver\"");
  lines.push("```");
  lines.push("");
  lines.push("重跑不会刷新市场数据，也不会调用付费粒粒lili API。");
  return lines.join("\n");
}

function esc(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function renderHtml(input: SelectionInput, plans: ReturnType<typeof evaluate>[]) {
  const a1 = plans.find((plan) => plan.id === "A1")!;
  const rows = plans
    .map(
      (plan) =>
        `<tr><td>${plan.id} ${esc(plan.name)}</td><td>${plan.score100}</td><td>$${plan.unit.toFixed(2)}</td><td>$${plan.worst.toFixed(2)}</td><td>${plan.verdict}</td></tr>`,
    )
    .join("");
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>开品决策评审稿 · ${esc(input.keyword)}</title>
<style>
body{margin:0;background:#f6f3ef;color:#1f1a17;font:16px/1.6 "Noto Sans SC",sans-serif}
main{max-width:880px;margin:24px auto;background:#fff;border:1px solid #efe8e1;border-radius:16px;padding:28px}
h1{font-size:28px;margin:0 0 8px} h2{font-size:18px;margin:28px 0 8px}
.hold{display:inline-block;background:#fff4ee;color:#9a3412;border-radius:999px;padding:4px 10px;font-weight:700}
table{width:100%;border-collapse:collapse;font-size:14px} td,th{border-top:1px solid #efe8e1;text-align:left;padding:8px 6px}
.wm{position:fixed;inset:0;display:grid;place-items:center;font-size:42px;color:rgba(232,106,44,.08);transform:rotate(-18deg);pointer-events:none}
footer{margin-top:24px;color:#8d847b;font-size:12px}
</style></head><body><div class="wm">粒粒lili · fixture</div><main>
<p>来源：金样账本回放 + 本地计算。不是报价，不是放行。</p>
<h1>${esc(input.keyword)} · 三管腰挂箭袋</h1>
<p><span class="hold">${a1.verdict}</span> 评分 ${a1.score100}/100 不能覆盖缺报价、未核实税费和未测转化。</p>
<h2>市场样本</h2>
<p>六个父体月销合计 ${COMPETITORS.reduce((sum, item) => sum + item.unitsMonth, 0)} 件（第三方估计）。关键词研究回放：搜索 2859、购买估计 46、商品 211。</p>
<h2>方案</h2>
<table><thead><tr><th>方案</th><th>分数</th><th>单位贡献</th><th>最差格</th><th>结论</th></tr></thead><tbody>${rows}</tbody></table>
<h2>口径</h2>
<p>税率情景 17.6% / 42.6% / 62.6%。主计算用 42.6%，标为假设。评论有效正文 12 条，低置信度，频次不是故障率。</p>
<footer>lili-report-spec 口径：单文件、内联 CSS、无远程资源。水印表示学习沙盒。inferred：选品 skill 由 private-label 与 profit-analyzer 加金样硬门槛合成。</footer>
</main></body></html>`;
}

export function planSet(quantity: number) {
  return PLANS.map((plan: PlanInputs) => evaluate(plan, quantity));
}
