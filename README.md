# Fin Plus: Student Finance

Build a comprehensive, production-ready full-stack financial literacy and management web app named "Fin Plus" designed specifically for students and young adults managing income, EMIs, and budgeting.

### Visual Aesthetic & Style (Strict Rule)

- Canvas background: Soft Warm Cream (#F8F7F2)

- Cards & Surfaces: White (#FFFFFF) with 1px border (#E5E3D8) and soft elevation

- Text: Deep Forest Charcoal (#132A1D)

- Primary Accents: Deep Sage (#2A7B50) and Warm Ochre (#D48806)

- Danger/Alert: Terracotta Rust (#C85A32)

- Typography: Plus Jakarta Sans for headings, DM Sans for body text, mono fonts for currency/numbers.

- Clean, tactile, high-density dashboard. NO neon dark mode, NO glassmorphic blurs.

### Layout Architecture & Navigation

A top navigation header with "Fin Plus" logo, user financial health score badge (e.g., "780/900 - Wise Saver"), active streak counter ("🔥 12-Day Streak"), and a side/top view switcher containing 6 main modules:

1. Overview Dashboard:

   - Cash flow summary cards (Monthly Income, Total Expenses, Net Savings, Active EMIs).

   - Interactive expense breakdown chart (Recharts pie/bar chart).

   - "Habit Detector Alert Banner": Highlights bad spending habits (e.g., "⚠️ High impulse spending detected on food delivery late at night (+34% vs last month)") with actionable resolution tips.

2. Interactive Micro-Lessons (Financial Academy):

   - Grid of category cards: Mutual Funds, Stocks, Crypto, Investing 101, Fixed Deposits, Tax Basics.

   - Clickable lesson drawer with short byte-sized reading cards, interactive flashcard quizzes, and a "Complete Lesson" button that awards streak points and updates the user's score.

3. Financial Calculators Hub:

   - Tabbed interactive tools for: EMI Calculator, Loan Amortization, Compound Interest ROI, Dividend Yield, and Salary Tax Bracket breakdown.

   - Real-time slider inputs with dynamic SVG/Recharts output graphs and instant monthly payment readouts.

4. Smart Student Budgeting Tool:

   - Income slider & category priority customization (50/30/20 rule or custom allocation).

   - Live budget vs. actual spending progress bars across categories (Rent/Hostel, Food, Tech, Savings, Fun).

5. Gamified Habit Streaks & Leaderboard:

   - Weekly challenge progress (e.g., "Zero Impulse Spending Days: 4/5").

   - Leaderboard showing anonymous student rankings based on budget adherence, streak length, and lesson completion scores.

6. AI Financial Assistant Drawer:

   - Fixed slide-over or floating chat window ("FinBot Assistant") with pre-set suggestion chips ("How do I split my 15,000 allowance?", "Explain Mutual Funds vs FDs", "How to reduce EMI strain?").

   - Responsive chat interface with typing indicators and simulated markdown responses.

### Tech Stack Details

- Framework: React (TypeScript) with Tailwind CSS

- Icons: lucide-react

- Charts: recharts

- Include dynamic local state for all forms, sliders, quiz answers, and chat inputs so every button on screen is fully interactive. Populate with realistic mock student transaction data.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cb9ad8db-a0a2-487a-82c8-e7d2b4edf26b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
