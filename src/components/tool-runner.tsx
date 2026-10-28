"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/lib/tx";
import { tx } from "@/lib/tx";

type Schema = {
  properties?: Record<string, { type?: string; description?: string }>;
  required?: string[];
};

export function ToolRunner({
  locale,
  name,
  description,
  docs,
  schema,
  readOnly,
  storeId,
  profileId,
}: {
  locale: Locale;
  name: string;
  description: string;
  docs: string;
  schema: Schema;
  readOnly: boolean;
  storeId: string;
  profileId: string;
}) {
  const props = schema.properties ?? {};
  const required = new Set(schema.required ?? []);
  const initial: Record<string, string> = {};
  for (const key of Object.keys(props)) {
    if (key === "store_scope") initial[key] = profileId;
    else if (key === "marketplace" || key === "marketplace_id") initial[key] = key === "marketplace" ? "US" : "ATVPDKIKX0DER";
    else if (key === "top" || key === "limit") initial[key] = "10";
    else initial[key] = "";
  }
  const [values, setValues] = useState(initial);
  const [result, setResult] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <form
        className="card space-y-3 p-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const input: Record<string, unknown> = {};
          for (const [key, spec] of Object.entries(props)) {
            const raw = values[key] ?? "";
            if (raw === "") continue;
            if (spec.type === "integer") input[key] = Number(raw);
            else if (spec.type === "number") input[key] = Number(raw);
            else if (spec.type === "boolean") input[key] = raw === "true";
            else input[key] = raw;
          }
          setPending(true);
          const res = await fetch("/api/tools/run", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ name, input, storeId }),
          });
          const data = await res.json();
          setResult(JSON.stringify(data, null, 2));
          setPending(false);
        }}
      >
        <div className="text-sm text-muted">{readOnly ? "read" : "write / approval"} · {description}</div>
        {Object.entries(props).map(([key, spec]) => (
          <label key={key} className="block text-sm">
            <span className="mb-1 block font-medium">{key}{required.has(key) ? " *" : ""} <span className="font-normal text-muted">{spec.type || "string"}</span></span>
            {spec.type === "boolean" ? (
              <select className="field w-full" value={values[key]} onChange={(e) => setValues({ ...values, [key]: e.target.value })}>
                <option value="">—</option>
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            ) : (
              <input className="field w-full" value={values[key] ?? ""} onChange={(e) => setValues({ ...values, [key]: e.target.value })} />
            )}
            {spec.description && <span className="mt-1 block text-xs text-muted">{spec.description}</span>}
          </label>
        ))}
        {Object.keys(props).length === 0 && <p className="text-sm text-muted">{tx(locale, "这个工具没有参数。", "This tool takes no arguments.")}</p>}
        <button className="btn-orange" disabled={pending} type="submit">{pending ? "…" : tx(locale, "模拟调用", "Run mock")}</button>
      </form>
      <div>
        <pre className="card max-h-[640px] overflow-auto p-4 text-xs leading-5">{result || tx(locale, "结果会显示在这里。", "The result shows up here.")}</pre>
        {result.includes("pending_approval") && (
          <Link className="mt-3 inline-flex text-sm text-orange" href="/v2/approvals">{tx(locale, "去审批", "Open approvals")}</Link>
        )}
        {result.includes("market_research") && (
          <Link className="mt-3 inline-flex text-sm text-orange" href="/v2/start">{tx(locale, "到开始使用打开市场调研", "Turn on market research in Get Started")}</Link>
        )}
        <h2 className="mb-2 mt-4 font-semibold">{tx(locale, "说明", "Docs")}</h2>
        <pre className="card max-h-[480px] overflow-auto whitespace-pre-wrap p-4 text-xs leading-5">{docs}</pre>
      </div>
    </div>
  );
}
