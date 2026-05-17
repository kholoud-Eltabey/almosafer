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
├── deploy.bat          ← Cloudflare Pages deploy script
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
| City Guide | `openCityGuide()`, `closeCityGuide()`, `renderCityGuide()` |
| Hero visibility | `setHeroVisible(bool)` — hides/shows `.hero` when overlays open |
| Hotel Detail | `showHotelDetail()`, `hideHotelDetail()`, `HOTEL_DETAILS` lookup |
| Flight Detail | `showFlightDetail()`, `hideFlightDetail()`, `_AIRLINE_META` / `_CITY_IATA` |
| Attraction Detail | `showAttractionDetail()`, `hideAttractionDetail()`, `ATTR_DETAILS` lookup |
| Search Results | `showCgResults()` — filterable results panel inside city guide |
| Offers & Deals | `DEALS_DATA`, `DEAL_ROWS`, `_renderOneRow()`, `openDealDetail()`, `openDealSeeAll()` |
| Booking Flow | `openBooking()`, `closeBk()`, `_renderBkStep()` — 3-step checkout |
| My Account | `openMyAccount()`, `closeMyAccount()`, `renderMyAccount()`, `openMyTickets()` — open/close calls `setHeroVisible(false/true)` |
| My Account Sub-Panels | `openMaSubPanel(key)` — slides in `.ma-sub-view` with key-specific content |
| Ticket Cart | `_cart` array, `addToCart()`, ticket wallet panel |
| Icon System | `_ICONS` map (29 types) + `_icon(name, size, extra)` helper |

---

## Icon System

### `_ICONS` map
29 named SVG path strings matching the design system icon library:
`account · back · baggage · booking · calendar · check · chevron-down · chevron-left · chevron-right · close · currency · error · favorite · filter · flight · hotel · info · language · location · package · passenger · payment · search · share · sort · success · time · user · warning`

### `_icon(name, size, extra)`
Returns an inline `<svg>` string using the `_ICONS` map.
- `size`: `'sm'` = 16px, `'md'` = 20px (default), `'lg'` = 24px
- `extra`: replaces default `aria-hidden="true" focusable="false"`
- Output class: `icon icon--{size}`

### CSS — `.icon` base
```css
.icon { display:inline-flex; flex-shrink:0; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
.icon--sm { width:16px; height:16px; }
.icon--md { width:20px; height:20px; }
.icon--lg { width:24px; height:24px; }
.icon--brand { color:var(--alm-cyan); }
.icon--inverse { color:#fff; }
```

### Flight icon path (Lucide Plane)
```
M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-2 0-4 1-4 1L4.8 6.2A2 2 0 0 0 4 8 2 2 0 0 0 6 10l2.1.1 4.6 8.3a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 0 .8-2.2
```
Used in: Flights tab, My Trips quick row, flight detail, booking summary.

---

## City Guide System

### Overlay ID
`#cg-page` (class `overlay-page`) — opened/closed via `_openOverlay()` / `_closeOverlay()`

### Panel state machine
Content is rendered into `#cg-body` by `renderCityGuide()`. Sub-panels:

| Element | Content |
|---|---|
| `#cg-page-content` | City overview (tabs: Hotels / Flights / Activities / To-Do) |
| `#cg-results` | Search results (filtered hotel/flight/activity cards) |
| `#cg-hotel-detail` | Full hotel detail with rooms |
| `#cg-flight-detail` | Full flight detail with cabin selector |
| `#cg-attr-detail` | Attraction/activity detail with ticket bar |

### Navigation variables
```javascript
var _cgCurrentCity  = null;     // currently-open city object
var _cgFromAllDest  = false;    // opened from All Destinations overlay?
var _cgDetailFrom   = 'city';   // 'city' | 'results' — back-button routing
```

### 10 supported cities
`dubai` · `istanbul` · `maldives` · `london` · `cairo` · `riyadh` · `jeddah` · `paris` · `bali` · `tokyo`

### Removed: Footer CTA buttons
The "Flights to / Stays in / Activities in [city]" colored buttons were **removed** from city guide pages. Do not re-add them.

---

## Hotel Detail — `HOTEL_DETAILS`
Keyed by `hotel.nameEn`. Each entry:
```javascript
{
  img: '...url...',
  descEn: '...', descAr: '...',
  addressEn: '...', addressAr: '...',
  rating: 4.6, reviewCount: 28400,
  amenities: ['wifi','pool','parking','breakfast','spa','gym','restaurant','roomservice'],
  rooms: [
    {
      nameEn: 'Deluxe King Room', nameAr: 'غرفة كينج ديلوكس',
      img: '...url...',
      beds: 1, bedType: 'King', bedTypeAr: 'كينج',
      sizeSqm: 50,
      viewEn: 'Palm View', viewAr: 'إطلالة نخلة',
      chips: ['Balcony','Rain Shower','Mini Bar','55" Smart TV'],
      chipsAr: ['بلكونة','دش مطري','ميني بار','تلفزيون ذكي 55"'],
      priceSAR: 3200
    }
    // 2–3 rooms per hotel
  ]
}
```
All 40 hotels across 10 cities have `rooms` arrays. Room cards show bed icon + count/type, size icon + m², view icon + outlook, amenity chips, price per night, and a "Select" button that opens the booking flow.

