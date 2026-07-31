import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ACTUAL_SPEND,
  BUDGET_CATEGORIES,
  EMIS,
  INCOME_SOURCES,
  TRANSACTIONS,
  USER,
  type IncomeSource,
} from "@/data/mock";

export type Allocation = Record<string, number>;

export type UserProfile = {
  name: string;
  email: string;
  picture?: string;
  isAuthenticated: boolean;
  authProvider?: "google" | "manual";
};

type FinState = {
  user: UserProfile;
  score: number;
  streak: number;
  points: number;
  completedLessons: string[];
  incomeSources: IncomeSource[];
  allocation: Allocation;
  preset: "50-30-20" | "custom";
  dismissedTips: string[];
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  emiTotal: number;
  updateUser: (profile: Partial<UserProfile>) => void;
  loginWithGoogle: (data: { name: string; email: string; picture?: string }) => void;
  logout: () => void;
  completeLesson: (id: string, quizScore: number) => void;
  setIncomeAmount: (id: string, amount: number) => void;
  setAllocation: (key: string, value: number) => void;
  applyPreset: (preset: "50-30-20" | "custom") => void;
  dismissTip: (id: string) => void;
};

const FinCtx = createContext<FinState | null>(null);

const DEFAULT_USER: UserProfile = {
  name: "",
  email: "",
  picture: "",
  isAuthenticated: false,
  authProvider: undefined,
};

const DEFAULT_ALLOCATION: Allocation = Object.fromEntries(
  BUDGET_CATEGORIES.map((c) => [c.key, c.share]),
);

// 50 needs / 30 wants / 20 savings mapped onto the app's five buckets.
const PRESET_50_30_20: Allocation = { Rent: 34, Food: 16, Tech: 10, Savings: 20, Fun: 20 };

export function FinProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fin_user_profile");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object") {
            setUser(parsed);
          }
        } catch {
          // ignore error
        }
      }
    }
  }, []);

  const [score, setScore] = useState(USER.score);
  const [streak, setStreak] = useState(USER.streak);
  const [points, setPoints] = useState(340);
  const [completedLessons, setCompletedLessons] = useState<string[]>(["fd-1"]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>(INCOME_SOURCES);
  const [allocation, setAllocationState] = useState<Allocation>(DEFAULT_ALLOCATION);
  const [preset, setPreset] = useState<"50-30-20" | "custom">("custom");
  const [dismissedTips, setDismissedTips] = useState<string[]>([]);

  const totalIncome = incomeSources.reduce((sum, s) => sum + s.amount, 0);
  const emiTotal = EMIS.reduce((sum, e) => sum + e.monthly, 0);
  const totalExpenses =
    Object.values(ACTUAL_SPEND).reduce((sum, v) => sum + v, 0) -
    (ACTUAL_SPEND["Savings"] ?? 0) +
    emiTotal;
  const netSavings = totalIncome - totalExpenses;

  const updateUser = (profile: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...profile };
      if (typeof window !== "undefined") {
        localStorage.setItem("fin_user_profile", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const loginWithGoogle = (data: { name: string; email: string; picture?: string }) => {
    const newProfile: UserProfile = {
      name: data.name,
      email: data.email,
      picture: data.picture || "",
      isAuthenticated: true,
      authProvider: "google",
    };
    setUser(newProfile);
    if (typeof window !== "undefined") {
      localStorage.setItem("fin_user_profile", JSON.stringify(newProfile));
    }
  };

  const logout = () => {
    const unauth: UserProfile = {
      name: "Guest",
      email: "",
      picture: "",
      isAuthenticated: false,
      authProvider: "manual",
    };
    setUser(unauth);
    if (typeof window !== "undefined") {
      localStorage.setItem("fin_user_profile", JSON.stringify(unauth));
    }
  };

  const value = useMemo<FinState>(
    () => ({
      user,
      score,
      streak,
      points,
      completedLessons,
      incomeSources,
      allocation,
      preset,
      dismissedTips,
      totalIncome,
      totalExpenses,
      netSavings,
      emiTotal,
      updateUser,
      loginWithGoogle,
      logout,
      completeLesson: (id, quizScore) => {
        setCompletedLessons((prev) => (prev.includes(id) ? prev : [...prev, id]));
        setPoints((p) => p + 20 + quizScore * 5);
        setScore((s) => Math.min(900, s + 4 + quizScore * 2));
        setStreak((s) => s + (completedLessons.includes(id) ? 0 : 1));
      },
      setIncomeAmount: (id, amount) =>
        setIncomeSources((prev) => prev.map((s) => (s.id === id ? { ...s, amount } : s))),
      setAllocation: (key, next) => {
        setPreset("custom");
        setAllocationState((prev) => {
          const others = Object.keys(prev).filter((k) => k !== key);
          const remaining = 100 - next;
          const otherTotal = others.reduce((sum, k) => sum + (prev[k] ?? 0), 0);
          const scaled: Allocation = { [key]: next };
          others.forEach((k, i) => {
            scaled[k] =
              otherTotal === 0
                ? Math.round(remaining / others.length)
                : Math.round(((prev[k] ?? 0) / otherTotal) * remaining);
            if (i === others.length - 1) {
              const sum = others.reduce((acc, kk) => acc + (scaled[kk] ?? 0), 0);
              scaled[k] = (scaled[k] ?? 0) + (remaining - sum);
            }
          });
          return scaled;
        });
      },
      applyPreset: (p) => {
        setPreset(p);
        setAllocationState(p === "50-30-20" ? PRESET_50_30_20 : DEFAULT_ALLOCATION);
      },
      dismissTip: (id) => setDismissedTips((prev) => [...prev, id]),
    }),
    [
      user,
      score,
      streak,
      points,
      completedLessons,
      incomeSources,
      allocation,
      preset,
      dismissedTips,
      totalIncome,
      totalExpenses,
      netSavings,
      emiTotal,
    ],
  );

  return <FinCtx.Provider value={value}>{children}</FinCtx.Provider>;
}

export function useFin() {
  const ctx = useContext(FinCtx);
  if (!ctx) throw new Error("useFin must be used inside FinProvider");
  return ctx;
}

export const RECENT_TRANSACTIONS = TRANSACTIONS;

export function inr(value: number, compact = false) {
  if (compact && Math.abs(value) >= 1000) {
    return `₹${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  }
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}
