// Builds the compact, context-aware payload FinBot sends to the model.
// This is the single place that knows how to describe the user's finances.

import { ACTUAL_SPEND, EMIS, HABITS, USER } from "@/data/mock";
import type { Allocation } from "@/lib/fin-context";
import type { IncomeSource } from "@/data/mock";

export type FinContextPayload = {
  user: {
    name?: string;
    alias: string;
    score: number;
    scoreMax: number;
    tier: string;
    streak: number;
  };
  income: { total: number; sources: { label: string; amount: number }[] };
  budget: { preset: string; allocationPct: Allocation; plannedByCategory: Record<string, number> };
  spending: { actualByCategory: Record<string, number>; totalExpenses: number; netSavings: number };
  emis: { name: string; monthly: number; remainingMonths: number; rate: number }[];
  emiLoadPct: number;
  habits: { title: string; severity: string; deltaPct: number; monthlyLeak: number }[];
  learning: { completedLessons: string[]; points: number };
};

export function buildFinContext(input: {
  userName?: string;
  incomeSources: IncomeSource[];
  allocation: Allocation;
  preset: string;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  score: number;
  streak: number;
  points: number;
  completedLessons: string[];
}): FinContextPayload {
  const planned = Object.fromEntries(
    Object.entries(input.allocation).map(([k, pct]) => [
      k,
      Math.round((pct / 100) * input.totalIncome),
    ]),
  );
  const emiTotal = EMIS.reduce((sum, e) => sum + e.monthly, 0);

  return {
    user: {
      name: input.userName,
      alias: USER.alias,
      score: input.score,
      scoreMax: USER.scoreMax,
      tier: USER.tier,
      streak: input.streak,
    },
    income: {
      total: input.totalIncome,
      sources: input.incomeSources.map(({ label, amount }) => ({ label, amount })),
    },
    budget: { preset: input.preset, allocationPct: input.allocation, plannedByCategory: planned },
    spending: {
      actualByCategory: ACTUAL_SPEND,
      totalExpenses: input.totalExpenses,
      netSavings: input.netSavings,
    },
    emis: EMIS.map(({ name, monthly, remainingMonths, rate }) => ({
      name,
      monthly,
      remainingMonths,
      rate,
    })),
    emiLoadPct: Math.round((emiTotal / input.totalIncome) * 100),
    habits: HABITS.map(({ title, severity, deltaPct, monthlyLeak }) => ({
      title,
      severity,
      deltaPct,
      monthlyLeak,
    })),
    learning: { completedLessons: input.completedLessons, points: input.points },
  };
}

export const FINBOT_SYSTEM_PROMPT = `You are FinBot, the financial assistant inside Fin Plus — an app for students and young adults in India.

Rules:
- Answer in short markdown. Use bold for numbers, bullet lists for steps. Never exceed 200 words.
- Always ground advice in the user's actual figures from the CONTEXT block. Quote the real rupee amounts.
- Amounts are INR. Write them like ₹12,500.
- Be practical and specific for a student budget. No jargon without a one-line explanation.
- Never invent products, returns, or guarantees. Say when something depends on their risk appetite.
- If asked something outside personal finance, redirect to what Fin Plus can help with.`;

export function serializeContext(payload: FinContextPayload) {
  return `CONTEXT (the signed-in user's live financial data):\n${JSON.stringify(payload, null, 2)}`;
}
