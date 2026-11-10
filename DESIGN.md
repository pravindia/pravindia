---
name: pravindia
description: Personal engineering workspace
colors:
  background: "#071411"
  surface: "#0d1117"
  surface-raised: "#161b22"
  surface-high: "#21262d"
  border-bright: "#30363d"
  text: "#c9d1d9"
  text-bright: "#f0f6fc"
  text-muted: "#8b949e"
  primary: "#39d353"
  secondary: "#ff4c00"
  tertiary: "#2979ff"
  green: "#39d353"
  green-dim: "#0e4429"
  blue: "#2979ff"
  orange: "#ff4c00"
  black: "#000000"
typography:
  display:
    fontFamily: "Space Grotesk, Geist, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Space Grotesk, Geist, sans-serif"
    fontSize: "clamp(1.8rem, 4vw, 2.8rem)"
    fontWeight: 700
  body:
    fontFamily: "Geist, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.1rem"
    lineHeight: 1.7
  label:
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, Consolas, monospace"
    fontSize: "0.85rem"
rounded:
  small: "4px"
  medium: "8px"
  card: "12px"
  pill: "999px"
spacing:
  chip-gap: "0.5rem"
  element-gap: "1rem"
  card-padding: "1.5rem"
  section-horizontal: "2rem"
  section-vertical: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.black}"
    rounded: "{rounded.medium}"
    padding: "0.65rem 1.5rem"
  button-secondary:
    backgroundColor: "rgba(255, 255, 255, 0.05)"
    textColor: "{colors.text-bright}"
    rounded: "{rounded.medium}"
    padding: "0.65rem 1.5rem"
---

# Design System: pravindia

## Overview

**Creative North Star: "Personal engineering workspace"**

A dark workspace with vivid green, terminal-inspired details, and clear, approachable content. Buttons, cards, and panels feel functional and understated. The shared system is layered with ambient glow, while individual pages can have their own presentation: the coding dashboard currently uses a light editorial treatment.

**Key Characteristics:**
- Dark green and charcoal surfaces with bright green emphasis.
- Geist body text, Space Grotesk headings, and JetBrains Mono technical labels.
- Bordered, softly rounded panels and restrained interactive movement.
- Terminal prompts, status indicators, and compact technology tags.

## Colors

The shared palette combines dark workspace surfaces with vivid green and cool, readable text. Use the frontmatter values as the source of truth.

### Primary
- **Vivid Green**: calls to action, prompts, emphasis, status, and selected states.
- **Deep Green**: a subdued supporting accent.

### Secondary
- **Orange**: the shared secondary accent for supporting emphasis and data distinctions.

### Tertiary
- **Blue**: the shared tertiary accent for links, insights, and additional data distinctions.

### Neutral
- **Background and surfaces**: near-black green and charcoal distinguish page, panels, and raised areas.
- **Text tiers**: bright text for headings, standard text for body copy, and muted text for supporting information.
- **Bright border**: separates panels and controls on dark surfaces.

## Typography

Every page uses **Geist** for body text and ordinary controls, **Space Grotesk** for headings, and **JetBrains Mono** for technical labels, navigation, code, keyboard shortcuts, and chart annotations. Load the three families once from the global stylesheet with swap rendering and appropriate fallbacks.

- **Display and headline:** Space Grotesk; retain the existing responsive scale and hierarchy.
- **Body:** Geist with comfortable line spacing and readable supporting copy.
- **Technical label:** JetBrains Mono; use for technical metadata rather than general prose.

The shared primary, secondary, and tertiary accents come from the typing palette. Page-specific surfaces and light/dark backgrounds can vary; font and accent roles stay consistent. Darker semantic variants may be used where necessary for readable text on light surfaces.

## Layout

Homepage sections use `6rem 2rem` padding and a centered `1100px` content width. The hero centers its content within `720px`; its description is limited to `560px`. Project cards form three columns, then two at `1024px` and one at `768px`. The floating header is capped at `1200px`, hides navigation at `820px`, and simplifies search controls on smaller screens. Homepage actions stack at `600px`.

## Elevation & Depth

Layered surfaces, subtle borders, transparency, and occasional ambient glow create depth. Project cards lift slightly and reveal a green radial highlight on hover. The command palette uses a darker overlay and `0 20px 80px rgba(0, 0, 0, 0.5)` shadow; the header uses a translucent blurred surface. These effects support interaction rather than decorating every panel.

## Shapes

Controls and panels have gently rounded corners: small tags use `4px`, buttons `8px`, and project cards and dialogs `12px`. The header and its compact controls use pill shapes. Thin borders and translucent fills distinguish surfaces.

## Components

### Buttons

Primary actions use vivid green with black text; secondary actions use translucent white with bright text and a subtle border. Both have `8px` corners and `0.65rem 1.5rem` padding. Primary hover reduces opacity and lifts by `1px`; secondary hover brightens its surface.

### Cards and tags

Project cards use a translucent surface, a fine border, `12px` corners, and `1.5rem` padding. On hover they lift `4px`, strengthen their green border, and reveal a pointer-following highlight. Technology tags use muted monospaced text, a subtle border, and `4px` corners.

### Navigation and search

A fixed, centered, translucent pill contains the brand, monospaced navigation, availability indicator, and search control. Navigation links brighten on hover; the header becomes more opaque after scrolling. The command palette uses a centered raised panel, a transparent search input, and highlighted results with a green leading border.

### Learning cards

The homepage learning section uses a distinctive playing-card treatment with colored gradient borders, rank and suit corners, and a small hover lift and glow. This is a section-specific expression, not a default card style.

## Do's and Don'ts

### Do:
- **Do** use shared color variables for the dark site surfaces and green emphasis.
- **Do** use monospaced type for prompts and technical metadata where the surrounding surface already does so.
- **Do** preserve responsive stacking and readable text hierarchy.
- **Do** provide context alongside color in charts and status information.

### Don't:
- **Don't** apply the dark shared palette indiscriminately to the light coding dashboard.
- **Don't** treat the decorative learning cards as the default for ordinary content cards.
- **Don't** rely on hover alone to communicate essential information.
