---
name: Pastel Luxe Fintech
colors:
  surface: '#fef7ff'
  surface-dim: '#dfd7e7'
  surface-bright: '#fef7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f1ff'
  surface-container: '#f3ebfb'
  surface-container-high: '#ede5f5'
  surface-container-highest: '#e7dff0'
  on-surface: '#1d1a25'
  on-surface-variant: '#49454e'
  inverse-surface: '#332e3b'
  inverse-on-surface: '#f6eefe'
  outline: '#7a757f'
  outline-variant: '#cac4cf'
  surface-tint: '#655689'
  primary: '#655689'
  on-primary: '#ffffff'
  primary-container: '#b8a7e0'
  on-primary-container: '#493b6c'
  inverse-primary: '#cfbef8'
  secondary: '#665590'
  on-secondary: '#ffffff'
  secondary-container: '#d0bcff'
  on-secondary-container: '#5a4983'
  tertiary: '#894a6c'
  on-tertiary: '#ffffff'
  tertiary-container: '#e599bf'
  on-tertiary-container: '#692e50'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbef8'
  on-primary-fixed: '#201242'
  on-primary-fixed-variant: '#4d3f70'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#210f48'
  on-secondary-fixed-variant: '#4e3d76'
  tertiary-fixed: '#ffd8e9'
  tertiary-fixed-dim: '#feafd6'
  on-tertiary-fixed: '#390527'
  on-tertiary-fixed-variant: '#6e3254'
  background: '#fef7ff'
  on-background: '#1d1a25'
  surface-variant: '#e7dff0'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Outfit
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  financial-number-lg:
    fontFamily: Outfit
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.03em
  financial-number-md:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.02em
  label-md:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Manrope
    fontSize: 10px
    fontWeight: '700'
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
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xxs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-xxl: 3rem
---

## Brand & Style

This design system synthesizes whimsical kawaii intimacy with high-conviction financial clarity. Built for modern digital banking and asset-tracking interfaces, the aesthetic bridges delicate pastel artistry and mathematical rigor. The interface feels weightless, nurturing, and joyful without compromising transaction clarity, legibility, or institutional trust.

The design movement combines **Sculpted Glassmorphic Minimalism** with **Tactile Soft-Touch Ceramics**:
- Translucent layered substrates with subtle ambient blurs keep balance sheets legible and soft.
- Ceramic-smooth cards and sculpted buttons feel physically pressable and playful, while tabular numeric rows retain razor-sharp architectural alignment.
- Financial data remains sober, high-contrast, and scannable; decorative and motivational flourishes carry the sweetness, micro-delight badges, and soft-focus pastels.

## Colors

The core system anchors on **Lavender Dream**, supported by a foundational ceramic light mode that preserves a minimum 4.5:1 WCAG AA contrast ratio for core transaction figures.

### Core Active Palette (Lavender Dream)
- **Primary (`#B8A7E0`)**: Gentle lilac blossom used for focused borders, brand highlights, and interactive states.
- **Secondary (`#7D6BA8`)**: Deep muted amethyst for high-legibility icons, secondary text, and tactile toggle fills.
- **Tertiary (`#F4A6CD`)**: Sweet strawberry accent for positive savings milestones, notifications, and micro-badges.
- **Neutral Foreground (`#2E2A36`)**: Deep twilight plum delivering crisp readability on amounts, metrics, and labels without harsh black contrast.
- **Surface Ceramic (`#FAF8FC`)**: Off-white lavender milk foundation preventing glare while providing warmth.

### Theme Engine Extension (6 Distinct Palettes)
The system exposes dynamic CSS surface-tier overrides while preserving mathematical lightness tiers:
1. **Lavender Dream** (Active Master): Lilac `#B8A7E0`, Deep Violet `#7D6BA8`, Soft Cream `#FAF8FC`.
2. **Strawberry Pink**: Blush `#F9B3CE`, Dusty Rose `#9E4D6E`, Warm Milk `#FFF9FA`.
3. **Peachy Cream**: Soft Apricot `#F8B896`, Toasted Peach `#A85A32`, Warm Vanilla `#FFFBF7`.
4. **Matcha Garden**: Sweet Mint `#98D8AA`, Forest Matcha `#416D4E`, Pure Cream `#F8FAF6`.
5. **Sky Bunny**: Powder Azure `#99C8F5`, Slate Ocean `#3F6E9C`, Cloud White `#F7FBFF`.
6. **Milky Cocoa**: Soft Caramel `#CBB094`, Roasted Cocoa `#6E5540`, Steamed Milk `#FCFAF7`.

### Semantic Indicators
- **Positive / Income**: `#58B392` (Soft Jade Mint).
- **Negative / Expense**: `#EA7B7B` (Soft Strawberry Coral).
- **Warning / Alert**: `#E8AA42` (Golden Honey).

## Typography

The typographic hierarchy pairs the friendly, sculpted geometry of **Outfit** for headers and financial amounts with the neutral, hyper-legible cadence of **Manrope** for body copy and metadata.

- **Numerics & Ledger Clarity**: All financial numbers mandate `font-feature-settings: "tnum" 1` (tabular numerals) to ensure balance amounts, percentage changes, and column tallies line up precisely across decimals.
- **Cuteness with Restraint**: Titles utilize tighter tracking and medium/semibold weights to evoke warmth without ballooning into comic exaggeration.
- **Micro-Badges**: Labels render with explicit tracking and uppercase transformations to maintain legibility inside pastel indicator chips.

