# Earn Your Treat 🍰

A reward-based habit tracker: set goals, check in, and earn treats — with a monthly cap per treat so rewards stay meaningful.

<p>
  <img src="screenshot-today.png" width="250">
  <img src="screenshot-calendar.png" width="250">
  <img src="screenshot-card.png" width="250">
  <img src="screenshot-goal setting.png" width="250">
</p>
## Features

- **Weekly, monthly and yearly goals** — each with its own target, emoji and start date. Goals can be archived and restored.
- **Reward rules** — link a goal to a treat with your own exchange rate (e.g. 3 check-ins = 1 treat).
- **Monthly treat cap** — set a monthly allowance for each treat. Treats redeemed beyond your balance or cap are logged honestly as "extra" rather than blocked.
- **Calendar with backfill** — review check-ins and redemptions by day, and backfill missed check-ins from the past 7 days. Backfilled entries are marked separately from same-day check-ins.
- **Milestones and trophy shelf** — progress milestones (25%, 50%, 75%) and goal completions trigger a celebration and are collected on a trophy shelf.
- **Shareable cards** — download achievement cards and a weekly recap as images.
- **Bilingual interface** — switch between English and Traditional Chinese (繁體中文).
- **Data backup** — export all data to a JSON file and import it on another device or browser.
- **Demo mode** — first-time users can load two months of sample data to explore the app.

## Privacy

Everything stays on your device. All data is stored in the browser's `localStorage`: no accounts, no backend server, no analytics and no API keys. The app makes no network requests apart from loading web fonts.

## Tech stack

- React 19 and TypeScript
- Vite
- Tailwind CSS v4
- Motion (animations), canvas-confetti, Lucide icons
- html-to-image (card downloads)

Designed and iterated with [Google AI Studio](https://aistudio.google.com/).

## Run locally

Requires Node.js 18 or later.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

To create a production build:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── components/   Modals, cards and navigation
├── context/      App state and business logic (AppContext)
├── types/        TypeScript data models
├── utils/        Storage, date helpers, presets, templates, demo data
└── views/        Today, Goals, Treats and Calendar screens
```

## Possible extensions

This version is intentionally local-only. All storage operations live in a single module, `src/utils/storage.ts`, so the app can be extended without touching the screens:

- **Cloud sync** — replace the storage module with a backend such as Firebase or Supabase to sync across devices.
- **AI features** — for example, personalised encouragement messages via the Gemini API. API calls should go through a server-side function rather than the browser, so the API key is never exposed to users.

