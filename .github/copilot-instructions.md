# Copilot instructions for Asper-Beauty-Shop

Purpose: Give AI coding agents the minimum context to be immediately productive
in this repo.

## Brand Identity & Core Values

**Asper Beauty Shop** - Premium organic and natural beauty products

- **Core Value**: "Radiant Beauty" — empowering confidence through high-quality,
  natural ingredients
- **Brand Promise**: Luxury skincare and beauty essentials for the modern
  customer
- **Design Philosophy**: Elegant, sophisticated, and trustworthy with warm,
  luxurious aesthetics
- **Target Audience**: Beauty-conscious customers seeking premium
  organic/natural products
- **Contact**: asperpharma@gmail.com | +962 79 065 6666 | Amman, Jordan

## Quick Start

- **Dev**: `npm run dev` (port 8080) • **Build**: `npm run build` • **Preview**:
  `npm run preview` • **Lint**: `npm run lint`
- **Stack**: React 18 + TypeScript + Vite, Tailwind CSS, shadcn/ui (Radix
  primitives), Zustand, TanStack Query
- **Production**: https://www.asperbeautyshop.com (custom domain)
- **Lovable Dev**: https://asperbeautyshop.lovable.app (integrated with Lovable
  platform for hot reload)

## Coding Standards

**TypeScript**:

- Mode: `strict: false` (relaxed for Lovable compatibility)
- Use TypeScript for type safety but `@typescript-eslint/no-unused-vars` is off
- Always use interfaces for object shapes, types for unions/intersections
- Import types from `@/components/ui/*` for shadcn/ui components

**Components**:

- **Always** use functional components (no class components)
- Use Lucide-React for iconography (consistent icon library)
- Prefer `'use client'` directive only when necessary (event handlers, useState,
  useEffect)
- Default to server-compatible patterns when possible (though this is a SPA, not
  Next.js)
- Follow shadcn/ui patterns: composition over configuration

**Styling**:

- Tailwind CSS utility-first approach (no inline styles)
- Use design tokens from `tailwind.config.ts` (maroon, gold, cream, burgundy
  colors)
- Mobile-first responsive design: use `sm:`, `md:`, `lg:`, `xl:` breakpoints
- RTL support: use `rtl:` variants for Arabic language
- Animations: use predefined Tailwind animations (fade-up, fade-in, scale-in)

**State Management**:

- Zustand stores for global state (cart, wishlist) with localStorage persistence
- useState/useEffect for local component state
- TanStack Query provider is set up but not actively used (prefer plain fetch in
  useEffect)
- Context API for language switching (EN/AR)

**Naming Conventions**:

- Components: PascalCase (e.g., `ProductCard.tsx`, `BeautyAssistant.tsx`)
- Hooks: useX naming (e.g., `useAuth`, `useLanguage`, `useMobile`)
- Utils/Helpers: camelCase (e.g., `categorizeProduct`, `translateTitle`)
- Constants: UPPER_SNAKE_CASE (if any)
- Files: Match component name for components, camelCase for utilities

## Architecture (Big Picture)

**Frontend-only SPA** that talks to:

1. **Shopify Storefront API** (`lovable-project-milns.myshopify.com`) — product
   catalog, checkout
2. **Supabase** (`rgehleqcubtmcwyipyvi.supabase.co`) — auth, serverless
   functions (beauty-assistant AI, bulk-product-upload)

**Provider hierarchy** (see `src/App.tsx`):

```
QueryClientProvider → LanguageProvider → TooltipProvider → BrowserRouter → Routes
```

**Data flow**: Pages call `src/lib/shopify.ts` functions (fetchProducts,
fetchProductsPaginated, searchProducts, createStorefrontCheckout) which hit
Shopify GraphQL. Products are categorized via `src/lib/categoryMapping.ts` (maps
Shopify products to 6 primary collections: skin-care, hair-care, make-up,
body-care, fragrances, tools-devices). Pages use plain useEffect/useState (no
TanStack Query in practice despite provider setup).

**State management**: Zustand stores with localStorage persistence:

- `src/stores/cartStore.ts` — shopping cart (items, checkout URL, quantities)
- `src/stores/wishlistStore.ts` — saved products

## Key Patterns & Conventions

**Routing**: `src/pages/*` map to routes via React Router v6 (see `src/App.tsx`
for all routes). Examples: `/`, `/product/:handle`, `/collections/:slug`,
`/brands`.

**Components**:

- **Pages**: `src/pages/*` (Index, Collections, ProductDetail, Brands, Auth,
  Account, etc.)
- **Reusable UI**: `src/components/*` (Header, Footer, ProductCard, CartDrawer,
  BeautyAssistant, etc.)
- **Design system**: `src/components/ui/*` (shadcn/ui primitives — Button,
  Dialog, Drawer, Toast, etc.)
- **Scripts**: `scripts/*` — TypeScript utilities (audit-categories.ts for
  product analysis, data processing tools)

**Hooks**: `src/hooks/` — custom hooks use `useX` naming (useAuth, useToast,
useMobile, useScrollAnimation).

