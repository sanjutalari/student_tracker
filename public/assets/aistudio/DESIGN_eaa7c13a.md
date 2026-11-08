---
name: Aurora Glass
colors:
  surface: '#171216'
  surface-dim: '#171216'
  surface-bright: '#3e373c'
  surface-container-lowest: '#120d11'
  surface-container-low: '#201a1e'
  surface-container: '#241e22'
  surface-container-high: '#2e282d'
  surface-container-highest: '#3a3337'
  on-surface: '#ebdfe5'
  on-surface-variant: '#dcbfc8'
  inverse-surface: '#ebdfe5'
  inverse-on-surface: '#352e33'
  outline: '#a48a92'
  outline-variant: '#564148'
  surface-tint: '#ffb0ce'
  primary: '#ffb0ce'
  on-primary: '#63003b'
  primary-container: '#ec5da1'
  on-primary-container: '#570033'
  inverse-primary: '#ab286d'
  secondary: '#ffade3'
  on-secondary: '#5f004f'
  secondary-container: '#811d6d'
  on-secondary-container: '#ff95df'
  tertiary: '#f9b981'
  on-tertiary: '#4b2700'
  tertiary-container: '#bd8551'
  on-tertiary-container: '#422200'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffd9e5'
  primary-fixed-dim: '#ffb0ce'
  on-primary-fixed: '#3e0022'
  on-primary-fixed-variant: '#8b0454'
  secondary-fixed: '#ffd8ee'
  secondary-fixed-dim: '#ffade3'
  on-secondary-fixed: '#3a0030'
  on-secondary-fixed-variant: '#7e1a6a'
  tertiary-fixed: '#ffdcc0'
  tertiary-fixed-dim: '#f9b981'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#683c0e'
  background: '#171216'
  on-background: '#ebdfe5'
  surface-variant: '#3a3337'
  bg-deep: '#1A1015'
  plum-700: '#5A1830'
  plum-500: '#7E2548'
  mauve-400: '#B07A9C'
  mauve-300: '#C395B0'
  pink-soft: '#D9759F'
  success: '#3DDC5A'
  glass-fill: rgba(255, 255, 255, 0.06)
  glass-fill-strong: rgba(255, 255, 255, 0.12)
  glass-fill-tint: rgba(255, 255, 255, 0.20)
  glass-border: rgba(255, 255, 255, 0.14)
  glass-highlight: rgba(255, 255, 255, 0.25)
  text-on-light: '#111111'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 44px
    fontWeight: '500'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 38px
    fontWeight: '500'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '500'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  meta:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies a premium, dark glassmorphic learning sanctuary. It synthesizes futuristic artificial intelligence capability with organic, emotional warmth. By departing from cold, sterile developer aesthetics, the visual world relies on an intimate, near-black plum envelope illuminated by atmospheric magenta and burgundy "aurora" glows. 

### Emotional Persona & Aesthetic Direction
- **Warm Futuristic:** Cutting-edge intelligence presented through gentle, living light rather than technical harshness.
- **Calm Mastery:** A supportive, low-distraction dark mode designed for late-night focus and steady progression.
- **Glassmorphic Precision:** Translucent surfaces, hairline refractive borders, and high-diffusion backdrops create real tactile physical presence.
- **Friendly & Encouraging:** Welcoming microcopy and round, pill-driven ergonomics soften dense educational data.

The system mixes refined **Glassmorphism** with an ambient, atmospheric light leak philosophy. Content floats across layered translucent planes, using focused typography and bold hero indicators instead of noisy decorative clutter.

## Colors

The chromatic structure relies on a deep plum-tinted dark foundation (`#0F0A0E`) layered with blurred, bleeding atmospheric glows. Pure blacks and flat grays are prohibited; every dark surface retains subtle red/plum undertones.

### Application Hierarchy
- **Primary (`#E85A9E`):** Dynamic pink accent used for key active states, interactive FABs, circular progress meters, and critical focus triggers.
- **Secondary (`#A8408F`):** Deep magenta gradient engine driving ambient backdrops and secondary glow overlays.
- **Tertiary (`#C98F5A`):** Warm amber used strictly as an intentional focal disruptor for AI mentor promos and callouts.
- **Neutral (`#0F0A0E`):** Root canvas tone holding the luminous dark spectrum.

### Surface and Text Behavior
- **Text Layers:** Primary text remains crisp white (`#FFFFFF`). Secondary supporting labels use `rgba(255, 255, 255, 0.70)` to preserve legibility against magenta glows. Tertiary metadata sits at `rgba(255, 255, 255, 0.45)`. Text rendered atop solid white surfaces uses `--text-on-light` (`#111111`).
- **Gradients:** Canvas environments blend multi-point radial gradients with the deep base rather than using flat linear ramps.

## Typography

The typographic personality is powered by **Plus Jakarta Sans**, offering a humanist touch to geometric modernist forms that harmonizes with rounded glass edges. The scale embraces airy weight balances: weights never exceed medium (`500`), avoiding heavy, blocky footprints on dark backdrops.

### Typographic Rules
- **Large Metrics, Restrained Weights:** Primary values and numbers (`display-hero`) use light-to-medium strokes with tight line heights and negative tracking (`-0.02em`).
- **Subordinate Measuring Units:** Ancillary symbols next to hero numbers (such as `/100%`, `h`, `m`) drop to a lower font scale and 50% opacity to prevent visual competition.
- **Editorial Leading:** Headlines employ compact leading for a magazine-grade, mobile-first aesthetic.
- **Case Hierarchy:** All titles and CTAs follow Title Case; body interactions, responses, and contextual feedback remain in standard sentence case.

