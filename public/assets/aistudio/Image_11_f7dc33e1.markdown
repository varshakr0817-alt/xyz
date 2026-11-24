---
name: PlacementPrep
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#767680'
  outline-variant: '#c6c5d0'
  surface-tint: '#4f5c8e'
  primary: '#000f3f'
  on-primary: '#ffffff'
  primary-container: '#172554'
  on-primary-container: '#808dc2'
  inverse-primary: '#b7c4fd'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#1c0047'
  on-tertiary: '#ffffff'
  tertiary-container: '#35007a'
  on-tertiary-container: '#a375ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4fd'
  on-primary-fixed: '#071747'
  on-primary-fixed-variant: '#374475'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#eaddff'
  tertiary-fixed-dim: '#d2bbff'
  on-tertiary-fixed: '#25005a'
  on-tertiary-fixed-variant: '#5a00c6'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  title-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system embodies a focused, aspirational, and high-trust EdTech experience engineered for college students navigating recruitment cycles. The visual tone balances academic rigor with modern SaaS momentum: clean, structured, and friction-free. It avoids visual clutter, reducing cognitive load during interview preparation and assessment drills.

The design style is **Corporate Modern with Tactile SaaS Polish**:
- Crisp typography and clear structural hierarchies to parse complex curricula, interview schedules, and test analytics effortlessly.
- High-contrast, deliberate color placement signaling progression, success, and system status.
- Soft multi-stop shadows and nested rounded containers that frame actionable preparation modules as distinct, interactive surfaces.

## Colors
The palette leverages a authoritative primary navy paired with high-engagement digital blues and purples to balance credibility with technological agility.

### Functional Roles
- **Primary (`#172554` - Deep Navy Blue):** Establishes anchor points, primary navigation bars, dominant headlines, and key structural framing. Communicates stability and authority.
- **Secondary (`#2563EB` - Royal Blue):** Interactive driver for primary buttons, active links, progress state indicators, and active selection filters.
- **Tertiary / Accent (`#7C3AED` - Purple):** Signals AI-assisted mock interviews, premium prep packs, dynamic insights, and special badges.
- **Neutral (`#64748B` - Slate):** Drives secondary labels, supporting text, deactivated states, and structural icons.
- **Surfaces & Borders:** `#FFFFFF` serves as the primary canvas for cards and modals against an `#F8FAFC` slate-tinted canvas background. Structural dividers and containers use crisp `#E2E8F0` outlines.
- **Feedback & Validation:** Positive results and milestone achievements use `#16A34A` (Green), while warnings, upcoming deadlines, and practice hints use `#F59E0B` (Amber).

## Typography
Inter delivers a utilitarian, high-legibility typographic foundation across dense coding assessments, analytical dashboards, and structured question banks.

- **Scale & Hierarchy:** Tight negative tracking on display and headline weights (`-0.01em` to `-0.02em`) provides an authoritative editorial posture for primary dashboard metrics and module titles.
- **Reading Comfort:** Body copy maintains a generous 1.5x to 1.6x line-height ratio to optimize long-form reading during test reviews and problem statements.
- **Labels & Microcopy:** Badges, tags, table headers, and sub-labels utilize medium-to-semibold weights with subtle positive letter spacing (`0.02em` to `0.04em`) to ensure instant recognition at micro scales.

## Layout & Spacing
The layout model employs a fluid 12-column grid system on desktop that transitions gracefully to a 4-column flow on mobile viewports.

- **Desktop (1024px+):** Max-width canvas of 1280px, flanked by 2rem margins (`margin`) and 1.5rem gutters (`gutter`). Supports side-by-side split layouts for code terminals and problem definitions.
- **Tablet (768px - 1023px):** 8-column layout with 1.5rem gutters and 1.5rem margins. Secondary panels collapse into tabbed interfaces or slide-over sheets.
- **Mobile (<768px):** 4-column fluid layout with 1rem margins (`margin-mobile`) and 1rem gutters (`gutter-mobile`). Bottom navigation anchors core views, while interactive test cards span full available width.
- **Rhythm & Stacking:** Component internal spacing adheres to an 8pt increment model: `space-xs` (4px) for tight inline badges; `space-sm` (8px) for icon-to-label gaps; `space-md` (16px) for standard form inputs and card padding; `space-lg` (24px) for dashboard module padding; and `space-xl` (32px) for sectional separation.

## Elevation & Depth
Visual hierarchy relies on multi-layered ambient shadows combined with structural low-contrast borders, delivering clarity without excessive contrast.

