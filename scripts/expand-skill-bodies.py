#!/usr/bin/env python3
"""Expand all 116 lili skills into full-blood SKILL.md bodies.

Sources (priority):
1. /workspace/duobaoyu-replay/*.SKILL.md (7 files) — brand-replaced
2. /workspace/skill-packs/amazon-skills/<slug>/SKILL.md (nexscope, ~52) — brand-replaced
3. Synthesize from zhSum/steps + tool-docs + category playbooks

Output: data/skill-bodies/<slug>.md  (one file per skill, used by seed + codex-bundle)
"""
from __future__ import annotations

import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
OUT = DATA / "skill-bodies"
REPLAY = Path("/workspace/duobaoyu-replay")
NEX = Path("/workspace/skill-packs/amazon-skills")
ECOM = Path("/workspace/skill-packs/ecommerce-skills")

ALIASES = {
    "amazon-profit-analysis": "amazon-profit-analyzer",
    "turbot-private-label": "amazon-private-label",
    "turbot-brand-registry": "amazon-brand-registry",
    "turbot-coupon-strategy": "amazon-coupon-strategy",
    "turbot-brand-promotions": "amazon-brand-tailored-promotions",
    "turbot-bundling": "amazon-product-bundling",
    "turbot-product-compliance": "amazon-product-compliance",
    "turbot-return-reduction": "amazon-return-reduction",
    "turbot-review-compliance": "amazon-review-strategy",
    "turbot-seasonal-planning": "amazon-seasonal-planning",
    "turbot-storefront": "amazon-storefront-design",
    "turbot-subscribe-save": "amazon-subscribe-save",
    "turbot-variation-strategy": "amazon-variation-strategy",
    "turbot-vine": "amazon-vine-program",
    "turbot-wholesale-sourcing": "amazon-wholesale-sourcing",
    "turbot-inventory-restock": "amazon-inventory-management",
    "turbot-listing-localization": "amazon-international-listings",
    "turbot-account-health-appeal": "amazon-suspension-appeal",
    "turbot-ad-scheduling": "amazon-dayparting-strategy",
    "weekday-dayparting-review": "amazon-dayparting-strategy",
    "review-solicitation": "amazon-review-strategy",
    "amazon-product-selection": "amazon-product-research",  # close cousin; still synthesize mostly
    "product-selection": "amazon-product-research",
    "negative-keyword-strategy": "amazon-negative-keywords",
    "buybox-competition-watch": "amazon-buy-box",
}

# Soft ecom templates for a few ops/promo gaps
ECOM_ALIASES = {
    "reimbursement-recovery": "ecommerce-returns-management",
    "promotions-review": "ecommerce-growth-strategy",
    "clearance-aging-decision": "dynamic-pricing-ecommerce",
    "low-conversion-diagnosis": "conversion-rate-optimization",
    "low-ctr-diagnosis": "conversion-rate-optimization",
    "traffic-conversion-triage": "conversion-rate-optimization",
}

BRAND_SUBS = [
    (r"(?i)nexscope-ai/Amazon-Skills", "lili/skills"),
    (r"(?i)nexscope-ai/eCommerce-Skills", "lili/skills"),
    (r"(?i)https?://www\.nexscope\.ai[^\s)\"]*", "https://lili.local"),
    (r"(?i)\[Nexscope\]\([^)]*\)", "粒粒lili"),
    (r"(?i)\bNexscope\b", "粒粒lili"),
    (r"(?i)\bnexscope\b", "lili"),
    (r"多宝鱼", "粒粒"),
    (r"(?i)\bduobaoyu\b", "lili"),
    (r"npx skills add[^\n]+", "通过粒粒 MCP：`meta_load_skill` 加载本技能；工具经 MCP server `lili` 调用。"),
]


def brand_replace(text: str) -> str:
    for pat, rep in BRAND_SUBS:
        text = re.sub(pat, rep, text)
    return text


def strip_installation(md: str) -> str:
    # Remove ## Installation ... until next ##
    return re.sub(
        r"\n## Installation\n.*?(?=\n## )",
        "\n",
        md,
        flags=re.S,
    )


