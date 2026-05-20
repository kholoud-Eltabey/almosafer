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
├── CLAUDE.md           ← project context for Claude
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

### Motion tokens
```css
--motion-fast:   100ms cubic-bezier(0.2,0,0,1)
--motion-normal: 200ms cubic-bezier(0.2,0,0,1)
--motion-slow:   300ms cubic-bezier(0.2,0,0,1)
--motion-enter:  200ms cubic-bezier(0,0,0.2,1)
--motion-exit:   150ms cubic-bezier(0.4,0,1,1)
--motion-layout: 400ms cubic-bezier(0,0,0.2,1)
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
All children inherit via `font-family: inherit`. **Never hardcode font names inside component rules.**

---

## Dark / Light Theme

Toggled by `#themeBtn`. Stored in `localStorage` key `"alm-theme"`. Applied via `html[data-theme="dark"]`.

```css
html[data-theme="dark"] {
  --text-primary:   #ddeef2;
  --text-secondary: #7aacb8;
  --text-subtle:    #8ec4cf;
  --bg-page:        #071820;
  --bg-surface:     #0c2330;
  --border:         #163545;
}
```

Header always stays `--alm-dark` background in both modes.

---

## Bilingual / RTL System
- Language stored in `localStorage` key `alm-lang` (`"en"` or `"ar"`)
- `html.lang` and `html.dir` toggled by `#langBtn`
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
- RTL positioning: always `inset-inline-start` / `inset-inline-end` — **never `left` / `right`**
- RTL-flippable icons: class `.icon--flip-rtl`
  ```css
  html[dir="rtl"] .icon--flip-rtl { transform: scaleX(-1); }
  ```

---

## Logo Rules
- **English mode**: show `.logo-en` only → wordmark `Alm<span class="logo-o">o</span>safer`
- **Arabic mode**: show `.logo-ar` only → wordmark `المسافر` (no span wrapping — breaks Arabic shaping)
- Split-color "o": CSS `background-clip: text` gradient (cyan 50% → red 50%)
- Arabic wordmark uses full-word gradient on `.logo-wordmark` only:
  ```css
  .logo-ar .logo-wordmark {
    font-family: var(--font-ar);
    letter-spacing: 0;
    background: linear-gradient(to right, #fff 63%, #E63946 63% 73%, #00B7C6 73% 83%, #fff 83%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  ```
- **م gradient positions are measured values: 63%–73% = red, 73%–83% = cyan**
- **No SVG, no image, no icon** in the logo — text only
- **Never wrap Arabic characters in `<span>`** — breaks Arabic letter shaping/connection

Logo switching CSS:
```css
.logo-en { display: flex; }
.logo-ar { display: none; }
html[lang="ar"] .logo-en { display: none; }
html[lang="ar"] .logo-ar { display: flex; }
```

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
| Multi City  | CSS Grid (4 equal cols). Row 1: all 4 fields. Extra rows: cols 1–3 only |

- **Default on page load: One Way**
- JS function: `setTripType('one-way' | 'round-trip' | 'multi-city')`
- Multi City max: 6 flights (`MC_MAX = 6`)

### Multi City grid
```css
.mc-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  align-items: end;
}
.mc-search-btn { width: 100%; justify-content: center; margin-top: 8px; }
```

### Input field spacing rule
All `.sf-input` fields use:
```css
padding: 16px 12px;
```
**Never add `min-height` to `.sf-btn` or `.sf-input`.**

### Search button
```css
background: var(--alm-red);
padding: 16px 28px;
border-radius: var(--r-md);
```

---

## DOM ORDER — Sections in this exact sequence

```
1.  <header>                  sticky dark header
2.  #si-modal                 sign-in glassmorphism modal
3.  #cg-page                  city guide overlay
4.  #all-dest-overlay         all destinations overlay
5.  #my-account               account section
6.  #deal-overlay             deal detail overlay
7.  #dsa-overlay              deal see-all overlay
8.  #deal-coming-soon         ← ALWAYS OUTSIDE <main>, BEFORE it
9.  <main id="main">          services bar + top destinations + deals
10. <footer>
11. #alm-toast                toast notification
12. #alm-bk                   booking backdrop
13. #alm-picker               date picker
14. #alm-pax                  travellers panel
15. <script>                  single IIFE — ALL JS inside
```

---

## JavaScript Architecture
Single IIFE in `<script>` at bottom of `<body>`. Key sections:

| Section | What it does |
|---------|-------------|
| Language | `setLang()`, `#langBtn` click, localStorage persist |
| Theme | `setTheme()`, `#themeBtn` click, localStorage persist |
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
| My Account | `openMyAccount()`, `closeMyAccount()`, `renderMyAccount()`, `openMyTickets()` |
| My Account Sub-Panels | `openMaSubPanel(key)` — slides in `.ma-sub-view` with key-specific content |
| Ticket Cart | `_cart` array, `addToCart()`, ticket wallet panel |
| Toast | `showToast(msg, duration)` |
| Icon System | `_ICONS` map (29 types) + `_icon(name, size, extra)` helper |

---

## Icon System

### `_ICONS` map
29 named SVG path strings:
`account · back · baggage · booking · calendar · check · chevron-down · chevron-left · chevron-right · close · currency · error · favorite · filter · flight · hotel · info · language · location · package · passenger · payment · search · share · sort · success · time · user · warning`

### `_icon(name, size, extra)`
- `size`: `'sm'` = 16px, `'md'` = 20px (default), `'lg'` = 24px
- Output class: `icon icon--{size}`

```css
.icon { display:inline-flex; flex-shrink:0; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
.icon--sm { width:16px; height:16px; }
.icon--md { width:20px; height:20px; }
.icon--lg { width:24px; height:24px; }
.icon--brand { color:var(--alm-cyan); }
.icon--inverse { color:#fff; }
```

---

## City Guide System

### Overlay ID
`#cg-page` (class `overlay-page`) — opened/closed via `_openOverlay()` / `_closeOverlay()`

### Navigation variables
```javascript
var _cgCurrentCity  = null;     // currently-open city object
var _cgFromAllDest  = false;    // opened from All Destinations overlay?
var _cgDetailFrom   = 'city';   // 'city' | 'results' — back-button routing
```

### Sub-panels
| Element | Content |
|---|---|
| `#cg-page-content` | City overview (tabs: Hotels / Flights / Activities / To-Do) |
| `#cg-results` | Search results (filtered hotel/flight/activity cards) |
| `#cg-hotel-detail` | Full hotel detail with rooms |
| `#cg-flight-detail` | Full flight detail with cabin selector |
| `#cg-attr-detail` | Attraction/activity detail with ticket bar |

### 10 supported cities
`dubai` · `istanbul` · `maldives` · `london` · `cairo` · `riyadh` · `jeddah` · `paris` · `bali` · `tokyo`

### REMOVED — Do Not Re-Add
The "Flights to / Stays in / Activities in [city]" colored CTA buttons were **permanently removed** from city guide pages.

---

## Hotel Detail — `HOTEL_DETAILS`
Keyed by `hotel.nameEn`. Each entry has: `img`, `descEn`, `descAr`, `addressEn`, `addressAr`, `rating`, `reviewCount`, `amenities[]`, `rooms[]`.

Each room: `nameEn`, `nameAr`, `img`, `beds`, `bedType`, `bedTypeAr`, `sizeSqm`, `viewEn`, `viewAr`, `chips[]`, `chipsAr[]`, `priceSAR`.

All 40 hotels across 10 cities have `rooms` arrays. CSS prefix: `.cghd-*`

---

## Flight Detail
```javascript
var _AIRLINE_META = { 'Saudia': { color:'#006437', short:'SV' }, ... };
var _CITY_IATA    = { dubai:'DXB', istanbul:'IST', ... };
var _CITY_DURATION= { dubai:'2h 15m', istanbul:'4h 30m', ... };
```
CSS prefix: `.cgfd-*`

---

## Offers & Deals Section

- 5 category rows in `DEAL_ROWS` array
- Row arrows: **40×40px circle, 16×16px icon — both locked with `min-width/min-height/flex-shrink:0`**
- Cards `.drc`: 230px wide
- `DEALS_DATA` array: 9 deals
- Deal detail: `#deal-overlay` (z-index 1900)
- See All: `#dsa-overlay` (z-index 1600)
- Coming Soon: `#deal-coming-soon` — **must be outside `<main>`, placed before it**

CSS prefixes: `.drc-*` · `.deal-ov-*` · `.dsa-*`

---

## Booking Flow

### Entry points
| Trigger | Type |
|---|---|
| Hotel "Book Now" | `'hotel'` |
| Room "Select" | `'room'` |
| Flight "Select Flight" | `'flight'` |
| Attraction "Book Ticket" | `'activity'` |
| Deal "Book Now" | `'activity'` |

### State object
```javascript
var _bk = { step: 1, type: '', label: '', price: 0, nights: 1, ref: '' };
```

3 steps: Your Details → Payment → Booking Confirmed (ref: `ALM-XXXXXXX`)

CSS prefix: `.bk-*`

---

## Sign-In / OTP Flow

