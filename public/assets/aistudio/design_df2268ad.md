# Design System: "Aurora Glass" AI Learning App

A design specification reverse-engineered from three mobile screens: a **Course Progress** screen, a **Learning Dashboard**, and an **AI Assistant chat**. All values are visual estimates from the image. Treat hex codes and sizes as close approximations and fine-tune in your own build.

Reference canvas: iPhone-class screen, **390 × 844 pt**.

---

## 1. Theme and Mood

**Concept:** A premium, dark, "glassmorphic" learning companion. It feels futuristic but warm, thanks to plum, magenta and amber glows against near-black surfaces. Friendly rather than sterile.

**Keywords:** dark mode, glassmorphism, aurora gradients, soft glow, rounded, calm, motivational, AI-native, premium.

**Design principles**
1. **Dark base, colored light.** Surfaces are near-black. Color comes from blurred gradient "light leaks" (magenta, plum, burgundy) bleeding in from the corners and edges.
2. **Glass over flat.** Cards are translucent, softly bordered, and let the gradient show through.
3. **One hero per card.** Each card has a single focal point: a big number, a ring, a gauge, or a mascot.
4. **Big numbers, small labels.** Metrics are large and light-weight; captions are small and muted.
5. **Everything is round.** Large corner radii, circular icon buttons, pill CTAs and chips. No sharp corners anywhere.
6. **Friendly AI.** A 3D hooded-robot mascot gives the AI a personality. Encouraging microcopy ("You're doing great").

---

## 2. Color Palette

### 2.1 Core tokens

| Token | Hex (approx.) | Usage |
|---|---|---|
| `--bg-base` | `#0F0A0E` | Primary app background (near-black with a warm plum tint) |
| `--bg-deep` | `#1A1015` | Lower-elevation areas, behind cards |
| `--plum-700` | `#5A1830` | Burgundy glow (lower-left of dashboard, bottom of screens) |
| `--plum-500` | `#7E2548` | Mid burgundy glow |
| `--magenta-500` | `#A8408F` | Magenta glow (bottom of screen 1, bottom-right of chat) |
| `--mauve-400` | `#B07A9C` | Frosted mauve hero card (Course card) |
| `--mauve-300` | `#C395B0` | Top header haze on light-gradient screens |
| `--pink-accent` | `#E85A9E` | Progress ring, primary accent, FAB "+" button |
| `--pink-soft` | `#D9759F` | Softer accent (input "+" button fill) |
| `--amber-400` | `#C98F5A` | Warm "AI Mentor" promo banner |
| `--white` | `#FFFFFF` | Primary CTA fill, user chat bubble, gauge arc |
| `--text-primary` | `#FFFFFF` | Headlines, big numbers |
| `--text-secondary` | `rgba(255,255,255,0.65)` | Labels, captions, timestamps |
| `--text-tertiary` | `rgba(255,255,255,0.45)` | Placeholder, meta |
| `--text-on-light` | `#111111` | Text on white buttons / bubbles |
| `--success` | `#3DDC5A` | "Online" dot, delivered ticks |
| `--presentation-bg` | `#E3CCDB` | Showcase backdrop only (not part of the app UI) |

### 2.2 Glass surfaces

| Token | Value | Usage |
|---|---|---|
| `--glass-fill` | `rgba(255,255,255,0.06)` | Standard dark glass card |
| `--glass-fill-strong` | `rgba(255,255,255,0.12)` | Icon buttons, stat tiles |
| `--glass-fill-tint` | `rgba(255,255,255,0.20)` | Frosted card on the pink screen |
| `--glass-border` | `rgba(255,255,255,0.14)` | 1 px hairline border on all glass |
| `--glass-highlight` | `rgba(255,255,255,0.25)` | Top-edge inner highlight |
| `--bubble-ai` | `rgba(255,255,255,0.10)` over dark | AI chat bubble |

### 2.3 Background gradient recipes

