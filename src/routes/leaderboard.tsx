import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trophy } from "lucide-react";
import { Panel, Pill } from "@/components/fin/primitives";
import { LEADERBOARD, type LeaderRow } from "@/data/mock";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — Fin Plus" },
      {
        name: "description",
        content:
          "Anonymous student rankings by budget adherence, streak length and lesson scores — see where you stand this week.",
      },
      { property: "og:title", content: "Leaderboard — Fin Plus" },
      {
        property: "og:description",
        content: "Compete anonymously on budget adherence, streaks and lesson scores.",
      },
    ],
  }),
  component: Leaderboard,
});

const SORTS = [
  { id: "adherence", label: "Budget adherence" },
  { id: "streak", label: "Streak length" },
  { id: "lessonScore", label: "Lesson score" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

function Leaderboard() {
  const [sort, setSort] = useState<SortId>("adherence");
  const rows: LeaderRow[] = [...LEADERBOARD].sort((a, b) => b[sort] - a[sort]);
  const you = rows.findIndex((r) => r.isUser) + 1;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">Leaderboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Anonymous aliases only · you are ranked{" "}
          <span className="num font-semibold text-primary">#{you}</span> by{" "}
          {SORTS.find((s) => s.id === sort)!.label.toLowerCase()}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SORTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSort(s.id)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              sort === s.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input hover:bg-secondary"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <Panel title="This week's ranking" subtitle="Updated every Sunday">
        <ol className="divide-y divide-border">
          {rows.map((r, i) => (
            <li
              key={r.id}
              className={`flex items-center gap-3 py-3 ${
                r.isUser ? "-mx-2 rounded-lg bg-sage-soft px-2" : ""
              }`}
            >
              <span className="num w-7 text-sm font-semibold text-muted-foreground">{i + 1}</span>
              {i === 0 ? <Trophy className="size-4 text-ochre" /> : <span className="size-4" />}
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {r.alias} {r.isUser && <Pill tone="sage">you</Pill>}
              </span>
              <span className="num hidden w-24 text-right text-sm sm:block">
                {r.adherence}% budget
              </span>
              <span className="num hidden w-20 text-right text-sm sm:block">🔥 {r.streak}</span>
              <span className="num w-16 text-right text-sm font-semibold">{r.lessonScore}</span>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}
