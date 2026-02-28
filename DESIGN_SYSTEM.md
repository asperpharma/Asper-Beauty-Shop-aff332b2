# Asper Beauty Shop - Design System

> **Brand Identity:** Premium organic and natural beauty products with Medical Trust

This document defines the visual language, design tokens, and styling guidelines for the Asper Beauty Shop website.

---

## 🎨 Brand Values

**Core Value:** "Radiant Beauty" — Empowering confidence through high-quality, natural ingredients

**Brand Promise:** Luxury skincare and beauty essentials for the modern customer

**Design Philosophy:**
- **Elegant** - Sophisticated and refined aesthetics
- **Trustworthy** - Medical-grade credibility (JFDA-compliant, Authorized Retailer)
- **Luxurious** - Premium feel with warm, inviting colors
- **Organic** - Natural, clean, and sustainable

**Visual Mood:** "Morning Spa" meets "Medical Luxury"

---

## 🌈 Color Palette

### Primary Colors

#### Asper Stone (Maroon)
Primary brand color - Medical authority and luxury
- **Maroon:** `#800020` (128, 0, 32)
- **Maroon Light:** HSL variant `hsl(var(--maroon-light))`
- **Maroon Dark:** HSL variant `hsl(var(--maroon-dark))`
- **Usage:** Primary buttons, headers, accent elements

#### Rose Clay
Warm, natural, spa-like
- **Rose:** HSL variant `hsl(var(--rose))`
- **Rose Light:** HSL variant `hsl(var(--rose-light))`
- **Usage:** Hover states, secondary accents, feminine touches

#### Burgundy
Deep, rich, sophisticated
- **Burgundy:** HSL variant `hsl(var(--burgundy))`
- **Burgundy Light:** HSL variant `hsl(var(--burgundy-light))`
- **Burgundy Dark:** HSL variant `hsl(var(--burgundy-dark))`
- **Usage:** Cards, sections, product cards

### Accent Colors

#### Polished Gold
Luxury and premium quality
- **Gold:** `#D4AF37` (212, 175, 55)
- **Shiny Gold:** `#C5A028` (197, 160, 40)
- **Gold Light:** HSL variant `hsl(var(--gold-light))`
- **Gold Glow:** HSL variant `hsl(var(--gold-glow))`
- **Usage:** CTAs, badges, highlights, icons

**Gold Scale:**
- `gold-100`: `#F9F1D8` (very light)
- `gold-300`: `#D4AF37` (default)
- `gold-500`: `#AA8C2C` (medium)
- `gold-900`: `#524314` (dark)

#### Warm Brown
Earthy and organic
- **Warm Brown:** HSL variant `hsl(var(--warm-brown))`
- **Warm Brown Light:** HSL variant `hsl(var(--warm-brown-light))`
- **Usage:** Organic/natural product indicators, earthy accents

### Background Colors

#### Soft Ivory
Primary background - clean and spa-like
- **Soft Ivory:** `#F8F8FF` (248, 248, 255)
- **Cream:** HSL variant `hsl(var(--cream))`
- **Cream Dark:** HSL variant `hsl(var(--cream-dark))`
- **Usage:** Page backgrounds, cards, sections

#### Luxury Black
Dark mode and premium sections
- **Luxury Black:** `#1A1A1A` (26, 26, 26)
- **Luxury Charcoal:** `#2D2D2D` (45, 45, 45)
- **Usage:** Footer, dark sections, contrast elements

### Text Colors

#### Asper Ink (Dark Charcoal)
Primary text color
- **Dark Charcoal:** `#333333` (51, 51, 51)
- **Foreground:** HSL variant `hsl(var(--foreground))`
- **Usage:** Body text, headings, descriptions

---

## 🖋️ Typography

### Font Families

#### Display / Headings
**Playfair Display** - Elegant serif for luxury feel
- **Usage:** H1, H2, hero text, product names
- **Weights:** 400 (Regular), 600 (SemiBold), 700 (Bold)
- **CSS:** `font-family: 'Playfair Display', serif;`
- **Tailwind:** `font-display`

#### Body Text
**Inter** and **Lato** - Modern, readable sans-serif
- **Usage:** Paragraphs, UI text, descriptions
- **Weights:** 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **CSS:** `font-family: 'Inter', 'Lato', sans-serif;`
- **Tailwind:** `font-body`

#### Script / Decorative
**Great Vibes** - Elegant script for special touches
- **Usage:** Taglines, special callouts, decorative elements
- **Weights:** 400 (Regular)
- **CSS:** `font-family: 'Great Vibes', cursive;`
- **Tailwind:** `font-script`

#### Arabic Typography
**Tajawal** - Clean, modern Arabic font
- **Usage:** All Arabic text when `language === 'ar'`
- **Weights:** 400 (Regular), 500 (Medium), 700 (Bold)
- **Note:** Automatically applied with RTL layout

### Type Scale

