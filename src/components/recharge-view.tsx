"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, RefreshCw } from "lucide-react";
import type { Locale } from "@/lib/tx";
import { tx } from "@/lib/tx";
import { useUI } from "@/store/ui";

const PRESETS = [5, 50, 100, 300, 500];

export type OrderRow = { id: string; code: string; credits: number; amountCny: number; status: string; createdAt: string };

export function RechargeView({ locale, credits, orders }: { locale: Locale; credits: number; orders: OrderRow[] }) {
  const router = useRouter();
  const flash = useUI((s) => s.flash);
  const [yuan, setYuan] = useState(100);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const amount = Number.isFinite(yuan) ? yuan : 0;
  const got = Math.max(0, Math.round(amount * 10));

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <section className="card p-5">
          <div className="text-sm text-[#5c564f]">{tx(locale, "当前余额", "Current balance")}</div>
          <div className="mt-6 text-4xl font-semibold">{credits.toLocaleString(locale === "zh" ? "zh-CN" : "en-US")}</div>
          <div className="text-sm text-muted">{tx(locale, "积分", "credits")}</div>
        </section>
        <section className="card p-5">
          <div className="text-sm font-medium">{tx(locale, "积分怎么用", "How credits are used")}</div>
          <p className="mt-4 text-sm leading-6 text-[#5c564f]">
            {tx(locale, "市场调研数据：关键词、竞品、评论", "Market research data: keywords, competitors, reviews")}
            <span className="ml-2 font-medium text-orange">{tx(locale, "2 积分 / 次", "2 credits / lookup")}</span>
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">
            {tx(locale, "买来的积分不会过期。如果不再使用，可以联系我们退还剩余部分。沙盒里的支付不会产生真实扣款。", "Purchased credits never expire; if you stop using them, contact us to refund the remainder. This sandbox does not charge a real card.")}
          </p>
        </section>
      </div>

      <section className="card p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{tx(locale, "充值金额", "Top-up amount")}</span>
          <span className="text-muted">{tx(locale, "¥1 = 10 积分，最低 ¥5", "¥1 = 10 credits, ¥5 minimum")}</span>
        </div>
        <label className="mt-4 flex items-center justify-between rounded-xl border border-[#eadfd6] px-4 py-3">
          <span className="flex items-baseline gap-2 text-3xl font-semibold">
            <span className="text-xl text-muted">¥</span>
            <input
              className="w-32 bg-transparent outline-none"
              inputMode="numeric"
              value={Number.isFinite(yuan) ? String(yuan) : ""}
              onChange={(e) => setYuan(Number(e.target.value.replace(/[^\d]/g, "")) || 0)}
            />
          </span>
          <span className="font-medium text-orange">= {got.toLocaleString()} {tx(locale, "积分", "credits")}</span>
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((value) => (
            <button
              key={value}
              onClick={() => setYuan(value)}
              className={`rounded-full border px-3 py-1 text-sm ${yuan === value ? "border-orange text-orange" : "border-[#eadfd6] text-[#5c564f]"}`}
            >
              ¥{value}
            </button>
          ))}
        </div>
      </section>

      <section className="card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium">{tx(locale, "本次充值", "This top-up")}</div>
            <div className="mt-3 text-xs text-muted">{tx(locale, "支持的付款方式", "Supported payment methods")}</div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <PayMark label="VISA" className="bg-[#1a1f71] text-white" />
              <PayMark label="MC" className="bg-white text-[#eb001b]" />
              <PayMark label="AMEX" className="bg-[#2e77bc] text-white" />
              <PayMark label="银联" className="bg-[#e21836] text-white" />
              <PayMark label="微信" className="bg-[#22c55e] text-white" />
              <PayMark label="支付宝" className="bg-[#1677ff] text-white" />
            </div>
            <p className="mt-3 flex items-center gap-1 text-xs text-muted">
              <Lock className="h-3.5 w-3.5" />
              {tx(locale, "模拟支付，积分会立刻记到沙盒余额。", "Secure payment — credits arrive automatically")}
            </p>
          </div>
          <div className="text-right">
            <div className="font-medium">¥{amount || 0} · {got.toLocaleString()} {tx(locale, "积分", "credits")}</div>
            <button
              className="btn-orange mt-4 !h-10 !rounded-full px-6"
              disabled={pending || amount < 5}
              onClick={async () => {
                setPending(true);
                setError("");
                const res = await fetch("/api/credits", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ yuan: amount }),
                });
                const data = await res.json();
                setPending(false);
                if (!res.ok) {
                  setError(data.message || tx(locale, "最低 ¥5", "Minimum is ¥5."));
                  return;
                }
                flash(tx(locale, `已入账 ${got} 积分`, `Credited ${got} credits`));
                router.refresh();
              }}
            >
              {tx(locale, `支付 ¥${(amount || 0).toFixed(2)}`, `Pay ¥${(amount || 0).toFixed(2)}`)}
            </button>
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">{tx(locale, "我的订单", "My Orders")}</h2>
          <button className="flex items-center gap-1 text-sm text-muted" onClick={() => router.refresh()}>
            <RefreshCw className="h-3.5 w-3.5" /> {tx(locale, "刷新", "Refresh")}
          </button>
        </div>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">{tx(locale, "订单", "Order")}</th>
                <th className="px-4 py-3 font-medium">{tx(locale, "时间", "Time")}</th>
                <th className="px-4 py-3 font-medium">{tx(locale, "积分", "Credits")}</th>
                <th className="px-4 py-3 font-medium">{tx(locale, "金额", "Amount")}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-line">
                  <td className="px-4 py-3">{order.code}</td>
                  <td className="px-4 py-3">{order.createdAt.slice(0, 16).replace("T", " ")}</td>
                  <td className="px-4 py-3">{order.credits} {tx(locale, "积分", "credits")}</td>
                  <td className="px-4 py-3">¥{order.amountCny.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">{tx(locale, "已入账", "Credited")}</span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td className="px-4 py-6 text-muted" colSpan={5}>{tx(locale, "还没有订单。", "No orders yet.")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function PayMark({ label, className }: { label: string; className: string }) {
  return <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${className}`}>{label}</span>;
}