def strip_nexscope_footer(md: str) -> str:
    # Drop trailing "Built by ..." / upsell paragraphs often at end
    md = re.sub(r"\n\*Built by .*", "\n", md, flags=re.S)
    md = re.sub(r'\n\*"I\'ve identified.*?\*\n', "\n", md, flags=re.S)
    md = re.sub(r"\n\*\"I've identified.*?\*\n", "\n", md, flags=re.S)
    return md


def rewrite_frontmatter(md: str, slug: str, zh: str, en: str, zh_sum: str, en_sum: str) -> str:
    desc = f"{zh_sum} {en_sum} Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili.".strip()
    desc = desc.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")
    body = md
    if body.startswith("---"):
        end = body.find("\n---", 3)
        if end != -1:
            body = body[end + 4 :].lstrip("\n")
    # Drop leading H1 if present; we'll rewrite
    body = re.sub(r"^# .+\n+", "", body)
    fm = f"""---
name: {slug}
description: "{desc}"
metadata: {{"lili":{{"category":"amazon","brand":"粒粒"}}}}
---

# {zh} / {en}
"""
    return fm + "\n" + body.lstrip()


def inject_lili_sections(md: str, skill: dict, tool_docs: dict) -> str:
    tools = skill.get("tools") or []
    steps_zh = skill.get("stepsZh") or []
    steps_en = skill.get("stepsEn") or []
    zh_sum = skill.get("zhSum") or ""

    tool_lines = []
    for t in tools:
        blurb = tool_docs.get(t) or ""
        if blurb:
            tool_lines.append(f"- `{t}` — {blurb}")
        else:
            tool_lines.append(f"- `{t}`")
    if not tool_lines:
        tool_lines = ["- （无关联工具；可用 `meta_search_skills` 查找相邻技能）"]

    steps_block = "\n".join(f"{i+1}. {s}" for i, s in enumerate(steps_zh)) or "1. （无步骤）"
    steps_en_block = "\n".join(f"{i+1}. {s}" for i, s in enumerate(steps_en))

    inject = f"""
## 粒粒操作要点

{zh_sum}

在线时优先用 MCP `meta_load_skill`（slug=`{skill['slug']}`）拉取最新版；下列步骤是本店执行顺序。

## 步骤

{steps_block}

## 粒粒 MCP 工具

经 MCP server `lili` 调用。写操作（改出价/预算/否定/上架/货件）必须先 `*_prepare_*` 生成预览，进审批后再执行。

{chr(10).join(tool_lines)}

## 护栏

- 查询可以直接看结果；改 Listing、广告或货件时先生成预览。
- 市场调研和允许执行两个开关默认关闭。
- 多店时先确认是 NS 店还是 TK 店，避免串店。
- 任何会产生费用或修改店铺的步骤，先把预览给运营确认。
"""
    if steps_en_block:
        inject += f"""
## Steps (EN)

{skill.get('enSum') or ''}

{steps_en_block}
"""
    # Insert before ## Limitations if present, else append
    if re.search(r"\n## Limitations\b", md):
        md = re.sub(r"\n## Limitations\b", inject + "\n## Limitations", md, count=1)
    else:
        md = md.rstrip() + "\n" + inject
    return md


def load_source_md(slug: str) -> tuple[str | None, str]:
    """Return (markdown, source_tag) or (None, '')."""
    # 1) replay
    replay = REPLAY / f"{slug}.SKILL.md"
    if replay.exists():
        return replay.read_text(encoding="utf-8"), "replay"
    alias = ALIASES.get(slug, slug)
    replay2 = REPLAY / f"{alias}.SKILL.md"
    if replay2.exists():
        return replay2.read_text(encoding="utf-8"), "replay-alias"

    # 2) nexscope amazon
    for cand in (slug, alias):
        p = NEX / cand / "SKILL.md"
        if p.exists():
            return p.read_text(encoding="utf-8"), f"nexscope:{cand}"

    # 3) ecom soft
    ealias = ECOM_ALIASES.get(slug)
    if ealias:
        p = ECOM / ealias / "SKILL.md"
        if p.exists():
            return p.read_text(encoding="utf-8"), f"ecom:{ealias}"

    return None, ""


# ---------- Category playbooks for synthesis ----------

