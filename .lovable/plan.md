## Fin Plus — plan (Gemini-ready)

Fully interactive front-end app with realistic mock student data. Since you'll port it to Google AI Studio and add a Gemini key, FinBot is built behind a single swappable interface.

### Design system (src/styles.css)

- Tokens: canvas cream `#F8F7F2`, card white + border `#E5E3D8`, text `#132A1D`, sage `#2A7B50`, ochre `#D48806`, terracotta `#C85A32`, soft elevation.
- Fonts via `<link>` in `__root.tsx`: Plus Jakarta Sans (headings), DM Sans (body), JetBrains Mono (numbers). Light-only, no blur, no neon.

### Layout

- `__root.tsx`: header with Fin Plus mark, health-score badge (780/900 · Wise Saver), 🔥 12-day streak chip, module switcher.
- Routes: `/` Overview, `/academy`, `/calculators`, `/budget`, `/streaks`. FinBot drawer floats on every page.

### Modules

1. **Overview** — cash-flow cards (income, expenses, net savings, active EMIs); Recharts expense pie + monthly trend bar; Habit Detector banner ("high impulse spending on late-night food delivery, +34% vs last month") with expandable fixes; recent transactions.
   - **Getting-started tips**: dismissible "Start your financial journey" card deck for new users (build an emergency fund, automate savings, understand your EMI load) with progress dots.
2. **Academy** — 6 category cards (Mutual Funds, Stocks, Crypto, Investing 101, Fixed Deposits, Tax Basics). Lesson drawer: byte-sized reading cards with inline illustrative charts/diagrams, flashcard quiz with scoring, "Complete Lesson" awards points → header score/streak update, progress rings.
3. **Calculators** — tabs: EMI, Loan Amortization, Compound Interest ROI, Dividend Yield, Salary Tax Bracket. Sliders + numeric inputs, instant readouts, a Recharts graph per tool (amortization split, growth curve, tax bracket bars).
4. **Budget** — income sources (multiple entries), income-bracket aware defaults, 50/30/20 preset vs custom priority sliders (normalized to 100%), live budget-vs-actual bars for Rent/Hostel, Food, Tech, Savings, Fun with over-budget terracotta states, plus an allocation donut.
5. **Habits & Streaks** — bad-habit cards with severity and trend sparklines, weekly challenges (Zero Impulse Spending Days 4/5), 7-day streak calendar, anonymous sortable leaderboard with the current user highlighted.
6. **FinBot drawer** — suggestion chips, typing indicator, markdown replies, references the user's live numbers.

### Gemini-ready chat seam

- `src/lib/finbot/buildContext.ts` — compacts live app state (income sources, allocations, category spend, EMIs, detected habits, streak, score, completed lessons) into JSON + a system prompt. This is the context payload for Gemini.
- `src/lib/finbot/provider.ts` — one `sendMessage(messages, context)` interface with a `mockProvider` (keyword-matched markdown) and a commented `geminiProvider` stub marking exactly where the API key and `generateContent` call go, so in AI Studio you swap one export.
- Chat UI talks only to that interface.

### Technical notes

- `FinContext` holds score, streak, points, completed lessons, budget config, transactions, dismissed tips so every module stays in sync with the header.
- Mock data in `src/data/` (transactions, EMIs, lessons+quizzes, habits, leaderboard, challenges, tips).
- recharts, lucide-react, react-markdown.
- Per-route `head()` metadata, single H1 per page, responsive to mobile.
