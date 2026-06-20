# Hero Redesign — CHED E-Library Landing Page

**Date:** 2026-06-20
**Scope:** `resources/js/pages/welcome.tsx` — hero section only

---

## Goal

Replace the current two-column hero (main card + Quick Access sidebar) with a single centered, minimal hero that puts the headline and CTA front and center.

---

## Layout

- Vertically centered in the remaining viewport height below the header
- Horizontally centered, `max-w-2xl`, with comfortable padding
- Single column — no sidebar

## Sections (top to bottom)

1. **Badge pill** — same as current: green online dot + "Regional Office XII · Digital Library", rounded-full, blue-tinted background
2. **Headline** — "Welcome to CHED E-Library", large (`text-4xl` → `text-5xl` → `text-6xl`), bold, "CHED E-Library" in `#2A5298` / `#7da5ff` dark
3. **Subtext** — single line, `text-lg`, muted color: "Browse policies, publications, and academic materials for higher education institutions across SOCCSKSARGEN."
4. **CTA button** — "Enter the Library →" linking to `/login` (hidden when user is authenticated, replaced by "Go to Dashboard →" linking to `/dashboard`)
5. **Stat chips** — three inline chips in a row: `5,240+ Resources`, `28 Partner Schools`, `1,200 Daily Visits` — small, muted, pill-shaped

## What's Removed

- Right sidebar (Quick Access cards, Library Hours card)
- Feature badges (📚 5k+ digital titles, etc.) — replaced by cleaner stat chips
- Stats grid (the 3-card row at the bottom of the left card)

## Styling

- Background: unchanged — existing radial gradient on the page wrapper
- Hero card: same glassmorphism as current (`bg-white/85`, `backdrop-blur-sm`, `border`, `shadow`)
- Colors: unchanged — `#2A5298` primary blue, `#132247` headline, `#2f3b57` body text, dark mode equivalents
- Header: unchanged

## Auth Behavior

- Unauthenticated: show "Enter the Library →" → `route('login')`
- Authenticated: show "Go to Dashboard →" → `route('dashboard')`

---

## Out of Scope

- No changes to the header
- No changes to routing or backend
- No new components — all changes stay in `welcome.tsx`