- Modal: `#si-modal` — glassmorphism: `background:rgba(0,183,198,0.10); backdrop-filter:blur(28px)`
- Two modes: Email / Phone with country code selector
- 6-box OTP: auto-advance, backspace, arrow keys, paste support
- Prototype: any 6 digits accepted (`SI_TEST_OTP` shown on screen)
- Resend countdown: 58 seconds
- On success: `ALM_USER` set → `localStorage` persisted → `openMyAccount()` after 220ms

---

## My Account Sub-Panels

`openMaSubPanel(key)` renders into `#ma-sub-view`.

### RTL slide fix — 3 rules required (specificity matters)
```css
html[dir="rtl"] .ma-sub-view { transform: translateX(-110%); }   /* specificity 0,2,1 */
.ma-sub-view.ma-sub-open { transform: translateX(0); }            /* specificity 0,2,0 */
html[dir="rtl"] .ma-sub-view.ma-sub-open { transform: translateX(0); } /* specificity 0,3,1 — wins */
```

### Sub-panel keys
| Key | Content |
|---|---|
| `profile` | Edit name, email/phone, nationality picker (flagcdn.com flags) |
| `travellers` | Saved traveller cards + Add Traveller inline form |
| `preferences` | Travel preference toggles |
| `loyalty` | Points card, airline rows + Link New Loyalty Program form |
| `payment` | Saved cards + Add New Card inline form |
| `security` | Email/password, 2FA toggles, Change Password, Deactivate Account |
| `wallet` | Balance = SAR 250 + 2.5% cashback per `_cart` item + transactions |

### CSS classes
| Class | Role |
|---|---|
| `.ma-input` | `border:1px solid var(--border)`, hover/focus = cyan border + glow |
| `.ma-form-save` | `background:var(--alm-dark)`, 12px/500 |
| `.ma-form-neutral` | Cancel: `rgba(230,57,70,.07)` bg, red border + text |
| `.ma-toggle` | Off: `background:var(--border)` |
| `.ma-toggle.on` | On: `background:var(--alm-dark)` |
| `.ma-pref-val` | `color:var(--text-subtle)` — never cyan |
| `.ma-card-num` | 12px / 500 |

---

## Known Bugs Fixed — Do Not Revert

### BUG 01 — Logo showing both languages simultaneously
**Cause:** No CSS rule to hide inactive logo on language switch.
**Fix:**
```css
.logo-en { display: flex; }
.logo-ar { display: none; }
html[lang="ar"] .logo-en { display: none; }
html[lang="ar"] .logo-ar { display: flex; }
```

### BUG 02 — #deal-coming-soon permanently invisible
**Cause:** `#deal-coming-soon` was nested inside `<main id="main">`. `showDealComingSoon()` calls `mainEl.style.display='none'` first — parent `display:none` overrides child `display:block`. CSS law, not a JS bug.
**Fix:** Move `#deal-coming-soon` to be a sibling BEFORE `<main>` in the DOM. Same pattern as `#my-account`, `#deal-overlay`, `#dsa-overlay`.

### BUG 03 — City guide back button routing to wrong destination
**Cause:** Back button had one hardcoded destination — no navigation state tracked.
**Fix:** Two state variables control routing:
```javascript
var _cgDetailFrom  = 'city';   // 'city' | 'results'
var _cgFromAllDest = false;    // true → return to all-destinations on close
```

### BUG 04 — RTL sub-panel CSS specificity conflict
**Cause:** `html[dir="rtl"] .ma-sub-view` (specificity 0,2,1) was overriding `.ma-sub-view.ma-sub-open` (specificity 0,2,0) — open state never won in RTL.
**Fix:** Add third rule with matching RTL+open specificity (0,3,1):
```css
html[dir="rtl"] .ma-sub-view.ma-sub-open { transform: translateX(0); }
```

### BUG 05 — Arabic wordmark breaking letter connections
**Cause:** Wrapping "م" in `<span>` created an inline element boundary — Arabic shaping engine disconnected surrounding letters.
**Fix:** Remove all `<span>` from Arabic wordmark. Apply gradient to `.logo-ar .logo-wordmark` only. Never wrap Arabic characters in any element.

### BUG 06 — Deal row arrows collapsing size
**Cause:** No locked dimensions on arrow buttons or inner icons — flexbox compressed them.
**Fix:**
```css
/* Arrow button */
min-width: 40px; min-height: 40px; flex-shrink: 0;
/* Inner icon */
min-width: 16px; min-height: 16px; flex-shrink: 0;
```

