# Treat Tracker

A reward-based habit tracker where completing goals earns treats, with a monthly treat cap.

![Screenshot](screenshot.png)

## Features

- **Habit Goals**: Create and track daily, weekly, or monthly goals with customizable targets and emojis.
- **Treat Rewards**: Link goals to treat rewards with customizable exchange rules (e.g. 3 check-ins = 1 treat).
- **Monthly Treat Cap**: Set healthy monthly allowances per treat to celebrate milestones responsibly and avoid over-indulgence.
- **Interactive Calendar with Backfill**: View your complete check-in and redemption history by day, with support for logging recent past activities.
- **Trophy Shelf & Milestones**: Earn badges and celebratory confetti when reaching habit streaks and redeem milestones.
- **Downloadable Summary Card**: Export and save a visual summary card of your progress as an image.
- **Bilingual Interface & Data Portability**: Toggle between English and Traditional Chinese (繁體中文), with JSON backup export and import.

## Tech Stack

Built with [Google AI Studio](https://aistudio.google.com/):

- **Core**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animation & Visuals**: Motion, Canvas Confetti
- **Image Generation**: html-to-image

## Privacy

All data is stored locally in the browser's `localStorage`. The application runs entirely client-side with no accounts, no backend servers, and no API keys required.

## Run Locally

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the local development server:
```bash
npm run dev
```

### Build

Create an optimized production build:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

## Possible Extensions

- **Cloud Sync**: All storage operations are centralized in `src/utils/storage.ts`, making it straightforward to replace the local storage provider with a backend database like Firebase or Supabase for cross-device synchronization.
- **AI Features**: Personalized encouragement messages, celebratory quotes, or habit insights via the Gemini API. For security, API calls should be routed through a server-side function rather than called directly from the browser, ensuring the API key is never exposed.

## My role

[To be written by the author]