The backgrounds are built from **layered blurred radial gradients** on top of `--bg-base`, not a single linear gradient.

```css
/* Dashboard (center screen): burgundy-to-magenta glow rising from lower-left */
background:
  radial-gradient(60% 40% at 0% 45%, rgba(168,64,143,.55), transparent 70%),
  radial-gradient(70% 45% at 0% 65%, rgba(126,37,72,.70), transparent 70%),
  #0F0A0E;

/* Course screen (left): mauve haze at top, dark middle, magenta glow at bottom */
background:
  linear-gradient(180deg, #A5748F 0%, #4A3441 22%, #1A1015 55%, #0F0A0E 70%),
  radial-gradient(80% 25% at 10% 100%, rgba(168,64,143,.85), transparent 70%);

/* Chat (right): mauve haze at top, dark middle, magenta glow bottom-right */
background:
  linear-gradient(180deg, #8F6480 0%, #2A1B25 28%, #0F0A0E 55%),
  radial-gradient(70% 25% at 100% 100%, rgba(168,64,143,.8), transparent 70%);
```

---

## 3. Typography

**Style:** Clean geometric/neo-grotesque sans-serif, very close to **SF Pro Display / SF Pro Text**. Equivalent web options: **Inter**, **Manrope**, **Plus Jakarta Sans**. Weights are mostly **Regular (400) and Medium (500)**; the look is light and airy, never heavy.

```css
--font-sans: "SF Pro Display", "Inter", "Manrope", system-ui, -apple-system, sans-serif;
```

### Type scale

| Role | Size / Line height | Weight | Letter-spacing | Example |
|---|---|---|---|---|
| Display headline | 30 / 34 pt | 500 | -0.02em | "Track Your Learning Journey Easily" |
| Hero metric (large) | 44 / 48 pt | 500 | -0.02em | "125", "87", "6h 45 m", "24" |
| Hero metric (gauge) | 40 / 44 pt | 500 | -0.02em | "68%" (the "/100%" is smaller and 50% opacity) |
| Card title | 22 / 26 pt | 500 | -0.01em | "AI Learning Hub", "Ask AI Mentor", "AI Assistant" |
| Section label | 16 / 20 pt | 400 | 0 | "Course", "Suggested" |
| Body (chat) | 16 / 22 pt | 400 | 0 | AI bubble text |
| Button label | 16 / 20 pt | 500 | 0 | "Continue Learning", "Ask Now" |
| Caption | 13 / 18 pt | 400 | 0 | "Courses Completed", "Remaining", "Lessons" |
| Meta / timestamp | 12 / 16 pt | 400 | 0 | "12:37 PM", "24 Lessons · Beginner" |
| Chip | 14 / 18 pt | 400 | 0 | "Generate Quiz", "Show Mind Map" |
| Status bar | 15 pt | 500 | 0 | "9:41" |

**Typographic notes**
- Headlines use tight leading and slight negative tracking for a modern editorial feel.
- Units inside metrics (e.g. "/100%", "m") are visually subordinate: smaller or lower opacity.
- Title Case for headings and buttons; sentence case for body copy.
- Text is left-aligned except in the gauge center (centered) and small tile labels.

---

## 4. Layout, Spacing and Shape

### 4.1 Grid and spacing
- **Base unit:** 4 pt. Common steps: 4, 8, 12, 16, 20, 24, 32.
- **Screen horizontal padding:** 24 pt.
- **Vertical gap between cards:** 20 pt.
- **Inner card padding:** 16 to 20 pt.
- **Gap between side-by-side tiles:** 12 to 16 pt (2-column grid).
- **Header row:** top safe-area + 16 pt, icon buttons 48 pt circles.

### 4.2 Corner radius

| Element | Radius |
|---|---|
| Large cards (course, gauge panel, hub) | 28 pt |
| Small tiles / stat cards | 24 pt |
| Banner (AI Mentor) | 24 pt |
| Chat bubbles | 22 pt (with a slightly tighter corner on the tail side) |
| Buttons, chips, input bar | Full pill (999 pt) |
| Icon buttons, avatar | Full circle |
| Device frame | ~48 pt |

