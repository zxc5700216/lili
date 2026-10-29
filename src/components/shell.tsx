"use client";

import { withBasePath } from "@/lib/base-path";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  CircleHelp,
  Coins,
  Download,
  Globe,
  Headset,
  KeyRound,
  Lightbulb,
  LogOut,
  Menu,
  MessageSquare,
  Rocket,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/tx";
import { tx } from "@/lib/tx";
import { useUI } from "@/store/ui";

const TOP = [
  { href: "/v2/start", icon: Rocket, zh: "开始使用", en: "Get Started" },
  { href: "/v2/cases", icon: Lightbulb, zh: "工作流模板", en: "Workflow Templates" },
  { href: "/v2/skills", icon: Sparkles, zh: "技能", en: "Skills" },
  { href: "/v2/courses", icon: BookOpen, zh: "课程", en: "Classes" },
];

const BOTTOM = [
  { href: "/v2/tool-config", icon: KeyRound, zh: "工具配置", en: "Tool setup" },
  { href: "/v2/team", icon: Users, zh: "团队", en: "Team" },
  { href: "/v2/settings", icon: Settings, zh: "设置", en: "Settings" },
];

function titleFor(pathname: string, locale: Locale) {
  const all = [...TOP, ...BOTTOM, { href: "/v2/recharge", icon: Coins, zh: "充值", en: "Top Up" }, { href: "/v2/workflows", icon: Lightbulb, zh: "演示报告", en: "Demo reports" }, { href: "/v2/tools", icon: Sparkles, zh: "工具实验室", en: "Tool lab" }, { href: "/v2/approvals", icon: Settings, zh: "审批", en: "Approvals" }];
  const hit = all.find((item) => pathname === item.href || pathname.startsWith(item.href + "/"));
  if (!hit) return { icon: Rocket, label: "粒粒lili" };
  return { icon: hit.icon, label: tx(locale, hit.zh, hit.en) };
}

