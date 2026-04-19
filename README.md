# 🎓 Campus Companion — Next.js App

A clean, minimal student dashboard for TU Dublin built with Next.js 14, TypeScript, and styled-jsx.

## Features

| Feature | Route |
|---|---|
| Weekly timetable (Mon–Fri) | `/timetable` |
| Interactive campus map | `/map` |
| Module tracker + assignments | `/modules` |

---

## Project Structure

```
campus-companion/
├── app/
│   ├── layout.tsx          ← root layout, Topbar + Nav
│   ├── page.tsx            ← redirects → /timetable
│   ├── timetable/
│   │   └── page.tsx
│   ├── map/
│   │   └── page.tsx
│   └── modules/
│       └── page.tsx
├── components/
│   ├── Topbar.tsx
│   ├── ClassCard.tsx
│   ├── ModuleCard.tsx
│   ├── AssignmentItem.tsx
│   └── MapPin.tsx
├── data/
│   ├── timetable.ts        ← schedule data + types
│   ├── modules.ts          ← module + assignment data + types
│   └── buildings.ts        ← campus building data + types
├── styles/
│   └── globals.css         ← CSS variables, resets
├── package.json
├── tsconfig.json
└── next.config.js
```

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/timetable`.

### 3. Build for production
```bash
npm run build
npm start
```

---

## Deployment (Vercel — recommended)

```bash
npm install -g vercel
vercel
```

That's it. Vercel auto-detects Next.js. Your app will be live at a `.vercel.app` URL instantly.

---

## Extending the App

### Add your real timetable
Edit `data/timetable.ts` — the `timetable` object is keyed by day.

### Add modules / grades
Edit `data/modules.ts` — update the `modules` and `assignments` arrays.

### ML component hook (for the full project brief)
The `modules` data is already structured for a grade predictor. You can:
1. Train a scikit-learn model on student grade data
2. Expose it as a `/api/predict` route (`app/api/predict/route.ts`)
3. Call it from `ModulesPage` with a `fetch()` to show predicted final grade

### Active nav highlighting
In `app/layout.tsx`, replace `<Link>` with a `NavLink` client component that uses `usePathname()` to apply the `.active` class.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: styled-jsx (scoped CSS) + CSS variables
- **Fonts**: DM Sans + DM Mono (Google Fonts)
- **Deployment**: Vercel
