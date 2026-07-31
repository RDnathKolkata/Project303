// The one seam between the chat UI and whatever generates replies.
//
// Today: `mockProvider` — deterministic, keyword-matched markdown answers that
// already read the user's live numbers out of the context payload.
//
// When you move this project to Google AI Studio with a Gemini API key, swap the
// `finbotProvider` export at the bottom of this file for `geminiProvider` (stub
// below). Nothing else in the app needs to change — the UI only ever calls
// `finbotProvider.sendMessage(...)`.

import { FINBOT_SYSTEM_PROMPT, serializeContext, type FinContextPayload } from "./buildContext";

export type ChatRole = "user" | "assistant";
export type ChatMessage = { id: string; role: ChatRole; content: string };

export type FinbotProvider = {
  name: string;
  sendMessage: (messages: ChatMessage[], context: FinContextPayload) => Promise<string>;
};

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

function answerFor(question: string, ctx: FinContextPayload): string {
  const q = question.toLowerCase();
  const income = ctx.income.total;
  const emiMonthly = ctx.emis.reduce((s, e) => s + e.monthly, 0);
  const topHabit = ctx.habits[0];

  if (/split|allowance|allocat|50\/30\/20|50-30-20/.test(q)) {
    const needs = Math.round(income * 0.5);
    const wants = Math.round(income * 0.3);
    const save = income - needs - wants;
    return `Here's a split for your **${inr(income)}** monthly inflow:

- **Needs — ${inr(needs)}** (hostel, mess, transport, EMIs of ${inr(emiMonthly)})
- **Wants — ${inr(wants)}** (delivery, outings, gadgets)
- **Savings — ${inr(save)}** (SIP + emergency buffer)

Your current plan allocates **${ctx.budget.allocationPct["Savings"] ?? 0}%** to savings. Since your EMIs already eat ${ctx.emiLoadPct}% of income, keep wants at the lower end until the laptop loan closes.`;
  }

  if (/mutual fund|mf vs|fd|fixed deposit/.test(q)) {
    return `**Mutual funds vs fixed deposits**

- **FD** — fixed ~6.5–7.5% return, capital protected, taxed at your slab. Good for money you need within 2 years.
- **Equity mutual fund** — market-linked, historically ~11–12% over long periods, but can fall 20% in a bad year. Good for 5+ year goals.

For you: keep your **${inr(Math.round(income))}** one-month buffer in an FD or sweep account, and route the ${inr(Math.round(((ctx.budget.allocationPct["Savings"] ?? 0) / 100) * income))} savings line into an index fund SIP. That mix gives safety plus growth.`;
  }

  if (/emi|loan|debt|strain/.test(q)) {
    const list = ctx.emis
      .map(
        (e) =>
          `- **${e.name}** — ${inr(e.monthly)}/mo at ${e.rate}%, ${e.remainingMonths} months left`,
      )
      .join("\n");
    return `Your EMI load is **${ctx.emiLoadPct}% of income** (${inr(emiMonthly)} of ${inr(income)}). Under 30% is healthy, so you're okay but tight.

${list}

To reduce strain:
1. Prepay the **higher-rate** loan first — even one extra EMI cuts months off the tail.
2. Don't add a new EMI until the laptop loan closes.
3. Redirect the ${inr(topHabit?.monthlyLeak ?? 0)} leaking into ${topHabit?.title.toLowerCase() ?? "impulse spends"} straight into prepayment.`;
  }

  if (/habit|impulse|overspend|food delivery|spending/.test(q)) {
    if (!topHabit) return "No risky spending patterns detected this month — nice work.";
    return `Biggest leak right now: **${topHabit.title}** — up **${topHabit.deltaPct}%** vs last month, costing about **${inr(topHabit.monthlyLeak)}/month**.

Fix it this week:
1. Remove saved cards from delivery apps.
2. Keep ₹300 of late-night snacks stocked.
3. Block those apps after 10:30pm.

Redirected into your SIP, that's roughly **${inr(topHabit.monthlyLeak * 12)}** a year invested instead of eaten.`;
  }

  if (/save|saving|emergency|buffer/.test(q)) {
    return `You're netting **${inr(ctx.spending.netSavings)}** a month right now.

- Target an emergency buffer of **${inr(ctx.spending.totalExpenses)}** (one month of expenses) before anything else.
- At your current pace that takes about **${Math.max(1, Math.ceil(ctx.spending.totalExpenses / Math.max(1, ctx.spending.netSavings)))} months**.
- Automate it on the 3rd, right after your stipend lands, so it never competes with spending.`;
  }

  if (/tax|slab|bracket/.test(q)) {
    return `On an annual income of about **${inr(income * 12)}** you're under the new-regime rebate threshold, so your effective tax is likely **₹0** — but you still need to file if TDS was deducted on your freelance work.

- Ask clients for Form 16A to claim that TDS back.
- Start tracking freelance expenses (software, internet share) — they reduce taxable income when you do cross the threshold.`;
  }

  if (/stock|crypto|invest/.test(q)) {
    return `Order of operations before individual stocks or crypto:

1. **Buffer** — one month of expenses (${inr(ctx.spending.totalExpenses)}).
2. **Index SIP** — boring, diversified, automatic.
3. **Only then** put money you can fully lose into single stocks or crypto — cap it at 5–10% of your portfolio.

You've completed **${ctx.learning.completedLessons.length}** lesson(s) so far. Finish *Investing 101* and *Stocks* in the Academy before your first direct buy.`;
  }

  return `I can help with your actual numbers. Right now you earn **${inr(income)}**/month, spend **${inr(ctx.spending.totalExpenses)}**, and save **${inr(ctx.spending.netSavings)}**.

Try asking about:
- splitting your monthly income
- reducing EMI strain (currently ${ctx.emiLoadPct}% of income)
- mutual funds vs fixed deposits
- the spending habit costing you the most`;
}

export const mockProvider: FinbotProvider = {
  name: "mock",
  async sendMessage(messages, context) {
    const last = [...messages].reverse().find((m) => m.role === "user");
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));
    return answerFor(last?.content ?? "", context);
  },
};

/* ---------------------------------------------------------------------------
 * GEMINI PROVIDER — enable this in Google AI Studio.
 *
 * 1. npm i @google/genai
 * 2. Put your key in an env var (never hardcode it in a committed file):
 *      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
 * 3. Uncomment below and change the final export to `geminiProvider`.
 *
 * The context payload from buildFinContext() is what makes it context-aware:
 * it is serialized into the system instruction on every turn, and the full
 * message history is replayed so the model keeps the thread.
 *
 * import { GoogleGenAI } from "@google/genai";
 *
 * export const geminiProvider: FinbotProvider = {
 *   name: "gemini",
 *   async sendMessage(messages, context) {
 *     const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
 *     const response = await ai.models.generateContent({
 *       model: "gemini-2.5-flash",
 *       config: {
 *         systemInstruction: `${FINBOT_SYSTEM_PROMPT}\n\n${serializeContext(context)}`,
 *       },
 *       contents: messages.map((m) => ({
 *         role: m.role === "assistant" ? "model" : "user",
 *         parts: [{ text: m.content }],
 *       })),
 *     });
 *     return response.text ?? "I couldn't generate a reply just now.";
 *   },
 * };
 * ------------------------------------------------------------------------- */

// Swap this to `geminiProvider` once the API key is wired up.
export const finbotProvider: FinbotProvider = mockProvider;

// Re-exported so the Gemini implementation above has them in scope when enabled.
export { FINBOT_SYSTEM_PROMPT, serializeContext };
