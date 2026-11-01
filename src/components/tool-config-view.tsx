"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/tx";
import { tx } from "@/lib/tx";
import { withBasePath } from "@/lib/base-path";
import type { FieldDef, ProviderDef } from "@/lib/tool-config/providers";

type Buy = { buy: string; keys: string; buyInferred?: boolean; keysInferred?: boolean };

const xiyouJsonExample = JSON.stringify({
  mcpServers: {
    "xydc-mcp": {
      url: "https://mcp.xydc.com/mcp",
      headers: { Authorization: "Bearer YOUR_MCP_TOKEN" },
    },
  },
}, null, 2);

function XiyouMcpGuide({ locale }: { locale: Locale }) {
  const examples = [
    {
      title: tx(locale, "自动接入（官方推荐）", "Automatic setup (recommended)"),
      text: `${tx(locale, "帮我安装西柚洞察 MCP，以下是我的 MCP Token", "Install Xiyou Insights MCP using my MCP Token")}\n${xiyouJsonExample}`,
    },
    { title: tx(locale, "JSON 配置", "JSON configuration"), text: xiyouJsonExample },
    { title: tx(locale, "MCP 链接（仅支持 URL 的客户端）", "MCP link (URL-only clients)"), text: "https://mcp.xydc.com/mcp?mcp_token=YOUR_MCP_TOKEN" },
  ];

  return (
    <div className="mt-4 space-y-2 rounded-lg border border-[#e8e3da] bg-[#faf9f6] p-4 text-sm">
      <h3 className="font-semibold">{tx(locale, "官方接入方式与配置示例", "Official setup methods and examples")}</h3>
      <p className="leading-6 text-[#5c564f]">{tx(locale, "在西柚 MCP 控制台生成 Token。自动接入时，将替换好 Token 的整段文案交给你信任的 Agent；失败时再使用 JSON 或 MCP 链接。", "Generate a token in the Xiyou MCP console. For automatic setup, replace the token and give the complete setup text to an agent you trust. If that fails, use JSON or the MCP link.")}</p>
      {examples.map((example) => (
        <details key={example.title} className="rounded border border-[#e8e3da] bg-white p-3">
          <summary className="cursor-pointer font-medium">{example.title}</summary>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all text-xs leading-6"><code>{example.text}</code></pre>
        </details>
      ))}
      <p className="text-xs leading-5 text-muted">{tx(locale, "YOUR_MCP_TOKEN 仅为占位符，需替换为你自己的真实 MCP Token。示例不会读取或显示本页已保存的令牌。MCP 链接示例供外部客户端使用，本页仍在下方单独填写 Token。", "YOUR_MCP_TOKEN is a placeholder: replace it with your real MCP Token. These examples never read or display the token saved on this page. The MCP link is for external clients; enter the token separately below on this page.")}</p>
    </div>
  );
}