| Element | Font Size | Line Height | Weight | Font Family |
|---------|-----------|-------------|--------|-------------|
| H1 | 3rem (48px) | 1.2 | 700 | Playfair Display |
| H2 | 2.5rem (40px) | 1.25 | 600 | Playfair Display |
| H3 | 2rem (32px) | 1.3 | 600 | Playfair Display |
| H4 | 1.5rem (24px) | 1.4 | 600 | Playfair Display |
| Body Large | 1.125rem (18px) | 1.6 | 400 | Inter |
| Body | 1rem (16px) | 1.6 | 400 | Inter |
| Body Small | 0.875rem (14px) | 1.5 | 400 | Inter |
| Caption | 0.75rem (12px) | 1.4 | 400 | Inter |

---

## 📐 Spacing & Layout

### Container
- **Max Width:** 1400px (`2xl` breakpoint)
- **Padding:** 2rem (32px)
- **Center:** Yes

### Grid System
Follow Tailwind's 12-column grid:
- Mobile: 1 column
- Tablet (`sm`): 2 columns
- Desktop (`md`): 3-4 columns
- Large (`lg`): 4+ columns

### Spacing Scale
Use Tailwind's default spacing scale (0.25rem increments):
- `space-1` = 0.25rem (4px)
- `space-2` = 0.5rem (8px)
- `space-4` = 1rem (16px)
- `space-6` = 1.5rem (24px)
- `space-8` = 2rem (32px)
- `space-12` = 3rem (48px)
- `space-16` = 4rem (64px)

---

## 🎭 Shadows & Elevation

### Gold Shadows
Luxury shadow system using gold tones:

| Token | Usage | Example |
|-------|-------|---------|
| `shadow-gold-sm` | Subtle elevation | Product cards (default) |
| `shadow-gold-md` | Medium elevation | Dropdowns, tooltips |
| `shadow-gold-lg` | High elevation | Modals, drawers |
| `shadow-gold-xl` | Extra high | Featured products |
| `shadow-gold-2xl` | Maximum | Hero sections |
| `shadow-gold-hover` | Hover state | Product cards (hover) |
| `shadow-gold-badge` | Badges/pills | "New", "Sale", "Organic" |
| `shadow-gold-button` | Buttons | Primary CTAs |

**Implementation Example:**
```tsx
<div className="shadow-gold-md hover:shadow-gold-hover transition-shadow duration-300">
  Product Card
</div>
```

---

## 🔘 Components

### Buttons

#### Primary Button (Gold)
- **Background:** `bg-gold-300` or `bg-gold`
- **Text:** `text-luxury-black` or `text-white`
- **Shadow:** `shadow-gold-button hover:shadow-gold-button-hover`
- **Border Radius:** `rounded-md` (8px)
- **Padding:** `px-6 py-3`

#### Secondary Button (Maroon)
- **Background:** `bg-maroon` or `bg-burgundy`
- **Text:** `text-white`
- **Border:** `border border-maroon`
- **Hover:** `hover:bg-maroon-dark`

#### Ghost Button (Outline)
- **Background:** `bg-transparent`
- **Text:** `text-maroon` or `text-gold`
- **Border:** `border border-current`
- **Hover:** `hover:bg-maroon/10`

### Cards

#### Product Card
- **Background:** `bg-white` or `bg-cream`
- **Shadow:** `shadow-gold-sm hover:shadow-gold-hover`
- **Border Radius:** `rounded-lg` (12px)
- **Padding:** `p-4` or `p-6`
- **Transition:** `transition-all duration-300`

#### Collection Card
- **Background:** Gradient or image overlay
- **Shadow:** `shadow-gold-md`
- **Text:** White text on dark overlay
- **Hover:** Scale + shadow change

### Badges

#### Organic Badge
- **Background:** `bg-warm-brown` or `bg-rose`
- **Text:** `text-white`
- **Shadow:** `shadow-gold-badge`
- **Border Radius:** `rounded-full`
- **Padding:** `px-3 py-1`

#### Sale/New Badge
- **Background:** `bg-gold-300`
- **Text:** `text-luxury-black`
- **Shadow:** `shadow-gold-badge-hover`
- **Animation:** `animate-pulse` (optional)

---

## ✨ Animations

### Keyframes

#### Fade Up
Entrance animation from bottom
- **Duration:** 0.8s
- **Easing:** ease-out
- **Usage:** Hero sections, product reveals
- **CSS:** `animate-fade-up`

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

#### Fade In
Simple opacity fade
- **Duration:** 0.6s
- **Easing:** ease-out
- **Usage:** Images, content blocks
- **CSS:** `animate-fade-in`

#### Scale In
Scale from 95% to 100%
- **Duration:** 0.5s
- **Easing:** ease-out
- **Usage:** Modals, popovers, cards
- **CSS:** `animate-scale-in`

### Transitions

#### Standard Duration
- **Default:** 300ms (`duration-300`)
- **Slow:** 400ms (`duration-400`)
- **Fast:** 200ms (`duration-200`)

#### Easing
- **Default:** ease-out (most common)
- **Smooth:** ease-in-out (for reversible animations)

**Example:**
```tsx
<div className="transition-all duration-300 ease-out hover:scale-105">
  Hover me
</div>
```

---

## 📱 Responsive Design

