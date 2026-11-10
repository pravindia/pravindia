# Typing page style guide

This guide records the current visual system for `/typing`. Its page-specific styles live in `styles/Typing.module.scss`; the shared color tokens come from `styles/globals.css`. All pages share Geist body text, Space Grotesk headings, JetBrains Mono technical labels, and the primary/secondary/tertiary tokens in `styles/globals.css`. Layouts remain page-specific.

## Typography

| Role | Font | Use |
| --- | --- | --- |
| Display | Space Grotesk | Hero and section headings, statistic values, personal bests and goal figure |
| Primary | Geist | Body copy, labels, buttons, chart annotations and supporting text |
| Fallbacks | System sans-serif | Used if web fonts cannot load |

Geist and Space Grotesk are loaded from Google Fonts at weights 400, 500, 600 and 700. All three font families are loaded once globally. The hero requests weight 800; because that weight is not loaded explicitly, the browser may synthesize it.

| Element | Size | Weight | Line height / tracking |
| --- | --- | --- | --- |
| Hero heading | `clamp(2.5rem, 6vw, 4.5rem)` | 800 | `1.1` / `-0.03em` |
| Section and goal heading | `clamp(1.8rem, 4vw, 2.8rem)` | 700 | `1.15` / `-0.04em` |
| Hero description | `1.1rem` | 400 | `1.7` |
| Section description | `15px` | 400 | `1.75` |
| Eyebrow | `0.85rem` | 400 | `1.5` |
| Statistic number | `clamp(2.65rem, 4.3vw, 4.6rem)` | 500 | `1` / `-0.055em` |
| Statistic number, mobile | `clamp(2.1rem, 7.5vw, 3.8rem)` | 500 | `1` / `-0.055em` |
| Statistic label | `1rem` | 600 | `1.3` |
| Statistic detail | `0.875rem` | 400 | `1.5` |
| Statistic unit | `0.9rem` | 500 | normal |
| Primary button | `0.9rem` | 700 | normal |
| Chart and compact labels | `10px` | 600 | `1.5`; some labels use `0.1em` tracking |

## Colors

| Role | Token / value | Use |
| --- | --- | --- |
| Primary | `#39D353` (`--typing-primary`, shared `--green`) | Primary button, hero emphasis, chart line and first statistic |
| Secondary | `#FF4C00` (`--typing-secondary`) | Accuracy statistic, goal value and progress bars |
| Tertiary | `#2979FF` (`--typing-tertiary`) | Completed-test statistic, links and disclosures |
| Page background | `#071411` (`--bg`) | Main page background |
| Surface | `#0D1117` (`--surface`) | Cards, charts and goal panel |
| Raised surface | `#161B22` (`--surface-2`) | Notice and keyboard background gradient |
| Track | `#21262D` (`--surface-3`) | Progress-bar backgrounds |
| Border | `#21262D` (`--border`) | Panels and charts |
| Emphasized border | `#30363D` (`--border-bright`) | Statistic cards and dividers |
| Heading text | `#F0F6FC` (`--text-bright`) | Headings and prominent labels |
| Body text | `#C9D1D9` (`--text`) | Standard text |
| Muted text | `#8B949E` (`--text-muted`) | Descriptions, units and supporting labels |

## Components and layout

- **Page container:** maximum width `1200px`; desktop page padding `140px 28px 80px`, changing to `110px 20px 60px` at widths up to `800px`.
- **Hero:** desktop minimum height `720px`; large interactive keyboard sits behind the copy. On smaller screens, the keyboard follows the copy in normal flow.
- **Statistic cards:** four columns with `12px` gaps on desktop; two columns with `10px` gaps at `800px` and below; one column at `360px` and below. Cards use a `14px` radius, a `1px` emphasized border and a `230px` desktop minimum height (`190px` on mobile, `160px` at the narrowest breakpoint).
- **Other panels:** surface background, `1px` border and `8px` radius.
- **Primary button:** green background, black text, `8px` radius and `0.65rem 1.5rem` padding.
- **Chart:** green data line, dashed green goal line, muted grid and date labels. Orange is used for progress bars.
- **Motion:** statistic values count up when they enter view; the Keybr graph draws in a loop. Both honor `prefers-reduced-motion`.

Use labels and context alongside color so information remains understandable without relying on color alone. The shared header and footer retain their site-wide styles.
