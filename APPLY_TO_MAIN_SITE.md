# 🚀 Apply to Main Site - Deployment Checklist

**Target Site**: www.asperbeautyshop.com  
**Last Updated**: February 26, 2026  
**Purpose**: Comprehensive checklist for deploying updates to production

---

## 📋 Pre-Deployment Checklist

### 1. Environment Configuration

- [ ] Verify `env.main-site.example` is up to date with required variables
- [ ] Confirm production environment variables in Lovable dashboard:
  - [ ] `VITE_SUPABASE_PROJECT_ID`
  - [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SITE_URL` (https://www.asperbeautyshop.com)
  - [ ] `VITE_LOVABLE_URL` (https://asperbeautyshop.lovable.app)
  - [ ] `VITE_SHOPIFY_STORE_DOMAIN`
  - [ ] `VITE_SHOPIFY_STOREFRONT_TOKEN`
  - [ ] `VITE_SHOPIFY_API_VERSION`
- [ ] Verify `.env.production` file contains correct production values
- [ ] Ensure no secrets or API keys are exposed in client-side code

### 2. Code Quality & Testing

- [ ] Run linting: `npm run lint`
- [ ] Fix any critical linting errors (warnings acceptable if pre-existing)
- [ ] Build successfully: `npm run build`
- [ ] Preview production build locally: `npm run preview`
- [ ] Test locally on port 4173 (preview server)
- [ ] Verify no console errors in browser
- [ ] Check bundle size warnings (acceptable if under 500kb per chunk)

### 3. Social Media Integration Verification

Review [SOCIAL_MEDIA_INTEGRATION.md](./SOCIAL_MEDIA_INTEGRATION.md) for details.

- [ ] **Footer Social Icons** (all pages):
  - [ ] Instagram (@asper.beauty.shop)
  - [ ] Facebook (Asper Beauty Shop)
  - [ ] TikTok (@asper.beauty.shop)
  - [ ] WhatsApp (+962 79 065 6666)
  - [ ] X/Twitter (@asperbeautyshop)
  - [ ] YouTube (Asper Beauty Shop)
  - [ ] LinkedIn (Company Page)
  - [ ] Snapchat (@asperbeautyshop)
  - [ ] Pinterest (Asper Beauty Shop)
- [ ] **Floating Social Sidebar** (desktop only):
  - [ ] Visible on large screens (hidden on mobile)
  - [ ] Slide-out animation on hover working
  - [ ] All 9 platforms present and functional
- [ ] **Contact Page**:
  - [ ] "Follow Us" section displays all platforms
  - [ ] Icons match footer styling
  - [ ] Bilingual labels (EN/AR) working
- [ ] All social links open in new tab (`target="_blank"`)
- [ ] All links have `rel="noopener noreferrer"` for security
- [ ] Hover effects show brand-specific colors
- [ ] Icons are SVG (no image requests)

### 4. Google Merchant Center Setup

- [ ] **Product Feed**:
  - [ ] Verify Shopify products are synced and published
  - [ ] All products have images, prices, descriptions
  - [ ] Product availability status is accurate
  - [ ] Product categories are mapped correctly (see `src/lib/categoryMapping.ts`)
- [ ] **Google Merchant Center Account**:
  - [ ] Account created and verified
  - [ ] Business information complete
  - [ ] Tax and shipping settings configured
  - [ ] Product feed URL configured (if using feed)
  - [ ] Manual product uploads complete (if applicable)
- [ ] **Google Shopping Ads** (optional):
  - [ ] Campaign created in Google Ads
  - [ ] Product groups defined
  - [ ] Bidding strategy set
  - [ ] Budget allocated
- [ ] **Structured Data**:
  - [ ] Product schema markup present (if implemented)
  - [ ] Test with Google Rich Results Test
  - [ ] Verify breadcrumbs and organization schema

### 5. All Pages Verification

Test each page for functionality and appearance:

#### Core Pages
- [ ] **Home (`/`)**: 
  - [ ] Hero section loads with animations
  - [ ] Featured products display correctly
  - [ ] Collections showcase working
  - [ ] Beauty assistant chatbot functional
- [ ] **Product Detail (`/product/:handle`)**:
  - [ ] Product images load
  - [ ] Price displays correctly (JOD)
  - [ ] Variant selector working
  - [ ] Add to cart functionality
  - [ ] Quick view modal
  - [ ] Bilingual content (EN/AR)
- [ ] **Collections (`/collections/:slug`)**:
  - [ ] All 6 collections load: skin-care, hair-care, make-up, body-care, fragrances, tools-devices
  - [ ] Product cards display correctly
  - [ ] Filtering and sorting work
  - [ ] Pagination functional
- [ ] **Brands (`/brands`)**:
  - [ ] Brand list displays
  - [ ] Brand filtering works
  - [ ] Vichy brand page functional (`/brands/vichy`)

#### E-Commerce Pages
- [ ] **Cart (Drawer)**:
  - [ ] Items display correctly
  - [ ] Quantity controls work (+/-)
  - [ ] Remove item functionality
  - [ ] Free shipping progress indicator
  - [ ] Total calculation accurate
  - [ ] Checkout button redirects to Shopify
- [ ] **Wishlist (`/wishlist`)**:
  - [ ] Saved products persist
  - [ ] Remove from wishlist works
  - [ ] Add to cart from wishlist
- [ ] **Best Sellers (`/best-sellers`)**:
  - [ ] Popular products display
  - [ ] Product cards functional

#### Informational Pages
- [ ] **Contact (`/contact`)**:
  - [ ] Contact form functional (if implemented)
  - [ ] Email: asperpharma@gmail.com visible
  - [ ] Phone: +962 79 065 6666 clickable
  - [ ] Address: Amman, Jordan displayed
  - [ ] Social icons present
  - [ ] Map embedded (if implemented)
- [ ] **Philosophy (`/philosophy`)**:
  - [ ] Brand story displays
  - [ ] Luxury design consistent
- [ ] **Shipping (`/shipping`)**:
  - [ ] Shipping policy visible
  - [ ] Delivery information clear
- [ ] **Returns (`/returns`)**:
  - [ ] Return policy displayed
  - [ ] Process explained
- [ ] **Skin Concerns (`/skin-concerns`)**:
  - [ ] Concern categories display
  - [ ] Product recommendations work
- [ ] **Offers (`/offers`)**:
  - [ ] Current promotions display
  - [ ] Discount codes visible (if any)

#### Account & Admin Pages
- [ ] **Auth (`/auth`)**:
  - [ ] Login form functional
  - [ ] Signup form functional
  - [ ] Supabase auth integration working
  - [ ] Session persistence
- [ ] **Account (`/account`)**:
  - [ ] User profile displays
  - [ ] Order history (if implemented)
  - [ ] Logout functionality
- [ ] **Admin Orders (`/admin/orders`)**:
  - [ ] Protected by RequireAdmin guard
  - [ ] Orders list displays
  - [ ] Order management functional
- [ ] **Bulk Upload (`/admin/bulk-upload`)**:
  - [ ] Protected by RequireAdmin guard
  - [ ] CSV upload functional
  - [ ] Supabase function connected

#### Utility Pages
- [ ] **Consultation (`/consultation`)**:
  - [ ] Consultation form works
  - [ ] Beauty assistant integration
- [ ] **Tracking (`/tracking`)**:
  - [ ] Order tracking functional (if implemented)
- [ ] **404 Not Found**:
  - [ ] Custom 404 page displays
  - [ ] Navigation back to home works

### 6. Bilingual Support (EN/AR)

- [ ] Language toggle in header works
- [ ] RTL layout applies when Arabic selected
- [ ] All UI text translates properly
- [ ] Product titles translate via `translateTitle()`
- [ ] Product descriptions translate via `translateDescription()`
- [ ] Navigation menu items translate
- [ ] Footer content translates
- [ ] Button labels translate
- [ ] Form labels translate
- [ ] Error messages translate
- [ ] No broken layout in RTL mode
- [ ] Tailwind `rtl:` variants working
- [ ] Language preference persists in localStorage

### 7. Mobile Responsiveness

- [ ] Test on mobile viewport (375px, 414px, 390px)
- [ ] Test on tablet viewport (768px, 1024px)
- [ ] Header responsive and collapsible
- [ ] Product cards stack properly
- [ ] Cart drawer slides from right
- [ ] Forms adapt to small screens
- [ ] Images scale correctly
- [ ] Text remains readable
- [ ] Buttons are touch-friendly (min 44px)
- [ ] Floating socials hidden on mobile
- [ ] Navigation menu hamburger works
- [ ] Modals and dialogs fit screen
- [ ] No horizontal scroll issues

### 8. Performance & SEO

- [ ] **Performance**:
  - [ ] Lighthouse score > 80 (mobile)
  - [ ] Lighthouse score > 90 (desktop)
  - [ ] First Contentful Paint < 2s
  - [ ] Largest Contentful Paint < 3s
  - [ ] Time to Interactive < 4s
  - [ ] Images use WebP format
  - [ ] Images are lazy-loaded
  - [ ] Critical CSS inlined
  - [ ] Bundle size optimized
- [ ] **SEO**:
  - [ ] `robots.txt` accessible: www.asperbeautyshop.com/robots.txt
  - [ ] `sitemap.xml` accessible: www.asperbeautyshop.com/sitemap.xml
  - [ ] Meta tags in `index.html` correct
  - [ ] Open Graph tags for social sharing
  - [ ] Twitter Card meta tags
  - [ ] Canonical URLs point to www.asperbeautyshop.com
  - [ ] Page titles unique and descriptive
  - [ ] Meta descriptions present
  - [ ] Headings hierarchy (h1, h2, h3) logical
  - [ ] Alt text on images
  - [ ] Submit sitemap to Google Search Console
  - [ ] Submit sitemap to Bing Webmaster Tools
- [ ] **PWA**:
  - [ ] `manifest.json` accessible
  - [ ] Service worker registered (if implemented)
  - [ ] Installable on mobile devices
  - [ ] Works offline (if implemented)

### 9. Security Verification

Review [SECURITY_STATUS.md](./SECURITY_STATUS.md) for details.

- [ ] HTTPS enforced (301 redirect)
- [ ] No hardcoded secrets in client code
- [ ] Environment variables use `VITE_` prefix
- [ ] Admin routes protected with auth guards
- [ ] Supabase RLS (Row Level Security) enabled
- [ ] GraphQL injection prevention in search
- [ ] CORS configured properly
- [ ] External links have `rel="noopener noreferrer"`
- [ ] CSP headers set (if configured)
- [ ] No mixed content warnings
- [ ] Dependencies audited: `npm audit`
- [ ] Critical vulnerabilities fixed
- [ ] CodeQL scanning passed (if set up)

### 10. Third-Party Integrations

- [ ] **Shopify Storefront API**:
  - [ ] Products fetch successfully
  - [ ] Pagination works (cursor-based)
  - [ ] Search returns results
  - [ ] Checkout creation succeeds
  - [ ] Redirects to Shopify-hosted checkout
- [ ] **Supabase**:
  - [ ] Auth sessions persist
  - [ ] Functions respond: `beauty-assistant`
  - [ ] Functions respond: `bulk-product-upload`
  - [ ] Database accessible
  - [ ] RLS policies enforced
- [ ] **Beauty Assistant AI**:
  - [ ] Chatbot opens and responds
  - [ ] Lovable AI Gateway connected (ai.gateway.lovable.dev)
  - [ ] Gemini 2.5 Flash model working
  - [ ] Conversation history maintained
  - [ ] Bilingual support (EN/AR)
- [ ] **Analytics** (if configured):
  - [ ] Google Analytics tracking
  - [ ] Facebook Pixel firing
  - [ ] Conversion tracking active

---

## 🚀 Deployment Steps

### Option A: Automatic Deployment (Recommended)

1. **Merge to Main Branch**:
   ```bash
   git checkout main
   git merge <feature-branch>
   git push origin main
   ```

2. **Lovable Auto-Deploy**:
   - Lovable detects push to main
   - Automatically runs `npm run build`
   - Deploys to asperbeautyshop.lovable.app
   - Deploys to www.asperbeautyshop.com (custom domain)
   - Invalidates CDN cache

3. **Monitor Deployment**:
   - Check Lovable dashboard for build status
   - Verify deployment logs for errors
   - Confirm build completed successfully

### Option B: Manual Deployment (Advanced)

1. **Build Locally**:
   ```bash
   npm run build
   npm run preview  # Test locally first
   ```

2. **Deploy via Lovable CLI** (if available):
   ```bash
   lovable deploy --production
   ```

3. **Alternative - Push Trigger**:
   ```bash
   git add .
   git commit -m "Deploy: [brief description]"
   git push origin main
   ```

---

## ✅ Post-Deployment Verification

### Immediate Checks (within 5 minutes)

- [ ] **Site Accessible**:
  - [ ] www.asperbeautyshop.com loads
  - [ ] HTTPS certificate valid
  - [ ] No SSL warnings
  - [ ] Non-www redirects to www
- [ ] **Core Functionality**:
  - [ ] Home page loads completely
  - [ ] Products display on homepage
  - [ ] Navigation menu works
  - [ ] Search functionality active
  - [ ] Cart drawer opens
  - [ ] Language toggle works
- [ ] **No Console Errors**:
  - [ ] Open browser DevTools console
  - [ ] Verify no JavaScript errors
  - [ ] Check network tab for failed requests
  - [ ] Confirm no CORS errors

### Detailed Verification (within 30 minutes)

- [ ] **Test User Flows**:
  - [ ] Browse products → View product → Add to cart → Checkout
  - [ ] Search for product → Filter results → View product
  - [ ] Change language → Verify RTL → Test navigation
  - [ ] Add to wishlist → View wishlist → Remove item
  - [ ] Open beauty assistant → Ask question → Get response
- [ ] **Mobile Testing**:
  - [ ] Open site on physical mobile device
  - [ ] Test portrait and landscape
  - [ ] Verify touch interactions
  - [ ] Check font sizes readable
- [ ] **Cross-Browser Testing**:
  - [ ] Chrome/Edge (Chromium)
  - [ ] Safari (iOS and macOS)
  - [ ] Firefox
  - [ ] Samsung Internet (if Android audience)

### Performance Monitoring (within 24 hours)

- [ ] **Google PageSpeed Insights**:
  - [ ] Test www.asperbeautyshop.com
  - [ ] Mobile score > 80
  - [ ] Desktop score > 90
  - [ ] Core Web Vitals passing
- [ ] **Real User Monitoring**:
  - [ ] Check analytics for traffic
  - [ ] Monitor error rates
  - [ ] Track conversion funnel
  - [ ] Identify slow pages
- [ ] **Uptime Monitoring**:
  - [ ] Set up uptime monitor (UptimeRobot, Pingdom, etc.)
  - [ ] Configure alerts for downtime
  - [ ] Monitor response times

---

## 🔄 Rollback Procedure

If issues are discovered post-deployment:

### Quick Rollback

1. **Revert to Previous Commit**:
   ```bash
   git log --oneline -10  # Find last stable commit
   git revert <commit-hash>
   git push origin main
   ```

2. **Lovable Auto-Redeploys**:
   - Previous version automatically deployed
   - Monitor build completion

### Emergency Rollback

1. **Contact Lovable Support**: support@lovable.dev
2. **Request Manual Rollback**: Specify commit hash or timestamp
3. **Document Issue**: Note what went wrong for future prevention

---

## 📊 Success Metrics

Track these metrics post-deployment:

- **Uptime**: Target 99.9%
- **Page Load Time**: < 3 seconds (average)
- **Error Rate**: < 0.1%
- **Mobile Performance Score**: > 80
- **Desktop Performance Score**: > 90
- **Conversion Rate**: Monitor pre/post deployment
- **User Engagement**: Track bounce rate, session duration
- **Social Traffic**: Monitor clicks from social icons

---

## 📞 Support Contacts

### Technical Support
- **Lovable Platform**: support@lovable.dev
- **Shopify Support**: Via Shopify admin dashboard
- **Supabase Support**: Via Supabase dashboard

### Business Contacts
- **Email**: asperpharma@gmail.com
- **Phone**: +962 79 065 6666
- **Location**: Amman, Jordan

---

## 📝 Deployment Log Template

Document each deployment:

```markdown
### Deployment: [Date] - [Brief Description]

**Deployed By**: [Name]
**Branch**: [Branch Name]
**Commit**: [Commit Hash]

**Changes**:
- [List of changes]

**Pre-Deployment**:
- [x] All checks passed
- [x] Build successful
- [x] Preview tested

**Post-Deployment**:
- [x] Site accessible
- [x] Core functionality verified
- [x] No console errors

**Issues**:
- [Any issues encountered]

**Rollback**: [Yes/No - If yes, explain]
```

---

## 🎯 Related Documentation

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Detailed deployment instructions
- [SOCIAL_MEDIA_INTEGRATION.md](./SOCIAL_MEDIA_INTEGRATION.md) - Social media setup
- [SECURITY_STATUS.md](./SECURITY_STATUS.md) - Security audit results
- [TASK_COMPLETION_CHECKLIST.md](./TASK_COMPLETION_CHECKLIST.md) - Project status
- [README.md](./README.md) - Project overview

---

## ✨ Final Notes

This checklist ensures comprehensive verification before and after deployment to www.asperbeautyshop.com. Always test in the preview environment first, and monitor the site closely for the first 24 hours post-deployment.

**Remember**:
- ✅ Test locally before pushing
- ✅ Verify environment variables
- ✅ Check social media links
- ✅ Test bilingual support (EN/AR)
- ✅ Monitor performance metrics
- ✅ Document each deployment

**Ready to deploy? Let's make Asper Beauty Shop shine! ✨**