**i18n (bilingual EN/AR)**:

- Language context: `src/contexts/LanguageContext.tsx` provides
  `{ language, setLanguage, t }` hook.
- Persisted in localStorage as `'asper-language'`.
- RTL layout auto-applied when `language === 'ar'` (CSS via Tailwind `rtl:`
  variants).
- Product titles/descriptions translated via `src/lib/productUtils.ts`
  (translateTitle, translateDescription — maps English terms to Arabic).

**Design tokens** (Tailwind config):

- **Primary Colors**: `--maroon` (#800020), `--burgundy`, `--gold` (D4AF37)
- **Accent Colors**: `--shiny-gold` (#C5A028), `--rose`, `--warm-brown`
- **Background**: `--soft-ivory` (#F8F8FF), `--cream`, `--luxury-black`
  (#1A1A1A)
- **Text**: `--dark-charcoal` (#333333), `--foreground`
- **Fonts**: Playfair Display (headings/display), Inter/Lato (body), Great Vibes
  (script), Tajawal (Arabic)
- **Shadows**: Use gold-* shadow utilities (gold-sm, gold-md, gold-hover, etc.)
  for luxury feel
- **Animations**: fade-up (0.8s), fade-in (0.6s), scale-in (0.5s)

## Integration Points

**Shopify** (`src/lib/shopify.ts`):

- API version: `2025-07`
- Storefront token: public read-only (safe for client-side)
- Functions: fetchProducts, fetchProductsPaginated (cursor-based for large
  catalogs), searchProducts (sanitizes input to prevent GraphQL injection),
  fetchProductByHandle, createStorefrontCheckout (returns Shopify-hosted
  checkout URL)
- All products are fetched via GraphQL queries; no REST API usage.

**Supabase** (`supabase/functions/`, `src/integrations/supabase/`):

- **Project URL**: Use environment variable `VITE_SUPABASE_URL` (currently:
  rgehleqcubtmcwyipyvi.supabase.co)
- **Auth Callback**: `https://rgehleqcubtmcwyipyvi.supabase.co/auth/v1/callback`
  (project-specific)
- Functions: `beauty-assistant` (AI chatbot via Lovable AI Gateway at
  `ai.gateway.lovable.dev` using Gemini 2.5 Flash), `bulk-product-upload` (admin
  tool)
- Config: `supabase/config.toml` (verify_jwt = false for functions)
- Client: `src/integrations/supabase/client.ts` (auto-refresh sessions,
  persistent auth via localStorage)
- **Database**: Follow relational best practices; prioritize Row-Level Security
  (RLS) for all tables
- **Security**: Never hardcode secrets; use environment variables
  (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY)

**Product categorization** (`src/lib/categoryMapping.ts`):

- Maps products to 6 collections via keyword matching on
  title/productType/vendor.
- Categories: skin-care, hair-care, make-up, body-care, fragrances,
  tools-devices.
- Each category has slug, title, titleAr, description, descriptionAr, keywords
  array.

**Lovable integration** (`vite.config.ts`, `lovable.config.json`):

- Uses `lovable-tagger` plugin for hot reload component tagging.
- Dev server on port 8080 with IPv6 (`host: "::"`).
- Custom domain: www.asperbeautyshop.com
- Lovable development URL: asperbeautyshop.lovable.app
- SPA redirects configured in `public/_redirects`
- Environment variables in `.env` (dev) and `.env.production` (prod)

## Common Tasks

**Add a new component**:

1. Create file in `src/components/` (or `src/components/ui/` for design-system
   primitives)
2. Follow shadcn/ui patterns for UI components (import from `@/components/ui/*`)
3. Use `useLanguage()` hook for bilingual support

**Fetch/display products**:

1. Import functions from `src/lib/shopify.ts` (fetchProducts,
   fetchProductsPaginated, searchProducts)
2. Call in useEffect, store in useState (no TanStack Query hooks used in
   practice)
3. Map products to `<ProductCard>` components
4. Use `categorizeProduct()` from `src/lib/categoryMapping.ts` to filter by
   collection

**Add to cart**:

1. Import `useCartStore()` from `src/stores/cartStore.ts`
2. Call
   `addItem({ product, variantId, variantTitle, price, quantity, selectedOptions })`
3. Cart auto-persists to localStorage; drawer updates via Zustand re-render

**Checkout flow**:

1. User clicks "Checkout" in CartDrawer
2. Calls `cartStore.createCheckout()` which invokes `createStorefrontCheckout()`
   from `src/lib/shopify.ts`
3. Redirects to Shopify-hosted checkout URL
   (`window.location.href = checkoutUrl`)

**Add serverless function**:

1. Create folder in `supabase/functions/` (e.g.
   `supabase/functions/my-function/`)
2. Add entry in `supabase/config.toml` (set `verify_jwt = false` if public)
3. Deploy via Supabase CLI: `supabase functions deploy my-function`

## Developer Workflows

**Local dev**: `npm install` → `npm run dev` (Vite dev server on
http://localhost:8080) **Lint**: `npm run lint` (ESLint with React hooks plugin,
TypeScript ESLint) **Build**: `npm run build` (production) → `npm run preview`
(preview prod bundle locally) **Scripts**: `npx tsx scripts/<script-name>.ts` —
run TypeScript utilities (category auditing, data processing) **Deno**:
`deno lint` (additional linting for non-src files) — see `deno.json` config
**CI/CD**: GitHub Actions on push/PR (`.github/workflows/deno.yml`) runs Deno
lint and test **Verify changes**: Run build and preview to validate (no unit
tests in repo)

## Agent Workflow & Best Practices

**Issue Scoping**:

- **Always** analyze "Acceptance Criteria" in GitHub Issues first before
  starting work
- Break down complex issues into smaller, testable tasks
- Ask clarifying questions if requirements are ambiguous
- Verify the scope aligns with brand values (organic, natural, premium quality)

**Pull Request Guidelines**:

- **PR Title**: Clear, action-oriented (e.g., "Add product filtering by
  category", "Fix mobile menu RTL support")
- **PR Description**: Must include:
  1. **Summary**: Brief overview of changes and linked issue(s)
  2. **Changes Made**: Bulleted list of modified files with explanation
  3. **Testing Plan**: Steps to verify the changes work (build, preview, manual
     testing)
  4. **Screenshots**: For UI changes, include before/after screenshots
  5. **Impact**: Note any breaking changes or performance implications
- Use the PR template in `.github/PULL_REQUEST_TEMPLATE.md`
- Keep PRs focused and atomic (one feature/fix per PR)

**Iteration & Feedback**:

- Respond to PR comments by refining existing code, not proposing new
  architectures
- Preserve working functionality unless explicitly requested to change
- When in doubt, ask for clarification rather than making assumptions
- Update PR description as scope evolves

**Code Review Standards**:

- Self-review before requesting review (check linting, build, preview)
- Ensure code follows project conventions (component structure, naming, styling)
- Verify bilingual support (EN/AR) for user-facing text
- Check mobile responsiveness (mobile-first design)
- Validate performance (optimize images with `<OptimizedImage>` component, lazy
  loading)

**Security Best Practices**:

- **Never** hardcode API keys, tokens, or secrets in code
- Reference environment variables: `import.meta.env.VITE_*`
- Sanitize user inputs (e.g., search queries in `shopify.ts`)
- Use HTTPS for all external requests
- Follow Supabase RLS patterns for data access control
- Validate email addresses and phone numbers before processing
- Report security vulnerabilities to asperpharma@gmail.com (see SECURITY.md)

**Performance & SEO**:

- **Images**: Use `<OptimizedImage>` component (see
  `src/components/OptimizedImage.tsx`)
- **Lazy Loading**: Load heavy components on demand (React.lazy, Suspense)
- **Meta Tags**: Add descriptive titles and OpenGraph tags for pages (even in
  SPA context for social sharing)
- **SEO Keywords**: Use organic skincare, natural beauty, premium cosmetics
  terminology
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation support
- **Mobile-First**: Design for mobile screens first, then scale up

**MCP & Testing**:

- If MCP server is configured (e.g., Playwright for E2E), utilize it to validate
  UI changes
- Manual testing workflow: `npm run build` → `npm run preview` → test in browser
- Test bilingual mode: toggle language in UI, verify RTL layout for Arabic
- Test cart persistence: add items, refresh page, verify cart state retained
- Cross-browser testing recommended (Chrome, Safari, Firefox) for production
  changes

## Safety Notes

- **No unit tests**: Validate via build + preview + manual testing (test suite
  may be added in future)
- **Shopify Storefront token**: Public read-only (safe for client-side; no write
  access)
- **Lovable integration**: Changes may sync to hosted preview at
  asperbeautyshop.lovable.app
- **GraphQL injection**: Search input sanitized in `shopify.ts` to prevent
  injection attacks
- **Image optimization**: Use `<OptimizedImage>` component for performance (lazy
  loading, responsive)
- **Environment variables**: Never commit `.env` files; use `.env.example` for
  reference
- **TypeScript strict mode**: Currently `strict: false` for Lovable
  compatibility; avoid `any` when possible
- **Dependency updates**: Test thoroughly after updating packages (especially
  Shopify API version)

## Common Pitfalls to Avoid

- **Don't** use Next.js patterns (this is a Vite SPA, not Next.js App Router)
- **Don't** commit `node_modules`, `dist`, or `.env` files
- **Don't** hardcode English-only text in components (use `useLanguage()` hook
  for i18n)
- **Don't** ignore RTL layout for Arabic (`rtl:` Tailwind variants required)
- **Don't** bypass Shopify checkout (always redirect to Shopify-hosted checkout
  URL)
- **Don't** create custom backend endpoints (use Supabase Functions or Shopify
  API)
- **Don't** modify working test/build scripts unless fixing a specific issue
- **Don't** remove or alter existing accessibility features (ARIA, semantic
  HTML)

For more detail on a specific area (routing, checkout flow, Supabase functions,
category mapping), ask and I'll provide concrete file pointers and examples.
