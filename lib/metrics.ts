export type YearlyMetric = {
  year: number;
  acmPanels: number;
  sealPanels: number;
  totalPanels: number;
  acmShare: number;
  acmPerWeek: number;
  headline: string;
};

export type MixRow = {
  year: number;
  dry: number;
  wet: number;
  srs: number;
  per: number;
  other: number;
  bvr: number;
  rsc: number;
  note: string;
};

export type CrewReview = {
  id: string;
  name: string;
  email: string;
  hireDate: string;
  activeWeeks: number;
  acmPanels: number;
  acmPerWeek: number;
  acmShare: number;
  context: string;
  strengths: string[];
  opportunities: string[];
};

export type CrewSummaryBreakdown = {
  label: string;
  totalAcm: number;
  currentCrew: number;
  legacyCrew: number;
  shop: number;
};

export const yearlyMetrics: YearlyMetric[] = [
  {
    year: 2015,
    acmPanels: 14912,
    sealPanels: 1,
    totalPanels: 14913,
    acmShare: 1,
    acmPerWeek: 286.8,
    headline: "Pure ACM baseline",
  },
  {
    year: 2023,
    acmPanels: 12984,
    sealPanels: 34239,
    totalPanels: 47223,
    acmShare: 0.275,
    acmPerWeek: 249.7,
    headline: "Volume spike, diluted mix",
  },
  {
    year: 2024,
    acmPanels: 15337,
    sealPanels: 7792,
    totalPanels: 23129,
    acmShare: 0.663,
    acmPerWeek: 300.7,
    headline: "ACM renaissance year",
  },
  {
    year: 2025,
    acmPanels: 10146,
    sealPanels: 9196,
    totalPanels: 19342,
    acmShare: 0.525,
    acmPerWeek: 215.9,
    headline: "YTD mix shift",
  },
];

export const acmMix: MixRow[] = [
  {
    year: 2015,
    dry: 0.33,
    wet: 0.29,
    srs: 0.08,
    per: 0.14,
    other: 0.13,
    bvr: 0.01,
    rsc: 0.01,
    note: "Balanced DRY/WET/PER mix",
  },
  {
    year: 2023,
    dry: 0.266,
    wet: 0.034,
    srs: 0.506,
    per: 0.11,
    other: 0.013,
    bvr: 0,
    rsc: 0.071,
    note: "SRS explosion, WET fades",
  },
  {
    year: 2024,
    dry: 0.23,
    wet: 0.025,
    srs: 0.464,
    per: 0.099,
    other: 0.182,
    bvr: 0,
    rsc: 0,
    note: "SRS dominant, Other grows",
  },
  {
    year: 2025,
    dry: 0.128,
    wet: 0.104,
    srs: 0.606,
    per: 0.129,
    other: 0.012,
    bvr: 0,
    rsc: 0.021,
    note: "SRS crosses 60% of ACM",
  },
];

export const crewSummary = {
  lifetime: {
    label: "2015 + 2023-2025",
    totalAcm: 53379,
    currentCrew: 11504,
    legacyCrew: 40921,
    shop: 954,
  },
  modern: {
    label: "2024-2025",
    totalAcm: 25533,
    currentCrew: 10295,
    legacyCrew: 15187,
    shop: 51,
  },
  highlights: [
    "Robert Hutchinson sits #2 all-time for ACM output",
    "Cristian Fuentes already cracked the top-10 despite short tenure",
  ],
};

