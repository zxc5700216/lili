"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Copy,
  Download,
  Lightbulb,
  Pencil,
  Plus,
  RefreshCw,
  Store,
  Trash2,
  Unplug,
} from "lucide-react";
import { BASE_PATH, withBasePath } from "@/lib/base-path";
import { buildCodexInstallPrompt, CODEX_COPY_TOAST_EN, CODEX_COPY_TOAST_ZH } from "@/lib/codex-install-prompt";
import type { Locale } from "@/lib/tx";
import { tx } from "@/lib/tx";
import { copyText, useUI } from "@/store/ui";

type StoreRow = {
  id: string;
  name: string;
  sellerId: string;
  marketplace: string;
  marketplaceId: string;
  spConnected: boolean;
  lastSyncedAt: string | null;
};
type Profile = {
  id: string;
  storeId: string;
  name: string;
  country: string;
  countryCode: string;
  enabled: boolean;
  neverSynced: boolean;
  lastSyncedAt: string | null;
};
type Connection = {
  id: string;
  name: string;
  client: string;
  allowMarketResearch: boolean;
  allowAiExecute: boolean;
  connectedAt: string;
  lastUsedAt: string;
};

const CLIENTS = [
  { id: "codex", label: "Codex (app)" },
  { id: "chatgpt", label: "ChatGPT (web)" },
  { id: "workbuddy", label: "WorkBuddy" },
  { id: "claude", label: "Claude (web / desktop)" },
  { id: "claude-code", label: "Claude Code (CLI)" },
  { id: "grok", label: "Grok (web)" },
  { id: "accio", label: "Accio Work" },
  { id: "coze", label: "Coze 扣子" },
  { id: "minimax", label: "MiniMax Agent" },
  { id: "openclaw", label: "OpenClaw" },
  { id: "hermes", label: "Hermes" },
  { id: "deepseek", label: "DeepSeek Harness (app)" },
] as const;

type ClientId = (typeof CLIENTS)[number]["id"];

function asClientId(value: string): ClientId {
  return (CLIENTS.find((item) => item.id === value)?.id ?? "codex") as ClientId;
}