CAT_PLAYBOOK = {
    "ads": {
        "capabilities": [
            "核对广告同步新鲜度（`ads_get_data_health` / `ads_get_sync_status`）",
            "按近 7 天 vs 近 30 天对比花费、销售额、ACOS、CPC、CVR",
            "定位异常活动 / 广告组 / 搜索词 / 投放，写清因果",
            "生成出价、预算、否定、结构变更的预览（`ads_prepare_changes`）",
            "输出三句话结论 + 按优先级排序的动作清单（含预计省钱/增量）",
        ],
        "workflow_extra": [
            "先拉实体与健康状态，确认不是同步延迟造成的假警报。",
            "用统一口径：同一时区、同一币种、是否含 SB/SD。",
            "只处理变化最大或浪费最大的 Top 3–5，避免一次改太多。",
            "否定前检查该词是否在其他活动出单；能出单的不要否。",
            "出价调整写明当前出价、建议出价、依据（目标 ACOS / 破局 ACOS）。",
        ],
        "outputs": [
            "诊断表：活动 × 花费/销售/ACOS 变化与原因标签",
            "动作清单：否定词 / 降出价 / 加出价 / 预算 / 暂停（各带预览 ID）",
            "HTML 小结：三句结论 + 本周复盘指标",
        ],
    },
    "research": {
        "capabilities": [
            "界定站点、类目、价格带与成本假设后再开查",
            "需求、竞争、价格带、评价痛点、进入门槛多维打分",
            "结合市场数据工具与站内 Listing 样本交叉验证",
            "输出可交给工厂/运营的开品或拆解结论",
        ],
        "workflow_extra": [
            "先写清假设：目标毛利、可接受广告 ACOS、头程与关税。",
            "样本至少覆盖头部 5–10 个 ASIN，避免只看一个爆款。",
            "差评痛点按「可改良 / 不可控」分类并估改良成本。",
            "付费市场数据调用前先告知预计次数。",
        ],
        "outputs": [
            "候选表：机会分、风险、价格带、预估利润",
            "痛点/卖点清单",
            "做或不做结论 + 下一步验证动作",
        ],
    },
    "listing": {
        "capabilities": [
            "确认站点、类目、必填属性；缺图或缺字段就停下来问",
            "标题 / 五点 / 描述 / 后台词 / 图片模块分工，不堆砌重复词",
            "生成 Listing 预览，进审批后再提交",
            "对照竞品与搜索词意图改薄弱处",
        ],
        "workflow_extra": [
            "主图与标题各司其职：尺寸/材质不要只靠主图。",
            "后台搜索词不进标题；违规词、竞品品牌词剔除。",
            "A+/品牌故事与五点不重复堆砌同一卖点。",
            "改动前后各留一份对照，方便回滚。",
        ],
        "outputs": [
            "Listing 预览（标题、五点、描述、后台词、图位说明）",
            "关键词分组：核心 / 长尾 / 否定候选",
            "审批单 ID",
        ],
    },
    "ops": {
        "capabilities": [
            "先确认店铺身份，避免 NS / TK 串店",
            "账户健康、合规、申诉、退货、履约异常分诊",
            "只读诊断优先；写入类动作一律预览",
            "给出可在卖家后台核对的证据清单",
        ],
        "workflow_extra": [
            "收集政策编号、ASIN、时间窗、截图/邮件证据。",
            "申诉信事实与附件一一对应，不夸大、不甩锅买家。",
            "退货归因区分产品质量 / 物流 / 期望管理 / 误购。",
        ],
        "outputs": [
            "问题定性 + 风险等级",
            "证据包清单",
            "下一步动作（含是否需人工客服）",
        ],
    },
    "report": {
        "capabilities": [
            "统一口径：时间范围、币种、是否剔除异常订单",
            "销售 / 流量 / 广告 / 库存 / 费用多模块对照上周或上月",
            "三句话结论 + 按优先级的动作清单",
            "输出 HTML 报告便于周会宣讲",
        ],
        "workflow_extra": [
            "先对齐「看哪个店、哪段时间」。",
            "每个模块只留 Top 风险与 Top 机会，避免流水账。",
            "动作写明负责人角色（广告/库存/定价）与本周盯的指标。",
        ],
        "outputs": [
            "HTML 报告",
            "动作清单（负责人 + 指标）",
            "需后台人工确认的开放问题",
        ],
    },
    "profit": {
        "capabilities": [
            "拆售价、采购、头程、佣金、FBA、广告、退货、仓储",
            "按 SKU / ASIN 算毛利、贡献利润、破局 ACOS",
            "标出亏损或边缘利润款及原因",
            "给出调价 / 降本 / 停投 / 清货建议",
        ],
        "workflow_extra": [
            "成本假设写进报告，避免和财务口径打架。",
            "广告费按归因窗口说明，不和订单日期硬拧。",
            "关税与头程波动单独标注灵敏度。",
        ],
        "outputs": [
            "SKU 利润表",
            "破局 ACOS / 目标 ACOS",
            "调价或结构建议",
        ],
    },
    "inventory": {
        "capabilities": [
            "按可售天数列出两周内可能断货的 SKU",
            "结合在途、预留、促销峰值估补货量与最晚下单日",
            "生成货件/入库计划预览",
            "标出滞销与老化库存处理选项",
        ],
        "workflow_extra": [
            "补货量 = 目标可售天数 × 日均 − 在途 − 可售，再加安全库存。",
            "大促前单独拉高峰系数，不要用平销日均硬套。",
            "货件标签、箱唛、预处理要求按站点核对。",
        ],
        "outputs": [
            "补货清单（数量、最晚下单日）",
            "货件预览 / 资料包",
            "滞销处理建议",
        ],
    },
    "promo": {
        "capabilities": [
            "列出正在跑和最近结束的券、秒杀、优惠券、Vine、BD/LD",
            "评估折扣深度、毛利冲击、是否抢自己广告转化",
            "给出排期与叠加规则建议",
            "预览创建/结束促销（若工具支持）",
        ],
        "workflow_extra": [
            "先算折后毛利再决定是否报 Deal。",
            "券与 PPC 同时狂奔时，检查是否在给无效词买单。",
            "Vine / 早期评论必须合规，禁止诱导五星。",
        ],
        "outputs": [
            "促销日历",
            "每场预期增量 vs 毛利损失",
            "执行 checklist",
        ],
    },
}

