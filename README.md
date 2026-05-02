# crit.

Real design feedback in 30 seconds. AI-powered design critique tool that scores your designs across clarity, hierarchy, trust, and conversion — and tells you exactly what to fix.

![crit screenshot](https://via.placeholder.com/1200x600/111111/FF5512?text=crit.)

## Features

- **Real auth** with localStorage-based sessions
- **Vision AI critique** — Claude analyses your actual design pixel by pixel
- **0–100 scoring** across four UX dimensions
- **Specific, actionable issues** with concrete fixes
- **Persistent history** of all your critiques
- **Brand kit** for consistent design tokens
- **Smooth orange loading bars** with staged progress

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Anthropic Claude API** (Sonnet 4 with vision)
- **Geist font** via Google Fonts
- **No external UI library** — pure CSS-in-JS for full control

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/crit.git
cd crit
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Get your Anthropic API key at [console.anthropic.com](https://console.anthropic.com) and add it to `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you'll land on the marketing page. Click "Run a free critique" to sign up and start using the app.

## Project Structure

```
crit/
├── app/
│   ├── api/
│   │   └── critique/
│   │       └── route.ts          # Server-side Claude API call
│   ├── dashboard/
│   │   └── page.tsx              # Main dashboard with all tabs
│   ├── login/
│   │   └── page.tsx              # Auth screen (login/signup)
│   ├── layout.tsx                # Root layout + Geist font
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/
│   ├── AuthScreen.tsx            # Login/signup form
│   ├── Dashboard.tsx             # Sidebar + view router
│   ├── CritiqueFlow.tsx          # Upload + analyse flow
│   ├── CritiqueResult.tsx        # Score + issues display
│   ├── LoadingBars.tsx           # Animated orange progress bars
│   └── views/
│       ├── CritiquesView.tsx
│       ├── ProjectsView.tsx
│       ├── HistoryView.tsx
│       └── BrandKitView.tsx
├── lib/
│   ├── colors.ts                 # Design tokens
│   └── storage.ts                # localStorage helpers
└── public/
```

## Deploying

### Vercel (recommended)

1. Push this repo to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Add `ANTHROPIC_API_KEY` to environment variables
4. Deploy

### Manual deployment

Any platform that supports Next.js will work — Netlify, Railway, Fly.io, your own VPS. Just make sure to set the `ANTHROPIC_API_KEY` env var.

## How It Works

1. **User uploads a design** (PNG/JPG screenshot or Figma export)
2. **Frontend converts to base64** and POSTs to `/api/critique` along with optional context
3. **Server-side route** calls the Anthropic API with the image and a structured prompt
4. **Claude returns JSON** with score, dimensions, and specific issues
5. **Frontend renders** the critique with smooth animations
6. **Result is saved** to localStorage so users can browse past critiques

The API key never touches the client — all Claude calls go through the Next.js server route.

## Customising

### Change the brand color

Edit `lib/colors.ts` — replace `ORANGE` with whatever fits your brand. The whole app is themed off this single token.

### Change the scoring framework

Edit the prompt in `app/api/critique/route.ts`. The current prompt asks for clarity, hierarchy, trust, and conversion — swap these for whatever dimensions matter to your users.

### Add real auth

The current auth uses localStorage which is fine for a demo but not production. To upgrade:

- Drop in [NextAuth.js](https://next-auth.js.org) for OAuth
- Or [Clerk](https://clerk.com) / [Supabase Auth](https://supabase.com/auth) for full backend auth
- Replace `lib/storage.ts` with calls to a real database

## License

MIT — do whatever you want with it.

## Built by

[velora.studio](https://velora.studio) — design partner for AI & web3 founders.
