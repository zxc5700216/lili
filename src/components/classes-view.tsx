"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useState } from "react";
import type { ClassItem } from "@/lib/classes";
import type { Locale } from "@/lib/tx";
import { tx } from "@/lib/tx";
import { useUI } from "@/store/ui";

export function ClassesView({ locale, items }: { locale: Locale; items: ClassItem[] }) {
  const [cursor, setCursor] = useState({ y: 2026, m: 10 });
  const openDialog = useUI((s) => s.openDialog);
  const live = items.filter((item) => item.kind === "live");
  const recorded = items.filter((item) => item.kind === "recorded");
  const marks = new Set(
    items.filter((item) => item.month === cursor.m).flatMap((item) => item.days),
  );
  const first = new Date(cursor.y, cursor.m - 1, 1);
  const start = first.getDay();
  const days = new Date(cursor.y, cursor.m, 0).getDate();
  const cells = [...Array(start).fill(0), ...Array.from({ length: days }, (_, i) => i + 1)];
  const monthName = first.toLocaleString(locale === "en" ? "en-US" : "zh-CN", { month: "long", year: "numeric" });

  function shift(delta: number) {
    const d = new Date(cursor.y, cursor.m - 1 + delta, 1);
    setCursor({ y: d.getFullYear(), m: d.getMonth() + 1 });
  }

  function notice(item: ClassItem) {
    openDialog(
      "notice",
      tx(
        locale,
        "学习沙盒不会加企业微信，也不会收款或报名。下面是这门课的目录，点进去可以看提纲。",
        "The sandbox does not add WeCom, take payment, or register you. Open the class for the outline.",
      ),
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between text-sm font-medium">
            <span>{monthName}</span>
            <span className="flex gap-1">
              <button aria-label="Prev" onClick={() => shift(-1)}><ChevronLeft className="h-4 w-4" /></button>
              <button aria-label="Next" onClick={() => shift(1)}><ChevronRight className="h-4 w-4" /></button>
            </span>
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-center text-xs text-muted">
            {(locale === "en" ? ["S", "M", "T", "W", "T", "F", "S"] : ["日", "一", "二", "三", "四", "五", "六"]).map((d, i) => <span key={`${d}${i}`}>{d}</span>)}
            {cells.map((day, i) => (
              <span key={i} className={`grid h-8 place-items-center rounded-full ${day && marks.has(day) ? (day === 29 && cursor.m === 10 ? "bg-orange text-white" : "bg-peach text-orange") : ""}`}>
                {day || ""}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {live.map((item) => (
            <article key={item.slug} id={item.slug} className="card flex flex-wrap items-center gap-3 p-4">
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-chip text-center text-xs leading-4">
                <span>{item.whenEn.split(" ")[0]}<br />{item.whenEn.split(" ").slice(1).join(" ")}</span>
              </div>
              <div className="min-w-[220px] flex-1">
                <Link href={`/v2/courses/${item.slug}`} className="font-semibold hover:text-orange">{tx(locale, item.titleZh, item.titleEn)}</Link>
                <div className="text-xs text-orange">{tx(locale, item.noteZh ?? "", item.noteEn ?? "")}</div>
                <div className="text-xs text-muted">{tx(locale, item.metaZh, item.metaEn)}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{tx(locale, item.priceZh, item.priceEn)}</div>
                {item.wasEn && <div className="text-xs text-muted line-through">{tx(locale, item.wasZh ?? "", item.wasEn)}</div>}
                <button className="btn-orange mt-2" onClick={() => notice(item)}>
                  {item.cta === "wecom" ? tx(locale, "加企业微信", "Add us on WeCom") : tx(locale, "报名", "Sign up")}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      <h2 className="mb-3 mt-8 font-semibold">{tx(locale, "录像课", "Recorded classes")}</h2>
      <div className="space-y-3">
        {recorded.map((item) => (
          <article key={item.slug} className="card flex flex-wrap items-center gap-3 p-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-peach text-orange"><Play className="h-4 w-4" /></span>
            <div className="min-w-[200px] flex-1">
              <div className="font-semibold">{tx(locale, item.titleZh, item.titleEn)}</div>
              <div className="text-xs text-muted">{tx(locale, "录像，随时看", "Recorded, watch any time")}</div>
            </div>
            <div className="text-right font-semibold">
              {tx(locale, item.priceZh, item.priceEn)}
              {item.wasEn && <div className="text-xs font-normal text-muted line-through">{item.wasEn}</div>}
            </div>
            <Link className="btn-ghost" href={`/v2/courses/${item.slug}`}>{tx(locale, "查看详情", "View details")}</Link>
            <button className="btn-orange" onClick={() => notice(item)}>{tx(locale, "联系获取", "Contact us to get it")}</button>
          </article>
        ))}
      </div>
    </div>
  );
}
