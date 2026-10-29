import { BASE_PATH as CONFIG_BASE_PATH } from "@/lib/base-path";
import fs from "node:fs";
import path from "node:path";

export type BundleSkill = {
  slug: string;
  zh: string;
  en: string;
  zhSum: string;
  enSum: string;
  stepsZh: string[];
  stepsEn: string[];
  tools: string[];
};

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item)).filter(Boolean);
}

export function skillFolderName(slug: string): string {
  const stripped = String(slug || "").replace(/^duobaoyu-/i, "");
  const safe = stripped
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return safe || "skill";
}

export function resolvePublicMcpUrl(request: Request): {
  proto: string;
  host: string;
  basePath: string;
  mcpUrl: string;
} {
  const url = new URL(request.url);
  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    url.protocol.replace(":", "") ||
    "http";
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host") ||
    url.host;

  let basePath = (process.env.NEXT_PUBLIC_BASE_PATH || process.env.BASE_PATH || "")
    .trim()
    .replace(/\/$/, "");

  if (!basePath) {
    const forwardedPrefix = request.headers.get("x-forwarded-prefix")?.trim().replace(/\/$/, "") || "";
    if (forwardedPrefix) basePath = forwardedPrefix;
  }

  if (!basePath) {
    const match = url.pathname.match(/^(\/[^/]+)\/api\//);
    if (match && match[1] && match[1] !== "/api") basePath = match[1];
  }

  if (!basePath) {
    const referer = request.headers.get("referer") || "";
    const match = referer.match(/https?:\/\/[^/]+(\/studylab)(?:\/|$)/i);
    if (match) basePath = match[1];
  }

  // Next.js strips basePath from request.url inside route handlers; use config constant.
  if (!basePath && CONFIG_BASE_PATH) {
    basePath = String(CONFIG_BASE_PATH).replace(/\/$/, "");
  }

  const mcpUrl = `${proto}://${host}${basePath}/api/mcp`;
  return { proto, host, basePath, mcpUrl };
}

function fromJsonFile(): BundleSkill[] {
  const file = path.join(process.cwd(), "data", "skills.json");
  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as Array<Record<string, unknown>>;
  return raw.map((row) => ({
    slug: String(row.slug || ""),
    zh: String(row.zh || row.slug || ""),
    en: String(row.en || row.slug || ""),
    zhSum: String(row.zhSum || ""),
    enSum: String(row.enSum || ""),
    stepsZh: asStringArray(row.stepsZh),
    stepsEn: asStringArray(row.stepsEn),
    tools: asStringArray(row.tools),
  }));
}

export async function loadBundleSkills(): Promise<BundleSkill[]> {
  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.skill.findMany({ orderBy: [{ sort: "asc" }, { slug: "asc" }] });
    if (rows.length > 0) {
      return rows.map((row) => ({
        slug: row.slug,
        zh: row.nameZh,
        en: row.nameEn,
        zhSum: row.summaryZh,
        enSum: row.summaryEn,
        stepsZh: asStringArray(row.stepsZh),
        stepsEn: asStringArray(row.stepsEn),
        tools: asStringArray(row.relatedTools),
      }));
    }
  } catch {
    // Prisma / DB unavailable — fall back to shipped JSON.
  }
  return fromJsonFile();
}

function escapeYamlDoubleQuoted(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
}

export function skillToMarkdown(skill: BundleSkill): string {
  const name = skillFolderName(skill.slug);
  const description = escapeYamlDoubleQuoted(
    `${skill.zhSum} ${skill.enSum} Use when running 粒粒lili / Codex workflows that mention this skill; call tools via MCP server lili.`.trim(),
  );
  const stepsZh = skill.stepsZh.length
    ? skill.stepsZh.map((step, i) => `${i + 1}. ${step}`).join("\n")
    : "1. （无步骤）";
  const stepsEn = skill.stepsEn.length
    ? skill.stepsEn.map((step, i) => `${i + 1}. ${step}`).join("\n")
    : "";
  const tools = skill.tools.length
    ? skill.tools.map((tool) => `- \`${tool}\``).join("\n")
    : "- （无关联工具）";

  return `---
name: ${name}
description: "${description}"
---

# ${skill.zh}

${skill.zhSum}

## 步骤

${stepsZh}

${stepsEn ? `## Steps (EN)\n\n${skill.enSum}\n\n${stepsEn}\n` : ""}
## Tools

Call these via the connected MCP server \`lili\`. When online, prefer \`meta_load_skill\` with slug \`${skill.slug}\` for the latest server copy.

${tools}
`;
}

export function buildInstallMarkdown(mcpUrl: string): string {
  return `# 粒粒lili → Codex 一键配置包

本压缩包包含 Codex MCP 配置片段，以及全量 Skill（\`SKILL.md\`）。

## 1. 合并 MCP 配置

把 \`config.snippet.toml\` 里的内容合并进本机：

\`\`\`
~/.codex/config.toml
\`\`\`

当前部署的 MCP 地址：

\`\`\`toml
[mcp_servers.lili]
url = "${mcpUrl}"
\`\`\`

也可参考同目录 \`mcpServers.json\`（部分客户端用 JSON 配 MCP）。

## 2. 安装 Skills

把 \`skills/\` 下每个子目录拷到：

\`\`\`
~/.codex/skills/
\`\`\`

例如：\`skills/acos-spike-triage/SKILL.md\` → \`~/.codex/skills/acos-spike-triage/SKILL.md\`。

## 3. 重启并验证

1. 完全退出并重启 Codex（App / CLI / IDE）。
2. **新开一个对话**（旧对话看不到新 MCP / skills）。
3. 输入 \`/mcp\`，确认出现 \`lili\`。
4. 在线时仍可用 \`meta_load_skill\` 拉取服务端最新版；本地 SKILL.md 是离线镜像。

## 注意

- 改投放等写操作仍走 MCP 审批；本地 skill 只提供步骤说明。
- 若 MCP URL 变了，重新下载本包或只改 \`~/.codex/config.toml\` 里的 \`url\`。
`;
}

export function buildConfigSnippet(mcpUrl: string): string {
  return `[mcp_servers.lili]\nurl = "${mcpUrl}"\n`;
}

export function buildMcpServersJson(mcpUrl: string): string {
  return `${JSON.stringify({ mcpServers: { lili: { url: mcpUrl } } }, null, 2)}\n`;
}
