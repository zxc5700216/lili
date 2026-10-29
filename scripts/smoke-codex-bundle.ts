/**
 * Smoke: build skill markdown from data/skills.json and assert count ≥ 100.
 * Run: npx tsx scripts/smoke-codex-bundle.ts
 */
import fs from "node:fs";
import path from "node:path";
import { skillFolderName, skillToMarkdown } from "../src/lib/codex-bundle";

async function main() {
  const file = path.join(process.cwd(), "data", "skills.json");
  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as Array<Record<string, unknown>>;
  const skills = raw.map((row) => ({
    slug: String(row.slug || ""),
    zh: String(row.zh || ""),
    en: String(row.en || ""),
    zhSum: String(row.zhSum || ""),
    enSum: String(row.enSum || ""),
    stepsZh: Array.isArray(row.stepsZh) ? row.stepsZh.map(String) : [],
    stepsEn: Array.isArray(row.stepsEn) ? row.stepsEn.map(String) : [],
    tools: Array.isArray(row.tools) ? row.tools.map(String) : [],
  }));

  if (skills.length < 100) {
    throw new Error(`Expected ≥100 skills, got ${skills.length}`);
  }

  const folders = new Set<string>();
  for (const skill of skills) {
    const md = skillToMarkdown(skill);
    if (!md.startsWith("---\nname:")) throw new Error(`Bad frontmatter for ${skill.slug}`);
    if (!md.includes("## 步骤") && !md.includes("## 粒粒步骤") && !md.includes("## 工作流程")) {
      throw new Error(`Missing Chinese steps for ${skill.slug}`);
    }
    if (md.length < 1500) throw new Error(`Body too short for ${skill.slug}: ${md.length}`);
    const name = skillFolderName(skill.slug);
    if (!name) throw new Error(`Empty folder for ${skill.slug}`);
    folders.add(name);
  }

  if (folders.size !== skills.length) {
    throw new Error(`Folder name collision: ${skills.length} skills → ${folders.size} folders`);
  }

  console.log(`ok: ${skills.length} SKILL.md would be packaged (${folders.size} folders)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