function ClientGlyph({ id }: { id: string }) {
  const common = "h-7 w-7";
  const cid = asClientId(id);
  if (cid === "codex") {
    return (
      <svg viewBox="0 0 32 32" className={common} aria-hidden>
        <rect width="32" height="32" rx="8" fill="#4f7cff" />
        <path d="M9 18.5c2.2-4 6.2-5.2 10.2-3.2 1.2.6 2.1 1.3 2.8 2.2-2.6 2-6.2 3.2-9.4 2.6-1.6-.3-2.8-1-3.6-1.6z" fill="white" />
        <circle cx="18.5" cy="14.2" r="1.1" fill="#4f7cff" />
      </svg>
    );
  }
  if (cid === "chatgpt") {
    return (
      <svg viewBox="0 0 32 32" className={common} aria-hidden>
        <path d="M16 6.2l2.1 3.6 4.1.6-3 2.9.7 4.1L16 15.4l-3.9 2 0.7-4.1-3-2.9 4.1-.6z" fill="none" stroke="#111" strokeWidth="1.6" />
        <circle cx="16" cy="16" r="3.1" fill="none" stroke="#111" strokeWidth="1.6" />
        <path d="M16 9.2v3.2M16 19.6V23M9.8 12.4l2.8 1.6M19.4 18l2.8 1.6M9.8 19.6l2.8-1.6M19.4 14l2.8-1.6" stroke="#111" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (cid === "workbuddy") {
    return (
      <svg viewBox="0 0 32 32" className={common} aria-hidden>
        <circle cx="16" cy="16" r="8" fill="none" stroke="#16a34a" strokeWidth="2.2" />
        <path d="M12 16c1.2-2.4 2.6-3.6 4-3.6 2.2 0 3.2 2 4.8 2" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (cid === "claude" || cid === "claude-code") {
    return (
      <svg viewBox="0 0 32 32" className={common} aria-hidden>
        <path d="M16 5l1.6 6.2L24 12l-5.2 2.4L18.6 21 16 15.8 13.4 21 12 14.4 6.8 12l6.4-.8z" fill={cid === "claude" ? "#e07a3d" : "#ef9a4a"} />
      </svg>
    );
  }
  if (cid === "grok") {
    return (
      <svg viewBox="0 0 32 32" className={common} aria-hidden>
        <path d="M8 16c0-4 3-7 7-7 2.4 0 4 .8 5.2 2.2" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M24 16c0 4-3 7-7 7-2.4 0-4-.8-5.2-2.2" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (cid === "accio") {
    return (
      <svg viewBox="0 0 32 32" className={common} aria-hidden>
        <path d="M16 6l9 18H7z" fill="#1a1a1a" />
        <path d="M12.5 18h7" stroke="white" strokeWidth="1.6" />
      </svg>
    );
  }
  if (cid === "coze") {
    return (
      <svg viewBox="0 0 32 32" className={common} aria-hidden>
        <rect x="6" y="6" width="20" height="20" rx="6" fill="#5b5bd6" />
        <circle cx="13" cy="15" r="2" fill="#8fd3ff" />
        <circle cx="19" cy="15" r="2" fill="#ffd36e" />
      </svg>
    );
  }
  if (cid === "minimax") {
    return (
      <svg viewBox="0 0 32 32" className={common} aria-hidden>
        <rect x="7" y="8" width="18" height="16" rx="5" fill="#3b82f6" />
        <circle cx="13" cy="15" r="1.3" fill="white" />
        <circle cx="19" cy="15" r="1.3" fill="white" />
        <path d="M13 19c1.2 1 4.8 1 6 0" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }
  if (cid === "openclaw") {
    return (
      <svg viewBox="0 0 32 32" className={common} aria-hidden>
        <path d="M8 20c2-6 4-8 8-8s6 2 8 8" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M11 14l-2-4M16 12V7M21 14l2-4" stroke="#111" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (cid === "hermes") {
    return (
      <svg viewBox="0 0 32 32" className={common} aria-hidden>
        <circle cx="16" cy="16" r="7" fill="none" stroke="#e07a3d" strokeWidth="2" />
        <path d="M12 16h8M16 12v8" stroke="#e07a3d" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" className={common} aria-hidden>
      <path d="M7 18c4-7 8-8 12-5 2 1.4 3.4 3 5 3-2 3-5 5-9 5-3 0-6-1-8-3z" fill="#3b6cff" />
      <circle cx="20" cy="15" r="1" fill="white" />
    </svg>
  );
}

const MARKETS = ["United States", "Canada", "Mexico", "United Kingdom", "Germany", "Japan"];

const TRIES = [
  {
    titleZh: "改好卖得最好的 Listing",
    titleEn: "Improve your best seller's listing",
    bodyZh: "找出近 30 天卖得最好的款，重写标题、五点和搜索词里最弱的三处。",
    bodyEn: "Picks your best seller of the last 30 days and rewrites the three weakest parts of its title, bullets and search terms.",
    promptZh: "使用粒粒lili。找出近 30 天卖得最好的 ASIN，重写标题、五点和后台搜索词里最弱的三处。先给我预览，我确认后再准备变更。",
    promptEn: "Use 粒粒lili. Pick the best seller of the last 30 days and rewrite the three weakest parts of its title, bullets and search terms. Show me a preview and wait for confirmation.",
  },
  {
    titleZh: "找出浪费的广告花费",
    titleEn: "Find wasted ad spend",
    bodyZh: "找出近 30 天花了钱但没有订单的搜索词，汇总每月浪费，并列出要加的否定词。",
    bodyEn: "Finds search terms that spent without orders in the last 30 days, totals the monthly waste and lists negatives to add.",
    promptZh: "使用粒粒lili。找出近 30 天花了钱但没有订单的搜索词，汇总每月浪费，列出要加的否定词。先给预览，不要直接改广告。",
    promptEn: "Use 粒粒lili. Find search terms that spent without orders in the last 30 days, total the monthly waste, and list negatives to add. Preview first. Do not change ads until I confirm.",
  },
  {
    titleZh: "店铺周复盘",
    titleEn: "Weekly store review",
    bodyZh: "把上周的销售、流量、广告和库存风险和前一周对比，输出一份 HTML 报告。",
    bodyEn: "Last week's sales, traffic, ads and inventory risks against the week before, as an HTML report.",
    promptZh: "使用粒粒lili。对比上周和前一周的销售、流量、广告和库存风险，输出一份 HTML 报告。",
    promptEn: "Use 粒粒lili. Compare last week's sales, traffic, ads and inventory risks with the week before, and deliver an HTML report.",
  },
];

function publicMcpUrl() {
  if (typeof window === "undefined") {
    return `http://127.0.0.1:43123${BASE_PATH}/api/mcp`;
  }
  return `${window.location.origin}${BASE_PATH}/api/mcp`;
}

export function GetStarted({
  locale,
  stores,
  profiles,
  connections,
  skillCount,
}: {
  locale: Locale;
  stores: StoreRow[];
  profiles: Profile[];
  connections: Connection[];
  skillCount: number;
}) {
  const router = useRouter();
  const flash = useUI((s) => s.flash);
  const storeOn = stores.some((s) => s.spConnected);
  const adsOn = profiles.some((p) => p.enabled);
  const aiOn = connections.length > 0;
  const done = Number(storeOn) + Number(adsOn) + Number(aiOn);
  const [open, setOpen] = useState<"store" | "ads" | "ai" | null>(aiOn ? "ai" : !storeOn ? "store" : !adsOn ? "ads" : "ai");
  const [market, setMarket] = useState("United States");
  const [adding, setAdding] = useState(!storeOn);
  const [storeName, setStoreName] = useState("");
  const [client, setClient] = useState<ClientId>("codex");
  const [mode, setMode] = useState<"install" | "manual">("install");
  const [connName, setConnName] = useState("Codex");
  const [prompt, setPrompt] = useState("");
  const [syncFor, setSyncFor] = useState<string | null>(null);
  const [mcpUrl, setMcpUrl] = useState(() => publicMcpUrl());
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setMcpUrl(publicMcpUrl());
  }, []);

  const visibleStores = stores.filter((s) => s.spConnected && s.marketplace === market);
  const connectedStoreCount = stores.filter((s) => s.spConnected).length;

  const manualJson = useMemo(
    () =>
      JSON.stringify(
        {
          mcpServers: {
            lili: { url: mcpUrl },
          },
        },
        null,
        2,
      ),
    [mcpUrl],
  );

  const tomlSnippet = useMemo(() => `[mcp_servers.lili]\nurl = "${mcpUrl}"\n`, [mcpUrl]);

  async function post(url: string, body: unknown, okMsg?: string) {
    setBusy(true);
    try {
      const res = await fetch(withBasePath(url), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        flash(tx(locale, `请求失败 ${res.status}`, `Request failed ${res.status}`));
        return false;
      }
      if (okMsg) flash(okMsg);
      router.refresh();
      return true;
    } catch {
      flash(tx(locale, "网络错误", "Network error"));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function patchConn(id: string, body: unknown, okMsg?: string) {
    setBusy(true);
    try {
      const res = await fetch(withBasePath(`/api/connections/${id}`), {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        flash(tx(locale, `请求失败 ${res.status}`, `Request failed ${res.status}`));
        return false;
      }
      if (okMsg) flash(okMsg);
      router.refresh();
      return true;
    } catch {
      flash(tx(locale, "网络错误", "Network error"));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function deleteConn(id: string) {
    setBusy(true);
    try {
      const res = await fetch(withBasePath(`/api/connections/${id}`), { method: "DELETE" });
      if (!res.ok) {
        flash(tx(locale, `请求失败 ${res.status}`, `Request failed ${res.status}`));
        return;
      }
      flash(tx(locale, "已删除连接", "Connection removed"));
      router.refresh();
    } catch {
      flash(tx(locale, "网络错误", "Network error"));
    } finally {
      setBusy(false);
    }
  }

  const installPrompt = useMemo(() => {
    const label = CLIENTS.find((item) => item.id === client)?.label ?? client;
    const preface = [
      `Client: ${label}. Connection name: ${connName || label}.`,
      "Prefer Streamable HTTP. Server key in config: lili.",
      "Reads use connected store / ads data when authorized on Get Started.",
      "Allow market research and Allow AI to execute actions stay off until toggled on Get Started.",
      "Any write returns a preview and waits for approval.",
      "",
    ].join("\n");
    return `${preface}${buildCodexInstallPrompt(mcpUrl, { skillCount })}`;
  }, [client, connName, mcpUrl, skillCount]);

  return (
    <div className="mx-auto max-w-[980px]">
      <h1 className="text-[28px] font-semibold tracking-tight">
        {done === 3 ? tx(locale, "已全部连接", "All connected") : tx(locale, "开始使用", "Get started")}
      </h1>
      <p className="mt-4 text-sm text-muted">{tx(locale, `已完成 ${done} / 3`, `Completed ${done} of 3`)}</p>
      <div className="mt-2 h-[3px] rounded-full bg-[#f0e4da]">
        <div className="h-[3px] rounded-full bg-orange" style={{ width: `${(done / 3) * 100}%` }} />
      </div>

      {/* First-class: copy Codex install prompt (zip secondary) */}
      <section className="card mt-4 border border-[#f0d4c2] bg-[#fffaf6] px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#3f3a36]">
              <Copy className="h-4 w-4 text-orange" />
              {tx(locale, "一键配置 Codex MCP", "One-click Codex MCP setup")}
            </div>
            <p className="mt-1 text-[13px] leading-5 text-muted">
              {tx(
                locale,
                `点一下复制安装提示词，粘贴到 Codex 聊天框，让它自己加 MCP（lili）并同步约 ${skillCount} 个 Skill；装完后请新开对话。ZIP 配置包可选。`,
                `Click to copy an install prompt — paste into a Codex chat so it adds MCP (lili) and syncs ~${skillCount} skills; then start a NEW chat. ZIP bundle is optional.`,
              )}
            </p>
            <pre className="mt-2 overflow-auto rounded-lg bg-white/80 px-3 py-2 text-[11px] leading-4 text-[#5c564f]">{mcpUrl}</pre>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-orange"
              onClick={async () => {
                await copyText(installPrompt);
                flash(tx(locale, CODEX_COPY_TOAST_ZH, CODEX_COPY_TOAST_EN));
              }}
            >
              <Copy className="h-3.5 w-3.5" />
              {tx(locale, "复制安装提示词", "Copy install prompt")}
            </button>
            <a className="btn-ghost" href={withBasePath("/api/codex-bundle")} download>
              <Download className="h-3.5 w-3.5" />
              {tx(locale, "可选：下载 ZIP", "Optional: ZIP")}
            </a>
            <button
              type="button"
              className="btn-ghost"
              onClick={async () => {
                await copyText(tomlSnippet);
                flash(tx(locale, "已复制 TOML", "TOML copied"));
              }}
            >
              <Copy className="h-3.5 w-3.5" />
              {tx(locale, "复制 TOML", "Copy TOML")}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={async () => {
                await copyText(manualJson);
                flash(tx(locale, "已复制 JSON", "JSON copied"));
              }}
            >
              <Copy className="h-3.5 w-3.5" />
              {tx(locale, "复制 JSON", "Copy JSON")}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setOpen("store");
                setAdding(true);
              }}
            >
              <Store className="h-3.5 w-3.5" />
              {tx(locale, "去授权店铺", "Authorize store")}
            </button>
          </div>
        </div>
      </section>

      <section className="card mt-4 px-5 py-4">
        <StepHead
          done={storeOn}
          title={tx(locale, "授权亚马逊店铺", "Authorize Amazon store")}
          sub={storeOn ? tx(locale, `${connectedStoreCount} 个已连接`, `${connectedStoreCount} connected`) : tx(locale, "尚未连接", "Not connected")}
          open={open === "store"}
          onClick={() => setOpen(open === "store" ? null : "store")}
        />
        {open === "store" && (
          <div className="mt-4 space-y-3">
            <Warn>
              {tx(
                locale,
                "大店第一次同步可能要 12 小时。这期间可以继续。沙盒可用「模拟授权」接好流程。",
                "The first sync can take up to 12 hours for large accounts. You can keep going in the meantime. Sandbox: use Simulate authorization to wire the flow.",
              )}
            </Warn>
            {visibleStores.map((store) => (
              <div key={store.id} className="rounded-xl border border-line">
                <div className="flex items-center gap-3 px-3 py-3">
                  <Store className="h-4 w-4 text-orange" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{store.name}</div>
                    <div className="text-xs text-muted">
                      {store.sellerId} · {store.marketplace}
                    </div>
                  </div>
                  <span className="ml-auto text-sm text-emerald-600">{tx(locale, "已连接", "Connected")}</span>
                  <button
                    type="button"
                    className="text-sm text-[#5c564f]"
                    disabled={busy}
                    onClick={() => post("/api/stores", { action: "disconnect", id: store.id }, tx(locale, "已断开店铺", "Store disconnected"))}
                  >
                    {tx(locale, "断开", "Disconnect")}
                  </button>
                </div>
                <div className="flex items-center gap-3 border-t border-line px-3 py-3 text-sm">
                  <div>
                    <div>{tx(locale, "数据同步", "Data sync")}</div>
                    <div className="text-xs text-muted">{hours(store.lastSyncedAt, locale)}</div>
                  </div>
                  <div className="relative ml-auto">
                    <button type="button" className="btn-ghost" onClick={() => setSyncFor(syncFor === store.id ? null : store.id)}>
                      <RefreshCw className="h-3.5 w-3.5" /> {tx(locale, "立即同步", "Sync now")} <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    {syncFor === store.id && (
                      <div className="absolute right-0 z-10 mt-1 w-44 rounded-xl border border-line bg-white p-1 text-sm shadow">
                        {[
                          ["all", "全部", "Sync all"],
                          ["orders", "订单", "Orders"],
                          ["inventory", "库存", "Inventory"],
                          ["ads", "广告", "Ads"],
                        ].map(([kind, zh, en]) => (
                          <button
                            key={kind}
                            type="button"
                            className="block w-full rounded-lg px-3 py-1.5 text-left hover:bg-canvas"
                            onClick={() => {
                              setSyncFor(null);
                              post("/api/stores", { action: "sync", id: store.id, kind }, tx(locale, "同步已触发", "Sync started"));
                            }}
                          >
                            {tx(locale, zh, en)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {!visibleStores.length && (
              <p className="text-sm text-muted">{tx(locale, "这个站点还没有店铺。选站点后点「再连一个店铺」或「模拟授权」。", "No store on this marketplace yet. Pick a market, then Connect another store / Simulate authorization.")}</p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <select className="field" value={market} onChange={(e) => setMarket(e.target.value)}>
                {MARKETS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <button type="button" className="btn-ghost" onClick={() => setAdding(true)}>
                <Plus className="h-3.5 w-3.5" /> {tx(locale, "再连一个店铺", "Connect another store")}
              </button>
            </div>
            {adding && (
              <form
                className="flex flex-wrap gap-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const ok = await post(
                    "/api/stores",
                    { action: "connect", name: storeName || "Sandbox store", marketplace: market },
                    tx(locale, "店铺已授权（模拟）", "Store authorized (simulated)"),
                  );
                  if (ok) {
                    setAdding(false);
                    setStoreName("");
                  }
                }}
              >
                <input
                  className="field"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder={tx(locale, "店铺名称", "Store name")}
                />
                <button className="btn-orange" type="submit" disabled={busy}>
                  {tx(locale, "模拟授权", "Simulate authorization")}
                </button>
                <button type="button" className="btn-ghost" onClick={() => setAdding(false)}>
                  {tx(locale, "取消", "Cancel")}
                </button>
              </form>
            )}
            <button type="button" className="btn-orange" onClick={() => setOpen("ads")}>
              {tx(locale, "下一步", "Next")}
            </button>
          </div>
        )}
      </section>

      <section className="card mt-3 px-5 py-4">
        <StepHead
          done={adsOn}
          title={tx(locale, "授权广告账户", "Authorize ads account")}
          sub={adsOn ? tx(locale, "已授权", "Authorized") : tx(locale, "尚未授权", "Not authorized")}
          open={open === "ads"}
          onClick={() => setOpen(open === "ads" ? null : "ads")}
        />
        {open === "ads" && (
          <div className="mt-4 space-y-3">
            {!profiles.length && (
              <div className="space-y-2">
                <Warn>
                  {tx(
                    locale,
                    "还没有广告资料。请先授权店铺，再点「再连一个广告账户」生成 CA / MX / US 资料（沙盒）。",
                    "No ads profiles yet. Authorize a store first, then Connect another ads account to seed CA / MX / US profiles (sandbox).",
                  )}
                </Warn>
                <button
                  type="button"
                  className="btn-orange"
                  disabled={busy || !stores.length}
                  onClick={() =>
                    post("/api/ads-profiles", { action: "another" }, tx(locale, "已生成广告资料", "Ads profiles created"))
                  }
                >
                  <Plus className="h-3.5 w-3.5" /> {tx(locale, "授权 / 生成广告资料", "Authorize / seed ads profiles")}
                </button>
              </div>
            )}
            {profiles.map((profile) => (
              <div key={profile.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line px-3 py-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-peach text-orange">
                  <Store className="h-4 w-4" />
                </span>
                <div className="min-w-[140px]">
                  <div className="text-sm font-medium">{profile.name}</div>
                  <div className="text-xs text-muted">{profile.countryCode}</div>
                </div>
                <span className="ml-auto text-sm text-muted">
                  {profile.neverSynced || !profile.lastSyncedAt
                    ? tx(locale, "从未", "Never")
                    : hours(profile.lastSyncedAt, locale)}
                </span>
                <label className="flex items-center gap-2 text-sm">
                  {tx(locale, "启用", "Enabled")}
                  <input
                    type="checkbox"
                    checked={profile.enabled}
                    disabled={busy}
                    onChange={(e) =>
                      post("/api/ads-profiles", {
                        id: profile.id,
                        enabled: e.target.checked,
                        neverSynced: e.target.checked ? false : profile.neverSynced,
                      })
                    }
                  />
                </label>
                <button
                  type="button"
                  className="btn-ghost"
                  disabled={busy}
                  onClick={() =>
                    post("/api/ads-profiles", { id: profile.id, action: "sync" }, tx(locale, "广告同步已触发", "Ads sync started"))
                  }
                >
                  <RefreshCw className="h-3.5 w-3.5" /> {tx(locale, "立即同步", "Sync now")}
                </button>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 text-sm">
              <button
                type="button"
                className="btn-ghost"
                disabled={busy}
                onClick={() => post("/api/ads-profiles", { action: "another" }, tx(locale, "已添加广告账户", "Ads account added"))}
              >
                <Plus className="h-3.5 w-3.5" /> {tx(locale, "再连一个广告账户", "Connect another ads account")}
              </button>
              <button
                type="button"
                className="btn-ghost"
                disabled={busy}
                onClick={() => post("/api/ads-profiles", { action: "refresh" }, tx(locale, "资料已刷新", "Profiles refreshed"))}
              >
                <RefreshCw className="h-3.5 w-3.5" /> {tx(locale, "刷新资料", "Refresh profiles")}
              </button>
              <button
                type="button"
                className="btn-ghost"
                disabled={busy}
                onClick={() => post("/api/ads-profiles", { action: "disconnect" }, tx(locale, "广告已断开", "Ads disconnected"))}
              >
                <Unplug className="h-3.5 w-3.5" /> {tx(locale, "断开", "Disconnect")}
              </button>
            </div>
            <button type="button" className="btn-orange" onClick={() => setOpen("ai")}>
              {tx(locale, "下一步", "Next")}
            </button>
          </div>
        )}
      </section>

      <section className="card mt-3 px-5 py-4">
        <StepHead
          done={aiOn}
          title={tx(locale, "连接你的 AI", "Connect your AI")}
          sub={aiOn ? tx(locale, "连接已创建", "Connection created") : tx(locale, "尚未连接", "Not connected")}
          open={open === "ai"}
          onClick={() => setOpen(open === "ai" ? null : "ai")}
        />
        {open === "ai" && (
          <div className="mt-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#f0d4c2] bg-[#fffaf6] px-3 py-3">
              <div className="text-[13px] leading-5 text-[#5c564f]">
                {tx(
                  locale,
                  `也可一键复制安装提示词（含 MCP + 约 ${skillCount} 个 Skill）；ZIP 包可选。`,
                  `Or copy the install prompt (MCP + ~${skillCount} skills); ZIP is optional.`,
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-orange"
                  onClick={async () => {
                    await copyText(installPrompt);
                    flash(tx(locale, CODEX_COPY_TOAST_ZH, CODEX_COPY_TOAST_EN));
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                  {tx(locale, "复制安装提示词", "Copy install prompt")}
                </button>
                <a className="btn-ghost" href={withBasePath("/api/codex-bundle")} download>
                  <Download className="h-3.5 w-3.5" />
                  {tx(locale, "可选 ZIP", "Optional ZIP")}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {CLIENTS.map((item) => {
                const selected = client === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setClient(item.id);
                      setConnName(item.label.split(" (")[0]);
                    }}
                    className={`flex min-h-[92px] flex-col items-center justify-center rounded-xl border bg-white px-2 py-3 text-center text-[12px] leading-4 ${selected ? "border-[#e36a33] text-orange shadow-[0_0_0_1px_#e36a33]" : "border-[#eee6df] text-[#3f3a36]"}`}
                  >
                    <ClientGlyph id={item.id} />
                    <span className="mt-1.5">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex gap-2 text-[13px]">
              <button
                type="button"
                className={`rounded-full px-3 py-1 ${mode === "install" ? "bg-[#fde7da] text-orange" : "bg-[#f3eee8] text-[#5c564f]"}`}
                onClick={() => setMode("install")}
              >
                {tx(locale, "让 AI 自己安装", "Let the AI install it")}
              </button>
              <button
                type="button"
                className={`rounded-full px-3 py-1 ${mode === "manual" ? "bg-[#fde7da] text-orange" : "bg-[#f3eee8] text-[#5c564f]"}`}
                onClick={() => setMode("manual")}
              >
                {tx(locale, "手动添加", "Add it manually")}
              </button>
            </div>
            {mode === "install" ? (
              <div className="mt-4 text-sm">
                <p className="text-[13px] leading-5 text-muted">
                  {tx(
                    locale,
                    `把提示词贴进 ${connName || "Codex"}，它会自己写配置。不行就改用「手动添加」。`,
                    `Paste a prompt into ${connName || "Codex"} and it writes its own config. Didn't work? Switch to "Add it manually".`,
                  )}
                </p>
                <ol className="mt-4 space-y-4">
                  <li>
                    <div className="flex items-center gap-2 font-medium">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#f3eee8] text-xs text-[#6b645c]">1</span>
                      {tx(locale, "生成安装提示词并复制", "Generate the install prompt and copy it")}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 pl-7">
                      <span className="text-sm text-muted">{tx(locale, "名称", "Name")}</span>
                      <input className="field w-44" value={connName} onChange={(e) => setConnName(e.target.value)} />
                      <button
                        type="button"
                        className="h-9 rounded-full bg-orange px-4 text-sm font-medium text-white disabled:opacity-60"
                        disabled={busy}
                        onClick={async () => {
                          setPrompt(installPrompt);
                          await copyText(installPrompt);
                          flash(tx(locale, CODEX_COPY_TOAST_ZH, CODEX_COPY_TOAST_EN));
                          if (connections[0]) await patchConn(connections[0].id, { name: connName || "Codex", client });
                          else await post("/api/connections", { name: connName || "Codex", client }, tx(locale, "连接已创建", "Connection created"));
                        }}
                      >
                        {tx(locale, "生成", "Generate")}
                      </button>
                    </div>
                    {prompt && <pre className="mt-2 overflow-auto rounded-xl bg-canvas p-3 text-xs leading-5">{prompt}</pre>}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#f3eee8] text-xs text-[#6b645c]">2</span>
                    {tx(locale, `贴进 ${connName || "Codex"}，它会自己安装`, `Paste it into ${connName || "Codex"}. It installs itself`)}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#f3eee8] text-xs text-[#6b645c]">3</span>
                    {tx(locale, "新开一个对话，再问店铺的事", "Start a new chat and ask about your store")}
                  </li>
                </ol>
                <div className="mt-3">
                  <Warn>
                    {tx(
                      locale,
                      "必须新开一个对话。粒粒lili只会出现在添加之后打开的对话里。在旧对话里问，AI 会说没有店铺数据。",
                      "You must start a NEW chat! 粒粒lili only shows up in chats opened after you add it. Ask in the old chat and the AI will say it has no store data.",
                    )}
                  </Warn>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-sm">
                <p className="text-[13px] leading-5 text-muted">
                  {tx(
                    locale,
                    "把下面的地址加到客户端（Streamable HTTP）。生产环境带 /lili 前缀；本机沙盒同样走 basePath。",
                    "Add this URL in the client (Streamable HTTP). Production uses the /lili prefix; local sandbox uses the same basePath.",
                  )}
                </p>
                <pre className="mt-2 overflow-auto rounded-xl bg-canvas p-3 text-xs">{manualJson}</pre>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={async () => {
                      await copyText(manualJson);
                      flash(tx(locale, "已复制 JSON", "JSON copied"));
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" /> {tx(locale, "复制 JSON", "Copy JSON")}
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={async () => {
                      await copyText(tomlSnippet);
                      flash(tx(locale, "已复制 TOML", "TOML copied"));
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" /> {tx(locale, "复制 Codex TOML", "Copy Codex TOML")}
                  </button>
                  <button
                    type="button"
                    className="btn-orange"
                    disabled={busy}
                    onClick={() =>
                      post(
                        "/api/connections",
                        { name: connName || CLIENTS.find((c) => c.id === client)?.label.split(" (")[0] || "Codex", client },
                        tx(locale, "连接已创建", "Connection created"),
                      )
                    }
                  >
                    {tx(locale, "标记为已连接", "Mark as connected")}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-5 text-sm font-medium">{tx(locale, "已连接的 AI", "Connected AI assistants")}</div>
            <div className="mt-2 space-y-2">
              {!connections.length && (
                <p className="text-sm text-muted">{tx(locale, "还没有连接。生成安装提示词或手动添加后点「标记为已连接」。", "No connections yet. Generate an install prompt or mark as connected after manual setup.")}</p>
              )}
              {connections.map((conn) => (
                <div key={conn.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-[#eee6df] px-3 py-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#fff1e8] text-orange">
                    <ClientGlyph id={conn.client || client} />
                  </span>
                  <div className="min-w-[180px]">
                    {renamingId === conn.id ? (
                      <form
                        className="flex items-center gap-2"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const ok = await patchConn(conn.id, { name: renameValue || conn.name }, tx(locale, "已重命名", "Renamed"));
                          if (ok) setRenamingId(null);
                        }}
                      >
                        <input className="field h-8 w-40" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} autoFocus />
                        <button type="submit" className="btn-orange h-8 px-3 text-xs">
                          {tx(locale, "保存", "Save")}
                        </button>
                        <button type="button" className="btn-ghost h-8 px-2 text-xs" onClick={() => setRenamingId(null)}>
                          {tx(locale, "取消", "Cancel")}
                        </button>
                      </form>
                    ) : (
                      <button
                        type="button"
                        className="flex items-center gap-1 text-sm font-medium"
                        onClick={() => {
                          setRenamingId(conn.id);
                          setRenameValue(conn.name);
                        }}
                      >
                        {conn.name} <Pencil className="h-3.5 w-3.5 text-muted" />
                      </button>
                    )}
                    <div className="text-xs text-muted">
                      {tx(locale, "连接于", "connected")} {conn.connectedAt.slice(0, 10)} · {tx(locale, "最近使用", "last used")}{" "}
                      {conn.lastUsedAt.slice(0, 10)}
                    </div>
                  </div>
                  <label className="ml-auto flex items-center gap-2 text-sm">
                    <input
                      className="h-4 w-4 accent-[#e86a2c]"
                      type="checkbox"
                      checked={conn.allowMarketResearch}
                      disabled={busy}
                      onChange={(e) => patchConn(conn.id, { allowMarketResearch: e.target.checked })}
                    />
                    {tx(locale, "允许市场调研", "Allow market research")}
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      className="h-4 w-4 accent-[#e86a2c]"
                      type="checkbox"
                      checked={conn.allowAiExecute}
                      disabled={busy}
                      onChange={(e) => patchConn(conn.id, { allowAiExecute: e.target.checked })}
                    />
                    {tx(locale, "允许 AI 执行操作", "Allow AI to execute actions")}
                  </label>
                  <button
                    type="button"
                    aria-label="Refresh"
                    className="text-muted"
                    disabled={busy}
                    onClick={() => patchConn(conn.id, { name: conn.name }, tx(locale, "已刷新", "Refreshed"))}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button type="button" aria-label="Delete" className="text-muted" disabled={busy} onClick={() => deleteConn(conn.id)}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <Link href="/v2/courses/codex-basics" className="mt-3 flex items-center justify-between rounded-xl bg-[#fff4ee] px-4 py-3 text-sm">
              <span className="flex items-center gap-2 text-[#3f3a36]">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-white text-orange">AI</span>
                {tx(locale, "刚接触这些 AI 工具？", "New to these AI tools?")}
              </span>
              <span className="font-medium text-orange">
                {tx(locale, "AI 基础课", "AI basics class")} →
              </span>
            </Link>
          </div>
        )}
      </section>

      <div className="mt-8 mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{tx(locale, "试一试", "Try these")}</h2>
        <Link href="/v2/cases" className="text-sm text-muted">
          {tx(locale, "全部工作流模板", "All workflow templates")}
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {TRIES.map((item) => (
          <article key={item.titleEn} className="card p-4">
            <Lightbulb className="h-4 w-4 text-orange" />
            <h3 className="mt-2 font-semibold">{tx(locale, item.titleZh, item.titleEn)}</h3>
            <p className="mt-1 line-clamp-3 text-sm leading-5 text-[#5c564f]">{tx(locale, item.bodyZh, item.bodyEn)}</p>
            <button
              type="button"
              className="btn-orange mt-4"
              onClick={() => {
                copyText(tx(locale, item.promptZh, item.promptEn));
                flash(tx(locale, "已复制", "Copied"));
              }}
            >
              <Copy className="h-3.5 w-3.5" /> {tx(locale, "复制提示词", "Copy prompt")}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

function StepHead({
  done,
  title,
  sub,
  open,
  onClick,
}: {
  done: boolean;
  title: string;
  sub: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className="flex w-full items-center gap-3 text-left" onClick={onClick}>
      <span className={`grid h-6 w-6 place-items-center rounded-full ${done ? "bg-emerald-500 text-white" : "border border-[#eadfd6]"}`}>
        {done && <Check className="h-3.5 w-3.5" />}
      </span>
      <span>
        <span className="block font-semibold">{title}</span>
        {!open && <span className="block text-sm text-muted">{sub}</span>}
        {open && <span className="block text-sm text-emerald-600">{sub}</span>}
      </span>
    </button>
  );
}

function Warn({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 rounded-xl bg-[#fff4ee] px-3 py-2 text-sm leading-5 text-[#9a5b3c]">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

function hours(value: string | null, locale: Locale) {
  if (!value) return tx(locale, "尚未同步", "Never synced");
  const h = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 36e5));
  return tx(locale, `上次同步于 ${h} 小时前`, `Last synced ${h} hour${h === 1 ? "" : "s"} ago`);
}
