import Link from "next/link";
import { notFound } from "next/navigation";
import { CLASSES } from "@/lib/classes";
import { getLocale } from "@/lib/locale";
import { tx } from "@/lib/tx";

export default async function CourseDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const item = CLASSES.find((row) => row.slug === slug);
  if (!item) notFound();
  const outline = locale === "en" ? item.outlineEn : item.outlineZh;
  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/v2/courses" className="text-sm text-muted">{tx(locale, "全部课程", "All classes")}</Link>
      <h1 className="mt-3 text-2xl font-semibold">{tx(locale, item.titleZh, item.titleEn)}</h1>
      <p className="mt-2 text-sm text-muted">{tx(locale, item.metaZh, item.metaEn)} · {tx(locale, item.priceZh, item.priceEn)}</p>
      <p className="mt-4 text-sm leading-6">{tx(locale, item.summaryZh, item.summaryEn)}</p>
      <ol className="mt-4 space-y-2">
        {outline.map((line, i) => (
          <li key={line} className="card px-4 py-3 text-sm"><span className="mr-2 font-semibold text-orange">{i + 1}</span>{line}</li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-muted">
        {tx(locale, "沙盒不提供录像、收款或企业微信。上面是学习提纲。", "This sandbox does not play a recording, take payment, or add WeCom. The list above is the study outline.")}
      </p>
    </article>
  );
}
