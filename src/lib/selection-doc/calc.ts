/** Planning math replayed from the published arrow-bag-quiver review. Not a live quote. */

export type PlanInputs = {
  id: "A0" | "A1" | "A2";
  name: string;
  price: number;
  fob: number;
  raw: [number, number, number, number, number, number];
};

const WEIGHTS = [0.25, 0.25, 0.2, 0.15, 0.1, 0.05] as const;

export const ASSUMPTIONS = {
  quantity: 300,
  taxRate: 0.426,
  taxLow: 0.176,
  taxHigh: 0.626,
  freight: 0.95,
  insurance: 0.05,
  customs: 0.6,
  inbound: 0.4,
  referral: 0.15,
  fba: 6.37,
  storageReserve: 0.25,
  returnReserveRate: 0.04,
  cpc: 0.7,
  cvr: 0.12,
  targetMargin: 0.15,
  sampleBudget: 600,
  contingency: 0.1,
  hts: "4202.92.91.00",
  htsNote: "inferred candidate from the published USITC note in the golden flow tree; not a binding classification",
};

export function logisticsReserve() {
  const a = ASSUMPTIONS;
  return a.freight + a.insurance + a.customs + a.inbound;
}

export function score(raw: PlanInputs["raw"]) {
  const weighted = raw.reduce((sum, value, i) => sum + value * WEIGHTS[i], 0);
  return { weighted5: weighted, score100: Math.round(weighted * 20) };
}

export function evaluate(plan: PlanInputs, quantity = ASSUMPTIONS.quantity) {
  const a = ASSUMPTIONS;
  const L = logisticsReserve();
  const duty = plan.fob * a.taxRate;
  const landed = plan.fob + duty + L;
  const referral = plan.price * a.referral;
  const returnReserve = plan.price * a.returnReserveRate;
  const adCpa = a.cpc / a.cvr;
  const beforeAds = plan.price - landed - referral - a.fba - a.storageReserve - returnReserve;
  const unit = beforeAds - adCpa;
  const worst = beforeAds - (a.cpc * 1.2) / (a.cvr * 0.9);
  const landedCap = plan.price * (1 - a.referral - a.returnReserveRate - a.targetMargin) - a.fba - a.storageReserve - adCpa;
  const fobCap = (landedCap - L) / (1 + a.taxRate);
  const cash = (quantity * landed + quantity * adCpa + a.sampleBudget) * (1 + a.contingency);
  const scored = score(plan.raw);
  let verdict: "NO-GO" | "HOLD" | "GO" = "HOLD";
  if (unit < 0 || plan.id === "A0") verdict = "NO-GO";
  if (plan.id === "A2") verdict = "NO-GO";
  if (plan.id === "A1") verdict = "HOLD";
  return {
    ...plan,
    duty,
    landed,
    referral,
    returnReserve,
    adCpa,
    beforeAds,
    unit,
    margin: unit / plan.price,
    worst,
    landedCap,
    fobCap,
    cash,
    ...scored,
    verdict,
    inferred: plan.id === "A1" || plan.id === "A0" || plan.id === "A2",
  };
}

export const PLANS: PlanInputs[] = [
  { id: "A0", name: "同质基础款", price: 22.99, fob: 3.4, raw: [3, 1, 2, 1, 3, 3] },
  { id: "A1", name: "成人可靠性改良款", price: 27.99, fob: 2.8, raw: [3, 3, 2, 4, 3, 3] },
  { id: "A2", name: "高配减振款", price: 32.99, fob: 4.2, raw: [2, 2, 2, 3, 2, 2] },
];