## Layout & Spacing

This layout approach pairs a dynamic mobile-first column frame with strict 4pt spatial increments (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`).

### Spatial Rhythm
- **Canvas Margins:** Fixed at `1.5rem` (`24px`) on desktop/tablet, adjusting to `1.25rem` (`20px`) on compact viewports to protect thumb interaction bounds.
- **Card Separation:** Vertical component flow requires an intentional `1.25rem` (`20px`) distance to let background light leaks breathe between panels.
- **Component Enclosures:** Container padding transitions between `1rem` (`16px`) for sub-tiles and `1.25rem` (`20px`) for large hero structures.
- **Internal Column Grid:** Side-by-side metric dashboards use a 2-column layout governed by `0.75rem` (`12px`) to `1rem` (`16px`) gutters.

## Elevation & Depth

Spatial layering rejects opaque drop shadows in favor of translucent frosted planes and hairline reflections. Visual depth is established through refractive optical boundaries and ambient luminescence.

### Elevation Architecture
1. **Atmospheric Canvas (Base Level):** Deep plum tone (`#0F0A0E`) infused with radial aurora leaks (`rgba(168, 64, 143, 0.55)` and `rgba(126, 37, 72, 0.70)`).
2. **Glass Tier 1 (Standard Cards & Tiles):** Fill of `rgba(255, 255, 255, 0.06)`, `32px` backdrop blur (`saturate(140%)`), 1px continuous hairline outline using `rgba(255, 255, 255, 0.14)`.
3. **Glass Tier 2 (Interactive Floating Controls & Nested Badges):** Fill of `rgba(255, 255, 255, 0.12)`, `40px` backdrop blur, with an inset top-edge illumination (`inset 0 1px 0 rgba(255, 255, 255, 0.25)`).
4. **Active Hero Surfaces (Top Tier):** Translucent tinted foundations (`--mauve-400` at 85% opacity or solid white active bubbles) emitting soft radial back-glows.

## Shapes

The design system enforces organic, fluid curves across all UI layers. Hard edges and sharp corners are completely excluded.

### Shape Hierarchy
- **Pill Primitives:** Buttons, interactive chips, navigation input modules, and progress tracks use complete pill curves (`999px` / `rounded-full`).
- **Hero Surfaces:** Large parent containers and modal glass structures use a defined `28px` corner radius.
- **Sub-Cards and Badges:** Metric panels, promotional modules, and notification blocks leverage a uniform `24px` radius.
- **Chat Bubbles:** Conversational containers sit at a `22px` radius, tightening to `6px` on the anchor corner opposite the sender.
- **Icon Actions & Avatars:** Circular controls sit within strict 1:1 round geometric masks.

## Components

### Buttons & Interactive Triggers
- **Primary CTA:** A high-contrast solid white pill (`height: 52px`, `padding: 0 24px`) with dark charcoal text (`#111111`) set in `title-sm`. Bound to single focal actions per view. On press, scales to `0.97` with `90%` opacity.
- **Secondary Glass CTA:** Translucent pill (`rgba(255, 255, 255, 0.12)`), 1px glass border, white text. Retains `48px` touch height.
- **Icon Action Buttons:** `48px` symmetrical circles formed with Tier 2 glass, housing an optically centered `20px` single-path line glyph (`1.5px` stroke, round joins).
- **Accent Mini-FAB:** `48px` circle wrapped in `--pink-soft` (`#D9759F`) displaying a centered white plus icon for immediate creation states.

### Cards & Panels
- **Standard Glass Card:** Backed by `32px` blur, `28px` rounded corners, carrying an inner `1px` top edge highlight. Always emphasizes one primary metric or visual element.
- **Frosted Mauve Hero Card:** High-opacity `--mauve-400` surface displaying circular SVG progress indicators. Houses large display statistics alongside supportive feedback copy.
- **Stat Tile:** Compact `24px` rounded units. Top tier hosts a two-line label and a `32px` directional arrow badge; bottom zone showcases an unweighted `display-hero` metric.
- **Promo Highlight Panel:** Saturated `--amber-400` background holding a 3D mascot identifier, brief text hierarchy, and a compact `36px` white CTA pill.

### Chips & Filters
- Compact pill-shaped modules (`height: 38px`, `padding: 8px 16px`) backed by `glass-fill` and a `1px` border. Text renders at `label-md`. Active states invert the fill to `rgba(255, 255, 255, 0.25)` with an interior highlight.

### Conversational AI Elements
- **User Messages:** Solid white pills/bubbles (`22px` radius), dark typography (`#111111`), right-aligned. Accompanied by timestamp and affirmative green receipt indicators (`#3DDC5A`).
- **AI Response Bubbles:** Translucent glass bubbles (`rgba(255, 255, 255, 0.10)`), left-aligned, accompanied by a `40px` circular companion avatar. Includes an integrated bottom reaction rail with audio narration triggers.
- **Floating Input Dock:** Pill-shaped glass container holding a nested accent insertion trigger (`+`), placeholder input (`body-md`), and a standalone circular glass microphone action button.

### Form Inputs & Selectors
- **Input Fields:** Semi-transparent text containers with `999px` borders, subtle placeholder copy at 45% white opacity, and focused state rings using glowing `--pink-accent` outlines.
- **Checkboxes & Radios:** Fully rounded indicators (`24px` circles) utilizing soft frosted backdrops that fill with solid `--pink-accent` and white checkmarks when selected.