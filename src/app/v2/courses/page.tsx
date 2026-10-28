import { ClassesView } from "@/components/classes-view";
import { CLASSES } from "@/lib/classes";
import { getLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const locale = await getLocale();
  return <ClassesView locale={locale} items={CLASSES} />;
}