export function Shell({
  locale,
  email,
  credits,
  children,
}: {
  locale: Locale;
  email: string;
  credits: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { navOpen, setNav, dialog, notice, openDialog, toast } = useUI();
  const heading = titleFor(pathname, locale);
  const Icon = heading.icon;

  async function setLocale(next: Locale) {
    await fetch(withBasePath("/api/preferences"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });
    router.refresh();
  }

  async function signOut() {
    await fetch(withBasePath("/api/session"), { method: "DELETE" });
    window.location.href = withBasePath("/login");
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <aside className={`${navOpen ? "fixed inset-0 z-40 flex" : "hidden"} lg:sticky lg:top-0 lg:flex h-screen flex-col bg-white lg:border-r lg:border-line`}>
        <div className="flex items-start gap-2 px-4 pb-1 pt-5">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-orange text-white">
            <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
              <path d="M5 17c4-6 10-7.2 16-4 2 1 3.2 2 4 3.4-4 3-9 4.8-14 3.8-2.4-.5-4.2-1.6-6-3.2z" fill="white" />
              <circle cx="20" cy="14.5" r="1.2" fill="#e86a2c" />
            </svg>
          </span>
          <div className="min-w-0">
            <div className="text-[14px] font-semibold leading-5">粒粒lili助手</div>
            <div className="mt-0.5 flex items-center gap-1 text-[11px] leading-4 text-muted">
              <span className="rounded bg-[#fde7da] px-1 py-px text-[10px] font-medium text-orange">Beta</span>
              <span>{tx(locale, "11 月 1 日正式发布", "Official launch Nov 1")}</span>
            </div>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setNav(false)} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-5 space-y-0.5 px-3">
          {TOP.map((item) => (
            <NavLink key={item.href} {...item} locale={locale} pathname={pathname} onNavigate={() => setNav(false)} />
          ))}
        </nav>
        <div className="flex-1" />
        <div className="space-y-1 px-3 pb-2">
          {BOTTOM.map((item) => (
            <NavLink key={item.href} {...item} locale={locale} pathname={pathname} onNavigate={() => setNav(false)} />
          ))}
        </div>
        <div className="flex items-center gap-2 px-4 py-2 text-sm">
          <Globe className="h-4 w-4 text-muted" />
          <button className={locale === "zh" ? "rounded-full bg-orange px-2 py-0.5 text-white" : "px-1 text-ink"} onClick={() => setLocale("zh")}>中文</button>
          <button className={locale === "en" ? "rounded-full bg-orange px-2 py-0.5 text-white" : "px-1 text-ink"} onClick={() => setLocale("en")}>EN</button>
        </div>
        <div className="truncate px-4 pb-1 text-xs text-muted">{email}</div>
        <button className="mx-2 mb-3 flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-ink hover:bg-canvas" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          {tx(locale, "退出", "Sign out")}
        </button>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 bg-canvas/95 px-4 backdrop-blur lg:px-7">
          <button className="lg:hidden" onClick={() => setNav(true)} aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-[15px] font-medium">
            <Icon className="h-[18px] w-[18px] text-orange" />
            {heading.label}
          </div>
          <div className="ml-auto flex items-center gap-1 sm:gap-3">
            <a
              href={withBasePath("/api/codex-bundle")}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#f3ddcf] bg-white px-2.5 py-1.5 text-sm text-orange hover:bg-peach"
              title={tx(locale, "一键配置 Codex MCP · 全量下载 Skill", "One-click Codex MCP setup · Download all skills")}
              aria-label={tx(locale, "一键配置 Codex MCP · 全量下载 Skill", "One-click Codex MCP setup · Download all skills")}
            >
              <Download className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline">{tx(locale, "一键配置 Codex MCP · 全量下载 Skill", "Codex MCP · All skills")}</span>
              <span className="hidden sm:inline lg:hidden">{tx(locale, "Codex 配置", "Codex setup")}</span>
            </a>
            <HeaderButton icon={MessageSquare} label={tx(locale, "反馈", "Feedback")} onClick={() => openDialog("feedback")} />
            <HeaderButton icon={Headset} label={tx(locale, "支持", "Support")} onClick={() => openDialog("support")} />
            <Link href="/v2/start" className="hidden items-center gap-1.5 text-sm text-[#5c564f] sm:flex">
              <CircleHelp className="h-4 w-4" />
              {tx(locale, "帮助中心", "Help Center")}
            </Link>
            <Link href="/v2/recharge" className="ml-1 flex items-center overflow-hidden rounded-full border border-[#f3ddcf] bg-white text-sm">
              <span className="flex items-center gap-1 px-2.5 py-1.5 text-[#5c564f]">
                <Coins className="h-4 w-4 text-orange" />
                <span className="hidden sm:inline">{credits} {tx(locale, "积分", "credits")}</span>
              </span>
              <span className="bg-orange px-3 py-1.5 font-medium text-white">{tx(locale, "充值", "Top up")}</span>
            </Link>
          </div>
        </header>
        <div key={locale} className="px-4 pb-16 pt-2 lg:px-8">{children}</div>
      </div>

      {dialog === "feedback" && <FeedbackDialog locale={locale} onClose={() => openDialog(null)} />}
      {dialog === "support" && <SupportDialog locale={locale} onClose={() => openDialog(null)} />}
      {dialog === "notice" && (
        <Modal title={tx(locale, "学习沙盒", "Study sandbox")} onClose={() => openDialog(null)}>
          <p className="text-sm leading-6 text-[#4a433d]">{notice}</p>
        </Modal>
      )}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function NavLink({
  href,
  icon: Icon,
  zh,
  en,
  locale,
  pathname,
  onNavigate,
}: {
  href: string;
  icon: typeof Rocket;
  zh: string;
  en: string;
  locale: Locale;
  pathname: string;
  onNavigate: () => void;
}) {
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm ${active ? "bg-peach font-medium text-orange" : "text-[#3f3a36] hover:bg-canvas"}`}
    >
      <Icon className="h-[18px] w-[18px]" />
      {tx(locale, zh, en)}
    </Link>
  );
}

function HeaderButton({ icon: Icon, label, onClick }: { icon: typeof Rocket; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="hidden items-center gap-1.5 text-sm text-[#5c564f] sm:flex">
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" onClick={onClose}>
      <div className="card w-full max-w-lg p-5" onClick={(event) => event.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FeedbackDialog({ locale, onClose }: { locale: Locale; onClose: () => void }) {
  const flash = useUI((s) => s.flash);
  const [pending, setPending] = useState(false);
  return (
    <Modal title={tx(locale, "反馈", "Feedback")} onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          setPending(true);
          await fetch(withBasePath("/api/feedback"), {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ kind: form.get("kind"), body: form.get("body"), contact: form.get("contact") }),
          });
          setPending(false);
          flash(tx(locale, "已收到，只存在这台沙盒里", "Saved in this sandbox"));
          onClose();
        }}
      >
        <select name="kind" className="field w-full">
          <option value="idea">{tx(locale, "产品建议", "Product idea")}</option>
          <option value="data">{tx(locale, "数据问题", "Data question")}</option>
          <option value="other">{tx(locale, "其他", "Other")}</option>
        </select>
        <textarea name="body" required className="field h-28 w-full py-2" placeholder={tx(locale, "想说的话", "What should change")} />
        <input name="contact" className="field w-full" placeholder={tx(locale, "联系方式，可空", "Contact, optional")} />
        <button className="btn-orange" disabled={pending} type="submit">{tx(locale, "提交", "Send")}</button>
      </form>
    </Modal>
  );
}

function SupportDialog({ locale, onClose }: { locale: Locale; onClose: () => void }) {
  return (
    <Modal title={tx(locale, "支持", "Support")} onClose={onClose}>
      <p className="text-sm leading-6 text-[#4a433d]">
        {tx(
          locale,
          "这里不会接通粒粒lili客服，也不会提交工单到官方。学习问题可以写在反馈里。工具和审批在下面两个沙盒页面。",
          "This does not reach 粒粒lili support and does not open a real ticket. Write study notes in Feedback. Tools and approvals live on the two sandbox pages below.",
        )}
      </p>
      <label className="mt-4 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="h-4 w-4 accent-[#e86a2c]"
          checked={useUI((s) => s.sandboxExtras)}
          onChange={(e) => useUI.getState().setSandboxExtras(e.target.checked)}
        />
        {tx(locale, "显示沙盒演练（正式产品没有）", "Show sandbox rehearsal (not in the live product)")}
      </label>
      <div className="mt-4 flex gap-2">
        <Link className="btn-orange" href="/v2/tools" onClick={onClose}>{tx(locale, "工具实验室", "Tool lab")}</Link>
        <Link className="btn-ghost" href="/v2/approvals" onClick={onClose}>{tx(locale, "审批", "Approvals")}</Link>
      </div>
    </Modal>
  );
}
