import { ApprovalList } from "@/components/approval-list";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const locale = await getLocale();
  const [rows, stores, connections] = await Promise.all([
    prisma.approval.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.store.findMany(),
    prisma.aiConnection.findMany(),
  ]);
  const names = new Map(stores.map((s) => [s.id, s.name]));
  return (
    <ApprovalList
      locale={locale}
      executeOn={connections.some((c) => c.allowAiExecute)}
      items={rows.map((row) => {
        const preview = row.preview as { lines?: { target?: string; match?: string; before?: string; after?: string; note?: string }[] };
        return {
          id: row.id,
          kind: row.kind,
          toolName: row.toolName,
          title: row.title,
          summary: row.summary,
          status: row.status,
          lines: preview.lines ?? [],
          storeName: names.get(row.storeId) ?? row.storeId,
        };
      })}
    />
  );
}
