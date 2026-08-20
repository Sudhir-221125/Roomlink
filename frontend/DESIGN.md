# RoomLink Design System (v2.0)

Welcome to the RoomLink Design System. This document outlines the visual language, core principles, and reusable components that ensure RoomLink feels like a premium, trustworthy, and welcoming co-living management platform.

## Design Philosophy

RoomLink moves away from the "generic AI SaaS" aesthetic. We avoid excessive purples, neon accents, heavy glowing drop-shadows, and over-used glassmorphism.

Instead, the UI is **Architectural and Natural**:
- **Modern & Trustworthy**: Clean lines, readable data, structured layouts.
- **Welcoming & Human**: Warm stone backgrounds, sage green accents, and humanist typography.
- **Calm & Organized**: High contrast where necessary, but avoiding visual fatigue through soft, layered shadows and earthy tones.

---

## 1. Color System

All colors are available as CSS custom properties in `src/index.css`.

### Brand Palette (Sage / Forest Green)
Used for primary actions, active states, and brand moments. It conveys growth, calm, and reliability.
- `--color-primary` (`#315343`): Primary buttons, active tabs.
- `--color-primary-hover` (`#2a4337`): Button hover states.
- `--color-primary-bg` (`#f2f6f5`): Soft backgrounds for brand-tinted surfaces.

### Neutral Scale (Warm Stone / Charcoal)
Used for backgrounds, borders, and text. Warm neutrals prevent the UI from feeling cold or clinical.
- `--color-bg` (`#fcfbfa`): Main application background.
- `--color-surface` (`#ffffff`): Foreground cards and containers.
- `--color-surface-2` (`#f5f4f1`): Secondary surfaces (sidebars, nested panels).
- `--color-border` (`#e8e6e1`): Subtle dividers.
- `--color-heading` (`#1a1817`): Deep charcoal for high-contrast headings.
- `--color-text` (`#2b2826`): Standard body text.
- `--color-text-muted` (`#7a7671`): Secondary labels and captions.

### Semantic Status Colors
Used to communicate state. These use accessible, slightly muted tones to fit the natural palette.
- **Success**: `--color-success-bg` (`#edf7ed`), `--color-success-text` (`#2e7d32`)
- **Warning**: `--color-warning-bg` (`#fff7e6`), `--color-warning-text` (`#d97706`)
- **Danger**: `--color-danger-bg` (`#fce8e8`), `--color-danger-text` (`#c62828`)
- **Info**: `--color-info-bg` (`#eef4ff`), `--color-info-text` (`#1e40af`)

---

## 2. Typography

We use two highly legible, modern Google Fonts, imported in `index.html`.

### Display & Headings: `Outfit`
A geometric sans-serif that feels premium and welcoming.
- **Usage**: `h1` through `h6`.
- **Weight**: `600` (Semi-bold) by default.
- **Tracking**: Tightened (`-0.02em`) for a solid, architectural feel.

### Body & UI: `Plus Jakarta Sans`
A highly legible sans-serif excellent for dense data, forms, and statistical values.
- **Usage**: Body text, buttons, inputs, labels.
- **Scale**:
  - `--text-xs` (12px): Badges, tooltips.
  - `--text-sm` (14px): Secondary labels, button text.
  - `--text-base` (15px): Default UI text.
  - `--text-lg` (18px) to `--text-3xl` (30px): Larger UI values.

---

## 3. Spacing & Sizing

We use a strict **4pt Grid** system to ensure rhythm and consistency across layouts.
Tokens range from `--space-1` (4px) to `--space-16` (64px). 

**Rule of Thumb:**
- Component internals (icon to text): `8px` (`--space-2`)
- Component padding (button padding): `16px` (`--space-4`)
- Section gaps (between cards): `24px` (`--space-6`)

---

## 4. Reusable Component Classes

To ensure consistency without forcing heavy JavaScript abstractions, we provide global utility classes in `index.css` prefixed with `.rl-`.

### Cards
- `.rl-card`: Standard white surface with border and subtle shadow.
- `.rl-card-interactive`: Adds a hover lift (`translateY`) and elevated shadow.

### Buttons
- `.rl-btn`: Base class for all buttons (layout, typography, sizing).
- `.rl-btn-primary`: Solid Sage background, white text.
- `.rl-btn-secondary`: Warm stone background, dark text (for secondary actions).
- `.rl-btn-outline`: Transparent background, Sage border.

### Forms
- `.rl-form-group`: Flex column wrapper for label + input.
- `.rl-label`: Styled form label.
- `.rl-input`: Standard text input with focus rings.

### Badges
- `.rl-badge`: Base pill layout.
- Append state: `.rl-badge-success`, `.rl-badge-warning`, `.rl-badge-danger`, `.rl-badge-info`, `.rl-badge-neutral`.

---

## 5. Motion Principles

Animations should feel **subtle, intentional, and premium**. 
- **Transitions**: We use `--transition-fast` (100ms) for color/hover changes, and `--transition-normal` (200ms) for layout/transform shifts.
- **Easing**: We rely on `--ease-standard` for normal UI, and `--ease-spring` for elements that enter the viewport (modals, dropdowns) to provide a snappy, responsive feel.
- **Avoid**: Long, drawn-out animations (>300ms) or excessive bouncing.

---

## 6. Accessibility (a11y)

- **Focus States**: All interactive elements (buttons, links, inputs) have a defined `:focus-visible` state utilizing a 2px offset ring in `--brand-400`.
- **Contrast**: The neutral text palette (`#2b2826` on `#fcfbfa`) easily exceeds WCAG AA contrast requirements.
- **Screen Readers**: Use the `.sr-only` utility class to visually hide text while keeping it accessible to screen readers (e.g., icon-only buttons).

---

## 7. Usage Guidelines

1. **Don't hardcode colors**: Always use `--color-...` variables. If a color doesn't exist in the palette, question if it's truly needed.
2. **Prefer Composition over Custom CSS**: When building a new page, try to construct it using `.rl-card`, `.rl-form-group`, and the spacing variables before writing custom CSS modules.
3. **Keep Shadows Subtle**: Do not invent new shadows. Use `--shadow-sm` for standard cards, `--shadow-md` for hovered cards, and `--shadow-float` for dropdowns/modals.
