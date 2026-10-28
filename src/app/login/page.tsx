import { tx } from "@/lib/tx";
import { getLocale } from "@/lib/locale";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const locale = await getLocale();
  const next = (await searchParams).next || "/v2/start";
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-sm font-medium text-orange">Beta · {tx(locale, "学习沙盒", "Study sandbox")}</div>
        <h1 className="mt-2 text-2xl font-semibold">Duobaoyu AI Assistant</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          {tx(
            locale,
            "这是本地学习副本。店铺、广告和工具都是模拟数据，不会连接亚马逊。",
            "This is a local study copy. Stores, ads, and tools are mock data. Nothing connects to Amazon.",
          )}
        </p>
        <LoginForm next={next} label={tx(locale, "进入沙盒", "Enter the sandbox")} />
      </div>
    </main>
  );
}