# Slug-specific expansions (extra bullets keyed by slug keywords)
SLUG_EXTRA = {
    "acos": [
        "对比窗口固定为近 7 天 vs 近 30 天（或自定义），拆花费涨 vs 销售掉。",
        "破局 ACOS = 毛利 / 售价；目标 ACOS 通常取破局的 70–80%（新品期可放宽）。",
    ],
    "bid": [
        "出价建议同时给出「激进 / 稳健 / 防守」三档，默认采用稳健。",
        "Placement（Top of Search / Product Pages）单独看，不和关键词出价混改。",
    ],
    "negative": [
        "否定层级：广告组否优于活动否；精准否优于词组否（除非大面积浪费）。",
        "否之前用搜索词报告确认该词在其他活动是否出单。",
    ],
    "budget": [
        "预算撞线优先：高 ACOS 且撞线 → 先治词再加预算；低 ACOS 且撞线 → 可加预算。",
        "日预算 pacing：上半天花超 70% 要预警。",
    ],
    "harvest": [
        "从自动/广泛搜索词收割到词组/精确，保留来源活动以便回溯。",
        "收割阈值设最低点击与订单门槛，避免噪声词。",
    ],
    "funnel": [
        "漏斗分层：自动发现 → 广泛/词组测款 → 精确收割 → 否定清洗。",
        "同词不要多活动重复精确硬怼，除非明确品牌防守。",
    ],
    "daypart": [
        "分时数据至少累计两周；按时段看 CPC / CVR，而不是只看花费。",
        "调整幅度先 ±20%，观察 3–5 天再下一步。",
    ],
    "listing": [
        "标题前 80 字符承载核心词与规格；禁止堆砌品牌词与无效符号。",
    ],
    "inventory": [
        "可售天数 ≤ 14 标红；15–28 标黄；同时输出最晚下单日。",
    ],
    "refund": [
        "索赔按原因码归类：丢失、损坏、费用错误；每单附 shipment/FBA 证据。",
    ],
    "return": [
        "退货率异常先看是否新品期评价或物流破损集中。",
    ],
    "report": [
        "报告开头三句：发生了什么、为什么、这周先做什么。",
    ],
    "selection": [
        "打分维度：需求、竞争、差异化、供应链、合规、利润；低于阈值直接淘汰。",
    ],
    "competitor": [
        "拆价格带、评论增速、主图风格、广告占位、券力度，找出可攻击弱点。",
    ],
}


