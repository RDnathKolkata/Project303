export type ChartPoint = { label: string; value: number; compare?: number };

export type LessonCard = {
  heading: string;
  body: string;
  takeaway?: string;
  chart?: {
    kind: "line" | "bar";
    caption: string;
    data: ChartPoint[];
  };
};

export type QuizQuestion = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Lesson = {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  cards: LessonCard[];
  quiz: QuizQuestion[];
};

export const LESSONS: Lesson[] = [
  {
    id: "mutual-funds",
    title: "Mutual Funds",
    summary: "How pooled investing works, what an SIP is, and why expense ratios matter.",
    minutes: 5,
    cards: [
      {
        heading: "One basket, many stocks",
        body: "A mutual fund pools money from thousands of investors and a fund manager buys a basket of stocks or bonds with it. You own units of that basket, so a ₹500 SIP already gives you exposure to 50+ companies — something impossible to build alone on a student budget.",
        takeaway:
          "Diversification is the free lunch: one fund spreads a small amount across many companies.",
      },
      {
        heading: "SIP beats timing",
        body: "A Systematic Investment Plan invests a fixed amount every month. When markets dip, your fixed amount buys more units; when they rise, fewer. Over years this rupee-cost averaging smooths out entry price and removes the need to guess market tops and bottoms.",
        chart: {
          kind: "line",
          caption: "₹2,000/month SIP at 12% vs money left in a savings account at 3%",
          data: [
            { label: "Yr 1", value: 25400, compare: 24400 },
            { label: "Yr 3", value: 86000, compare: 75200 },
            { label: "Yr 5", value: 163000, compare: 129000 },
            { label: "Yr 10", value: 460000, compare: 279000 },
            { label: "Yr 15", value: 1000000, compare: 452000 },
          ],
        },
      },
      {
        heading: "Costs quietly eat returns",
        body: "The expense ratio is the annual fee the fund charges. An index fund may cost 0.2% while an active fund charges 1.8%. On a 15-year horizon that 1.6% gap can eat away a fifth of your final corpus, even if both funds perform identically before fees.",
        takeaway: "For your first fund, a low-cost Nifty index fund is a defensible default.",
      },
    ],
    quiz: [
      {
        prompt: "What does an SIP actually do?",
        options: [
          "Guarantees a fixed return each year",
          "Invests a fixed amount at regular intervals",
          "Locks your money for 5 years",
          "Buys only large-cap stocks",
        ],
        answer: 1,
        explanation:
          "An SIP just automates a fixed investment at a fixed interval. Returns stay market-linked and there is no lock-in unless the fund is ELSS.",
      },
      {
        prompt:
          "Two funds return 12% before fees. Fund A charges 0.2%, Fund B charges 1.8%. Which is better?",
        options: ["Fund A", "Fund B", "Identical", "Depends on NAV"],
        answer: 0,
        explanation:
          "Returns are quoted after fees, so the cheaper fund keeps more in your pocket every single year — and that gap compounds.",
      },
    ],
  },
  {
    id: "stocks",
    title: "Stocks",
    summary: "Ownership, volatility, and why a single stock is not a plan.",
    minutes: 6,
    cards: [
      {
        heading: "A share is a slice of a business",
        body: "Buying a share makes you a part-owner entitled to a slice of future profits. The price moves with what the market believes those future profits will be — which is why news, interest rates and sentiment can swing prices far more than this quarter's earnings.",
        takeaway: "You are buying a business, not a ticker symbol.",
      },
      {
        heading: "Volatility is the entry fee",
        body: "Indian equity indices have delivered roughly 11-13% annualised over long periods, but individual years swing from -25% to +40%. Money you need within two years does not belong in stocks; money you need in ten years usually does.",
        chart: {
          kind: "bar",
          caption: "Nifty-style calendar-year returns (%) — the average hides the ride",
          data: [
            { label: "2019", value: 12 },
            { label: "2020", value: 15 },
            { label: "2021", value: 24 },
            { label: "2022", value: 4 },
            { label: "2023", value: 20 },
            { label: "2024", value: 9 },
          ],
        },
      },
      {
        heading: "Concentration risk",
        body: "If one stock is 60% of your portfolio, your outcome is a coin flip on one management team. Five to six uncorrelated holdings, or one index fund, brings the risk down to market risk instead of company risk.",
      },
    ],
    quiz: [
      {
        prompt: "You need your money for fees in 8 months. Where should it not go?",
        options: ["Savings account", "Liquid fund", "Individual stocks", "Short-term FD"],
        answer: 2,
        explanation:
          "An 8-month horizon is far too short for equity. A drawdown right before the deadline would force you to sell at a loss.",
      },
      {
        prompt: "What risk do you remove by holding an index fund instead of one stock?",
        options: ["Market risk", "Company-specific risk", "Inflation risk", "Currency risk"],
        answer: 1,
        explanation:
          "Diversification removes company-specific risk. Market risk remains — the whole index can still fall.",
      },
    ],
  },
  {
    id: "crypto",
    title: "Crypto",
    summary: "Volatility, position sizing, tax rules and the scams to dodge.",
    minutes: 5,
    cards: [
      {
        heading: "High variance, no cash flow",
        body: "Crypto assets produce no earnings or dividends; the price is entirely a function of what the next buyer will pay. That makes drawdowns of 60-80% normal rather than exceptional, and it is why position sizing matters more here than anywhere else.",
        takeaway:
          "Cap crypto at a slice you could watch fall 70% without changing your plans — often under 5%.",
      },
      {
        heading: "India taxes it harshly",
        body: "Gains from virtual digital assets are taxed at a flat 30% with no benefit of set-off against other losses, plus 1% TDS on transfers above the threshold. Frequent trading therefore bleeds value even when your gross calls are correct.",
        chart: {
          kind: "bar",
          caption: "₹10,000 gain, take-home after tax by asset type",
          data: [
            { label: "Crypto 30%", value: 7000 },
            { label: "Equity LTCG", value: 8750 },
            { label: "Debt fund", value: 8000 },
          ],
        },
      },
      {
        heading: "Scam pattern recognition",
        body: "Guaranteed daily returns, referral bonuses for recruiting friends, a token you can buy but never withdraw, and Telegram groups urging you to hurry — these are the recurring signatures of frauds targeting students.",
      },
    ],
    quiz: [
      {
        prompt: "How are crypto gains taxed in India?",
        options: ["Flat 30%", "Slab rate", "10% LTCG", "Tax free under ₹1L"],
        answer: 0,
        explanation:
          "Virtual digital asset gains carry a flat 30% rate with no loss set-off, plus 1% TDS on transfers.",
      },
      {
        prompt: "Which claim is the clearest scam signal?",
        options: [
          "Prices are volatile",
          "Guaranteed 2% daily returns",
          "Exchange charges a fee",
          "Token has a whitepaper",
        ],
        answer: 1,
        explanation:
          "No legitimate asset guarantees daily returns. Guaranteed-yield plus referral bonuses is the classic pyramid structure.",
      },
    ],
  },
  {
    id: "investing-101",
    title: "Investing 101",
    summary: "Emergency fund, goal horizons, and the order of operations.",
    minutes: 4,
    cards: [
      {
        heading: "Order of operations",
        body: "Before investing a rupee: build one month of expenses as a buffer, then clear anything costing more than 12% interest (credit cards, personal loans), then start a small SIP. Investing while a 36% card balance rolls over is mathematically going backwards.",
        takeaway: "Buffer → expensive debt → invest. In that order.",
      },
      {
        heading: "Match the asset to the horizon",
        body: "Under 1 year: savings or liquid fund. One to three years: short-duration debt or FD. Over five years: equity. Mismatching the horizon is the single most common reason beginners lose money — the asset was fine, the timeline was not.",
        chart: {
          kind: "bar",
          caption: "Suggested equity share of a goal by years to goal (%)",
          data: [
            { label: "<1y", value: 0 },
            { label: "1-3y", value: 20 },
            { label: "3-5y", value: 50 },
            { label: "5-10y", value: 75 },
            { label: "10y+", value: 90 },
          ],
        },
      },
      {
        heading: "Time in market",
        body: "Starting a ₹1,500 SIP at 20 instead of 28 adds roughly eight extra years of compounding. At 12% that head start alone can be worth more than the entire amount someone else invests over the following decade.",
      },
    ],
    quiz: [
      {
        prompt: "You have a ₹18,000 credit card balance at 36% and ₹5,000 spare. What comes first?",
        options: ["Start an SIP", "Buy a stock", "Pay down the card", "Open an FD"],
        answer: 2,
        explanation:
          "Clearing 36% debt is a guaranteed 36% return. No investment offers that with certainty.",
      },
      {
        prompt: "Money needed in 10 months belongs in…",
        options: ["Equity fund", "Liquid fund", "Crypto", "Small-cap stocks"],
        answer: 1,
        explanation: "Short horizons need stability and liquidity, not growth potential.",
      },
    ],
  },
  {
    id: "fixed-deposits",
    title: "Fixed Deposits",
    summary: "Safety, real returns after inflation, and laddering.",
    minutes: 4,
    cards: [
      {
        heading: "Certainty you pay for",
        body: "An FD locks a rate for a set tenure and deposits are insured up to ₹5 lakh per bank under DICGC. You know the exact maturity amount on day one — the trade-off is that the rate rarely beats inflation by much.",
        takeaway: "FDs protect capital, not purchasing power.",
      },
      {
        heading: "Watch the real return",
        body: "A 7% FD with 6% inflation is a 1% real return, and interest is taxed at your slab rate. For a student in the nil-tax bracket the maths is friendlier, which is exactly why FDs work well for the emergency buffer and poorly for a 15-year goal.",
        chart: {
          kind: "line",
          caption: "₹1,00,000 growth: FD at 7% (solid) vs inflation-adjusted value (dashed)",
          data: [
            { label: "Yr 1", value: 107000, compare: 100900 },
            { label: "Yr 3", value: 122500, compare: 102800 },
            { label: "Yr 5", value: 140300, compare: 104800 },
            { label: "Yr 7", value: 160600, compare: 106900 },
            { label: "Yr 10", value: 196700, compare: 110000 },
          ],
        },
      },
      {
        heading: "Ladder for flexibility",
        body: "Instead of one ₹60,000 FD, open three of ₹20,000 maturing three, six and nine months apart. You keep near-continuous access to cash without breaking a large deposit and paying a premature-withdrawal penalty.",
      },
    ],
    quiz: [
      {
        prompt: "FD rate 7%, inflation 6%. Your real return is roughly…",
        options: ["13%", "7%", "1%", "-6%"],
        answer: 2,
        explanation:
          "Real return is roughly nominal minus inflation, so about 1% before tax on the interest.",
      },
      {
        prompt: "Why ladder FDs?",
        options: [
          "Higher interest rate",
          "Staggered access without breaking one big deposit",
          "Tax exemption",
          "Guaranteed equity upside",
        ],
        answer: 1,
        explanation:
          "Laddering gives periodic liquidity and avoids premature-withdrawal penalties on a single large FD.",
      },
    ],
  },
  {
    id: "tax-basics",
    title: "Tax Basics",
    summary: "Slabs, TDS on your stipend, and filing your first return.",
    minutes: 5,
    cards: [
      {
        heading: "Slabs are marginal",
        body: "Only the income inside each band is taxed at that band's rate. Earning ₹50,000 above a threshold does not push your whole income to the higher rate — a misunderstanding that makes people turn down freelance work they should accept.",
        chart: {
          kind: "bar",
          caption: "New-regime marginal rate by income band (%)",
          data: [
            { label: "0-4L", value: 0 },
            { label: "4-8L", value: 5 },
            { label: "8-12L", value: 10 },
            { label: "12-16L", value: 15 },
            { label: "16-20L", value: 20 },
          ],
        },
        takeaway: "A raise never lowers your take-home.",
      },
      {
        heading: "TDS is not the final tax",
        body: "Freelance and internship payouts often have 10% TDS deducted under section 194J. If your total annual income sits under the taxable limit, that money is refundable — but only if you file a return and claim it.",
      },
      {
        heading: "Filing your first return",
        body: "Collect Form 16 or 16A, check the AIS statement on the income-tax portal, pick ITR-1 for salary or ITR-4 for freelance presumptive income, and file before the July deadline. For most students it is a 20-minute job that recovers a few thousand rupees.",
        takeaway: "File even at zero tax — that is how the TDS refund reaches you.",
      },
    ],
    quiz: [
      {
        prompt:
          "Your client deducted 10% TDS but your annual income is below the taxable limit. What now?",
        options: [
          "The money is gone",
          "File a return and claim a refund",
          "Pay extra tax",
          "Ask for a waiver certificate only",
        ],
        answer: 1,
        explanation:
          "TDS is an advance deduction. Filing a return reconciles it and any excess is refunded to your bank account.",
      },
      {
        prompt: "Do Indian income-tax slabs apply marginally?",
        options: [
          "Yes — only income in each band pays that band's rate",
          "No — the top rate applies to all income",
          "Only for salaried people",
          "Only above ₹20 lakh",
        ],
        answer: 0,
        explanation:
          "Slabs are marginal, so crossing a threshold only affects the rupees above it.",
      },
    ],
  },
];
