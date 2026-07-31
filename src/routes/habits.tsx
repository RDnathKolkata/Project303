import { createFileRoute } from "@tanstack/react-router";
import { ResponsiveContainer, Line, LineChart, Tooltip, XAxis } from "recharts";
import { AlertTriangle, CheckCircle2, Flame } from "lucide-react";
import { Panel, Pill } from "@/components/fin/primitives";
import { inr, useFin } from "@/lib/fin-context";
import { CHALLENGES, HABITS, STREAK_DAYS } from "@/data/mock";

export const Route = createFileRoute("/habits")({
  head: () => ({
    meta: [
      { title: "Habits & Streaks — Fin Plus" },
      {
        name: "description",
        content:
          "See detected bad spending habits, weekly challenge progress and your streak calendar with fixes you can act on today.",
      },
      { property: "og:title", content: "Habits & Streaks — Fin Plus" },
      {
        property: "og:description",
        content: "Break impulse spending with detected habits, fixes and weekly challenges.",
      },
    ],
  }),
  component: Habits,
});

function Habits() {
  const fin = useFin();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">Habits & streaks</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {fin.streak}-day streak · {fin.points} points · keep logging to hold it
        </p>
      </div>

      <Panel title="Streak calendar" subtitle="Last 14 days of on-budget behaviour">
        <div className="flex flex-wrap gap-1.5">
          {STREAK_DAYS.map((d, i) => (
            <div
              key={i}
              title={d.day}
              className={`size-8 rounded-md ${
                d.done ? "bg-primary" : "bg-secondary"
              } flex items-center justify-center text-[10px] font-semibold ${
                d.done ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {d.day.slice(0, 2)}
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-ochre">
          <Flame className="size-4" /> Longest run this month:{" "}
          <span className="num font-semibold">{fin.streak} days</span>
        </p>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Detected habits" subtitle="Ranked by monthly leak">
          <ul className="space-y-4">
            {HABITS.map((h) => (
              <li key={h.id} className="rounded-lg border border-border p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-semibold">
                      <AlertTriangle className="size-4 text-destructive" /> {h.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{h.detail}</p>
                  </div>
                  <Pill tone="terracotta">+{h.deltaPct}%</Pill>
                </div>
                {h.trend.length > 0 && (
                  <div className="mt-2 h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={h.trend}>
                        <XAxis dataKey="week" hide />
                        <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                        <Line
                          dataKey="value"
                          stroke="var(--color-chart-3)"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <p className="num mt-1 text-sm font-semibold text-destructive">
                  ~{inr(h.monthlyLeak)}/month
                </p>
                <ul className="mt-2 space-y-1 text-sm text-foreground/85">
                  {h.fixes.map((f) => (
                    <li key={f} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Weekly challenges" subtitle="Finish one to earn streak points">
          <ul className="space-y-4">
            {CHALLENGES.map((c) => {
              const pct = Math.round((c.current / c.target) * 100);
              const done = c.current >= c.target;
              return (
                <li key={c.id}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium">{c.title}</span>
                    <span className="num font-semibold">
                      {c.current}/{c.target}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${done ? "bg-primary" : "bg-ochre"}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{c.reward} points</span>
                    {done ? <Pill tone="sage">complete</Pill> : <span>{pct}% there</span>}
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 rounded-lg bg-sage-soft p-3 text-sm text-accent-foreground">
            Complete an Academy lesson to add streak points this week.
          </p>
        </Panel>
      </div>
    </div>
  );
}
