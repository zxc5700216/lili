/** Client-safe Codex one-click install prompt (no Node/fs). */

export function buildCodexInstallPrompt(mcpUrl: string, opts?: { skillCount?: number; locale?: "zh" | "en" }): string {
  const skillCount = opts?.skillCount;
  const skillHint =
    typeof skillCount === "number" && skillCount > 0
      ? `There are about ${skillCount} skills on this server.`
      : "Load the full skill catalog from the server.";

  return [
    "You are configuring Codex for 粒粒lili (MCP server key: lili).",
    "",
    "1) Add MCP server `lili` (Streamable HTTP) with this exact URL:",
    `   ${mcpUrl}`,
    "   Write or merge into ~/.codex/config.toml:",
    "   [mcp_servers.lili]",
    `   url = "${mcpUrl}"`,
    "   Equivalent JSON for clients that use mcpServers.json:",
    `   {"mcpServers":{"lili":{"url":"${mcpUrl}"}}}`,
    "",
    "2) Install / sync ALL skills after MCP connects:",
    `   ${skillHint}`,
    "   Prefer calling MCP tools meta_search_skills then meta_load_skill for each skill you need,",
    "   or list workflows via meta_list_workflows. If helpful, you may also fetch the zip from",
    `   ${mcpUrl.replace(/\/api\/mcp\/?$/, "/api/codex-bundle")} and copy skills/*/SKILL.md into ~/.codex/skills/.`,
    "",
    "3) Completely quit and restart Codex if needed, then start a NEW chat.",
    "   Old chats will not see the new MCP / skills — do not reuse the current chat for verification.",
    "",
    "4) In the new chat, run /mcp and confirm `lili` is connected, then briefly confirm you can call a meta_* tool.",
    "",
    "Do the file edits yourself. Ask before any write that changes Amazon ads or store data.",
  ].join("\n");
}

export const CODEX_COPY_TOAST_ZH = "已复制，请粘贴到 Codex 聊天框让它自己安装";
export const CODEX_COPY_TOAST_EN = "Copied — paste into a Codex chat and let it install itself";