### 4.3 Elevation and effects
- **No hard drop shadows** inside the app. Depth comes from translucency, blur and border highlights.
- **Backdrop blur:** 24 to 40 px on glass cards.
- **Border:** 1 px `--glass-border`, often brighter along the top edge (inner light).
- **Glow:** soft outer glow around the pink progress ring and the AI chip artwork.
- **Device mockup shadow (presentation only):** large, soft, pink-tinted shadow beneath the phones.

---

## 5. Components

### 5.1 Status bar and home indicator
- iOS style: time at left (9:41), signal / Wi-Fi / battery at right, all white.
- Home indicator: white pill, ~134 × 5 pt, centered at the bottom.

### 5.2 Circular icon button
- 48 pt circle, `--glass-fill-strong`, 1 px glass border, white 20 pt line icon (1.5 px stroke).
- Used for: back arrow, bookmark, "more" (vertical dots), menu (hamburger), notification bell.
- Adjacent buttons are 8 pt apart (bookmark + more).

### 5.3 Avatar
- 48 pt circle photo with a 2 px white/light ring, placed at the top-right next to the bell.

### 5.4 Page header
- Left: back or menu button. Right: action button(s) or bell + avatar.
- Chat header: back button, 48 pt mascot avatar, two-line title (name 22 pt + status row with green dot "Online"), "more" button at right.

### 5.5 Course progress card (hero card, mauve)
- Frosted mauve fill (`--mauve-400`, ~85% opacity), 28 pt radius.
- Top-left: small circular icon chip + label "Course".
- Right: **progress ring**, 150 pt diameter.
  - Outer thin white arc (≈79% sweep, 4 px stroke, round caps).
  - Inner thick pink ring (`--pink-accent`, ~10 px).
  - Center: solid white disc with a pink "sparkle / path" icon.
- Bottom-left: **79%** (hero metric) with "You're doing great" caption underneath.

### 5.6 Semicircle gauge card (dashboard)
- Large dark glass panel with a **180° arc gauge**.
  - White arc for progress (≈68%), dark translucent track for the remainder, round caps, ~6 px stroke.
  - Center text: label "Good" (secondary) above **68%** with a muted "/100%".
- Contains two nested stat tiles at the bottom (see 5.7).

### 5.7 Stat tile
- Dark glass tile, 24 pt radius, ~110 pt tall.
- Top-left: label (2 lines, 13 pt, secondary). Top-right: 32 pt circular glass button with a **north-east arrow** icon.
- Bottom-left: big number (44 pt).
- Examples: "Courses Completed 125", "Daily Streak 87".

### 5.8 Metric tile with icon (course screen)
- Dark glass tile, 24 pt radius, ~170 pt tall.
- Top-left: 48 pt circular glass icon chip (timer / lesson icon).
- Bottom-left: large value ("6h 45 m", "24") and caption below ("Remaining", "Lessons").

### 5.9 Promo banner: "Ask AI Mentor"
- Warm amber fill (`--amber-400`), 24 pt radius, ~96 pt tall.
- Left: 3D mascot thumbnail in a rounded glass square.
- Center: title (22 pt) + two-line subtitle (13 pt, 80% white).
- Right: compact **white pill button** "Ask Now" (dark text).
- The only warm-colored surface in the system, so it draws attention as a CTA.

### 5.10 Course card (AI Learning Hub)
- Dark glass card, 28 pt radius.
- Left: 150 pt rounded-square thumbnail (neon blue/purple AI chip illustration, glowing).
- Right: 3-line title "AI Learning Hub" (22 pt), meta row "24 Lessons • Beginner".
- Bottom: full-width **secondary button** "Continue Learning" (glass pill, 48 pt tall).

### 5.11 Buttons

