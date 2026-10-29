"use client";

import { useState } from "react";
import type { Locale } from "@/lib/tx";
import { tx } from "@/lib/tx";
import { withBasePath } from "@/lib/base-path";

export function RunLiveButton({ slug, locale }: { slug: string; locale: Locale }) {
  const [text, setText] = useState("");
  const [ok, setOk] = useState<boolean | null>(null);
  return (
    <div className="mt-3">
      <button
        className="btn-ghost"
        onClick={async () => {
          const res = await fetch(withBasePath("/api/workflows/pack"), {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ slug, mode: "live" }),
          });
          const data = await res.json();
          setOk(res.ok);
          setText(data.message || (res.ok ? tx(locale, "真调用已返回", "Live call returned") : tx(locale, "未接通", "Not connected")));
        }}
      >
        {tx(locale, "用已保存密钥真调", "Run live with saved keys")}
      </button>
      {text && <p className={`mt-2 text-sm ${ok ? "text-emerald-700" : "text-[#9a3412]"}`}>{text}</p>}
    </div>
  );
}
