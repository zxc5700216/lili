export type MarketCall = {
  id: string;
  at: string;
  tool: string;
  args: Record<string, unknown>;
  purpose: string;
  step: 1 | 2 | 3 | 4;
  usedForConclusion: boolean;
};

export type Niche = {
  id: "A" | "B" | "C" | "D" | "E";
  name: string;
  stance: string;
  why: string;
};

export type ReviewRow = {
  id: string;
  asin: string;
  stars: number;
  date: string;
  excerpt: string;
  included: boolean;
  themes: string[];
  reason: string;
};

export type SelectionInput = {
  keyword: string;
  marketplace: "US";
  /** Pause after niche split until set. */
  nicheChoice?: "A" | "B" | "C" | "D" | "E";
  /** Trial quantity confirmed at the tariff step. */
  quantity?: number;
  /** When false, stop after calculations and do not write the review HTML. */
  deliver?: boolean;
};