### BUG 07 — Search results showing JED (Jeddah) flights for non-Jeddah searches
**Cause (A):** Arabic mode sets `destVal.textContent = "القاهرة"`. Old filter compared Arabic text against English `destCity` in FLIGHT_DATA → 0 matches → fallback `d = FLIGHT_DATA.slice()` → ALL 26 flights shown (including JED→RUH domestic IDs 25-26).
**Cause (B):** When user typed city as ORIGIN (e.g. "Cairo→Riyadh"), no origin filter existed → all flights shown including JED.
**Cause (C):** Default state (no city selected) had no origin baseline, so JED flights polluted all results.

**Final Fix — root-cause removal + IATA-aware destination filter:**

1. **Deleted FLIGHT_DATA IDs 25-26 (JED→RUH domestic)** — permanently removed. These flights served no purpose and were the source of all JED pollution. FLIGHT_DATA now contains only 24 entries, all `orig:'RUH'`.

2. `_getCityCode(text)` — resolves EN or AR city name to IATA code via `CITIES` lookup:
```javascript
function _getCityCode(text) {
  var t = text.trim().toLowerCase();
  for (var i = 0; i < CITIES.length; i++) {
    var c = CITIES[i];
    if (c.name.toLowerCase() === t || c.nameAr === text.trim()) return c.code;
  }
  return null;
}
```

3. `_getSearchDest()` — returns `''` when field has `sf-muted` class (placeholder), preventing stale placeholder text from triggering filters:
```javascript
function _getSearchDest() {
  var dv = document.getElementById('destVal');
  if (!dv || dv.classList.contains('sf-muted')) return '';
  return (dv.textContent || '').trim();
}
```

4. `applyFlightFlt()` — destination-only filter (origin filter removed since all data is RUH-origin):
```javascript
var d = FLIGHT_DATA.slice();
if (destIata) {
  var byDest = d.filter(function(x){ return x.dest === destIata; });
  if (byDest.length > 0) d = byDest;  // IATA exact match (handles Arabic names)
} else if (searchDest) {
  // text fallback only for values not in CITIES
}
```

**Rule: FLIGHT_DATA must only contain flights with `orig:'RUH'`. Never re-add JED-origin entries. If Jeddah domestic flights are needed in future, create a separate `DOMESTIC_DATA` array.**

---

## Overlay Routing Logic

No router — pure CSS class toggles + display switches.

**Open any overlay:**
1. `setHeroVisible(false)`
2. `mainEl.style.display = 'none'`
3. Add open class to target section

**Close any overlay:**
1. Remove open class
2. `setHeroVisible(true)`
3. `mainEl.style.display = ''`

**z-index stack:**
```
Sign-in modal     900
All Destinations  600
City Guide        700
Deal Coming Soon  800
Deal See-All     1600
Deal Detail      1900
Booking          2000
```

**Escape key** closes in order: City Guide → All Destinations → Sign-in

---

## Editing Rules

### Always
- Edit `index.html` only — no separate CSS/JS files
- Use CSS variables (`var(--alm-cyan)`) — never raw hex in component rules
- Use `.en`/`.ar` spans for all user-visible text
- `font-family: inherit` on all new elements
- Use `inset-inline-start/end` for RTL-safe positioning
- All card images must be real Unsplash URLs — no placeholders
- All new JS inside the existing IIFE only
- All new HTML sections follow the DOM ORDER above

### Never
- Do not add external JS libraries or frameworks
- Do not split into multiple files
- Do not use SVG or images in the logo
- Do not hardcode language-specific text without bilingual spans
- Do not add `min-height` to `.sf-btn` — use `padding: 16px` instead
- Do not use `flex: 1` on `.sh-tab` — tabs hug content
- Do not re-add "Flights to / Stays in / Activities in [city]" CTA buttons
- Do not nest `#deal-coming-soon` inside `<main>`
- Do not use `left` / `right` in positioning rules
- Do not wrap Arabic characters in `<span>`
- Do not remove existing aria attributes

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
cp index.html public/index.html
npx wrangler pages deploy public/ --project-name almosafer --commit-dirty=true
```
Project name: `almosafer` — **ONLY this project, never `Almosafer-Design-System`**

### Local preview
```
npx serve . --listen 3000 --no-clipboard
```
URL: `http://localhost:3000`

All three environments (local, Claude Preview, Cloudflare) must always reflect the same `index.html`.

---

## Dev Notes
- No build step — open `index.html` directly or via `npx serve`
- Google Fonts loaded via `<link>` in `<head>`
- Hero background: Unsplash/Pinimg hosted image
- Overlay scrim opacity: `0.30–0.38` — kept soft to keep hero vibrant
- `index.html` is ~10,800+ lines (all-in-one: HTML + CSS + JS + data)