| Type | Fill | Text | Height | Notes |
|---|---|---|---|---|
| Primary CTA | `#FFFFFF` | `#111` 16/500 | 52 pt | Full width, pill. Pinned near the bottom ("Continue Learning") |
| Secondary | `--glass-fill-strong` + border | white | 48 pt | Inside cards |
| Compact CTA | `#FFFFFF` | `#111` 14/500 | 36 pt | "Ask Now" |
| Icon (circle) | glass | white icon | 48 pt | Header actions |
| Accent FAB | `--pink-soft` | white "+" | 48 pt | Chat attach button |

### 5.12 Chat components
- **User bubble:** solid white, dark text, right-aligned, 22 pt radius. Timestamp with green double-tick above it.
- **AI bubble:** translucent dark glass (`rgba(255,255,255,0.10)`), white text, left-aligned, 22 pt radius, mascot avatar (40 pt) to its left, timestamp above.
- **Reaction bar:** white pill under the AI bubble: speaker icon at left, 4 emoji reactions, and a "+" button. Quick feedback and read-aloud.
- **Suggested chips:** section divider with centered "Suggested" label (hairline on both sides). Chips are dark glass pills with 1 px border, wrapping on multiple rows: "Generate Quiz", "Show Mind Map", "Learn with Voice", "Courses", "Practice Questions".
- **Input bar:** pill-shaped glass field with a pink circular "+" at the left, placeholder "Ask anything…", plus a separate circular glass **mic button** to its right. Sits at the bottom above the home indicator.

### 5.13 Mascot / illustration style
- A **3D-rendered, hooded robot** with a glossy black face and two small glowing eyes, grey hoodie. Appears as avatar (chat), banner thumbnail and presence cue.
- Course thumbnails: dark-navy background, neon cyan/magenta/violet circuit-board "AI chip" art with radial glow.
- Icons: thin (1.5 px) rounded line icons, monochrome white.

---

## 6. Iconography

- Line icons, 1.5 px stroke, round caps and joins, 20 to 24 pt.
- Set in use: arrow-left, bookmark, more-vertical, menu (two-line), bell, arrow-up-right, timer, document/lesson, sparkles/path, speaker, plus, microphone.
- Recommended libraries: **Lucide**, **Phosphor (Light/Regular)**, or **SF Symbols**.

---

## 7. Motion and Interaction (suggested)

The image is static; these are recommended to match the aesthetic.
- **Progress ring / gauge:** animate stroke sweep 0 → value, 900 ms, ease-out.
- **Count-up** on metrics (125, 87, 68%) for ~700 ms.
- **Cards:** fade + 12 pt rise on entry, 60 ms stagger.
- **Press state:** scale 0.97 and brighten the glass fill.
- **Chat:** AI bubble types in or streams in; chips fade in after the response completes.
- **Background glow:** very slow drift (20 to 30 s loop) for a living-aurora effect; respect `prefers-reduced-motion`.

---

## 8. Accessibility Notes

- White on glass is generally fine, but **secondary text at 45 to 65% opacity can dip below 4.5:1** over the magenta glow. Raise to ~75% for small captions.
- Dark text on the mauve and amber cards needs checking; the sample uses white, which is borderline on `--amber-400`. Consider darkening amber to `#B97A45` or using dark text.
- Minimum touch target: 44 pt (all circular buttons meet this).
- Don't rely on color alone for progress; keep the numeric value visible (as shown).
- Provide labels for icon-only buttons (back, bookmark, more, mic).

---

## 9. Design Tokens (copy-paste)

