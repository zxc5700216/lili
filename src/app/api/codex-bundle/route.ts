import { NextResponse } from "next/server";
import JSZip from "jszip";
import {
  buildConfigSnippet,
  buildInstallMarkdown,
  buildMcpServersJson,
  loadBundleSkills,
  resolvePublicMcpUrl,
  skillFolderName,
  skillToMarkdown,
} from "@/lib/codex-bundle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { mcpUrl } = resolvePublicMcpUrl(request);
  const skills = await loadBundleSkills();

  const zip = new JSZip();
  zip.file("INSTALL.md", buildInstallMarkdown(mcpUrl));
  zip.file("config.snippet.toml", buildConfigSnippet(mcpUrl));
  zip.file("mcpServers.json", buildMcpServersJson(mcpUrl));

  const used = new Set<string>();
  for (const skill of skills) {
    let folder = skillFolderName(skill.slug);
    if (used.has(folder)) folder = `${folder}-${used.size}`;
    used.add(folder);
    zip.file(`skills/${folder}/SKILL.md`, skillToMarkdown(skill));
  }

  const buffer = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
  return new NextResponse(Buffer.from(buffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="lili-codex-bundle.zip"',
      "Cache-Control": "no-store",
    },
  });
}
