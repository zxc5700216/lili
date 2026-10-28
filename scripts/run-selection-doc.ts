import path from "node:path";
import { runSelectionDoc } from "../src/lib/selection-doc/run";

const keywordFlag = process.argv.indexOf("--keyword");
const keyword = keywordFlag >= 0 ? process.argv[keywordFlag + 1] : "arrow bag quiver";
const dir = path.join(process.cwd(), "artifacts", "selection-doc", keyword.replace(/\s+/g, "-"));
const result = runSelectionDoc(
  { keyword, marketplace: "US", nicheChoice: "A", quantity: 300, deliver: true },
  dir,
);
console.log(JSON.stringify(result, null, 2));
