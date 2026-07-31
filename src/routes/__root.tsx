import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { BookOpen, Calculator, Flame, LayoutDashboard, PieChart, Trophy, User } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { FinProvider, useFin } from "../lib/fin-context";
import { FinbotDrawer } from "../components/fin/finbot-drawer";
import { GoogleAuthModal } from "../components/fin/google-auth-modal";
import { SignupGate } from "../components/fin/signup-gate";
import { USER } from "../data/mock";
import brandMark from "../assets/finbot-mark.png";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Fin Plus — Student Finance Coach" },
      {
        name: "description",
        content:
          "Fin Plus helps students and young adults budget income, tame EMIs, break bad spending habits and learn investing.",
      },
      { property: "og:title", content: "Fin Plus — Student Finance Coach" },
      {
        property: "og:description",
        content:
          "Budgeting, EMI calculators, micro-lessons, habit streaks and an AI money assistant built for students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/academy", label: "Academy", icon: BookOpen },
  { to: "/calculators", label: "Calculators", icon: Calculator },
  { to: "/budget", label: "Budget", icon: PieChart },
  { to: "/habits", label: "Habits", icon: Flame },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
] as const;

function AppHeader() {
  const { user, score, streak } = useFin();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-none">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={brandMark} alt="" width={32} height={32} className="size-8 rounded-lg" />
          <span className="font-display text-lg font-bold tracking-tight">Fin Plus</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {/* User Profile Button */}
          <button
            onClick={() => setAuthOpen(true)}
            className="flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary hover:bg-sage-soft/60"
            title="Google Account Profile"
          >
            <div className="flex size-5 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-[10px]">
              {user.name ? user.name.charAt(0).toUpperCase() : "G"}
            </div>
            <span className="max-w-28 truncate">{user.name || "Sign In"}</span>
          </button>

          <div className="flex items-center gap-2 rounded-full bg-sage-soft px-3 py-1.5">
            <span className="num text-sm font-semibold text-accent-foreground">{score}/900</span>
            <span className="hidden text-xs font-medium text-accent-foreground sm:inline">
              · {USER.tier}
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-ochre-soft px-3 py-1.5 text-sm font-semibold text-ochre">
            <span aria-hidden>🔥</span>
            <span className="num">{streak}</span>
            <span className="hidden text-xs font-medium sm:inline">Day Streak</span>
          </div>
        </div>

        <nav className="-mx-1 order-last w-full overflow-x-auto">
          <ul className="flex items-center gap-1 px-1 pb-0.5">
            {NAV.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  activeOptions={{ exact: to === "/" }}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <GoogleAuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  );
}

function MainLayout() {
  const { user } = useFin();

  if (!user.isAuthenticated) {
    return <SignupGate />;
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-6 pb-24">
        {/* Required: nested routes render here. */}
        <Outlet />
      </main>
      <FinbotDrawer />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <FinProvider>
        <MainLayout />
      </FinProvider>
    </QueryClientProvider>
  );
}
