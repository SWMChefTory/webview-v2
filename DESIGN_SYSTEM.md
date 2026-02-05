# Design System Documentation

## Overview

This project uses a modern, mobile-first design system built with **Tailwind CSS v4** and **Radix UI** primitives. The design emphasizes clean, functional aesthetics with a warm accent color palette and smooth user interactions.

---

## Color System

### Primary Colors (OKLCH)

The color system uses OKLCH color space for perceptual uniformity:

| Role | Light Mode | Dark Mode | Usage |
|------|-----------|-----------|-------|
| `--primary` | `oklch(0.205 0 0)` | `oklch(0.922 0 0)` | Primary actions, headings |
| `--secondary` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Secondary backgrounds |
| `--accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Accent elements |
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | Main background |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Main text |
| `--muted` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Muted backgrounds |
| `--border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | Borders, dividers |

### Accent Colors

- **Orange (`bg-orange-500`)**: Primary brand accent color
  - Used for: Call-to-action buttons, highlights, interactive elements
  - Text: `text-orange-500`
  - Background: `bg-orange-50` (light variant)
  - Hover: `hover:bg-orange-600`, `hover:border-orange-300`

### Functional Colors

- **Destructive**: `oklch(0.577 0.245 27.325)` (error states, delete actions)
- **Chart colors**: 5-color palette for data visualization

### Gray Scale

- `gray-50` to `gray-900`: Neutral backgrounds, borders, text
- `stone-600`: Status indicators (viewed badges)

---

## Typography

### Font Family

**NanumSquare** (Custom web font)

```css
font-family: "NanumSquare", -apple-system, BlinkMacSystemFont,
  "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif;
```

**Font Weights Available:**
- Light: 300
- Regular: 400
- Bold: 700
- Extra Bold: 800

### Type Scale

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| `text-xl` | 20px | font-bold | Card titles, modal headings |
| `text-lg` | 18px | font-semibold | Emphasized text |
| `text-base` | 16px | font-semibold | Body text |
| `text-sm` | 14px | font-semibold, font-normal | Card content, descriptions |
| `text-xs` | 11-12px | font-semibold | Pills, tags, metadata |

### Text Utilities

- `line-clamp-1`, `line-clamp-2`, `line-clamp-3`: Text truncation
- `leading-none`, `leading-relaxed`: Line height control
- `select-none`: Prevent text selection (global default)
- `allow-select`: Re-enable text selection where needed

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | 0.625rem (10px) | Base radius |
| `rounded-md` | calc(var(--radius) - 4px) | Small elements |
| `rounded-lg` | calc(var(--radius) - 2px) | Cards, buttons |
| `rounded-xl` | var(--radius) | Large cards |
| `rounded-2xl` | calc(var(--radius) + 4px) | Modals, major containers |
| `rounded-full` | 50% | Pills, circular buttons |

---

## Spacing & Layout

### Responsive Breakpoints

| Device | Width | Prefix |
|--------|-------|--------|
| Mobile | 0 - 767px | (none) |
| Tablet | 768px - 1023px | `md:` |
| Desktop | 1024px+ | `lg:` |

### Common Spacing

- `gap-1`, `gap-1.5`, `gap-2`: Element spacing (4px, 6px, 8px)
- `space-y-*`: Vertical stacking
- `p-2`, `p-3`, `p-4`: Padding increments
- `px-3`, `px-4`, `px-6`: Horizontal padding

### Layout Patterns

- `flex flex-col`: Vertical stacking
- `flex items-center justify-center`: Centered content
- `flex-1`: Flexible space distribution
- `aspect-[9/16]`, `aspect-[16/9]`, `aspect-video`: Fixed aspect ratios

---

## Component Patterns

### Cards

```tsx
// Standard card wrapper
<div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100">
```

### Buttons

```tsx
// Primary CTA
<div className="bg-orange-500 text-white font-semibold px-5 py-2 rounded-full">
```

### Pills & Tags

```tsx
// Orange pill
<div className="rounded-full bg-orange-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">

// Semi-transparent pill
<div className="rounded-full bg-black/75 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
```

