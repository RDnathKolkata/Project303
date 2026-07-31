import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Panel } from "@/components/fin/primitives";
import { inr } from "@/lib/fin-context";

export const Route = createFileRoute("/calculators")({
  head: () => ({
    meta: [
      { title: "Financial Calculators — Fin Plus" },
      {
        name: "description",
        content:
          "EMI, loan amortization, compound interest, dividend yield and income-tax calculators with live sliders and charts.",
      },
      { property: "og:title", content: "Financial Calculators — Fin Plus" },
      {
        property: "og:description",
        content:
          "Five interactive money calculators with instant charts, built for student budgets.",
      },
    ],
  }),
  component: Calculators,
});

const TABS = [
  { id: "emi", label: "EMI" },
  { id: "amort", label: "Amortization" },
  { id: "roi", label: "Compound ROI" },
  { id: "dividend", label: "Dividend yield" },
  { id: "tax", label: "Tax bracket" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Calculators() {
  const [tab, setTab] = useState<TabId>("emi");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">Calculators</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag any slider — every number and chart updates instantly.
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "emi" && <EmiCalc />}
      {tab === "amort" && <AmortCalc />}
      {tab === "roi" && <RoiCalc />}
      {tab === "dividend" && <DividendCalc />}
      {tab === "tax" && <TaxCalc />}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="num text-sm font-semibold text-primary">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-[var(--color-primary)]"
      />
    </label>
  );
}

function Readout({ items }: { items: { label: string; value: string; tone?: string }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((i) => (
        <div key={i.label} className="rounded-lg border border-border bg-secondary/50 p-3">
          <p className="text-xs font-medium text-muted-foreground">{i.label}</p>
          <p className={`num mt-1 text-lg font-semibold ${i.tone ?? ""}`}>{i.value}</p>
        </div>
      ))}
    </div>
  );
}

