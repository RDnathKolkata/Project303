// Realistic mock data for a student / young-adult user of Fin Plus.
// All amounts are in INR.

export type Category = "Rent" | "Food" | "Tech" | "Savings" | "Fun" | "Transport" | "EMI";

export type Transaction = {
  id: string;
  date: string;
  merchant: string;
  category: Category;
  amount: number;
  hour: number;
  impulse?: boolean;
};

export type IncomeSource = { id: string; label: string; amount: number };

export type Emi = {
  id: string;
  name: string;
  monthly: number;
  remainingMonths: number;
  totalMonths: number;
  rate: number;
  principal: number;
};

export const USER = {
  name: "Aarav",
  alias: "sage_owl_42",
  score: 780,
  scoreMax: 900,
  tier: "Wise Saver",
  streak: 12,
};

export const INCOME_SOURCES: IncomeSource[] = [
  { id: "i1", label: "Internship stipend", amount: 22000 },
  { id: "i2", label: "Family allowance", amount: 8000 },
  { id: "i3", label: "Freelance design", amount: 4500 },
];

export const EMIS: Emi[] = [
  {
    id: "e1",
    name: "Laptop EMI",
    monthly: 4166,
    remainingMonths: 7,
    totalMonths: 12,
    rate: 13.5,
    principal: 50000,
  },
  {
    id: "e2",
    name: "Education loan",
    monthly: 3200,
    remainingMonths: 34,
    totalMonths: 48,
    rate: 9.2,
    principal: 140000,
  },
];

export const BUDGET_CATEGORIES = [
  { key: "Rent", label: "Rent / Hostel", share: 32 },
  { key: "Food", label: "Food", share: 22 },
  { key: "Tech", label: "Tech", share: 10 },
  { key: "Savings", label: "Savings", share: 24 },
  { key: "Fun", label: "Fun", share: 12 },
] as const;

export const ACTUAL_SPEND: Record<string, number> = {
  Rent: 9500,
  Food: 8940,
  Tech: 2450,
  Savings: 6000,
  Fun: 4820,
};

export const MONTHLY_TREND = [
  { month: "Feb", income: 32000, expenses: 26400, savings: 5600 },
  { month: "Mar", income: 33500, expenses: 27800, savings: 5700 },
  { month: "Apr", income: 34500, expenses: 29100, savings: 5400 },
  { month: "May", income: 34500, expenses: 26900, savings: 7600 },
  { month: "Jun", income: 34500, expenses: 30250, savings: 4250 },
  { month: "Jul", income: 34500, expenses: 28710, savings: 5790 },
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    date: "Jul 28",
    merchant: "Swiggy — Late night biryani",
    category: "Food",
    amount: 640,
    hour: 23,
    impulse: true,
  },
  {
    id: "t2",
    date: "Jul 28",
    merchant: "Hostel mess dues",
    category: "Rent",
    amount: 3200,
    hour: 11,
  },
  {
    id: "t3",
    date: "Jul 27",
    merchant: "Zomato — 1am snacks",
    category: "Food",
    amount: 410,
    hour: 1,
    impulse: true,
  },
  {
    id: "t4",
    date: "Jul 26",
    merchant: "Metro card recharge",
    category: "Transport",
    amount: 500,
    hour: 9,
  },
  {
    id: "t5",
    date: "Jul 26",
    merchant: "Nykaa flash sale",
    category: "Fun",
    amount: 1290,
    hour: 22,
    impulse: true,
  },
  {
    id: "t6",
    date: "Jul 25",
    merchant: "Laptop EMI auto-debit",
    category: "EMI",
    amount: 4166,
    hour: 6,
  },
  {
    id: "t7",
    date: "Jul 24",
    merchant: "Index fund SIP",
    category: "Savings",
    amount: 3000,
    hour: 8,
  },
  {
    id: "t8",
    date: "Jul 23",
    merchant: "Mechanical keyboard",
    category: "Tech",
    amount: 2450,
    hour: 20,
    impulse: true,
  },
  { id: "t9", date: "Jul 22", merchant: "Campus cafe", category: "Food", amount: 180, hour: 16 },
  {
    id: "t10",
    date: "Jul 21",
    merchant: "Movie + popcorn",
    category: "Fun",
    amount: 760,
    hour: 21,
  },
  {
    id: "t11",
    date: "Jul 20",
    merchant: "Education loan EMI",
    category: "EMI",
    amount: 3200,
    hour: 6,
  },
  {
    id: "t12",
    date: "Jul 19",
    merchant: "Recurring deposit",
    category: "Savings",
    amount: 3000,
    hour: 8,
  },
];

export type Habit = {
  id: string;
  title: string;
  detail: string;
  severity: "high" | "medium" | "low";
  deltaPct: number;
  monthlyLeak: number;
  trend: { week: string; value: number }[];
  fixes: string[];
};

