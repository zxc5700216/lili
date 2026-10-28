import { cookies } from "next/headers";
import type { Locale } from "./tx";

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  return jar.get("dby_locale")?.value === "zh" ? "zh" : "en";
}

export function money(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);
}

export function pct(ratio: number) {
  if (!Number.isFinite(ratio)) return "—";
  return `${(ratio * 100).toFixed(1)}%`;
}

export function dayKey(value: Date | string | null | undefined) {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toISOString().slice(0, 10);
}

export function hoursAgo(value: Date | string | null | undefined, locale: Locale) {
  if (!value) return locale === "en" ? "Never synced" : "尚未同步";
  const d = typeof value === "string" ? new Date(value) : value;
  const hours = Math.max(1, Math.round((Date.now() - d.getTime()) / 36e5));
  if (locale === "en") return `Last synced ${hours} hour${hours === 1 ? "" : "s"} ago`;
  return `上次同步于 ${hours} 小时前`;
}
