# Almosafer — Project Context for Claude

## Project Overview
A production-grade **single-file HTML prototype** of the Almosafer (المسافر) Saudi Arabia travel booking platform. All CSS, HTML, and JavaScript live in one file: `index.html`.

## Preview Server
```
npx serve . --listen 3000 --no-clipboard
```
Preview URL: `http://localhost:3000`
Server config: `.claude/launch.json`

---

## File Structure
```
Almosafer/
├── index.html          ← entire app (HTML + CSS + JS, no build step)
└── .claude/
    └── launch.json     ← npx serve config
```

---

## Brand Tokens

### Colors
```css
--alm-dark:  #003B4A   /* header bg, primary text */
--alm-cyan:  #00B7C6   /* brand accent, icons, borders */
--alm-red:   #E63946   /* CTA buttons, coral accent */
--alm-white: #FFFFFF
```

### Semantic tokens
```css
--text-primary:   #003B4A
--text-secondary: #4B7A85
--text-subtle:    #7A9EA8
--bg-page:        #F0F5F7
--bg-surface:     #FFFFFF
--border:         #D0E2E6
```

### Border radius scale
```css
--r-sm: 6px  --r-md: 10px  --r-lg: 14px  --r-xl: 20px  --r-full: 9999px
```

### Typography
| Mode    | Font                   |
|---------|------------------------|
| English | IBM Plex Sans          |
| Arabic  | IBM Plex Sans Arabic   |

Font switching is handled at the `html` element:
```css
html { font-family: var(--font); }
html[lang="ar"] { font-family: var(--font-ar); }
```
All children inherit via `font-family: inherit`.

---

## Bilingual / RTL System
- Language is stored in `localStorage` key `alm-lang` (`"en"` or `"ar"`)
- `html.lang` and `html.dir` are toggled by `#langBtn`
- Content uses `.en` / `.ar` helper spans:
  ```html
  <span class="en">English text</span>
  <span class="ar">النص العربي</span>
  ```
- CSS shows/hides them:
  ```css
  .ar { display: none; }
  html[lang="ar"] .en { display: none; }
  html[lang="ar"] .ar { display: inline; }
  ```

---

## Logo Rules
- **English mode**: show `.logo-en` only → wordmark `Alm<span class="logo-o">o</span>safer`
- **Arabic mode**: show `.logo-ar` only → wordmark `ال<span class="logo-meem">م</span>سافر`
- Split-color "o" / "م": CSS `background-clip: text` gradient (cyan → red)
- Arabic wordmark uses a full-word gradient (no span wrapping that breaks shaping):
  ```css
  .logo-ar .logo-wordmark {
    background: linear-gradient(to right, #fff 63%, #E63946 63% 73%, #00B7C6 73% 83%, #fff 83%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  ```
- **No SVG, no image, no icon** in the logo — text only

---

## Hero Search Widget

### Tab structure
```
[Flights] [Stays] [Activities]   ← .sh-tab buttons, hug content width
──────────────────────────────
[         .sh-panel              ]
```
- Active tab: `background: #fff; color: var(--alm-dark)`
- Inactive tab: `background: rgba(0,0,0,0.30); backdrop-filter: blur(10px); color: rgba(255,255,255,0.80)`
- Tab font: 12px, weight 400, `font-family: inherit`
- Tab padding: `8px 12px`
- Active tab corner fix: `data-corner` attribute on `#shPanel` controls border-radius

### Flights form — trip types
| Mode        | Fields shown                                      |
|-------------|--------------------------------------------------|
| One Way     | Origin → Dest → Departure → Travellers → Search  |
| Round Trip  | Origin → Dest → Departure → Return → Travellers → Search |
| Multi City  | CSS Grid (5 equal cols). Row 1: all 5 fields. Extra rows: cols 1–3 only |

- **Default on page load: One Way**
- JS function: `setTripType('one-way' | 'round-trip' | 'multi-city')`
- Multi City max: 6 flights (`MC_MAX = 6`)

### Multi City grid
```css
.mc-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  align-items: end;
}
```
Extra rows (flights 2–6) append 3 grid children each (Origin, Dest, Date) → auto-placed in cols 1–3.

### Input field spacing rule
All `.sf-input` fields use:
```css
padding: 16px 12px;
```

### Search button
```css
background: var(--alm-red);
padding: 16px 28px;
border-radius: var(--r-md);
```

---

## JavaScript Architecture
Single IIFE in `<script>` at bottom of `<body>`. Key sections:

| Section | What it does |
|---------|-------------|
| Language | `setLang()`, `#langBtn` click, localStorage persist |
| Hero tabs | `.sh-tab` click → show/hide `.sh-form`, update `data-corner` |
| Trip type | `setTripType()`, `[data-trip]` chip clicks |
| Multi City | `addMcRow()`, `makeMcCell()`, `mc-add` click, `MC_MAX` guard |
| Swap button | `#swapBtn` rotate animation, swap `#origVal` ↔ `#destVal` text |
| Clear buttons | `[data-clear]` → restore placeholder from `data-ph` |

---

## Editing Rules

### Always
- Edit `index.html` only — no separate CSS/JS files
- Use CSS variables (`var(--alm-cyan)`) — never raw hex in component rules
- Use `.en`/`.ar` spans for all user-visible text
- `font-family: inherit` on all new elements (never hardcode font name in components)

### Never
- Do not add external JS libraries or frameworks
- Do not split into multiple files
- Do not use SVG or images in the logo
- Do not hardcode language-specific text without bilingual spans
- Do not add `min-height` to `.sf-btn` (use `padding: 16px` instead)
- Do not use `flex: 1` on `.sh-tab` (tabs hug content)

### Logo edits
- Gradient positions for Arabic م are measured values: **63%–73% = red, 73%–83% = cyan**
- Do not wrap Arabic characters in spans (breaks shaping) — use full-word gradient only

---

## Sections in order
1. `<header>` — dark teal bar, logo, nav, lang toggle, Sign In
2. `<section class="hero">` — full-bleed photo bg, scrim, title, search widget
3. `<main id="main">` — Top Destinations cards (Dubai, Istanbul, Maldives)
4. `<footer>` — brand, links, social, copyright

---

## Dev Notes
- No build step, no npm install — open `index.html` directly or via `npx serve`
- Google Fonts loaded via `<link>` in `<head>` (IBM Plex Sans + IBM Plex Sans Arabic)
- Hero background: Pinterest image hosted at `i.pinimg.com/originals/...`
- Overlay opacity kept soft (`0.30–0.38`) to keep hero image vibrant
