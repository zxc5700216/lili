import { WORKFLOWS, runWorkflowPack } from "../src/lib/workflows/pack";

const all = process.argv.includes("--all");
const live = process.argv.includes("--live");
const slugFlag = process.argv.indexOf("--slug");
const slugs = all ? WORKFLOWS.map((item) => item.slug) : [process.argv[slugFlag + 1]];

async function main() {
  for (const slug of slugs) {
    try {
      const result = await runWorkflowPack(slug, live ? "live" : "fixture");
      console.log(slug, result.status, result.dir);
    } catch (error) {
      console.error(slug, error instanceof Error ? error.message : error);
      process.exitCode = 2;
    }
  }
}

void main();