```css
:root {
  /* color */
  --bg-base: #0F0A0E;
  --bg-deep: #1A1015;
  --plum-700: #5A1830;
  --plum-500: #7E2548;
  --magenta-500: #A8408F;
  --mauve-400: #B07A9C;
  --pink-accent: #E85A9E;
  --pink-soft: #D9759F;
  --amber-400: #C98F5A;
  --success: #3DDC5A;

  --text-primary: #FFFFFF;
  --text-secondary: rgba(255,255,255,.65);
  --text-tertiary: rgba(255,255,255,.45);
  --text-on-light: #111111;

  --glass-fill: rgba(255,255,255,.06);
  --glass-fill-strong: rgba(255,255,255,.12);
  --glass-border: rgba(255,255,255,.14);

  /* shape */
  --radius-card: 28px;
  --radius-tile: 24px;
  --radius-bubble: 22px;
  --radius-pill: 999px;

  /* spacing */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-5: 20px; --space-6: 24px; --space-8: 32px;

  /* type */
  --font-sans: "SF Pro Display", "Inter", "Manrope", system-ui, sans-serif;
}

.glass {
  background: var(--glass-fill);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-card);
  backdrop-filter: blur(32px) saturate(140%);
  -webkit-backdrop-filter: blur(32px) saturate(140%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.18);
}

.btn-primary {
  height: 52px; padding: 0 24px; border-radius: var(--radius-pill);
  background: #fff; color: var(--text-on-light);
  font: 500 16px/20px var(--font-sans);
}

.chip {
  padding: 10px 16px; border-radius: var(--radius-pill);
  background: var(--glass-fill); border: 1px solid var(--glass-border);
  color: var(--text-primary); font: 400 14px/18px var(--font-sans);
}
```

### Tailwind mapping (optional)

```js
theme: {
  extend: {
    colors: {
      base: '#0F0A0E', deep: '#1A1015',
      plum: { 500: '#7E2548', 700: '#5A1830' },
      magenta: '#A8408F', mauve: '#B07A9C',
      accent: '#E85A9E', amber: '#C98F5A',
    },
    borderRadius: { card: '28px', tile: '24px', bubble: '22px' },
    fontFamily: { sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'] },
  },
}
```

---

## 10. Screen Blueprints

### Screen 1: Course Progress
1. Header: back (left), bookmark + more (right)
2. Mauve **Course card** with 79% ring
3. Amber **Ask AI Mentor** banner
4. Two metric tiles: Time Remaining, Lessons
5. Pinned white **Continue Learning** CTA

### Screen 2: Dashboard
1. Header: menu (left), bell + avatar (right)
2. Display headline: "Track Your Learning Journey Easily"
3. **Gauge panel** (68%) containing two stat tiles: Courses Completed, Daily Streak
4. **AI Learning Hub** course card with secondary CTA

### Screen 3: AI Assistant Chat
1. Header: back, mascot avatar, name + online status, more
2. User message (white bubble, right)
3. AI response (glass bubble, left) + reaction bar
4. "Suggested" divider + wrapping chips
5. Input bar: "+" attach, "Ask anything…", mic

---

## 11. Do and Don't

**Do**
- Keep backgrounds near-black and let colored glows sit at the edges.
- Use pill shapes for anything tappable and long; circles for icon-only actions.
- Limit each screen to one white primary CTA.
- Keep numbers large, labels small and muted.
- Use the amber banner sparingly, as the single warm accent.

**Don't**
- Don't use pure black or flat grey backgrounds. Keep the warm plum tint.
- Don't add heavy drop shadows or sharp corners.
- Don't mix more than two accent hues on one screen (pink + amber is the max).
- Don't use bold weights for metrics. Medium is the ceiling.
- Don't put dense paragraphs in cards; keep copy to 1 to 2 short lines.

---

## 12. Implementation Checklist

- [ ] Layered radial-gradient backgrounds with a dark base
- [ ] Glass card utility with blur, hairline border, inner highlight
- [ ] Circular icon button component (48 pt)
- [ ] SVG progress ring and semicircle gauge (stroke-dasharray, round caps)
- [ ] Stat tile with arrow button
- [ ] Chat bubble variants (user white / AI glass), reaction bar, suggestion chips
- [ ] Pill input bar with attach and mic
- [ ] Mascot asset and AI chip thumbnails (3D / neon style)
- [ ] Count-up and ring-sweep animations
- [ ] Contrast pass for secondary text and amber card
