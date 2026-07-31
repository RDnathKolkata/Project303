import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bar as RBar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  CreditCard,
  Lightbulb,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  X,
  UserCheck,
} from "lucide-react";
import { Panel, Pill, StatCard } from "@/components/fin/primitives";
import { inr, useFin, RECENT_TRANSACTIONS } from "@/lib/fin-context";
import { ACTUAL_SPEND, EMIS, HABITS, MONTHLY_TREND, STARTER_TIPS } from "@/data/mock";
import { GoogleAuthModal } from "@/components/fin/google-auth-modal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Fin Plus" },
      {
        name: "description",
        content:
          "Your monthly cash flow, expense breakdown, EMI load and detected spending habits in one student-friendly dashboard.",
      },
      { property: "og:title", content: "Overview — Fin Plus" },
      {
        property: "og:description",
        content: "Track income, expenses, savings and EMIs with habit alerts built for students.",
      },
    ],
  }),
  component: Overview,
});

const PIE_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function Overview() {
  const fin = useFin();
  const [openHabit, setOpenHabit] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [authOpen, setAuthOpen] = useState(false);

  const pieData = Object.entries(ACTUAL_SPEND).map(([name, value]) => ({ name, value }));
  const habit = HABITS[0]!;
  const visibleTips = STARTER_TIPS.filter((t) => !fin.dismissedTips.includes(t.id));
  const tip = visibleTips[Math.min(tipIndex, visibleTips.length - 1)];
  const emiLoad = Math.round((fin.emiTotal / fin.totalIncome) * 100);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">
            Good evening, {fin.user.name || "Friend"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            July snapshot · {fin.incomeSources.length} income sources · {EMIS.length} active EMIs
          </p>
        </div>

        <button
          onClick={() => setAuthOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-xs transition-all hover:border-primary hover:bg-sage-soft/40"
        >
          <div className="flex size-6 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-[11px]">
            {fin.user.name ? fin.user.name.charAt(0).toUpperCase() : "G"}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold leading-none">{fin.user.name || "Set Google Name"}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {fin.user.email || "Google OAuth"}
            </p>
          </div>
          <UserCheck className="ml-1 size-3.5 text-primary" />
        </button>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Monthly income"
          value={inr(fin.totalIncome)}
          hint="Stipend + allowance + freelance"
          tone="sage"
          icon={<TrendingUp className="size-4" />}
        />
        <StatCard
          label="Total expenses"
          value={inr(fin.totalExpenses)}
          hint={`Includes ${inr(fin.emiTotal)} of EMIs`}
          tone="terracotta"
          icon={<TrendingDown className="size-4" />}
        />
        <StatCard
          label="Net savings"
          value={inr(fin.netSavings)}
          hint={`${Math.round((fin.netSavings / fin.totalIncome) * 100)}% of income`}
          tone="ochre"
          icon={<PiggyBank className="size-4" />}
        />
        <StatCard
          label="Active EMIs"
          value={`${EMIS.length} · ${inr(fin.emiTotal)}`}
          hint={`${emiLoad}% of income — healthy under 30%`}
          icon={<CreditCard className="size-4" />}
        />
      </section>

      {/* Habit Detector */}
      <section className="rounded-xl border border-[color:var(--color-terracotta-soft)] bg-terracotta-soft p-4">
        <div className="flex flex-wrap items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
          <div className="min-w-56 flex-1">
            <p className="font-display text-sm font-semibold text-destructive">
              Habit detected: {habit.title} (+{habit.deltaPct}% vs last month)
            </p>
            <p className="mt-1 text-sm text-foreground/80">{habit.detail}</p>
            <p className="num mt-1.5 text-sm font-semibold text-destructive">
              Leaking ~{inr(habit.monthlyLeak)}/month
            </p>
          </div>
          <button
            onClick={() => setOpenHabit((v) => !v)}
            className="rounded-lg bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground"
          >
            {openHabit ? "Hide fixes" : "Show me fixes"}
          </button>
        </div>
        {openHabit && (
          <ol className="mt-3 space-y-1.5 border-t border-destructive/20 pt-3 text-sm">
            {habit.fixes.map((fix, i) => (
              <li key={fix} className="flex gap-2">
                <span className="num text-destructive">{i + 1}.</span>
                {fix}
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Where your money went" subtitle="July, by category" className="lg:col-span-1">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={86}
                  paddingAngle={2}
                  stroke="var(--color-card)"
                  strokeWidth={2}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => inr(v)}
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Income vs expenses" subtitle="Last 6 months" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_TREND} barGap={4}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(v: number) => `${v / 1000}k`}
                  tickLine={false}
                  axisLine={false}
                  style={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(v: number) => inr(v)}
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <RBar dataKey="income" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                <RBar dataKey="expenses" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
                <RBar dataKey="savings" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel
          title="Recent transactions"
          subtitle="Impulse buys are flagged"
          className="lg:col-span-2"
        >
          <ul className="divide-y divide-border">
            {RECENT_TRANSACTIONS.slice(0, 8).map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.merchant}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.date} · {t.category} · {String(t.hour).padStart(2, "0")}:00
                  </p>
                </div>
                {t.impulse && <Pill tone="terracotta">impulse</Pill>}
                <span className="num text-sm font-semibold">{inr(t.amount)}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-5">
          {tip && (
            <section className="surface p-5">
              <div className="flex items-start justify-between">
                <Pill tone="ochre">
                  <Lightbulb className="size-3" /> Start here
                </Pill>
                <button
                  onClick={() => {
                    fin.dismissTip(tip.id);
                    setTipIndex(0);
                  }}
                  aria-label="Dismiss tip"
                  className="rounded p-1 text-muted-foreground hover:bg-secondary"
                >
                  <X className="size-3.5" />
                </button>
              </div>
              <h2 className="mt-3 font-display text-base font-semibold">{tip.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{tip.body}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {visibleTips.map((t, i) => (
                    <button
                      key={t.id}
                      onClick={() => setTipIndex(i)}
                      aria-label={`Tip ${i + 1}`}
                      className={`size-1.5 rounded-full ${
                        i === Math.min(tipIndex, visibleTips.length - 1)
                          ? "bg-primary"
                          : "bg-border"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setTipIndex((i) => (i + 1) % visibleTips.length)}
                  className="flex items-center gap-1 text-xs font-semibold text-primary"
                >
                  Next tip <ChevronRight className="size-3.5" />
                </button>
              </div>
            </section>
          )}

          <Panel title="Active EMIs">
            <ul className="space-y-3">
              {EMIS.map((e) => (
                <li key={e.id}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium">{e.name}</span>
                    <span className="num font-semibold">{inr(e.monthly)}/mo</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-ochre"
                      style={{
                        width: `${((e.totalMonths - e.remainingMonths) / e.totalMonths) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {e.remainingMonths} of {e.totalMonths} months left · {e.rate}% p.a.
                  </p>
                </li>
              ))}
            </ul>
            <Link
              to="/calculators"
              className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary"
            >
              Open EMI calculator <ArrowRight className="size-3.5" />
            </Link>
          </Panel>
        </div>
      </div>

      <GoogleAuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
