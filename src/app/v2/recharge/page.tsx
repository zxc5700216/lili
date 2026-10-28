"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { tx, type Locale } from "@/lib/tx";
import { useUI } from "@/store/ui";

const PACKS = [
  { credits: 200, zh: "体验", en: "Try" },
  { credits: 1000, zh: "常用", en: "Regular" },
  { credits: 3000, zh: "深度学习", en: "Deep study" },
];

export default function RechargePage() {
  const router = useRouter();
  const flash = useUI((s) => s.flash);
  const [locale, setLocale] = useState<Locale>("en");
  useEffect(() => {
    setLocale(document.cookie.includes("dby_locale=zh") ? "zh" : "en");
  }, []);
  const [pending, setPending] = useState(0);
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold">{tx(locale, "充值积分", "Top up credits")}</h1>
      <p className="mt-2 text-sm text-muted">{tx(locale, "模拟充值，不会产生真实扣款。市场调研类工具会扣沙盒积分。", "Mock top-up. Nothing is charged. Market-research tools spend sandbox credits.")}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {PACKS.map((pack) => (
          <button
            key={pack.credits}
            className="card p-4 text-left hover:border-orange"
            disabled={pending === pack.credits}
            onClick={async () => {
              setPending(pack.credits);
              await fetch("/api/credits", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ credits: pack.credits }) });
              setPending(0);
              flash(`+${pack.credits}`);
              router.refresh();
            }}
          >
            <div className="text-sm text-muted">{tx(locale, pack.zh, pack.en)}</div>
            <div className="mt-1 text-2xl font-semibold">{pack.credits}</div>
            <div className="mt-3 text-sm text-orange">{tx(locale, "加入余额", "Add to balance")}</div>
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted">{tx(locale, "语言跟随侧栏。若这里仍是英文，刷新即可。", "The header language follows the sidebar after refresh.")}</p>
    </div>
  );
}