### Modals & Bottom Sheets

```tsx
// Modal container
<div className="bg-white rounded-[20px]">

// Bottom sheet (mobile)
<Sheet.Container style={{ borderRadius: 20, left: 8, right: 8 }}>
```

---

## Animation & Motion

### Page Transitions

**View Transitions API** for smooth page navigation:
- Forward slide: 0.3s linear
- Backward slide: 4s linear
- Keyframes: `slide-in-from-*`, `slide-out-to-*`

### Micro-interactions

- `active:scale-95`: Button press feedback
- `transition-transform duration-75`: Quick transform transitions
- `transition-all duration-150`: General state transitions
- `hover:scale-110`: Hover scale effects
- `hover:bg-orange-50`, `hover:border-orange-300`: Hover states

### Loading States

- Skeleton loaders with `bg-gray-200` background
- Spinners with `text-orange-500`
- `animate-spin` for rotation animations

---

## Icon System

**Libraries Used:**
- `react-icons/io`: Ionicons (IoMdArrowBack, IoMdClose, IoMdAdd)
- `react-icons/cg`: CG icons (CgProfile)
- `lucide-react`: Lucide icons (LayoutGrid, List)
- `react-icons/wi`: Weather icons (WiCloud for error states)

**Icon Sizing:**
- Mobile: `w-6 h-6` (24px)
- Desktop: `md:!w-7 md:!h-7` (28px)

---

## Shadows

| Class | Usage |
|-------|-------|
| `shadow-sm` | Subtle elevation for cards |
| `shadow-md` | Medium elevation (buttons) |
| `shadow-[0_10px_30px_rgba(0,0,0,0.16)]` | Floating elements (view toggle) |

---

## Visual Hierarchy

### Z-Index Scale

| Value | Usage |
|-------|-------|
| 40 | Fixed headers |
| 50 | Fixed controls (view toggle) |
| 99 | Modal backdrops |
| 100 | Modal content |

---

## Responsive Design Patterns

### Container Widths

```tsx
// Responsive container
max-w-[1200px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px]
```

### Device-Specific UI

- **Mobile**: Bottom sheet modals, horizontal scroll, compact spacing
- **Tablet**: Medium spacing, larger touch targets
- **Desktop**: Expanded layouts, max-width containers

---

## Special UI Patterns

### Scrollbar Hiding

```css
.no-scrollbar {
  -ms-overflow-style: none;  /* IE, Edge */
  scrollbar-width: none;  /* Firefox */
}
.no-scrollbar::-webkit-scrollbar {
  display: none;  /* Chrome, Safari */
}
```

### Safe Area Support

- `tailwindcss-safe-area` plugin integration
- `pb-safe` for bottom safe area padding
- iOS notch/home indicator aware

### Glass Morphism

```tsx
<div className="bg-white/90 backdrop-blur-md">
```

### Gradient Overlays

```tsx
<div className="bg-gradient-to-t from-black/80 via-black/30 to-transparent">
```

---

## Interactive States

### Button States

- Base: `bg-orange-500 text-white`
- Hover: `hover:bg-orange-600`
- Active: `active:scale-95`
- Disabled: `opacity-50`

### Card Hover

```tsx
className="hover:border-orange-300 hover:bg-orange-50 transition-all group"
```

### Active Indicators

```tsx
<span className="absolute inset-0 bg-gray-400 opacity-0 active:opacity-30 transition-opacity">
```

---

## Status & Feedback

### Loading States

- Skeleton components with `bg-gray-200` and `bg-gray-300/70`
- Spinner icons with `animate-spin`

### Empty States

- `bg-orange-50` background
- `text-orange-400` accent color
- Centered layout with `flex flex-col items-center justify-center`

### Error States

- Cloud icon with `text-orange-400`
- `text-gray-600` for messages
- Clear CTA with `bg-orange-500`

---

## Design Tokens Reference

### CSS Variables (globals.css)

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --border: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}
```

---

## Accessibility

- `aria-label` on icon-only buttons
- Focus states with `outline-ring/50`
- High contrast ratios maintained
- Semantic HTML with proper heading hierarchy