export function ToolConfigView({ locale }: { locale: Locale }) {
  const [providers, setProviders] = useState<ProviderDef[]>([]);
  const [buy, setBuy] = useState<Record<string, Buy>>({});
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});
  const [draft, setDraft] = useState<Record<string, Record<string, string>>>({});
  const [message, setMessage] = useState<Record<string, { ok: boolean; text: string }>>({});

  async function reload() {
    const res = await fetch(withBasePath("/api/tool-config"));
    const data = await res.json();
    setProviders(data.providers);
    setBuy(data.buy);
    setValues(data.values ?? {});
  }

  useEffect(() => { void reload(); }, []);

  function setField(id: string, key: string, value: string) {
    setDraft((prev) => ({ ...prev, [id]: { ...(prev[id] ?? {}), [key]: value } }));
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <p className="text-sm leading-6 text-[#5c564f]">
        {tx(locale, "密钥只加密存在本机 .secrets，加密口令在 .env.local 的 TOOL_CONFIG_KEY。不会写入 git。没填密钥也可以先跑演示报告；测试连接会说明缺哪一项，不会假装成功。", "Keys stay encrypted in .secrets on this machine. The passphrase is TOOL_CONFIG_KEY in .env.local and is not committed. You can run fixture reports without keys. The connection test says what is missing instead of pretending it worked.")}
      </p>
      {providers.map((provider) => {
        const links = buy[provider.id];
        const renderField = (field: FieldDef) => (
          <label key={field.key} className="block text-sm">
            <span className="font-medium">{tx(locale, field.labelZh, field.labelEn)}{field.inferred ? " · inferred" : ""}</span>
            <input
              className="field mt-1 w-full"
              type={field.secret ? "password" : "text"}
              placeholder={field.secret && values[provider.id]?.[field.key] ? values[provider.id][field.key] : field.defaultValue || ""}
              value={draft[provider.id]?.[field.key] ?? (field.secret ? "" : values[provider.id]?.[field.key] || field.defaultValue || "")}
              onChange={(e) => setField(provider.id, field.key, e.target.value)}
            />
            <span className="mt-1 block text-xs text-muted">{tx(locale, field.helpZh, field.helpEn)}</span>
          </label>
        );
        return (
          <section key={provider.id} className="card p-5">
            <h2 className="text-lg font-semibold">{tx(locale, provider.nameZh, provider.nameEn)}</h2>
            <p className="mt-2 text-sm leading-6 text-[#5c564f]">{tx(locale, provider.noteZh, provider.noteEn)}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {provider.docs.map((doc) => (
                <a key={doc.href} className="text-orange" href={doc.href} target="_blank" rel="noreferrer">{doc.label}</a>
              ))}
              {links && (
                <>
                  <a className="btn-ghost" href={links.buy} target="_blank" rel="noreferrer">{tx(locale, "去官网充值", "Buy credits")}{links.buyInferred ? " · inferred" : ""}</a>
                  <a className="btn-ghost" href={links.keys} target="_blank" rel="noreferrer">{provider.id === "xiyou" ? tx(locale, "获取 MCP Token", "Get MCP Token") : tx(locale, "去官网买密钥", "Get a key")}{links.keysInferred ? " · inferred" : ""}</a>
                </>
              )}
            </div>
            {provider.id === "xiyou" && <XiyouMcpGuide locale={locale} />}
            <form
              className="mt-4 space-y-3"
              onSubmit={async (event) => {
                event.preventDefault();
                const fields: Record<string, string> = {};
                for (const field of provider.fields) {
                  const typed = draft[provider.id]?.[field.key];
                  if (field.secret && !typed) fields[field.key] = values[provider.id]?.[field.key] ? "__keep__" : "";
                  else if (provider.id === "xiyou") fields[field.key] = typed ?? values[provider.id]?.[field.key] ?? field.defaultValue ?? "";
                  else fields[field.key] = typed ?? field.defaultValue ?? values[provider.id]?.[field.key] ?? "";
                }
                const res = await fetch(withBasePath("/api/tool-config"), { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: provider.id, fields }) });
                const data = await res.json();
                if (data.values) setValues(data.values);
                setMessage((prev) => ({ ...prev, [provider.id]: { ok: res.ok, text: res.ok ? tx(locale, "已保存", "Saved") : data.message } }));
              }}
            >
              {provider.fields.filter((field) => !field.advanced).map(renderField)}
              {provider.fields.some((field) => field.advanced) && (
                <details className="rounded-lg border border-[#e8e3da] p-3">
                  <summary className="cursor-pointer text-sm font-medium">{tx(locale, "独立 OpenAPI 配置（可选，非 MCP 接入）", "Separate OpenAPI configuration (optional, not MCP)")}</summary>
                  <div className="mt-3 space-y-3">{provider.fields.filter((field) => field.advanced).map(renderField)}</div>
                </details>
              )}
              <div className="flex flex-wrap gap-2">
                <button className="btn-orange" type="submit">{tx(locale, "保存", "Save")}</button>
                <button
                  className="btn-ghost"
                  type="button"
                  onClick={async () => {
                    const res = await fetch(withBasePath("/api/tool-config/test"), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: provider.id }) });
                    const data = await res.json();
                    setMessage((prev) => ({ ...prev, [provider.id]: { ok: Boolean(data.ok), text: data.message || tx(locale, "没有返回说明", "No message") } }));
                  }}
                >
                  {tx(locale, "测试连接", "Test connection")}
                </button>
              </div>
            </form>
            {message[provider.id] && (
              <p className={`mt-3 text-sm ${message[provider.id].ok ? "text-emerald-700" : "text-[#9a3412]"}`}>{message[provider.id].text}</p>
            )}
          </section>
        );
      })}
    </div>
  );
}