## Layout & Spacing

The layout philosophy uses a disciplined **Fluid-Grid Baseline** framed by airy canvas paddings to evoke effortless lightness.

- **Base Rhythm**: 4px base increment across all internal padding, component margins, and flex gaps.
- **Mobile First Framework**: Mobile runs an adaptive single-column layout with `margin-mobile: 1rem` and `gutter-mobile: 0.75rem`. Cards stretch fluidly with clamped internal paddings.
- **Desktop & Dashboard Surfaces**: Expands to a structured 12-column grid capped at `1200px` max-width. Ledger and budgeting graphs occupy 8 columns, while theme picker trays, quick transfer widgets, and micro-savings pigs occupy 4 columns.
- **Component Breathing Room**: Dense data structures (such as account lists) are broken into soft, separated island cards with `space-sm` gaps instead of harsh horizontal lines.

## Elevation & Depth

Visual depth is conveyed through **Tinted Ambient Cloud Shadows** and **Subtle Enamel Highlighting**, avoiding harsh black drop-shadows.

1. **Base Surface (Level 0)**: Flat tinted cream canvas (`#FAF8FC`).
2. **Floated Squircle Card (Level 1)**: Pure white ground (`#FFFFFF`) with a dual shadow stack:
   - Primary: `0px 4px 16px -2px rgba(184, 167, 224, 0.18)`
   - Contact: `0px 1px 2px 0px rgba(46, 42, 54, 0.04)`
   - Border: 1px continuous hairline outline using `rgba(184, 167, 224, 0.25)`.
3. **Interactive Hover / Floating Action Bar (Level 2)**:
   - Shadow: `0px 12px 28px -4px rgba(184, 167, 224, 0.32)`
   - Border: 1px frosted boundary `rgba(255, 255, 255, 0.8)`.
4. **Tactile Inset (Inputs & Unchecked Toggles)**:
   - Internal shadow: `inset 0px 2px 4px 0px rgba(46, 42, 54, 0.05)` on surface `#F3EFF9`.

## Shapes

The design system adopts **Roundedness Level 2**, utilizing continuous squircles across interactive and containment surfaces to reinforce a smooth ceramic feel.

- **Base Elements (`rounded`, 0.5rem / 8px)**: Segmented controls, input fields, and category tags.
- **Primary Containers (`rounded-lg`, 1rem / 16px)**: Ledger line items, contextual action panels, and category breakdowns.
- **Hero Containers (`rounded-xl`, 1.5rem / 24px)**: Account balance summaries, spend trajectory cards, and theme preview switchboards.
- **Pills (`rounded-full`, 9999px)**: Buttons, status micro-badges, and theme selector swatches.

## Components

### Buttons
- **Primary Tactile Button**: Pill-shaped (`rounded-full`), background `#B8A7E0`, text `#FFFFFF` (`font-weight: 600`), with an ambient shadow `0px 4px 12px rgba(184, 167, 224, 0.4)`. Transitions down `1px` on active press with reduced shadow.
- **Secondary Ghost Pill**: Frosted translucent surface (`rgba(184, 167, 224, 0.15)`), text `#7D6BA8`, border `1px solid rgba(184, 167, 224, 0.3)`.
- **Destructive Action**: Muted strawberry blush (`#FEE8E8`), text `#D9534F`, no hard red borders.

### Chips & Micro-Badges
- **Pill Badge**: Height `22px`, internal padding `2px 10px`, typography `label-sm`.
- **Financial Status Indicators**: Inflow tags receive soft jade pastel backgrounds with deep forest text; outflows receive soft peach/coral backgrounds with crimson plum text.
- **Cute Category Badges**: Contain a pastel-tinted round icon container (28px diameter) with an expressive icon paired with a category label.

### Cards (Squircle Containers)
- Base background `#FFFFFF`, border-radius `1.5rem` (`rounded-xl`), border `1px solid rgba(184, 167, 224, 0.2)`.
- Internal padding is `1.5rem` (`space-lg`). Content inside divides via negative space and tinted card islands rather than separator lines.

### Inputs & Search Bars
- Background `#F3EFF9` with subtle inset shadow.
- Height `48px`, border-radius `1rem` (`rounded-lg`), text `#2E2A36`.
- Focus state: Surface turns pure white (`#FFFFFF`) with a `2px solid #B8A7E0` focus ring and ambient glow.
- Numeric currency fields display the active currency symbol in an anchored pill chip on the leading edge.

### Toggles & Controls
- **Kawaii Pill Switches**: Width `52px`, height `30px`, track background `#E4DCF5`. Thumb is an elevated 24px pure white ceramic circle. When checked, the track transitions to `#7D6BA8` or the active palette's secondary color with a subtle bounce animation (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- **Checkboxes & Radios**: 20px squircle (`rounded`, 6px) with 1.5px border in `#B8A7E0`. Checked state fills with `#7D6BA8` displaying a white geometric checkmark.

### Theme Customizer Palette Selector
- An elevated horizontal carousel displaying the 6 aesthetic presets. Each preset is shown as a triple-layered overlapping dot disk wrapped in a squircle border with active ring indicator (`3px solid #7D6BA8` with `4px` offset).