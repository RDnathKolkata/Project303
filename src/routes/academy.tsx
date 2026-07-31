import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bitcoin,
  BookOpen,
  CandlestickChart,
  CheckCircle2,
  Landmark,
  PieChart,
  Receipt,
  X,
} from "lucide-react";
import { Panel, Pill } from "@/components/fin/primitives";
import { useFin } from "@/lib/fin-context";
import { LESSONS, type Lesson } from "@/data/lessons";

export const Route = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "Financial Academy — Fin Plus" },
      {
        name: "description",
        content:
          "Byte-sized lessons on mutual funds, stocks, crypto, investing, fixed deposits and tax basics, with flashcard quizzes.",
      },
      { property: "og:title", content: "Financial Academy — Fin Plus" },
      {
        property: "og:description",
        content:
          "Learn investing in five-minute lessons and earn streak points for every one you finish.",
      },
    ],
  }),
  component: Academy,
});

const ICONS = {
  "mutual-funds": PieChart,
  stocks: CandlestickChart,
  crypto: Bitcoin,
  "investing-101": BookOpen,
  "fixed-deposits": Landmark,
  "tax-basics": Receipt,
} as const;

function Academy() {
  const fin = useFin();
  const [active, setActive] = useState<Lesson | null>(null);

  const done = LESSONS.filter((l) => fin.completedLessons.includes(l.id)).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">Financial Academy</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {done} of {LESSONS.length} lessons complete · {fin.points} points earned
        </p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500"
          style={{ width: `${(done / LESSONS.length) * 100}%` }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LESSONS.map((lesson) => {
          const Icon = ICONS[lesson.id as keyof typeof ICONS] ?? BookOpen;
          const complete = fin.completedLessons.includes(lesson.id);
          return (
            <button
              key={lesson.id}
              onClick={() => setActive(lesson)}
              className="surface p-5 text-left transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg bg-sage-soft text-primary">
                  <Icon className="size-5" />
                </span>
                {complete ? (
                  <Pill tone="sage">
                    <CheckCircle2 className="size-3" /> done
                  </Pill>
                ) : (
                  <Pill tone="muted">{lesson.minutes} min</Pill>
                )}
              </div>
              <h2 className="mt-3 font-display text-base font-semibold">{lesson.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{lesson.summary}</p>
              <p className="mt-3 text-xs font-semibold text-primary">
                {lesson.cards.length} cards · {lesson.quiz.length} quiz questions
              </p>
            </button>
          );
        })}
      </div>

      {active && <LessonDrawer lesson={active} onClose={() => setActive(null)} />}
    </div>
  );
}

function LessonDrawer({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  const fin = useFin();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);

  const totalSteps = lesson.cards.length + lesson.quiz.length;
  const isQuiz = step >= lesson.cards.length;
  const quizIndex = step - lesson.cards.length;
  const correctCount = lesson.quiz.filter((q, i) => answers[i] === q.answer).length;

  function complete() {
    fin.completeLesson(lesson.id, correctCount);
    setFinished(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/20" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-lg flex-col border-l border-border bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start gap-3 border-b border-border px-5 py-4">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              {lesson.minutes} min lesson
            </p>
            <h2 className="font-display text-lg font-bold">{lesson.title}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close lesson"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="h-1 bg-secondary">
          <div
            className="h-full bg-primary transition-[width] duration-300"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {finished ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <CheckCircle2 className="size-12 text-primary" />
              <h3 className="mt-4 font-display text-xl font-bold">Lesson complete</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You got <span className="num font-semibold">{correctCount}</span> of{" "}
                {lesson.quiz.length} right and earned{" "}
                <span className="num font-semibold text-primary">
                  {20 + correctCount * 5} points
                </span>
                . Your health score and streak went up.
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Back to Academy
              </button>
            </div>
          ) : isQuiz ? (
            <QuizCard
              question={lesson.quiz[quizIndex]!}
              index={quizIndex}
              selected={answers[quizIndex]}
              onSelect={(choice) => setAnswers((prev) => ({ ...prev, [quizIndex]: choice }))}
            />
          ) : (
            <ReadingCard card={lesson.cards[step]!} />
          )}
        </div>

        {!finished && (
          <footer className="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="rounded-lg border border-input px-3 py-2 text-sm font-medium disabled:opacity-40"
            >
              Back
            </button>
            <span className="num text-xs text-muted-foreground">
              {step + 1} / {totalSteps}
            </span>
            {step === totalSteps - 1 ? (
              <button
                onClick={complete}
                disabled={answers[lesson.quiz.length - 1] === undefined}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                Complete lesson
              </button>
            ) : (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={isQuiz && answers[quizIndex] === undefined}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                Next
              </button>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}

function ReadingCard({ card }: { card: Lesson["cards"][number] }) {
  return (
    <article>
      <h3 className="font-display text-lg font-semibold">{card.heading}</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/85">{card.body}</p>

      {card.chart?.kind === "line" && (
        <div className="mt-5 h-52 rounded-lg border border-border p-3">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">{card.chart.caption}</p>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={card.chart.data}>
              <XAxis dataKey="label" tickLine={false} axisLine={false} style={{ fontSize: 11 }} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-chart-1)"
                strokeWidth={2.5}
                dot={false}
              />
              {card.chart.data[0]?.compare !== undefined && (
                <Line
                  type="monotone"
                  dataKey="compare"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {card.chart?.kind === "bar" && (
        <div className="mt-5 h-52 rounded-lg border border-border p-3">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">{card.chart.caption}</p>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={card.chart.data}>
              <XAxis dataKey="label" tickLine={false} axisLine={false} style={{ fontSize: 11 }} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {card.chart.data.map((_, i) => (
                  <Cell key={i} fill={i % 2 ? "var(--color-chart-2)" : "var(--color-chart-1)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {card.takeaway && (
        <p className="mt-5 rounded-lg bg-sage-soft p-3 text-sm font-medium text-accent-foreground">
          {card.takeaway}
        </p>
      )}
    </article>
  );
}

function QuizCard({
  question,
  index,
  selected,
  onSelect,
}: {
  question: Lesson["quiz"][number];
  index: number;
  selected: number | undefined;
  onSelect: (choice: number) => void;
}) {
  const answered = selected !== undefined;
  return (
    <div>
      <Pill tone="ochre">Flashcard {index + 1}</Pill>
      <h3 className="mt-3 font-display text-lg font-semibold">{question.prompt}</h3>
      <ul className="mt-4 space-y-2">
        {question.options.map((opt, i) => {
          const isRight = i === question.answer;
          const state = !answered ? "idle" : isRight ? "right" : selected === i ? "wrong" : "idle";
          return (
            <li key={opt}>
              <button
                onClick={() => !answered && onSelect(i)}
                className={`w-full rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors ${
                  state === "right"
                    ? "border-primary bg-sage-soft font-medium"
                    : state === "wrong"
                      ? "border-destructive bg-terracotta-soft"
                      : "border-input hover:border-primary"
                }`}
              >
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
      {answered && (
        <p className="mt-4 rounded-lg bg-secondary p-3 text-sm text-foreground/85">
          {question.explanation}
        </p>
      )}
    </div>
  );
}
