import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Panel, Pill } from "@/components/fin/primitives";
import { inr, useFin } from "@/lib/fin-context";
import { ACTUAL_SPEND } from "@/data/mock";
import { Plus, Trash2, ShieldAlert, Sparkles, Target } from "lucide-react";

export const Route = createFileRoute("/budget")({
  head: () => ({
    meta: [
      { title: "Smart Budgeting — Fin Plus" },
      {
        name: "description",
        content:
          "Customize income sources, income brackets, personal priority rules and expenditure category breakdowns with live visual charts.",
      },
      { property: "og:title", content: "Smart Budgeting — Fin Plus" },
      {
        property: "og:description",
        content:
          "Manage multiple salary/stipend streams, income bracket guidance and budget vs actual spending progress.",
      },
    ],
  }),
  component: Budget,
});

type Cat = "Rent/Hostel" | "Food" | "Tech" | "Savings" | "Fun";

const PRIORITIES = [
  {
    id: "50-30-20",
    name: "50/30/20 Standard",
    desc: "Balanced split between needs, wants and future savings.",
    alloc: { "Rent/Hostel": 35, Food: 15, Tech: 10, Savings: 20, Fun: 20 },
  },
  {
    id: "saver",
    name: "Aggressive Saver / FIRE",
    desc: "Maximizes compounding with a 35% savings rate.",
    alloc: { "Rent/Hostel": 32, Food: 14, Tech: 6, Savings: 35, Fun: 13 },
  },
  {
    id: "upskill",
    name: "Upskilling & Career",
    desc: "Prioritizes tech, courses and books alongside core needs.",
    alloc: { "Rent/Hostel": 30, Food: 15, Tech: 20, Savings: 20, Fun: 15 },
  },
  {
    id: "tight",
    name: "Emergency & Buffer",
    desc: "Keeps fun spending tight to build emergency reserves.",
    alloc: { "Rent/Hostel": 40, Food: 20, Tech: 5, Savings: 25, Fun: 10 },
  },
];

const CATS: Cat[] = ["Rent/Hostel", "Food", "Tech", "Savings", "Fun"];
const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const ACTUALS: Record<Cat, number> = {
  "Rent/Hostel": ACTUAL_SPEND["Rent/Hostel"] ?? 9500,
  Food: ACTUAL_SPEND["Food"] ?? 6400,
  Tech: ACTUAL_SPEND["Tech"] ?? 2100,
  Savings: ACTUAL_SPEND["Savings"] ?? 4200,
  Fun: ACTUAL_SPEND["Fun"] ?? 3300,
};

type IncomeItem = { id: string; source: string; amount: number };