### Breakpoints (Tailwind defaults)

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktops |
| `xl` | 1280px | Large desktops |
| `2xl` | 1536px | Extra large |

### Mobile-First Approach
All base styles are mobile by default. Use breakpoint prefixes to override:

```tsx
<div className="text-lg md:text-xl lg:text-2xl">
  Responsive Text
</div>
```

### RTL (Right-to-Left) Support
For Arabic language (`language === 'ar'`):
- Use `rtl:` variants for directional styles
- Tailwind automatically flips flex directions, margins, padding
- Custom RTL classes when needed:

```tsx
<div className="ml-4 rtl:mr-4 rtl:ml-0">
  Text with margin (LTR: left, RTL: right)
</div>
```

---

## 🌍 Accessibility

### Color Contrast
All text meets WCAG AA standards:
- **Normal text:** 4.5:1 minimum
- **Large text:** 3:1 minimum
- **Dark Charcoal on Soft Ivory:** ✅ Pass
- **White on Maroon:** ✅ Pass
- **Luxury Black on Gold:** ✅ Pass

### Focus States
All interactive elements have visible focus:
```tsx
<button className="focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2">
  Accessible Button
</button>
```

### Semantic HTML
- Use proper heading hierarchy (H1 → H2 → H3)
- Use `<nav>`, `<main>`, `<footer>` for landmarks
- Add `aria-label` for icon buttons
- Include alt text for all images

---

## 🎨 Design Tokens Reference

### CSS Variables (in `index.css`)

```css
:root {
  /* Colors */
  --maroon: 348 100% 25%; /* #800020 */
  --gold: 43 70% 55%; /* #D4AF37 */
  --shiny-gold: 43 66% 47%; /* #C5A028 */
  --soft-ivory: 240 100% 98%; /* #F8F8FF */
  --dark-charcoal: 0 0% 20%; /* #333333 */
  
  /* Shadows */
  --shadow-gold-sm: 0 2px 8px rgba(212, 175, 55, 0.15);
  --shadow-gold-hover: 0 8px 32px rgba(212, 175, 55, 0.4);
}
```

### Tailwind Config

See `tailwind.config.ts` for full configuration.

**Quick Reference:**
- **Colors:** `maroon`, `gold`, `burgundy`, `cream`, `rose`, `warm-brown`, `soft-ivory`, `dark-charcoal`, `luxury-black`
- **Fonts:** `font-display`, `font-body`, `font-script`
- **Shadows:** `shadow-gold-sm` to `shadow-gold-2xl`, plus hover variants
- **Animations:** `animate-fade-up`, `animate-fade-in`, `animate-scale-in`

---

## 📋 Usage Examples

### Product Card (Complete)

```tsx
<div className="bg-white rounded-lg p-6 shadow-gold-sm hover:shadow-gold-hover transition-all duration-300 group">
  <div className="relative overflow-hidden rounded-md mb-4">
    <img 
      src={product.image} 
      alt={product.title}
      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
    />
    {product.isOrganic && (
      <span className="absolute top-2 right-2 bg-warm-brown text-white px-3 py-1 rounded-full text-xs shadow-gold-badge">
        Organic
      </span>
    )}
  </div>
  <h3 className="font-display text-xl font-semibold text-dark-charcoal mb-2">
    {product.title}
  </h3>
  <p className="text-maroon font-body text-lg mb-4">
    ${product.price}
  </p>
  <button className="w-full bg-gold-300 text-luxury-black px-6 py-3 rounded-md shadow-gold-button hover:shadow-gold-button-hover transition-all duration-300">
    Add to Cart
  </button>
</div>
```

### Hero Section (Complete)

```tsx
<section className="relative bg-gradient-to-br from-soft-ivory to-cream py-20 px-4">
  <div className="container mx-auto max-w-7xl">
    <h1 className="font-display text-5xl md:text-6xl font-bold text-maroon mb-6 animate-fade-up">
      Radiant Beauty
    </h1>
    <p className="font-body text-xl text-dark-charcoal mb-8 max-w-2xl animate-fade-up" style={{animationDelay: '0.2s'}}>
      Premium organic skincare for your natural glow
    </p>
    <button className="bg-gold-300 text-luxury-black px-8 py-4 rounded-md shadow-gold-button hover:shadow-gold-button-hover transition-all duration-300 animate-fade-up" style={{animationDelay: '0.4s'}}>
      Shop Now
    </button>
  </div>
</section>
```

---

## 🔄 Updates & Versioning

This design system is actively maintained. When adding new tokens or patterns:

1. **Document here first** - Before implementing
2. **Update Tailwind config** - Add to `tailwind.config.ts`
3. **Test responsiveness** - Mobile, tablet, desktop
4. **Test RTL** - Arabic language support
5. **Check accessibility** - Color contrast, focus states
6. **Commit with message** - Reference this doc in commit

---

## 📚 Related Files

- **`tailwind.config.ts`** - Full Tailwind configuration
- **`src/index.css`** - CSS variables and global styles
- **`README.md`** - Project overview
- **`APPLY_TO_MAIN_SITE.md`** - Deployment checklist

---

*Last updated: February 2026*
*Design System Version: 1.0*