- **Level 0 (Flat / Canvas):** Neutral `#F8FAFC` base background without shadow or outline.
- **Level 1 (Card / Resting Surface):** Pure `#FFFFFF` surface container, bounded by a 1px solid border in `#E2E8F0`, elevated by an ambient tinted shadow: `0 1px 3px 0 rgba(23, 37, 84, 0.05), 0 1px 2px -1px rgba(23, 37, 84, 0.05)`.
- **Level 2 (Hover / Active Interactive Card):** Used when focusing test cards, practice modules, or active table rows: `0 10px 15px -3px rgba(23, 37, 84, 0.08), 0 4px 6px -4px rgba(23, 37, 84, 0.04)`, retaining the `#E2E8F0` border or transitioning the border to `#2563EB` (20% opacity).
- **Level 3 (Dropdowns / Flyouts):** Suspended contextual menus and predictive search bars: `0 20px 25px -5px rgba(23, 37, 84, 0.1), 0 8px 10px -6px rgba(23, 37, 84, 0.06)` with a crisp `#E2E8F0` perimeter.
- **Level 4 (Modals & Overlays):** Deep focus surfaces against a 40% `#172554` backdrop blur overlay: `0 25px 50px -12px rgba(23, 37, 84, 0.25)`.

## Shapes
The design system adopts a balanced roundedness (Level 2), standardizing base element radii at 0.5rem (8px), intermediate containers at 1rem (16px, `rounded-xl`), and primary cards/modals at 1.5rem (24px, `rounded-2xl`).

- **Inputs, Buttons, and Minor Controls:** Styled with `rounded-md` (0.5rem) to maintain geometric integrity and tactile comfort during rapid interaction.
- **Sub-cards, Stat Widgets, and Grouped Lists:** Styled with `rounded-xl` (1rem) to soften inner grids.
- **Main Cards, Dashboard Panels, and Modals:** Styled with `rounded-2xl` (1.5rem) to provide distinct, inviting visual enclosures.
- **Pills / Status Badges:** Fully circular (`rounded-full` / 9999px) for company tags, question counts, and completion badges.

## Components

### Buttons
- **Primary:** Solid `#2563EB` background with `#FFFFFF` text. Height of 40px (desktop) / 44px (mobile), 0.5rem border radius, semibold label. Hover: shifts to `#1D4ED8`. Active: subtle scale down (0.98).
- **Secondary:** Surface `#FFFFFF` with a 1px `#E2E8F0` border and `#172554` text. Hover: `#F8FAFC` background with `#CBD5E1` border.
- **Accent / AI Assist:** Solid `#7C3AED` with `#FFFFFF` text, utilized strictly for AI mock interviews, resume feedback, and premium diagnostic triggers. Hover: `#6D28D9`.
- **Destructive / Ghost:** Ghost buttons inherit `#64748B` typography, with a transparent baseline turning to `#F1F5F9` on hover.

### Chips & Badges
- **Status Badges:** Rounded-full, 24px height, padding of 4px 10px. Uses 10% opacity tints of the source color for backgrounds paired with the solid token for text:
  - Success (Completed / Cleared): `#DCFCE7` background with `#16A34A` text.
  - Warning (Pending Review / Deadline): `#FEF3C7` background with `#B45309` text.
  - Tech Stack / Topic Tags: `#EFF6FF` background with `#2563EB` text.
- **Filter Chips:** 32px height, 0.5rem border radius, `#FFFFFF` fill with 1px `#E2E8F0` border. Active state shifts to `#172554` fill with `#FFFFFF` text.

### Cards
- **Practice & Assessment Cards:** Constructed with a `#FFFFFF` fill, 1.5rem border radius (`rounded-2xl`), 1px `#E2E8F0` border, and Level 1 elevation. Internal padding is set to 24px.
- **Header Structure:** Includes an inline status badge, topic category, and company logo slot.
- **Progress Trackers:** Integrated linear progress bar (6px height, rounded-full) featuring `#F1F5F9` background track and `#2563EB` fill.

### Input Fields
- **Standard Input:** 42px height, `#FFFFFF` background, 0.5rem border radius, 1px `#CBD5E1` border. Body-md typography with `#64748B` placeholder text.
- **Focus State:** 2px focus ring using `#2563EB` with an ambient 4px outer blur at 15% opacity; border transitions to `#2563EB`.
- **Validation State:** Red outline `#DC2626` with an accompanying subtext indicator at `label-sm`.

### Checkboxes & Radio Buttons
- **Checkboxes:** 18px square with 4px border radius. 1.5px `#CBD5E1` border on neutral; active state fills with `#2563EB` and displays a crisp white checkmark.
- **Radio Buttons:** 18px circular container with a 1.5px `#CBD5E1` outer border; checked state features a `#2563EB` outer ring with an inner 8px solid `#2563EB` circle centered.

### Lists & Question Banks
- **Question Rows:** 56px minimum row height with 1px bottom border in `#F1F5F9`. Features alternating focus state on hover (`#F8FAFC`).
- **Metadata Alignment:** Structured column alignment displaying question difficulty, company frequency badge, completion status icon, and estimated solving time.