function Budget() {
  const fin = useFin();
  const [sources, setSources] = useState<IncomeItem[]>([
    { id: "1", source: "Stipend / Salary", amount: 22000 },
    { id: "2", source: "Freelance & Projects", amount: 7500 },
    { id: "3", source: "Family Allowance", amount: 5000 },
  ]);
  const [priorityId, setPriorityId] = useState("50-30-20");
  const [alloc, setAlloc] = useState<Record<Cat, number>>(PRIORITIES[0]!.alloc);

  const totalIncome = sources.reduce((s, item) => s + item.amount, 0);
  const totalPct = CATS.reduce((s, c) => s + alloc[c], 0);

  function handlePriorityChange(id: string) {
    setPriorityId(id);
    const found = PRIORITIES.find((p) => p.id === id);
    if (found) setAlloc(found.alloc);
  }

  function setCat(cat: Cat, v: number) {
    setPriorityId("custom");
    setAlloc((prev) => ({ ...prev, [cat]: v }));
  }

  function updateSourceAmount(id: string, newAmt: number) {
    setSources((prev) => prev.map((item) => (item.id === id ? { ...item, amount: newAmt } : item)));
  }

  function addSource() {
    const id = Date.now().toString();
    setSources((prev) => [...prev, { id, source: "Side Income", amount: 2000 }]);
  }

  function removeSource(id: string) {
    if (sources.length <= 1) return;
    setSources((prev) => prev.filter((item) => item.id !== id));
  }

  // Bracket determination
  const bracket =
    totalIncome <= 30000
      ? {
          tag: "Student / Entry Bracket",
          tip: "Focus on maintaining zero expensive debt and building a 1-2 month liquidity buffer before taking heavy equity risks.",
          color: "sage" as const,
        }
      : totalIncome <= 75000
        ? {
            tag: "Growth Professional Bracket",
            tip: "Great momentum! Automate a monthly index fund SIP equal to at least 20% of your total income.",
            color: "ochre" as const,
          }
        : {
            tag: "High Capital Bracket",
            tip: "Optimize tax efficiency under the new regime and diversify into equity, fixed income, and liquid emergency funds.",
            color: "sage" as const,
          };

  const pieData = CATS.map((c) => ({
    name: c,
    value: Math.round((totalIncome * alloc[c]) / 100),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Smart Budgeting</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tailor monthly income streams, personal priorities, and category limits.
        </p>
      </div>

      {/* Income Bracket Insight */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Detected Income Bracket
              </p>
              <h2 className="font-display text-base font-bold text-foreground">{bracket.tag}</h2>
            </div>
          </div>
          <Pill tone={bracket.color}>Total: {inr(totalIncome)}/mo</Pill>
        </div>
        <p className="mt-2 text-sm text-foreground/85">{bracket.tip}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Income Streams & Personal Priorities */}
        <div className="space-y-6">
          <Panel
            title="Custom Income Sources"
            subtitle="Add salary, stipend, freelance, or allowances"
          >
            <div className="space-y-4">
              {sources.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3"
                >
                  <div className="min-w-32 flex-1">
                    <input
                      type="text"
                      value={item.source}
                      onChange={(e) =>
                        setSources((prev) =>
                          prev.map((s) =>
                            s.id === item.id ? { ...s, source: e.target.value } : s,
                          ),
                        )
                      }
                      className="w-full bg-transparent font-medium text-foreground outline-none focus:underline"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="num text-sm font-semibold text-primary">
                      {inr(item.amount)}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={80000}
                      step={500}
                      value={item.amount}
                      onChange={(e) => updateSourceAmount(item.id, Number(e.target.value))}
                      className="h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-secondary accent-[var(--color-primary)]"
                    />
                    {sources.length > 1 && (
                      <button
                        onClick={() => removeSource(item.id)}
                        className="p-1 text-muted-foreground hover:text-destructive"
                        title="Remove source"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between border-t border-border pt-3">
                <button
                  onClick={addSource}
                  className="flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  <Plus className="size-3.5" /> Add Income Stream
                </button>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">Combined Monthly Income: </span>
                  <span className="num font-bold text-primary">{inr(totalIncome)}</span>
                </div>
              </div>
            </div>
          </Panel>

          <Panel
            title="Personal Priorities & Rule Sets"
            subtitle="Select a strategy that matches your goal"
          >
            <div className="grid gap-2.5 sm:grid-cols-2">
              {PRIORITIES.map((p) => {
                const active = priorityId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handlePriorityChange(p.id)}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      active
                        ? "border-primary bg-sage-soft/60 shadow-sm"
                        : "border-border bg-card hover:bg-secondary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-display text-sm font-bold text-foreground">{p.name}</p>
                      {active && <Target className="size-4 text-primary" />}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 space-y-4 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Category Allocation (% of income)</p>
                <Pill tone={totalPct === 100 ? "sage" : "terracotta"}>{totalPct}% total</Pill>
              </div>

              {CATS.map((c) => (
                <label key={c} className="block">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium">{c}</span>
                    <span className="num text-sm font-semibold text-foreground">
                      {alloc[c]}% · {inr(Math.round((totalIncome * alloc[c]) / 100))}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={alloc[c]}
                    onChange={(e) => setCat(c, Number(e.target.value))}
                    className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-[var(--color-primary)]"
                  />
                </label>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right Column: Visual Breakdown & Progress */}
        <div className="space-y-6">
          <Panel title="Planned Monthly Allocation">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                    stroke="var(--color-card)"
                    strokeWidth={2}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => inr(v)}
                    contentStyle={{ borderRadius: 10, fontSize: 12 }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel
            title="Budget vs Actual Expenditures"
            subtitle="Live tracking against this month's plan"
          >
            <ul className="space-y-4">
              {CATS.map((c) => {
                const budget = Math.round((totalIncome * alloc[c]) / 100);
                const actual = ACTUALS[c];
                const pct = budget ? Math.min(140, Math.round((actual / budget) * 100)) : 0;
                const over = actual > budget;
                return (
                  <li key={c} className="rounded-lg border border-border p-3">
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-semibold text-foreground">{c}</span>
                      <span className="num font-medium text-muted-foreground">
                        {inr(actual)} / <span className="text-foreground">{inr(budget)}</span>
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full transition-[width] duration-500 ${
                          over ? "bg-destructive" : "bg-primary"
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-xs">
                      <span
                        className={
                          over
                            ? "flex items-center gap-1 font-semibold text-destructive"
                            : "text-muted-foreground"
                        }
                      >
                        {over ? (
                          <>
                            <ShieldAlert className="size-3.5" /> Over budget by{" "}
                            {inr(actual - budget)}
                          </>
                        ) : (
                          `${inr(budget - actual)} remaining`
                        )}
                      </span>
                      <span className="num font-semibold text-foreground">{pct}% spent</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
