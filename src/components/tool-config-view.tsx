"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/tx";
import { tx } from "@/lib/tx";
import { withBasePath } from "@/lib/base-path";

type Field = { key: string; labelZh: string; labelEn: string; secret?: boolean; defaultValue?: string; helpZh: string; helpEn: string; inferred?: boolean };
type Provider = { id: string; nameZh: string; nameEn: string; docs: { href: string; label: string }[]; fields: Field[]; noteZh: string; noteEn: string };
type Buy = { buy: string; keys: string; buyInferred?: boolean; keysInferred?: boolean };

export function ToolConfigView({ locale }: { locale: Locale }) {
  const [providers, setProviders] = useState<Provider[]>([]);
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
                  <a className="btn-ghost" href={links.keys} target="_blank" rel="noreferrer">{tx(locale, "去官网买密钥", "Get a key")}{links.keysInferred ? " · inferred" : ""}</a>
                </>
              )}
            </div>
            <form
              className="mt-4 space-y-3"
              onSubmit={async (event) => {
                event.preventDefault();
                const fields: Record<string, string> = {};
                for (const field of provider.fields) {
                  const typed = draft[provider.id]?.[field.key];
                  if (field.secret && !typed) fields[field.key] = values[provider.id]?.[field.key] ? "__keep__" : "";
                  else fields[field.key] = typed ?? field.defaultValue ?? values[provider.id]?.[field.key] ?? "";
                }
                const res = await fetch(withBasePath("/api/tool-config"), { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: provider.id, fields }) });
                const data = await res.json();
                if (data.values) setValues(data.values);
                setMessage((prev) => ({ ...prev, [provider.id]: { ok: res.ok, text: res.ok ? tx(locale, "已保存", "Saved") : data.message } }));
              }}
            >
              {provider.fields.map((field) => (
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
              ))}
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
