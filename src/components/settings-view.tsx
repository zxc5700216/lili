"use client";

import { Store } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/tx";
import { tx } from "@/lib/tx";

export function SettingsView({ locale, shop, connected }: { locale: Locale; shop: string; connected: boolean }) {
  const router = useRouter();
  const [domain, setDomain] = useState(shop);
  const [error, setError] = useState("");
  return (
    <div className="mx-auto max-w-3xl">
      <section className="card p-5">
        <div className="flex items-center gap-2 font-semibold text-orange">
          <Store className="h-4 w-4" />
          {tx(locale, "连接 Shopify 店铺", "Connect Shopify store")}
        </div>
        <p className="mt-3 text-sm leading-6 text-[#5c564f]">
          {tx(
            locale,
            "输入店铺域名。沙盒会模拟同意页并记成只读安装，不打开 Shopify，也不读取买家个人信息。",
            "Enter your shop domain to open Shopify's consent page; click Install to finish (read-only scopes, no buyer PII).",
          )}
        </p>
        {locale === "en" && (
          <p className="mt-1 text-xs text-muted">Sandbox note: Connect simulates the consent page on this machine. It does not open Shopify.</p>
        )}
        <form
          className="mt-4 flex flex-wrap gap-2"
          onSubmit={async (event) => {
            event.preventDefault();
            setError("");
            const res = await fetch("/api/shopify", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ shop: domain }),
            });
            const data = await res.json();
            if (!res.ok) {
              setError(data.message);
              return;
            }
            router.refresh();
          }}
        >
          <input className="field w-72" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="your-store.myshopify.com" />
          <button className="btn-orange" type="submit">{connected ? tx(locale, "已连接", "Connected") : tx(locale, "连接", "Connect")}</button>
          {connected && (
            <button
              type="button"
              className="btn-ghost"
              onClick={async () => {
                await fetch("/api/shopify", { method: "DELETE" });
                setDomain("");
                router.refresh();
              }}
            >
              {tx(locale, "断开", "Disconnect")}
            </button>
          )}
        </form>
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
        {connected && <p className="mt-3 text-sm text-emerald-700">{shop} · {tx(locale, "只读 · 沙盒里没有买家信息", "read-only · no buyer PII in this sandbox")}</p>}
      </section>
    </div>
  );
}
