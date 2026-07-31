import { useState } from "react";
import { useFin } from "@/lib/fin-context";
import {
  ShieldCheck,
  Sparkles,
  BookOpen,
  Calculator,
  PieChart,
  Flame,
  Bot,
  ArrowRight,
  CheckCircle2,
  Mail,
  User as UserIcon,
} from "lucide-react";
import brandMark from "@/assets/finbot-mark.png";

export function SignupGate() {
  const { loginWithGoogle } = useFin();
  const [email, setEmail] = useState("debnathraj.deep3841@gmail.com");
  const [name, setName] = useState("Debnath Raj");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleGoogleAuth(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid Gmail address (e.g. user@gmail.com)");
      return;
    }

    setLoading(true);

    // Derive name from Gmail prefix if name field empty
    let derivedName = name.trim();
    if (!derivedName) {
      const prefix = email.split("@")[0] || "User";
      derivedName = prefix
        .replace(/[._\d]+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    // Simulate Google OAuth token exchange & verification
    setTimeout(() => {
      loginWithGoogle({
        name: derivedName || "Google Student",
        email: email.trim(),
      });
      setLoading(false);
    }, 700);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Subtle Accent Glow */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-40">
        <div className="w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 w-full max-w-4xl grid gap-8 lg:grid-cols-12 items-center">
        {/* Left Column: Brand & Feature Highlights */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-3">
            <img src={brandMark} alt="Fin Plus Logo" className="size-11 rounded-xl shadow-xs" />
            <div>
              <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
                Fin Plus Buddy
              </span>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                Personal Finance Coach
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              Master your money before your first salary.
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sign up with your Google account to unlock interactive micro-lessons, smart 50/30/20
              budgeting, EMI calculators, habit tracking, and FinBot AI.
            </p>
          </div>

          {/* Unlocked Capabilities Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-3 shadow-xs">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sage-soft text-primary">
                <BookOpen className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Micro-Lessons</p>
                <p className="text-[11px] text-muted-foreground">Mutual Funds & Crypto</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-3 shadow-xs">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ochre-soft text-ochre">
                <Calculator className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">6 Calculators</p>
                <p className="text-[11px] text-muted-foreground">EMI, SIP, ROI & Tax</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-3 shadow-xs">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sage-soft text-primary">
                <PieChart className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Smart Budgeting</p>
                <p className="text-[11px] text-muted-foreground">Custom 50/30/20 Split</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-3 shadow-xs">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ochre-soft text-ochre">
                <Bot className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">FinBot AI Assistant</p>
                <p className="text-[11px] text-muted-foreground">Real-time Money Advice</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground pt-1">
            <ShieldCheck className="size-4 text-primary" />
            <span>Google OAuth 2.0 Encrypted · No Credit Card Required</span>
          </div>
        </div>

        {/* Right Column: Google Sign Up Card */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
            <div className="text-center space-y-2 mb-6">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg className="size-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">Sign Up / Sign In</h2>
              <p className="text-xs text-muted-foreground">
                Register with your Gmail address to verify your account and unlock the app.
              </p>
            </div>

            {/* Quick One-Click Google OAuth Button */}
            <button
              onClick={() => handleGoogleAuth()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-secondary/80 hover:bg-secondary px-4 py-3 text-sm font-bold text-foreground transition-all shadow-xs hover:shadow-sm"
            >
              <svg className="size-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>
                {loading ? "Verifying Google Account..." : "Continue with Google Account"}
              </span>
            </button>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                <span className="bg-card px-2 text-muted-foreground font-semibold">
                  Or enter Gmail details
                </span>
              </div>
            </div>

            <form onSubmit={handleGoogleAuth} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1">
                  <Mail className="size-3.5 text-muted-foreground" /> Gmail / Google Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. debnathraj.deep3841@gmail.com"
                  className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1">
                  <UserIcon className="size-3.5 text-muted-foreground" /> Your Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Debnath Raj"
                  className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {error && <p className="text-xs font-semibold text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 shadow-xs"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    <span>Register & Unlock Fin Plus</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-border text-center">
              <p className="text-[11px] text-muted-foreground">
                By registering, you agree to Fin Plus Buddy's student learning terms & privacy
                policy.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
