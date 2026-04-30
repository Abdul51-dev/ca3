# Campus Companion — CA3 Submission

A clean, minimal student dashboard web app for TU Dublin built with Next.js 14 and TypeScript.

**Live URL:** https://campus-companion-ca3.netlify.app  
**GitHub:** https://github.com/Abdul51-dev/ca3

---

## Chosen Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Inline styles + CSS custom properties |
| Data | Fictional static data (`.ts` files in `/data`) |
| Deployment | Netlify |
| AI Tools Used | Claude (Anthropic) — prompt transcripts included |

---

## Features

| Feature | Route | Description |
|---|---|---|
| Timetable | `/timetable` | Weekly class schedule (Mon–Fri) with room, type, and duration |
| Campus Map | `/map` | Interactive Grangegorman campus map with 7 clickable buildings |
| Module Tracker | `/modules` | 6 CS modules with grades, progress bars, and assignment urgency |
| Canteen Menu | `/canteen` | Daily fictional menu with category filters, calories, and allergens |
| Grade Calculator | `/grades` | Add modules and assessments; grades sync automatically to the Module Tracker |
| Events | `/events` | Browse and add campus events (societies, sports, academic, career, social) with a calendar view and category filters |
| Lost & Found | `/lost-found` | Report or search for lost/found items on campus; tracks open and resolved cases |
| Help Desk | `/helpdesk` | Submit and track support tickets; includes student and admin views with status tracking (Open, In Progress, Resolved) |
| Food Recommendation | `/recommend` | Filter canteen meals by day, max calories, max price, and allergen exclusions to get personalised meal suggestions |

---

## How to Run Locally

### Prerequisites

