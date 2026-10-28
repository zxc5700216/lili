"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/tx";
import { tx } from "@/lib/tx";

type Line = { target?: string; match?: string; before?: string; after?: string; note?: string };
type Item = {
  id: string;
  kind: string;
  toolName: string;
  title: string;
  summary: string;
  status: string;
  lines: Line[];
  storeName: string;
};

export function ApprovalList({ locale, items, executeOn }: { locale: Locale; items: Item[]; executeOn: boolean }) {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const shown = filter === "all" ? items : items.filter((item) => item.kind === filter);
  async function act(id: string, decision: "approved" | "rejected") {
    setError("");
    const res = await fetch(`/api/approvals/${id}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Failed");
      return;
    }
    router.refresh();
  }
  return (
    <div>
      <div className="mb-4 rounded-2xl bg-[#fff4ee] px-4 py-3 text-sm leading-6">
        {executeOn
          ? tx(locale, "允许 AI 执行操作已打开。批准只会改沙盒里的出价、货件草稿或 Listing 草稿。", "Allow AI to execute actions is on. Approving changes sandbox bids, shipment drafts, or listing drafts only.")
          : tx(locale, "允许 AI 执行操作默认关闭。可以看预览，批准会被拒绝，直到你在「开始使用」里打开开关。", "Allow AI to execute actions is off by default. You can read the preview. Approve is refused until you turn the switch on in Get Started.")}
      </div>
      {error && <p className="mb-3 text-sm text-red-700">{error}</p>}
      <div className="mb-3 flex gap-2">
        {[
          ["all", "全部", "All"],
          ["ads", "广告", "Ads"],
          ["restock", "补货", "Restock"],
          ["listing", "Listing", "Listing"],
          ["other", "其他", "Other"],
        ].map(([id, zh, en]) => (
          <button key={id} onClick={() => setFilter(id)} className={`rounded-full px-3 py-1 text-sm ${filter === id ? "bg-ink text-white" : "bg-chip"}`}>{tx(locale, zh, en)}</button>
        ))}
      </div>
      <div className="space-y-3">
        {shown.map((item) => (
          <article key={item.id} id={item.id} className="card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-peach px-2 py-0.5 text-xs text-orange">{item.kind}</span>
              <span className="font-semibold">{item.title}</span>
              <span className="text-xs text-muted">{item.toolName} · {item.storeName} · {item.status}</span>
            </div>
            <p className="mt-2 text-sm text-[#5c564f]">{item.summary}</p>
            {item.lines.length > 0 && (
              <table className="mt-3 w-full text-left text-sm">
                <tbody>
                  {item.lines.slice(0, 8).map((line, i) => (
                    <tr key={i} className="border-t border-line">
                      <td className="py-1 pr-2">{line.target}</td>
                      <td className="py-1 pr-2 text-muted">{line.before}</td>
                      <td className="py-1">{line.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {item.status === "pending" && (
              <div className="mt-3 flex gap-2">
                <button className="btn-orange" onClick={() => act(item.id, "approved")}>{tx(locale, "批准", "Approve")}</button>
                <button className="btn-ghost" onClick={() => act(item.id, "rejected")}>{tx(locale, "驳回", "Reject")}</button>
              </div>
            )}
          </article>
        ))}
        {shown.length === 0 && <p className="text-sm text-muted">{tx(locale, "没有审批。先在工作流或工具里生成预览。", "No approvals. Run a workflow or a prepare tool first.")}</p>}
      </div>
    </div>
  );
}