def slug_extras(slug: str) -> list[str]:
    out = []
    for key, bullets in SLUG_EXTRA.items():
        if key in slug:
            out.extend(bullets)
    return out


def synthesize(skill: dict, tool_docs: dict) -> str:
    slug = skill["slug"]
    cat = skill.get("cat") or "ops"
    pb = CAT_PLAYBOOK.get(cat, CAT_PLAYBOOK["ops"])
    zh, en = skill["zh"], skill["en"]
    zh_sum, en_sum = skill.get("zhSum") or "", skill.get("enSum") or ""
    steps_zh = skill.get("stepsZh") or []
    steps_en = skill.get("stepsEn") or []
    tools = skill.get("tools") or []
    extras = slug_extras(slug)

    desc = f"{zh_sum} {en_sum} Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili.".strip()
    desc = desc.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")

    caps = "\n".join(f"- {c}" for c in pb["capabilities"])
    wf_extra = "\n".join(f"- {c}" for c in pb["workflow_extra"])
    outs = "\n".join(f"- {c}" for c in pb["outputs"])
    extra_block = "\n".join(f"- {c}" for c in extras) if extras else "- （按本技能摘要与步骤执行，遇缺口再查相邻技能）"

    # Expand each step into a richer procedure line
    rich_steps = []
    for i, s in enumerate(steps_zh):
        tip = ""
        if i == 0 and tools:
            tip = f" 建议先调 `{tools[0]}`。"
        elif i == len(steps_zh) - 2 and any("prepare" in t or "change" in t for t in tools):
            tip = " 变更类调用 `ads_prepare_changes` / 对应 prepare 工具生成预览。"
        rich_steps.append(f"{i+1}. {s}{tip}")
    if not rich_steps:
        rich_steps = ["1. 加载本技能后按摘要执行，并调用下列 MCP 工具。"]

    tool_lines = []
    for t in tools:
        blurb = tool_docs.get(t) or ""
        tool_lines.append(f"- `{t}` — {blurb}" if blurb else f"- `{t}`")
    if not tool_lines:
        tool_lines = ["- 无固定工具；可用 `meta_search_skills` 找相邻技能。"]

    steps_en_block = ""
    if steps_en:
        steps_en_block = "## Steps (EN)\n\n" + (en_sum + "\n\n") + "\n".join(
            f"{i+1}. {s}" for i, s in enumerate(steps_en)
        ) + "\n"

    # When-to-use derived from name
    when = f"处理「{zh}」或用户提到 {en} / `{slug}` 相关诉求时加载。也适用于 12 条粒粒工作流里点名本技能的步骤。"

    return f"""---
name: {slug}
description: "{desc}"
metadata: {{"lili":{{"category":"{cat}","brand":"粒粒"}}}}
---

# {zh} / {en}

## 这个技能做什么

{zh_sum}

{en_sum}

本手册是粒粒lili 离线/Codex 镜像。在线优先 `meta_load_skill`（slug=`{slug}`）拉服务端最新版；工具一律经 MCP server `lili` 调用。

## 什么时候用

{when}

## 能力要点

{caps}

## 本技能专项要点

{extra_block}

## 步骤

按下面顺序执行；每一步结束先汇报再往下（写操作必须停在预览）。

{chr(10).join(rich_steps)}

### 流程补充（分类手册）

{wf_extra}

## 相关工具

{chr(10).join(tool_lines)}

## 输出格式

{outs}

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

{steps_en_block}## 与工作流的关系

本技能可被「周一经营例会 / 广告止血 / 销量下滑 / 新品上架到开广告 / 选品开品 / 竞品拆解 / 补货发货 / 利润体检 / 大促备战 / 老品清退 / 退货攻坚 / 月度报告」等模板引用。若当前对话来自某条工作流，保持该工作流的顺序与停顿点，不要跳步执行写操作。
"""