- Node.js 18+ (download from https://nodejs.org)
- npm (comes with Node.js)

### Steps

```
# 1. Clone the repository
git clone https://github.com/Abdul51-dev/ca3.git

# 2. Move into the project folder
cd ca3

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Then open **http://localhost:3000** in your browser.

### Build for Production

```
npm run build
npm start
```

---

## Environment Variables

This project uses **no environment variables** — there is no Supabase or external API connection. All data is fictional and stored locally in the `/data` directory.

If Supabase Auth were added in future, you would need:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These would be added to a `.env.local` file (never committed to GitHub).

---

## Project Structure

```
campus-companion/
├── app/
│   ├── layout.tsx              ← root layout, Topbar + NavBar
│   ├── page.tsx                ← redirects to /timetable
│   ├── timetable/page.tsx      ← timetable feature
│   ├── map/page.tsx            ← campus map feature
│   ├── modules/page.tsx        ← module tracker feature
│   ├── canteen/page.tsx        ← canteen menu feature
│   ├── grades/page.tsx         ← grade calculator feature
│   ├── events/page.tsx         ← events calendar feature
│   ├── lost-found/page.tsx     ← lost & found board feature
│   ├── helpdesk/page.tsx       ← help desk ticketing feature
│   └── recommend/page.tsx      ← food recommendation feature
├── components/
│   ├── Topbar.tsx              ← top header bar
│   ├── NavBar.tsx              ← navigation (client component)
│   ├── ClassCard.tsx           ← timetable slot card
│   ├── ModuleCard.tsx          ← module card with progress bar
│   ├── AssignmentItem.tsx      ← assignment row with urgency badge
│   └── MapPin.tsx              ← clickable campus map pin
├── data/
│   ├── timetable.ts            ← fictional weekly schedule data
│   ├── modules.ts              ← fictional module grades + assignments
│   ├── buildings.ts            ← fictional campus building directory
│   └── canteen.ts              ← fictional weekly canteen menu
└── styles/
    └── globals.css             ← CSS variables and global resets
```

---

## Fictional Seed Data

All data is fictional and AI-generated. No real personal data is used anywhere in this project.

| File | Contents |
|---|---|
| `data/timetable.ts` | Made-up CS module schedule across Mon–Fri |
| `data/modules.ts` | 6 fictional CS modules with fake grades and assignments |
| `data/buildings.ts` | 7 fictional buildings based loosely on Grangegorman layout |
| `data/canteen.ts` | 5-day fictional canteen menu with prices, calories, and allergens |

---

## Prompt Engineering — Structured Prompt Log

All AI prompts used during development followed this structured template:

---

### Prompt Template Used

```
ROLE: You are a senior Next.js engineer.

CONTEXT: We are building a Campus Companion web app for first-year 
TU Dublin computing students using Next.js 14 App Router and TypeScript.

CONSTRAINTS:
- Next.js 14 (App Router), TypeScript
- No external APIs — fictional data only stored in /data/*.ts files
- Styling via CSS custom properties and inline styles (no styled-jsx in Server Components)
- Components that use hooks must be marked 'use client'

TASK: [one specific task per prompt — e.g. "Build the canteen menu page 
with day switching and category filtering"]

OUTPUT FORMAT:
1. Files to create or edit
2. Full code only — no partial snippets
3. Brief test steps

SELF-CHECK: After generating code, list likely issues (e.g. Server vs 
Client Component errors, missing 'use client' directives) and fixes.
```

---

### Example Prompts Used (Summary)

**Prompt 1 — Initial app scaffold**
> ROLE: Senior Next.js engineer. TASK: Scaffold a Next.js 14 app with App Router, TypeScript, and a clean minimal design system using CSS variables. Include a Topbar, NavBar, and three routes: /timetable, /map, /modules. Use DM Sans and DM Mono from Google Fonts.

**Prompt 2 — Timetable feature**
> TASK: Build the /timetable page. It should show a Mon–Fri day selector and render ClassCard components for each slot. Data comes from data/timetable.ts. SELF-CHECK: Ensure no styled-jsx is used in Server Components.

**Prompt 3 — Campus map feature**
> TASK: Build the /map page with an SVG campus map and clickable MapPin components for 7 buildings. Clicking a pin updates a detail card below the map with name, description, hours and accessibility info.

**Prompt 4 — Module tracker feature**
> TASK: Build the /modules page showing 6 modules in a 2-column grid. Each ModuleCard shows module code, grade letter, progress bar, and completion percentage. Below the grid show upcoming assignments with urgency badges (urgent / this week / on track).

**Prompt 5 — Canteen menu feature**
> TASK: Build the /canteen page with a day selector (Mon–Fri) and category filter buttons (Hot Meal, Grill, Vegetarian, Vegan, Soup, Dessert). Each menu item shows name, description, price, calories, and allergens. Data comes from data/canteen.ts.

**Prompt 6 — Grade calculator feature**
> TASK: Build the /grades page with an interactive grade calculator. Students can add modules and individual assessments with weightings; overall grades should sync to the Module Tracker automatically.

**Prompt 7 — Events feature**
> TASK: Build the /events page with a calendar view and category filters (General, Society, Sports, Academic, Social, Career). Students can browse upcoming events and add new ones using a form.

**Prompt 8 — Lost & Found feature**
> TASK: Build the /lost-found page where students can report lost or found items and search existing reports. Include status tracking (Open, Resolved) and filter options for Lost vs Found items.

**Prompt 9 — Help Desk feature**
> TASK: Build the /helpdesk page with a ticket submission system. Include student and admin views. Tickets should have statuses (Open, In Progress, Resolved, Closed) and be filterable by status.

**Prompt 10 — Food Recommendation feature**
> TASK: Build the /recommend page. Students select a day, set a max calorie limit, set a max price, and exclude allergens. The page filters canteen data and returns personalised meal suggestions.

**Prompt 11 — Bug fixes (iterative)**
> CONTEXT: Getting error "'client-only' cannot be imported from a Server Component". TASK: Identify all components using styled-jsx and convert them to use inline styles so they are compatible with Next.js Server Components. List every file that needs changing.

---

## Iterative Development Process

This project was built using the plan → generate → review → improve cycle:

1. **Plan** — described one small feature at a time to the AI
2. **Generate** — AI produced full file code
3. **Review** — ran locally, checked for errors in terminal and browser
4. **Improve** — fed errors back to AI with exact error messages for targeted fixes

Full prompt transcript is included as a separate file in this submission.

---

## Accessibility Notes

- Semantic HTML elements used throughout (`<header>`, `<nav>`, `<main>`)
- All interactive elements are `<button>` or `<Link>` (keyboard accessible)
- Colour is never the only indicator — text labels always accompany colour badges
- Sufficient contrast maintained across light background and dark text
- `aria-label` attributes added to MapPin buttons

---
