import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  children,
  className,
  title,
  subtitle,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <section className={cn("surface p-5", className)}>
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-base font-semibold">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "neutral",
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "sage" | "ochre" | "terracotta";
  icon?: ReactNode;
}) {
  const toneClass = {
    neutral: "text-foreground",
    sage: "text-primary",
    ochre: "text-ochre",
    terracotta: "text-destructive",
  }[tone];

  return (
    <div className="surface p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {icon && <span className={toneClass}>{icon}</span>}
      </div>
      <p className={cn("num mt-2 text-2xl font-semibold", toneClass)}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Bar({
  label,
  value,
  max,
  valueLabel,
  over,
}: {
  label: string;
  value: number;
  max: number;
  valueLabel: string;
  over?: boolean;
}) {
  const pct = max <= 0 ? 0 : Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className={cn("num text-xs", over ? "text-destructive" : "text-muted-foreground")}>
          {valueLabel}
        </span>
      </div>
      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500",
            over ? "bg-destructive" : "bg-primary",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function Pill({
  children,
  tone = "sage",
}: {
  children: ReactNode;
  tone?: "sage" | "ochre" | "terracotta" | "muted";
}) {
  const tones = {
    sage: "bg-sage-soft text-accent-foreground",
    ochre: "bg-ochre-soft text-ochre",
    terracotta: "bg-terracotta-soft text-destructive",
    muted: "bg-secondary text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
