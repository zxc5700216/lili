"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/tx";
import { tx } from "@/lib/tx";

export type ToolCard = { name: string; description: string; category: string; readOnly: boolean };

export function ToolLab({ locale, tools }: { locale: Locale; tools: ToolCard[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const cats = useMemo(() => ["all", ...Array.from(new Set(tools.map((t) => t.category)))], [tools]);
  const shown = tools.filter((tool) => {
    if (cat !== "all" && tool.category !== cat) return false;
    const hay = `${tool.name} ${tool.description}`.toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  });
  return (
    <div>
      <div className="mb-4 rounded-2xl bg-[#fff4ee] px-4 py-3 text-sm leading-6 text-[#9a5b3c]">
        {tx(locale, "工具实验室不在正式产品的侧栏里。107 个工具按清单模拟调用。写入和准备类会进审批。市场调研默认关闭。", "Tool lab is not in the live sidebar. All 107 tools run as mocks. Writes and prepare calls go to approval. Market research stays off until you allow it.")}
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        <input className="field min-w-[220px] flex-1" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx(locale, "搜索工具", "Search tools")} />
        <select className="field" value={cat} onChange={(e) => setCat(e.target.value)}>
          {cats.map((item) => <option key={item} value={item}>{item === "all" ? tx(locale, `全部 ${tools.length}`, `All ${tools.length}`) : item}</option>)}
        </select>
      </div>
      <p className="mb-2 text-sm text-muted">{shown.length}</p>
      <div className="grid gap-2">
        {shown.map((tool) => (
          <Link key={tool.name} href={`/v2/tools/${tool.name}`} className="card flex items-start gap-3 px-4 py-3 hover:border-orange">
            <span className={`mt-0.5 rounded-full px-2 py-0.5 text-xs ${tool.readOnly ? "bg-emerald-50 text-emerald-700" : "bg-peach text-orange"}`}>
              {tool.readOnly ? "read" : "write"}
            </span>
            <span>
              <span className="font-medium">{tool.name}</span>
              <span className="mt-0.5 block text-sm text-muted line-clamp-2">{tool.description}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