CSS prefix: `.cghd-*` (hotel detail), `.cghd-room-*` (room cards)

---

## Flight Detail
Enrichment maps:
```javascript
var _AIRLINE_META = { 'Saudia': { color:'#006437', short:'SV' }, ... };
var _CITY_IATA    = { dubai:'DXB', istanbul:'IST', ... };
var _CITY_DURATION= { dubai:'2h 15m', istanbul:'4h 30m', ... };
```

Panel sections: dark route bar (RUH → DXB with large IATA codes) · airline badge · times row · info grid (Duration / Stops / Baggage) · cabin selector (Economy / Business at 2.6× price, wired inline) · book bar.

CSS prefix: `.cgfd-*`

---

## Offers & Deals Section

### Layout: Netflix-style horizontal rows
5 category rows rendered by `DEAL_ROWS` array. Each row has:
- Header: emoji + title + optional LIVE badge + "See all" button
- Horizontal scroll track with prev/next arrows (40×40px circle, 16×16px icon — both locked with `min-width/min-height/flex-shrink:0`)
- Cards: `.drc` (230px wide), with image, discount badge, category tag, timer pill, title, price, promo code, "View deal" button

### Deal data: `DEALS_DATA` array (9 deals)
Each deal: `{ id, titleEn, titleAr, catEn, catAr, catAr, disc, discAr, img, code, bkPrice, bkLabelEn, bkLabelAr, descEn, descAr, termsEn, termsAr, expiresMs }`

### Row navigation arrows
- CSS: `opacity:0` by default, revealed on `.deal-row-track:hover`
- JS: `_syncRowArrows()` disables prev/next at scroll boundaries, RTL-aware

### Deal detail overlay (`#deal-overlay`)
Full-screen slide-up overlay (z-index 1900). Layout:
1. **Topbar**: "← Back" button + category label
2. **Hero image**: 300px tall, discount text overlaid
3. **Scrollable body** (max-width 680px, centered): category, title, description, countdown timer, T&Cs, promo code box (with Copy button), price, "Book Now" button

### See All overlay (`#dsa-overlay`)
Full-screen slide-up (z-index 1600). Shows all deals for a row category in a responsive CSS grid. Triggered by "See all" button on each row.

CSS prefixes: `.drc-*` (row cards), `.deal-ov-*` (deal detail), `.dsa-*` (see-all overlay)

---

## Booking Flow

### Entry points (all call `openBooking()`)
| Trigger | Type |
|---|---|
| Hotel "Book Now" (`#cghd-book-btn`) | `'hotel'` |
| Room card "Select" (`.cghd-room-select`) | `'room'` |
| Flight "Select Flight" (`#cgfd-select-btn`) | `'flight'` |
| Attraction "Book Ticket" (`#cgad-book-btn`) | `'activity'` |
| Deal "Book Now" (`#deal-ov-book`) | `'activity'` |

### `openBooking(type, label, price, nights)`
Opens `#alm-booking` overlay (fixed, full-screen, blurred backdrop). Panel slides in from inline-end. 3 steps:

**Step 1 — Your Details**
Fields: First Name, Last Name (2-col grid), Email, Phone, Nationality (select with 8 GCC options)

**Step 2 — Payment**
- STC Pay / Apple Pay quick-tap buttons (toggle `.active`)
- Card number (auto-formats `XXXX XXXX XXXX XXXX`)
- Name on card
- Expiry (auto-inserts `/` after `MM`) + CVV (password field)
- SSL secure note

**Step 3 — Booking Confirmed**
- Animated ✓ (spring pop)
- Unique booking ref: `ALM-XXXXXX`
- Summary card: item, nights (hotels), total in cyan, green "Confirmed" badge
- "Back to Browsing" closes overlay

### State object
```javascript
var _bk = { step: 1, type: '', label: '', price: 0, nights: 1, ref: '' };
```

### CSS prefix: `.bk-*`
Key classes: `.bk-panel`, `.bk-steps`, `.bk-step-bar`, `.bk-summary`, `.bk-fields`, `.bk-grid-2`, `.bk-input`, `.bk-pay-quick-btn`, `.bk-confirm`, `.bk-confirm-ref`, `.bk-confirm-card`, `.bk-status-badge`

---

## My Account Sub-Panels

### Structure
`openMaSubPanel(key)` renders content into `#ma-sub-view` (`.ma-sub-view`) and slides it in with `.ma-sub-open`.

