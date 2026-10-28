"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/lib/tx";
import { tx } from "@/lib/tx";

export function RunWorkflow({ slug, locale }: { slug: string; locale: Locale }) {
  const [html, setHtml] = useState("");
  const [approvals, setApprovals] = useState<{ id: string; tool: string; title: string }[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  return (
    <div className="mt-4">
      <button
        className="btn-orange"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setError("");
          const res = await fetch("/api/workflows/run", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ slug }),
          });
          const data = await res.json();
          setPending(false);
          if (!res.ok) {
            setError(data.message || "Failed");
            return;
          }
          setHtml(data.reportHtml);
          setApprovals(data.approvals ?? []);
        }}
      >
        {pending ? tx(locale, "演练中…", "Running…") : tx(locale, "在沙盒里演练", "Run in the sandbox")}
      </button>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      {approvals.length > 0 && (
        <div className="mt-3 rounded-xl bg-[#fff4ee] p-3 text-sm">
          {tx(locale, "已生成预览，执行开关默认关闭。到审批里确认。", "A preview was created. Execute stays off until you allow it, then confirm in Approvals.")}
          <div className="mt-2 flex flex-wrap gap-2">
            {approvals.map((item) => (
              <Link key={item.id} className="text-orange" href={`/v2/approvals#${item.id}`}>{item.tool}</Link>
            ))}
          </div>
        </div>
      )}
      {html && (
        <iframe title="report" sandbox="" className="mt-4 h-[520px] w-full rounded-2xl border border-line bg-white" srcDoc={html} />
      )}
    </div>
  );
}