function emi(principal: number, annualRate: number, months: number) {
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function EmiCalc() {
  const [amount, setAmount] = useState(250000);
  const [rate, setRate] = useState(10.5);
  const [months, setMonths] = useState(36);

  const monthly = emi(amount, rate, months);
  const total = monthly * months;
  const interest = total - amount;

  const data = [
    { name: "Principal", value: amount },
    { name: "Interest", value: Math.round(interest) },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Loan inputs" subtitle="Education, bike or gadget loan">
        <div className="space-y-5">
          <Slider
            label="Loan amount"
            value={amount}
            min={10000}
            max={2000000}
            step={5000}
            onChange={setAmount}
            format={inr}
          />
          <Slider
            label="Interest rate (p.a.)"
            value={rate}
            min={5}
            max={24}
            step={0.1}
            onChange={setRate}
            format={(v) => `${v.toFixed(1)}%`}
          />
          <Slider
            label="Tenure"
            value={months}
            min={6}
            max={120}
            onChange={setMonths}
            format={(v) => `${v} months`}
          />
        </div>
        <div className="mt-5">
          <Readout
            items={[
              { label: "Monthly EMI", value: inr(Math.round(monthly)), tone: "text-primary" },
              {
                label: "Total interest",
                value: inr(Math.round(interest)),
                tone: "text-destructive",
              },
              { label: "Total payable", value: inr(Math.round(total)) },
            ]}
          />
        </div>
      </Panel>

      <Panel title="Principal vs interest" subtitle="What you borrow vs what it costs">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
              <XAxis
                type="number"
                tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                style={{ fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={70}
                style={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(v: number) => inr(v)}
                contentStyle={{ borderRadius: 10, fontSize: 12 }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                <Cell fill="var(--color-chart-1)" />
                <Cell fill="var(--color-chart-3)" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Interest is{" "}
          <span className="num font-semibold text-destructive">
            {Math.round((interest / amount) * 100)}%
          </span>{" "}
          of what you borrowed. Shortening the tenure cuts it fastest.
        </p>
      </Panel>
    </div>
  );
}

function AmortCalc() {
  const [amount, setAmount] = useState(400000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(5);

  const months = years * 12;
  const monthly = emi(amount, rate, months);

  const schedule = useMemo(() => {
    const r = rate / 12 / 100;
    let balance = amount;
    const rows: { month: number; principal: number; interest: number; balance: number }[] = [];
    for (let m = 1; m <= months; m++) {
      const int = balance * r;
      const prin = monthly - int;
      balance = Math.max(0, balance - prin);
      rows.push({ month: m, principal: prin, interest: int, balance });
    }
    return rows;
  }, [amount, rate, months, monthly]);

  const yearly = useMemo(
    () =>
      Array.from({ length: years }, (_, y) => {
        const slice = schedule.slice(y * 12, y * 12 + 12);
        return {
          label: `Yr ${y + 1}`,
          principal: Math.round(slice.reduce((s, r) => s + r.principal, 0)),
          interest: Math.round(slice.reduce((s, r) => s + r.interest, 0)),
          balance: Math.round(slice[slice.length - 1]?.balance ?? 0),
        };
      }),
    [schedule, years],
  );

  return (
    <div className="space-y-5">
      <Panel title="Amortization inputs">
        <div className="grid gap-5 sm:grid-cols-3">
          <Slider
            label="Loan amount"
            value={amount}
            min={50000}
            max={3000000}
            step={10000}
            onChange={setAmount}
            format={inr}
          />
          <Slider
            label="Rate (p.a.)"
            value={rate}
            min={5}
            max={20}
            step={0.25}
            onChange={setRate}
            format={(v) => `${v}%`}
          />
          <Slider
            label="Tenure"
            value={years}
            min={1}
            max={15}
            onChange={setYears}
            format={(v) => `${v} yrs`}
          />
        </div>
        <div className="mt-5">
          <Readout
            items={[
              { label: "Monthly EMI", value: inr(Math.round(monthly)), tone: "text-primary" },
              {
                label: "Total interest",
                value: inr(Math.round(monthly * months - amount)),
                tone: "text-destructive",
              },
              { label: "Payments", value: `${months}` },
            ]}
          />
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Yearly split" subtitle="Early years are mostly interest">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearly}>
                <XAxis dataKey="label" tickLine={false} axisLine={false} style={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                  style={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(v: number) => inr(v)}
                  contentStyle={{ borderRadius: 10, fontSize: 12 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="principal" stackId="a" fill="var(--color-chart-1)" />
                <Bar
                  dataKey="interest"
                  stackId="a"
                  fill="var(--color-chart-3)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Outstanding balance">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yearly}>
                <XAxis dataKey="label" tickLine={false} axisLine={false} style={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                  style={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(v: number) => inr(v)}
                  contentStyle={{ borderRadius: 10, fontSize: 12 }}
                />
                <Area
                  dataKey="balance"
                  stroke="var(--color-chart-2)"
                  fill="var(--color-chart-2)"
                  fillOpacity={0.18}
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="First 12 payments" subtitle="Month-by-month breakdown">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 font-semibold">Month</th>
                <th className="py-2 text-right font-semibold">Principal</th>
                <th className="py-2 text-right font-semibold">Interest</th>
                <th className="py-2 text-right font-semibold">Balance</th>
              </tr>
            </thead>
            <tbody>
              {schedule.slice(0, 12).map((r) => (
                <tr key={r.month} className="border-b border-border/60">
                  <td className="num py-2">{r.month}</td>
                  <td className="num py-2 text-right">{inr(Math.round(r.principal))}</td>
                  <td className="num py-2 text-right text-destructive">
                    {inr(Math.round(r.interest))}
                  </td>
                  <td className="num py-2 text-right">{inr(Math.round(r.balance))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function RoiCalc() {
  const [monthly, setMonthly] = useState(2500);
  const [lump, setLump] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const data = useMemo(() => {
    const r = rate / 100 / 12;
    const rows = [];
    for (let y = 1; y <= years; y++) {
      const m = y * 12;
      const sipValue = monthly * ((Math.pow(1 + r, m) - 1) / (r || 1)) * (1 + r);
      const lumpValue = lump * Math.pow(1 + rate / 100, y);
      rows.push({
        label: `Yr ${y}`,
        invested: Math.round(monthly * m + lump),
        value: Math.round(sipValue + lumpValue),
      });
    }
    return rows;
  }, [monthly, lump, rate, years]);

  const last = data[data.length - 1]!;
  const gain = last.value - last.invested;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Compound interest & ROI">
        <div className="space-y-5">
          <Slider
            label="Monthly SIP"
            value={monthly}
            min={0}
            max={25000}
            step={500}
            onChange={setMonthly}
            format={inr}
          />
          <Slider
            label="One-time investment"
            value={lump}
            min={0}
            max={500000}
            step={5000}
            onChange={setLump}
            format={inr}
          />
          <Slider
            label="Expected return (p.a.)"
            value={rate}
            min={1}
            max={20}
            step={0.5}
            onChange={setRate}
            format={(v) => `${v}%`}
          />
          <Slider
            label="Horizon"
            value={years}
            min={1}
            max={30}
            onChange={setYears}
            format={(v) => `${v} yrs`}
          />
        </div>
        <div className="mt-5">
          <Readout
            items={[
              { label: "Invested", value: inr(last.invested) },
              { label: "Final value", value: inr(last.value), tone: "text-primary" },
              {
                label: "Gain",
                value: `${Math.round((gain / last.invested) * 100)}%`,
                tone: "text-ochre",
              },
            ]}
          />
        </div>
      </Panel>

      <Panel title="Growth curve" subtitle="Invested vs projected value">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="label" tickLine={false} axisLine={false} style={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                style={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(v: number) => inr(v)}
                contentStyle={{ borderRadius: 10, fontSize: 12 }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Line dataKey="invested" stroke="var(--color-chart-4)" strokeWidth={2} dot={false} />
              <Line dataKey="value" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}

function DividendCalc() {
  const [price, setPrice] = useState(1450);
  const [dps, setDps] = useState(58);
  const [shares, setShares] = useState(40);
  const [growth, setGrowth] = useState(7);

  const yieldPct = (dps / price) * 100;
  const annualIncome = dps * shares;

  const data = Array.from({ length: 10 }, (_, i) => ({
    label: `Yr ${i + 1}`,
    value: Math.round(annualIncome * Math.pow(1 + growth / 100, i)),
  }));

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Dividend yield">
        <div className="space-y-5">
          <Slider
            label="Share price"
            value={price}
            min={50}
            max={5000}
            step={10}
            onChange={setPrice}
            format={inr}
          />
          <Slider
            label="Dividend per share (yr)"
            value={dps}
            min={0}
            max={300}
            onChange={setDps}
            format={inr}
          />
          <Slider
            label="Shares held"
            value={shares}
            min={1}
            max={1000}
            onChange={setShares}
            format={(v) => `${v}`}
          />
          <Slider
            label="Dividend growth (p.a.)"
            value={growth}
            min={0}
            max={20}
            step={0.5}
            onChange={setGrowth}
            format={(v) => `${v}%`}
          />
        </div>
        <div className="mt-5">
          <Readout
            items={[
              { label: "Dividend yield", value: `${yieldPct.toFixed(2)}%`, tone: "text-primary" },
              { label: "Annual income", value: inr(annualIncome) },
              {
                label: "Monthly average",
                value: inr(Math.round(annualIncome / 12)),
                tone: "text-ochre",
              },
            ]}
          />
        </div>
      </Panel>

      <Panel title="Dividend income projection" subtitle="If the payout grows each year">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="label" tickLine={false} axisLine={false} style={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                style={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(v: number) => inr(v)}
                contentStyle={{ borderRadius: 10, fontSize: 12 }}
              />
              <Bar dataKey="value" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}

const SLABS = [
  { upto: 400000, rate: 0, label: "0 – 4L" },
  { upto: 800000, rate: 5, label: "4L – 8L" },
  { upto: 1200000, rate: 10, label: "8L – 12L" },
  { upto: 1600000, rate: 15, label: "12L – 16L" },
  { upto: 2000000, rate: 20, label: "16L – 20L" },
  { upto: 2400000, rate: 25, label: "20L – 24L" },
  { upto: Infinity, rate: 30, label: "24L +" },
];

function TaxCalc() {
  const [income, setIncome] = useState(900000);

  const rows = useMemo(() => {
    let lower = 0;
    return SLABS.map((s) => {
      const taxable = Math.max(0, Math.min(income, s.upto) - lower);
      lower = s.upto;
      return { label: s.label, rate: s.rate, taxable, tax: Math.round((taxable * s.rate) / 100) };
    });
  }, [income]);

  const totalTax = rows.reduce((s, r) => s + r.tax, 0);
  const effective = income > 0 ? (totalTax / income) * 100 : 0;
  const marginal = rows.filter((r) => r.taxable > 0).at(-1)?.rate ?? 0;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Salary tax bracket" subtitle="New regime slabs, illustrative">
        <Slider
          label="Annual income"
          value={income}
          min={100000}
          max={3000000}
          step={25000}
          onChange={setIncome}
          format={inr}
        />
        <div className="mt-5">
          <Readout
            items={[
              { label: "Total tax", value: inr(totalTax), tone: "text-destructive" },
              { label: "Effective rate", value: `${effective.toFixed(1)}%` },
              { label: "Marginal rate", value: `${marginal}%`, tone: "text-ochre" },
            ]}
          />
        </div>
        <p className="mt-4 rounded-lg bg-sage-soft p-3 text-sm text-accent-foreground">
          Take-home after tax: <span className="num font-semibold">{inr(income - totalTax)}</span> —
          about{" "}
          <span className="num font-semibold">{inr(Math.round((income - totalTax) / 12))}</span> a
          month.
        </p>
      </Panel>

      <Panel title="Tax paid per slab" subtitle="Only income inside a band pays its rate">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows}>
              <XAxis dataKey="label" tickLine={false} axisLine={false} style={{ fontSize: 11 }} />
              <YAxis
                tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                style={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(v: number) => inr(v)}
                contentStyle={{ borderRadius: 10, fontSize: 12 }}
              />
              <Bar dataKey="tax" radius={[4, 4, 0, 0]}>
                {rows.map((r, i) => (
                  <Cell key={i} fill={r.tax > 0 ? "var(--color-chart-3)" : "var(--color-border)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