### RTL / Slide direction
The sub-panel uses a CSS transform slide:
- LTR default: `translateX(110%)` (off right) → open: `translateX(0)`
- RTL default: `translateX(-110%)` (off left) → open: `translateX(0)`
Both open states are covered by separate CSS rules. The RTL open rule has higher specificity (0,3,1) than the RTL default (0,2,1):
```css
html[dir="rtl"] .ma-sub-view { transform:translateX(-110%); }
.ma-sub-view.ma-sub-open { transform:translateX(0); }
html[dir="rtl"] .ma-sub-view.ma-sub-open { transform:translateX(0); }
```

| Key | Content |
|---|---|
| `profile` | Edit name, email/phone, nationality picker (flagcdn.com flags) |
| `travellers` | Saved traveller cards + Add Traveller inline form |
| `preferences` | Travel preference toggles |
| `loyalty` | Points card, airline program rows + Link New Loyalty Program inline form |
| `payment` | Saved cards + Add New Card inline form |
| `security` | Email/password rows, 2FA toggles, Change Password form, Deactivate Account confirmation |
| `wallet` | Wallet balance, top-up button |

### Inline form pattern (Add Traveller / Add Card / Link Loyalty / Change Password)
Button click → hides button → inserts `.ma-add-trav-form` div before it → Save/Cancel handlers:
- Save: validates → appends new card/row → removes form → restores button → `showToast()`
- Cancel: removes form → restores button

### CSS classes
| Class | Role |
|---|---|
| `.ma-input` | Standard input/select: `border:1px solid var(--border)`, hover/focus = cyan border + glow |
| `.ma-form-save` | Primary action button: `background:var(--alm-dark)`, 12px/500 |
| `.ma-form-neutral` | Cancel button: subtle danger — `rgba(230,57,70,.07)` bg, red border and text |
| `.ma-toggle` | Toggle switch off: `background:var(--border)` |
| `.ma-toggle.on` | Toggle switch on: `background:var(--alm-dark)` |
| `.ma-pref-val` | Value text in pref rows: `color:var(--text-subtle)` (neutral, not cyan) |
| `.ma-card-num` | Card number text: 12px / 500 |

---

## Sections in order
1. `<header>` — dark teal bar, logo, nav, lang toggle, Sign In
2. `<section class="hero">` — full-bleed photo bg, scrim, title, search widget
3. `<main id="main">` — Top Destinations cards (3 featured cities)
4. Offers & Deals section — Netflix-style rows inside `#main`
5. All Destinations grid — `#all-dest-overlay`
6. City Guide overlay — `#cg-page` with full detail flow
7. Deal detail overlay — `#deal-overlay` (full-screen)
8. Deal See-All overlay — `#dsa-overlay` (full-screen)
9. My Account panel — quick rows: My Trips, My Wallet, My Tickets
10. My Tickets panel — ticket wallet
11. Booking overlay — `#alm-booking` (3-step checkout)
12. `<footer>` — brand, links, social, copyright

---

## Editing Rules

### Always
- Edit `index.html` only — no separate CSS/JS files
- Use CSS variables (`var(--alm-cyan)`) — never raw hex in component rules
- Use `.en`/`.ar` spans for all user-visible text
- `font-family: inherit` on all new elements (never hardcode font name in components)
- Use `inset-inline-start/end` for RTL-safe positioning
- All card images must be real photos (Unsplash URLs) — no placeholders

### Never
- Do not add external JS libraries or frameworks
- Do not split into multiple files
- Do not use SVG or images in the logo
- Do not hardcode language-specific text without bilingual spans
- Do not add `min-height` to `.sf-btn` (use `padding: 16px` instead)
- Do not use `flex: 1` on `.sh-tab` (tabs hug content)
- Do not re-add the "Flights to / Stays in / Activities in [city]" CTA buttons — they were intentionally removed

### Logo edits
- Gradient positions for Arabic م are measured values: **63%–73% = red, 73%–83% = cyan**
- Do not wrap Arabic characters in spans (breaks shaping) — use full-word gradient only

---

## Deployment

### GitHub
```
git add index.html CLAUDE.md
git commit -m "message"
git push origin master
```
Remote: `https://github.com/kholoud-Eltabey/almosafer.git`

### Cloudflare Pages
```
npx wrangler pages deploy . --project-name almosafer --commit-dirty=true
```
Or run `deploy.bat`. Project name: `almosafer`.

---

## Dev Notes
- No build step, no npm install — open `index.html` directly or via `npx serve`
- Google Fonts loaded via `<link>` in `<head>` (IBM Plex Sans + IBM Plex Sans Arabic)
- Hero background: Pinterest image hosted at `i.pinimg.com/originals/...`
- Overlay opacity kept soft (`0.30–0.38`) to keep hero image vibrant
- `index.html` is ~600 KB (all-in-one: HTML + CSS + JS + all data)
