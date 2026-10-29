"use client";

import { Check, Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/tx";
import { tx } from "@/lib/tx";
import { withBasePath } from "@/lib/base-path";

type Member = { id: string; name: string; email: string; role: string; status: string };

export function TeamView({ locale, members }: { locale: Locale; members: Member[] }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const admin = members.find((m) => m.role === "admin") ?? members[0];
  async function send(body: unknown, method = "POST") {
    await fetch(withBasePath("/api/team"), { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    router.refresh();
  }
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      <section className="card flex items-center gap-3 p-4">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-peach text-lg font-semibold text-orange">{(admin?.name || "?").slice(0, 1)}</span>
        <div>
          <div className="font-semibold">{admin?.name}</div>
          <div className="text-sm text-muted">{members.length} {tx(locale, "位成员 · 你是管理员", "members · You're the admin")}</div>
        </div>
      </section>
      <section className="card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="font-medium">{tx(locale, "成员", "Members")} ({members.length})</div>
          <form className="ml-auto flex gap-2" onSubmit={(e) => { e.preventDefault(); send({ action: "invite", email }); setEmail(""); }}>
            <input className="field w-56" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={tx(locale, "同事的邮箱", "Colleague's email")} />
            <button className="btn-orange" type="submit">{tx(locale, "邀请", "Invite")}</button>
          </form>
        </div>
        <ul className="mt-3 divide-y divide-line">
          {members.map((member, index) => (
            <li key={member.id} className="flex items-center gap-3 py-3 text-sm">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-peach text-orange">{index + 1}</span>
              <div className="min-w-0">
                {editing === member.id ? (
                  <input className="field" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => { send({ action: "rename", id: member.id, name }); setEditing(null); }} />
                ) : (
                  <div>{member.email}</div>
                )}
                {member.status === "invited" && <div className="text-xs text-muted">{tx(locale, "已邀请", "Invited")}</div>}
              </div>
              {member.role === "admin" && <span className="ml-auto text-orange">{tx(locale, "管理员", "Admin")}</span>}
              <button aria-label="Edit" onClick={() => { setEditing(member.id); setName(member.name); }}><Pencil className="h-4 w-4 text-muted" /></button>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-2xl bg-[#f3f0ea] p-4 text-sm leading-6">
        <div className="mb-2 font-medium">{tx(locale, "团队里共享的", "Shared across the team")}</div>
        {[
          ["店铺和广告账户（只有管理员能连接或断开，并决定每个成员能看到哪些店）", "Store and ads accounts (only the admin connects or disconnects them and decides which stores each member can see)"],
          ["店铺数据和全部功能", "Store data and all features"],
          ["管理员的积分和订阅额度", "The admin's credits and subscription quota"],
        ].map(([zh, en]) => (
          <div key={en} className="flex gap-2"><Check className="mt-1 h-4 w-4 text-emerald-600" />{tx(locale, zh, en)}</div>
        ))}
        <p className="mt-2 text-muted">{tx(locale, "AI 连接和密钥是个人的，每个成员在「开始使用」里自己连。", "AI connections and API keys are personal — each member connects their own on Get Started.")}</p>
      </section>
    </div>
  );
}
