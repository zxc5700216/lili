"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Coins } from "lucide-react";
import type { Locale } from "@/lib/tx";
import { tx } from "@/lib/tx";
import { useUI } from "@/store/ui";

const PACKS = [
  { credits: 200, zh: "体验", en: "Try", noteZh: "够几次市场调研", noteEn: "A few market lookups" },
  { credits: 1000, zh: "常用", en: "Regular", noteZh: "一周的广告建议和选品", noteEn: "A week of ad batches and research" },
  { credits: 3000, zh: "深度学习", en: "Deep study", noteZh: "把 12 条工作流反复跑", noteEn: "Replay the 12 workflows" },
];

export function RechargeView({ locale, credits }: { locale: Locale; credits: number }) {
  const router = useRouter();
  const flash = useUI((s) => s.flash);
  const [pending, setPending] = useState(0);
  const [error, setError] = useState("");
  return (
    <div className="mx-auto max-w-3xl">
      <section className="card flex items-center gap-4 p-5">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-peach text-orange">
          <Coins className="h-6 w-6" />
        </span>
        <div>
          <div className="text-sm text-muted">{tx(locale, "当前余额", "Current balance")}</div>
          <div className="text-3xl font-semibold">{credits.toLocaleString(locale === "zh" ? "zh-CN" : "en-US")}</div>
          <div className="text-sm text-muted">{tx(locale, "积分", "credits")}</div>
        </div>
      </section>
      <p className="mt-4 text-sm leading-6 text-[#5c564f]">
        {tx(
          locale,
          "充值只加沙盒积分，不会产生真实扣款。市场调研大约 2 积分一次，生成一批广告建议 5 积分。查询类工具不扣积分。",
          "Top up adds sandbox credits only. Nothing is charged. A market lookup is about 2 credits, and a fresh ads recommendation batch is 5. Read tools are free.",
        )}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {PACKS.map((pack) => (
          <button
            key={pack.credits}
            className="card p-4 text-left hover:border-orange"
            disabled={pending === pack.credits}
            onClick={async () => {
              setPending(pack.credits);
              setError("");
              const res = await fetch("/api/credits", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ credits: pack.credits }),
              });
              setPending(0);
              if (!res.ok) {
                setError(tx(locale, "没加上，请再试一次", "Could not add credits"));
                return;
              }
              flash(tx(locale, `已加上 ${pack.credits} 积分`, `Added ${pack.credits} credits`));
              router.refresh();
            }}
          >
            <div className="text-sm text-muted">{tx(locale, pack.zh, pack.en)}</div>
            <div className="mt-1 text-2xl font-semibold">{pack.credits.toLocaleString()}</div>
            <div className="mt-2 text-sm text-[#5c564f]">{tx(locale, pack.noteZh, pack.noteEn)}</div>
            <div className="mt-3 text-sm font-medium text-orange">{tx(locale, "加入余额", "Add to balance")}</div>
          </button>
        ))}
      </div>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