export const HABITS: Habit[] = [
  {
    id: "h1",
    title: "Late-night food delivery",
    detail:
      "High impulse spending detected on food delivery between 11pm and 2am — 9 orders this month.",
    severity: "high",
    deltaPct: 34,
    monthlyLeak: 3860,
    trend: [
      { week: "W1", value: 620 },
      { week: "W2", value: 890 },
      { week: "W3", value: 1140 },
      { week: "W4", value: 1210 },
    ],
    fixes: [
      "Delete saved cards from delivery apps so every order needs a fresh OTP.",
      "Stock ₹300 of instant late-night snacks — it replaces ~5 orders.",
      "Set an app timer that blocks delivery apps after 10:30pm.",
    ],
  },
  {
    id: "h2",
    title: "Flash-sale gadget buys",
    detail:
      "Two unplanned tech purchases in 30 days, both within 10 minutes of a sale notification.",
    severity: "medium",
    deltaPct: 18,
    monthlyLeak: 2450,
    trend: [
      { week: "W1", value: 0 },
      { week: "W2", value: 1160 },
      { week: "W3", value: 0 },
      { week: "W4", value: 1290 },
    ],
    fixes: [
      "Apply a 48-hour rule: add to wishlist, buy only if you still want it in two days.",
      "Turn off promotional push notifications for shopping apps.",
    ],
  },
  {
    id: "h3",
    title: "Savings paused mid-month",
    detail:
      "Your SIP has been moved after the 20th for 3 straight months, cutting compounding time.",
    severity: "low",
    deltaPct: -6,
    monthlyLeak: 900,
    trend: [
      { week: "W1", value: 3000 },
      { week: "W2", value: 0 },
      { week: "W3", value: 0 },
      { week: "W4", value: 3000 },
    ],
    fixes: ["Move the SIP date to the day after your stipend lands (the 3rd)."],
  },
];

export type Challenge = {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  reward: number;
};

export const CHALLENGES: Challenge[] = [
  {
    id: "c1",
    title: "Zero impulse spending days",
    description: "Finish a day without a single flagged impulse transaction.",
    current: 4,
    target: 5,
    reward: 40,
  },
  {
    id: "c2",
    title: "Log every expense",
    description: "Record all spends for 7 days straight.",
    current: 6,
    target: 7,
    reward: 25,
  },
  {
    id: "c3",
    title: "Cook-at-home nights",
    description: "Replace delivery with a home-cooked meal.",
    current: 2,
    target: 4,
    reward: 30,
  },
  {
    id: "c4",
    title: "Finish 3 micro-lessons",
    description: "Complete any three Academy lessons this week.",
    current: 1,
    target: 3,
    reward: 50,
  },
];

export const STREAK_DAYS = [
  { day: "Mon", done: true },
  { day: "Tue", done: true },
  { day: "Wed", done: true },
  { day: "Thu", done: false },
  { day: "Fri", done: true },
  { day: "Sat", done: true },
  { day: "Sun", done: true },
];

export type LeaderRow = {
  id: string;
  alias: string;
  adherence: number;
  streak: number;
  lessonScore: number;
  isUser?: boolean;
};

export const LEADERBOARD: LeaderRow[] = [
  { id: "l1", alias: "quiet_fern_08", adherence: 96, streak: 27, lessonScore: 940 },
  { id: "l2", alias: "amber_kite_11", adherence: 93, streak: 21, lessonScore: 880 },
  { id: "l3", alias: "sage_owl_42", adherence: 91, streak: 12, lessonScore: 780, isUser: true },
  { id: "l4", alias: "brisk_pine_77", adherence: 88, streak: 15, lessonScore: 720 },
  { id: "l5", alias: "copper_wren_03", adherence: 84, streak: 9, lessonScore: 690 },
  { id: "l6", alias: "slate_moth_19", adherence: 80, streak: 6, lessonScore: 640 },
  { id: "l7", alias: "olive_dune_55", adherence: 76, streak: 4, lessonScore: 610 },
  { id: "l8", alias: "clay_finch_21", adherence: 71, streak: 3, lessonScore: 540 },
];

export type StarterTip = {
  id: string;
  title: string;
  body: string;
  action: string;
};

export const STARTER_TIPS: StarterTip[] = [
  {
    id: "s1",
    title: "Build a 1-month buffer first",
    body: "Before investing, park one month of expenses (about ₹28,000 for you) in a sweep-in savings account. It stops one bad week from becoming debt.",
    action: "Open the budget tool",
  },
  {
    id: "s2",
    title: "Automate savings on payday",
    body: "Move your SIP and RD to the day after your stipend lands. Money you never see is money you never spend.",
    action: "Set allocation",
  },
  {
    id: "s3",
    title: "Know your EMI load",
    body: "Your EMIs are 21% of income. Under 30% is healthy for a student — keep new EMIs off the table until the laptop loan closes in 7 months.",
    action: "Check EMI calculator",
  },
  {
    id: "s4",
    title: "Learn before you invest",
    body: "Finish Investing 101 and Mutual Funds in the Academy. Ten minutes there saves thousands in avoidable mistakes.",
    action: "Go to Academy",
  },
];
