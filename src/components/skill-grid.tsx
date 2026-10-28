"use client";

import Link from "next/link";
import { ChevronDown, Copy, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/tx";
import { tx } from "@/lib/tx";
import { copyText, useUI } from "@/store/ui";

export type SkillCard = {
  slug: string;
  nameZh: string;
  nameEn: string;
  category: string;
  summaryZh: string;
  summaryEn: string;
  promptZh: string;
  promptEn: string;
  stepsZh: string[];
  stepsEn: string[];
  tools: string[];
  featured: boolean;
  isNew: boolean;
};

const CHIPS = [
  ["all", "全部", "All"],
  ["featured", "精选", "Featured"],
  ["ads", "广告", "Ads"],
  ["market", "市场", "Market"],
  ["listing", "Listing", "Listing"],
  ["profit", "利润", "Profit"],
  ["keywords", "关键词", "Keywords"],
  ["restock", "补货", "Restock"],
  ["data", "数据", "Data"],
  ["compliance", "合规", "Compliance"],
  ["returns", "退货", "Returns"],
  ["orders", "订单", "Orders"],
] as const;

export function SkillGrid({ locale, items }: { locale: Locale; items: SkillCard[] }) {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const flash = useUI((s) => s.flash);
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) map.set(item.category, (map.get(item.category) ?? 0) + 1);
    return map;
  }, [items]);
  const shown = items.filter((item) => {
    if (cat === "featured" && !item.featured) return false;
    if (cat !== "all" && cat !== "featured" && item.category !== cat) return false;
    const hay = `${item.nameZh} ${item.nameEn} ${item.slug} ${item.summaryZh} ${item.summaryEn}`.toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  });
  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={tx(locale, "搜索技能", "Search skills")}
        className="field mb-3 w-full"
      />
      <div className="mb-4 flex flex-wrap gap-2 pb-1">
        {CHIPS.map(([id, zh, en]) => {
          const n = id === "all" ? items.length : id === "featured" ? items.filter((s) => s.featured).length : counts.get(id) ?? 0;
          return (
            <button key={id} onClick={() => setCat(id)} className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${cat === id ? "bg-ink text-white" : "bg-chip text-[#3f3a36]"}`}>
              {tx(locale, zh, en)} {n}
            </button>
          );
        })}
      </div>
      {shown.length === 0 && <p className="text-sm text-muted">{tx(locale, "没有匹配的技能。", "No skills match.")}</p>}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((item) => {
          const short = item.slug.replace(/^duobaoyu-/, "");
          const label = short.length > 18 ? `${short.slice(0, 16)}…` : short;
          const expanded = open === item.slug;
          return (
            <article key={item.slug} className="card flex flex-col p-4">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                <Link href={`/v2/skills/${item.slug}`} className="font-semibold leading-5 hover:text-orange">
                  {tx(locale, item.nameZh, item.nameEn)}
                </Link>
                {item.isNew && <span className="ml-auto text-xs font-medium text-orange">{tx(locale, "新", "New")}</span>}
              </div>
              <p className={`mt-2 text-sm leading-5 text-[#5c564f] ${expanded ? "" : "line-clamp-3"}`}>
                {tx(locale, item.summaryZh, item.summaryEn)}
              </p>
              {expanded && (
                <div className="mt-2 text-sm text-[#5c564f]">
                  <ol className="list-decimal space-y-1 pl-4">
                    {(locale === "en" ? item.stepsEn : item.stepsZh).map((step) => <li key={step}>{step}</li>)}
                  </ol>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tools.map((tool) => (
                      <Link key={tool} href={`/v2/tools/${tool}`} className="rounded-full bg-chip px-2 py-0.5 text-xs">{tool}</Link>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-3 flex items-center gap-2">
                <button className="flex items-center gap-1 text-xs text-muted" onClick={() => setOpen(expanded ? null : item.slug)}>
                  {label} <ChevronDown className={`h-3.5 w-3.5 ${expanded ? "rotate-180" : ""}`} /> {tx(locale, "展开", "Show more")}
                </button>
                <button
                  className="btn-orange ml-auto"
                  onClick={() => {
                    copyText(tx(locale, item.promptZh, item.promptEn));
                    flash(tx(locale, "已复制", "Copied"));
                  }}
                >
                  <Copy className="h-3.5 w-3.5" /> {tx(locale, "复制提示词", "Copy prompt")}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