def adapt_imported(raw: str, skill: dict, tool_docs: dict, source: str) -> str:
    md = brand_replace(raw)
    md = strip_installation(md)
    md = strip_nexscope_footer(md)
    md = rewrite_frontmatter(
        md,
        skill["slug"],
        skill["zh"],
        skill["en"],
        skill.get("zhSum") or "",
        skill.get("enSum") or "",
    )
    # Soft-map note if alias/ecom
    if source.startswith("ecom:") or source.endswith("alias") or "alias" in source:
        note = f"\n> 来源模板：`{source}`，已按粒粒品牌与本店工具改写；执行以「粒粒步骤」为准。\n"
        md = md.replace(f"# {skill['zh']} / {skill['en']}\n", f"# {skill['zh']} / {skill['en']}\n{note}\n", 1)
    md = inject_lili_sections(md, skill, tool_docs)
    # Ensure no leftover duobaoyu/nexscope
    md = brand_replace(md)
    return md


def main() -> None:
    skills = json.loads((DATA / "skills.json").read_text(encoding="utf-8"))
    tool_docs = json.loads(Path("/tmp/tool-first.json").read_text(encoding="utf-8"))
    OUT.mkdir(parents=True, exist_ok=True)

    stats = {"replay": 0, "nexscope": 0, "ecom": 0, "synth": 0}
    sizes = []

    for skill in skills:
        slug = skill["slug"]
        raw, source = load_source_md(slug)
        # Don't use soft product-research alias as full body for selection — synthesize
        if slug in ("amazon-product-selection", "product-selection") and source.startswith("nexscope"):
            raw, source = None, ""
        # negative-keyword-strategy can use nexscope amazon-negative-keywords
        if raw and source.startswith("nexscope"):
            # For soft aliases that are strategy wrappers, still adapt but mark
            pass

        if raw:
            if source.startswith("replay"):
                stats["replay"] += 1
                tag = "replay"
            elif source.startswith("ecom"):
                stats["ecom"] += 1
                tag = "ecom"
            else:
                stats["nexscope"] += 1
                tag = "nexscope"
            body = adapt_imported(raw, skill, tool_docs, source)
        else:
            stats["synth"] += 1
            tag = "synth"
            body = synthesize(skill, tool_docs)
            if skill.get("cat") == "ads":
                shared = Path("/tmp/ads-shared-playbook.md")
                if shared.exists():
                    body = body.rstrip() + "\n\n## 广告公共参考（漏斗 / 财务 / 否定）\n\n" + shared.read_text(encoding="utf-8") + "\n"
            # research: append niche/competitor snippets when relevant
            if skill.get("cat") == "research":
                for tip_slug, tip_file in [
                    ("niche", NEX / "amazon-niche-finder" / "SKILL.md"),
                    ("competitor", NEX / "amazon-competitor-analysis" / "SKILL.md"),
                    ("review", NEX / "amazon-review-analyzer" / "SKILL.md"),
                    ("product", NEX / "amazon-product-research" / "SKILL.md"),
                ]:
                    if tip_slug in skill["slug"] and tip_file.exists():
                        raw = tip_file.read_text(encoding="utf-8")
                        # take Capabilities + Key Concepts only
                        parts = []
                        for title in ("Capabilities", "Key Concepts", "Workflow"):
                            m = re.search(rf"(## {title}\n.*?)(?=\n## |\Z)", raw, re.S)
                            if m: parts.append(m.group(1)[:3000])
                        if parts:
                            body = body.rstrip() + "\n\n## 参考手册摘录\n\n" + brand_replace("\n\n".join(parts)) + "\n"
                        break

        # Final brand sweep
        body = brand_replace(body)
        # Forbid leftover brands
        if re.search(r"多宝鱼|duobaoyu|nexscope", body, flags=re.I):
            body = brand_replace(body)

        out = OUT / f"{slug}.md"
        out.write_text(body, encoding="utf-8")
        sizes.append((len(body), slug, tag))

    sizes.sort()
    print("OUT", OUT)
    print("count", len(skills))
    print("stats", stats)
    print("size min/median/max", sizes[0], sizes[len(sizes)//2], sizes[-1])
    print("under 1500 bytes:", sum(1 for n,_,_ in sizes if n < 1500))
    print("under 2500 bytes:", sum(1 for n,_,_ in sizes if n < 2500))
    # verify no brand leaks
    leaks = []
    for p in OUT.glob("*.md"):
        t = p.read_text(encoding="utf-8")
        if re.search(r"多宝鱼|\bduobaoyu\b|\bnexscope\b", t, flags=re.I):
            leaks.append(p.name)
    print("brand leaks", len(leaks), leaks[:10])


if __name__ == "__main__":
    main()
