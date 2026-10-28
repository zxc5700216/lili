import fs from "node:fs";
import path from "node:path";
import { planSet } from "./render";
import { renderFlowTree, renderHtml } from "./render";
import { COMPETITORS, LEDGER, NICHES, REVIEWS } from "./ledger";
import type { SelectionInput } from "./types";

export type SelectionArtifacts = {
  status: "paused_gate_1" | "paused_gate_2" | "delivered";
  dir: string;
  files: string[];
  paidRequests: number;
  verdict: string | null;
};

export function runSelectionDoc(input: SelectionInput, dir: string): SelectionArtifacts {
  fs.mkdirSync(dir, { recursive: true });
  const quantity = input.quantity ?? 300;
  const step1 = LEDGER.filter((call) => call.step === 1);
  const evidence = {
    keyword: input.keyword,
    marketplace: input.marketplace,
    fixture: true,
    inferred: ["amazon-product-selection uses public private-label + profit-analyzer plus the golden hard gates"],
    paidRequests: 0,
    replayedLedgerSize: LEDGER.length,
    step1Budget: 10,
    step1Calls: step1.length,
    niches: NICHES,
    pauseGate1: input.nicheChoice ?? null,
  };
  const files = ["evidence.json"];
  fs.writeFileSync(path.join(dir, "evidence.json"), JSON.stringify(evidence, null, 2));
  if (!input.nicheChoice) {
    return { status: "paused_gate_1", dir, files, paidRequests: 0, verdict: null };
  }

  const stage = {
    ...evidence,
    nicheChoice: input.nicheChoice,
    competitors: COMPETITORS,
    keywordResearch: { keyword: "hip quiver", searches: 2859, purchaseEstimate: 46, products: 211, note: "replayed figure from the golden ledger; 12% CVR is not derived from this" },
    reviews: REVIEWS,
    reviewDenominator: REVIEWS.filter((row) => row.included).length,
    sourcing: LEDGER.filter((call) => call.id === "M25" || call.id === "M26" || call.id === "M27").map((call) => ({
      id: call.id,
      tool: call.tool,
      args: call.args,
      price: 0,
      moq: 0,
      usableQuote: false,
    })),
    ledger: LEDGER,
  };
  fs.writeFileSync(path.join(dir, "stage2-5-evidence.json"), JSON.stringify(stage, null, 2));
  files.push("stage2-5-evidence.json");

  const plans = planSet(quantity);
  fs.writeFileSync(path.join(dir, "calculations.json"), JSON.stringify({ quantity, plans, source: "local arithmetic, not a market response" }, null, 2));
  files.push("calculations.json");
  const tree = renderFlowTree({ ...input, quantity }, plans);
  fs.writeFileSync(path.join(dir, "flow-tree.md"), tree);
  files.push("flow-tree.md");

  if (input.deliver === false) {
    return { status: "paused_gate_2", dir, files, paidRequests: 0, verdict: "HOLD" };
  }
  fs.writeFileSync(path.join(dir, "review.html"), renderHtml({ ...input, quantity }, plans));
  files.push("review.html");
  return { status: "delivered", dir, files, paidRequests: 0, verdict: "HOLD" };
}
