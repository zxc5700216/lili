"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/lib/tx";
import { tx } from "@/lib/tx";
import { withBasePath } from "@/lib/base-path";

type Log = { n: number; skill: string | null; note: string; text: string };

export function RunWorkflow({ slug, locale }: { slug: string; locale: Locale }) {
  const [html, setHtml] = useState("");
  const [log, setLog] = useState<Log[]>([]);
  const [approvals, setApprovals] = useState<{ id: string; tool: string; title: string }[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  return (
    <div className="mt-2">
      <button
        className="btn-orange"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setError("");
          const res = await fetch(withBasePath("/api/workflows/run"), {
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
          setHtml(data.reportHtml || "");
          setLog(data.log || []);
          setApprovals(data.approvals ?? []);
        }}
      >
        {pending ? tx(locale, "演练中…", "Running…") : tx(locale, "按这些步骤演练", "Run these steps")}
      </button>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      {log.length > 0 && (
        <ol className="mt-4 space-y-2">
          {log.map((step) => (
            <li key={step.n} className="rounded-xl border border-line bg-white px-4 py-3 text-sm">
              <div className="font-medium text-orange">
                {step.n}. {step.skill || tx(locale, "收尾", "Close")}
              </div>
              <p className="mt-1 leading-6 text-[#3f3a36]">{step.text}</p>
              <p className="mt-1 text-xs text-muted">{step.note}</p>
            </li>
          ))}
        </ol>
      )}
      {approvals.length > 0 && (
        <div className="mt-3 rounded-xl bg-[#fff4ee] p-3 text-sm leading-6">
          {tx(
            locale,
            "这一步会改店铺或花钱，所以只生成了预览。执行开关默认关闭，到审批里确认。",
            "This step would change the store or spend money, so only a preview was created. Execute stays off until you confirm it in Approvals.",
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {approvals.map((item) => (
              <Link key={item.id} className="font-medium text-orange" href={`/v2/approvals#${item.id}`}>
                {item.tool}
              </Link>
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