export const crewReviews: CrewReview[] = [
  {
    id: "robert-hutchinson",
    name: "Robert Hutchinson",
    email: "robert@acmweekly.com",
    hireDate: "2023-01-03",
    activeWeeks: 143,
    acmPanels: 3509,
    acmPerWeek: 24.5,
    acmShare: 0.882,
    context: "Anchor operator, steady mix of DRY + SRS across three seasons.",
    strengths: [
      "Elite lifetime ACM volume comparable to 2015 legends",
      "High mix purity keeps him in the work that matters",
    ],
    opportunities: [
      "Lean on him for training standards and troubleshooting playbooks",
    ],
  },
  {
    id: "cristian-fuentes",
    name: "Cristian Fuentes",
    email: "cristian@acmweekly.com",
    hireDate: "2024-08-15",
    activeWeeks: 65,
    acmPanels: 1767,
    acmPerWeek: 27.2,
    acmShare: 0.744,
    context: "Built a top-10 ACM total in barely a year.",
    strengths: [
      "Velocity player with ~27 ACM/week",
      "Mix stays ACM-focused while still touching support work",
    ],
    opportunities: ["Protect from burnout; funnel him to high-complexity SRS"],
  },
  {
    id: "phil-perry",
    name: "Phil Perry",
    email: "phil@acmweekly.com",
    hireDate: "2024-10-09",
    activeWeeks: 57,
    acmPanels: 992,
    acmPerWeek: 17.4,
    acmShare: 0.801,
    context: "Reliable mid-to-high throughput ACM generalist.",
    strengths: ["80% ACM share with consistent cadence"],
    opportunities: [
      "Pair him with docs/enablement to codify SRS steps",
    ],
  },
  {
    id: "louie-rodriguez",
    name: "Louie Rodriguez",
    email: "louie@acmweekly.com",
    hireDate: "2024-06-12",
    activeWeeks: 74,
    acmPanels: 927,
    acmPerWeek: 12.5,
    acmShare: 0.158,
    context: "Swiss-army assembler who still logs big ACM totals.",
    strengths: [
      "High raw ACM counts despite mostly running other systems",
      "Wide job exposure helps him flex across crews",
    ],
    opportunities: ["Deliberately raise ACM share toward 40%"],
  },
  {
    id: "brandon-wolter",
    name: "Brandon Wolter",
    email: "brandon.w@acmweekly.com",
    hireDate: "2024-05-08",
    activeWeeks: 73,
    acmPanels: 894,
    acmPerWeek: 12.2,
    acmShare: 0.182,
    context: "Cross-system utility player with dependable ACM dash-ins.",
    strengths: ["Keeps ACM throughput up while absorbing seal-and-stack"],
    opportunities: ["Plan a gradual ACM bias (18% → 40%)"],
  },
  {
    id: "caleb-wierda",
    name: "Caleb Wierda",
    email: "caleb@acmweekly.com",
    hireDate: "2023-04-19",
    activeWeeks: 65,
    acmPanels: 380,
    acmPerWeek: 5.8,
    acmShare: 0.406,
    context: "CNC-first operator who hops in when the table needs hands.",
    strengths: ["Balances CNC ownership with meaningful ACM output"],
    opportunities: [
      "Use him to bridge CNC → Assembly feedback loops",
    ],
  },
  {
    id: "chris-bonnell",
    name: "Chris Bonnell",
    email: "chris@acmweekly.com",
    hireDate: "2024-11-26",
    activeWeeks: 27,
    acmPanels: 142,
    acmPerWeek: 5.3,
    acmShare: 0.563,
    context: "CNC-heavy hybrid role similar expectations as Caleb.",
    strengths: ["56% ACM share shows his assembly time is high-leverage"],
    opportunities: [
      "Track CNC uptime + ACM assists in a single dashboard tile",
    ],
  },
  {
    id: "rachael-beacon",
    name: "Rachael Beacon",
    email: "rachael@acmweekly.com",
    hireDate: "2025-04-23",
    activeWeeks: 30,
    acmPanels: 635,
    acmPerWeek: 21.2,
    acmShare: 0.914,
    context: "Parts quarterback who flips to ACM and stays there.",
    strengths: [
      "High ACM/week for a hybrid role",
      "91% ACM share proves the parts → ACM relay works",
    ],
    opportunities: ["Formalize the dual-track scope so success is clear"],
  },
  {
    id: "selena-chavez",
    name: "Selena Chavez",
    email: "selena@acmweekly.com",
    hireDate: "2025-07-08",
    activeWeeks: 20,
    acmPanels: 279,
    acmPerWeek: 14,
    acmShare: 0.732,
    context: "Another parts+ACM hybrid ramping quickly.",
    strengths: ["14 ACM/week after just a few months"],
    opportunities: ["Mirror Rachael's guardrails for success"],
  },
  {
    id: "juan-rodriguez",
    name: "Juan Rodriguez",
    email: "juan@acmweekly.com",
    hireDate: "2025-04-15",
    activeWeeks: 28,
    acmPanels: 713,
    acmPerWeek: 25.5,
    acmShare: 0.891,
    context: "New hire trending toward Cristian-level throughput.",
    strengths: ["25+ ACM/week in first 6 months"],
    opportunities: ["Start grooming him as SRS/DRY go-to"],
  },
  {
    id: "mario-rodriguez",
    name: "Mario Rodriguez",
    email: "mario@acmweekly.com",
    hireDate: "2025-05-02",
    activeWeeks: 30,
    acmPanels: 551,
    acmPerWeek: 18.4,
    acmShare: 0.963,
    context: "Almost pure ACM specialist with excellent cadence.",
    strengths: ["Near-100% ACM mix keeps skills sharp"],
    opportunities: ["Keep him shielded from seal-and-stack distractions"],
  },
  {
    id: "nicholas-hartz",
    name: "Nicholas Hartz",
    email: "nicholas@acmweekly.com",
    hireDate: "2025-10-03",
    activeWeeks: 8,
    acmPanels: 144,
    acmPerWeek: 18,
    acmShare: 0.966,
    context: "Sample size small, trajectory mirrors Mario's ramp.",
    strengths: ["Fast ramp with deep ACM concentration"],
    opportunities: ["Validate the trend over the next quarter"],
  },
  {
    id: "anthony-martinez",
    name: "Anthony D. Martinez Jr.",
    email: "anthony@acmweekly.com",
    hireDate: "2025-09-09",
    activeWeeks: 10,
    acmPanels: 115,
    acmPerWeek: 11.5,
    acmShare: 0.3,
    context: "Still in exposure mode with a generalist load.",
    strengths: ["Solid ACM pace while cross-training"],
    opportunities: ["Decide whether to bias him toward ACM or keep general"],
  },
  {
    id: "charles-mccoy",
    name: "Charles McCoy",
    email: "charles@acmweekly.com",
    hireDate: "2025-09-25",
    activeWeeks: 9,
    acmPanels: 98,
    acmPerWeek: 10.9,
    acmShare: 0.325,
    context: "Paired onboarding with Anthony; similar expectations.",
    strengths: ["Healthy ACM reps during immersion"],
    opportunities: ["Use next review to set a focused lane"],
  },
  {
    id: "brandon-york",
    name: "Brandon York",
    email: "brandon@acmweekly.com",
    hireDate: "2024-04-12",
    activeWeeks: 23,
    acmPanels: 358,
    acmPerWeek: 15.6,
    acmShare: 0.465,
    context: "Ops/PM lead jumping on the table in 2024 weeks 15-38.",
    strengths: ["Produces at full-time assembler pace when needed"],
    opportunities: ["Use this data to justify higher-leverage ops focus"],
  },
];

export const companyHeadlineStats = {
  analyzedPanels: 53379,
  strongestYear: 2024,
  strongestYearRate: 300.7,
  currentCrewShare: 0.4,
  highPuritySpecialists: 5,
};
