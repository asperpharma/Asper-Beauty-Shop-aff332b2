# Deployment & Domain Setup Guide

**Last Updated**: February 3, 2026
**Status**: ✅ Fully Connected (Lovable & Vercel)

## 🌐 Domain Configuration

### Primary Domain

- **Production URL**: <https://www.asperbeautyshop.com>
- **Lovable Development**: <https://asperbeautyshop.lovable.app>
- **DNS Provider**: Configure CNAME/A records to point to Lovable platform

### DNS Records Setup

To properly connect your custom domain to Lovable:

1. **Add CNAME Record** (Recommended):

   ```
   Type: CNAME
   Name: www
   Value: asperbeautyshop.lovable.app
   TTL: 3600
   ```

2. **Add A Record** (for apex domain):

   ```
   Type: A
   Name: @
   Value: [Lovable IP Address - get from Lovable dashboard]
   TTL: 3600
   ```

3. **Add 301 Redirect** (non-www to www):
   - Handled automatically via `public/_redirects` file

### SSL/TLS

- ✅ Automatic SSL certificates provisioned by Lovable
- ✅ Force HTTPS enabled via redirects
- Certificate auto-renewal enabled

## 🔗 Integration Status

### ✅ Shopify Storefront API

- **Store**: lovable-project-milns.myshopify.com
- **API Version**: 2025-07
- **Storefront Token**: Configured (public read-only)
- **Functions**: fetchProducts, fetchProductsPaginated, searchProducts, createStorefrontCheckout
- **Status**: ✅ Connected and operational

### ✅ Supabase Backend

- **Project ID**: rgehleqcubtmcwyipyvi
- **URL**: <https://rgehleqcubtmcwyipyvi.supabase.co>
- **Auth**: Enabled with session persistence
- **Functions**:
  - `beauty-assistant` - AI chatbot (Lovable AI Gateway + Gemini 2.5 Flash)
  - `bulk-product-upload` - Admin product management
- **Status**: ✅ Connected and operational

### ✅ Lovable Platform Integration

- **Component Tagger**: Enabled for hot reload
- **Dev Server**: Port 8080
- **Build Output**: dist/
- **Status**: ✅ Fully integrated

### ✅ Vercel Platform Integration

- **Framework Detection**: Vite (auto-detected)
- **Build Configuration**: Defined in `vercel.json`
- **SPA Routing**: Configured via rewrites
- **Performance**: Edge caching enabled
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- **Asset Optimization**: Static assets cached for 1 year
- **Status**: ✅ Ready for deployment

## 📦 Deployment Workflow

### Option 1: Automatic Deployment (via Lovable)

1. Push changes to `main` branch
2. Lovable automatically:
   - Detects changes via Git webhook
   - Runs `npm run build`
   - Deploys to asperbeautyshop.lovable.app
   - Deploys to <www.asperbeautyshop.com> (custom domain)
   - Invalidates CDN cache

### Option 2: Deploy to Vercel

**Prerequisites**:
- Vercel account (<https://vercel.com>)
- Vercel CLI installed: `npm i -g vercel`

**Initial Setup**:

1. **Connect Repository**:
   ```bash
   # Install Vercel CLI (if not already installed)
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Link your project (from project root)
   vercel link
   ```

2. **Configure Environment Variables in Vercel Dashboard**:
   - Go to your project settings on Vercel
   - Add all environment variables from `.env.production`:
     - `VITE_SUPABASE_PROJECT_ID`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`
     - `VITE_SUPABASE_URL`
     - `VITE_SITE_URL` (set to your Vercel domain)
     - `VITE_SHOPIFY_STORE_DOMAIN`
     - `VITE_SHOPIFY_STOREFRONT_TOKEN`
     - `VITE_SHOPIFY_API_VERSION`

**Deployment Methods**:

**A. Automatic Deployment (Recommended)**:
   - Connect GitHub repository to Vercel
   - Every push to `main` branch triggers automatic deployment
   - Vercel will automatically detect Vite framework and build settings

**B. Manual Deployment via CLI**:
   ```bash
   # Production deployment
   vercel --prod

   # Preview deployment (for testing)
   vercel
   ```

**C. Deploy from GitHub**:
   1. Import project at <https://vercel.com/new>
   2. Select your GitHub repository
   3. Vercel auto-detects framework (Vite)
   4. Configure environment variables
   5. Click "Deploy"

**Vercel Configuration**:
- Framework: Vite (auto-detected)
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Node.js Version: 18.x (default)

**SPA Routing**:
- All routes redirect to `index.html` via `vercel.json`
- Configured for React Router client-side routing

### Manual Deployment (Local Build)

```bash
# 1. Build production bundle
npm run build

# 2. Preview locally (optional)
npm run preview

# 3A. Deploy via Lovable CLI (if available)
lovable deploy --production

# 3B. Deploy via Vercel CLI
vercel --prod

# Or push to main branch to trigger automatic deployment
git add .
git commit -m "Deploy to production"
git push origin main
```

### Environment Variables

Set in Lovable dashboard under Settings → Environment Variables:

**Required Variables**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SITE_URL` (<https://www.asperbeautyshop.com>)
- `VITE_SHOPIFY_STORE_DOMAIN`
- `VITE_SHOPIFY_STOREFRONT_TOKEN`
- `VITE_SHOPIFY_API_VERSION`

**Local Development**: Uses `.env` file
**Production**: Uses `.env.production` file (deployed with build)

## 🔍 SEO Configuration

### ✅ Sitemap

- Location: `public/sitemap.xml`
- URL: <https://www.asperbeautyshop.com/sitemap.xml>
- Submit to: Google Search Console, Bing Webmaster Tools

### ✅ Robots.txt

- Location: `public/robots.txt`
- URL: <https://www.asperbeautyshop.com/robots.txt>
- Admin routes blocked: `/admin/*`

### ✅ Meta Tags

- Configured in `index.html`
- Open Graph tags for social sharing
- Twitter Card support
- Canonical URLs pointing to <www.asperbeautyshop.com>

### ✅ PWA Configuration

- Manifest: `public/manifest.json`
- Service Worker: Auto-generated by Vite PWA plugin
- Installable on mobile devices

## 🚀 Performance Optimization

### Current Optimizations

- ✅ Vite production build with tree-shaking
- ✅ Image optimization via `<OptimizedImage>` component
- ✅ Code splitting by route
- ✅ Lazy loading for images
- ✅ CDN delivery via Lovable
- ✅ Gzip/Brotli compression enabled

### Recommended Monitoring

- Google PageSpeed Insights
- Lighthouse CI
- Core Web Vitals tracking
- Uptime monitoring

## 🔐 Security

### Current Security Measures

- ✅ HTTPS enforced
- ✅ Supabase RLS (Row Level Security) enabled
- ✅ GraphQL injection prevention in search
- ✅ Public Shopify token (read-only access)
- ✅ Admin routes protected with `RequireAdmin` guard
- ✅ CORS configured properly

## 📊 Analytics Setup

To add analytics to your site:

1. **Google Analytics**:

   ```html
   <!-- Add to index.html before </head> -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   ```

2. **Facebook Pixel**:

   ```html
   <!-- Add Facebook Pixel code to index.html -->
   ```

3. **Environment Variables**:

   ```env
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_FB_PIXEL_ID=XXXXXXXXXX
   ```

## 🛠️ Troubleshooting

### Domain Not Working (Lovable)

1. Check DNS propagation: <https://dnschecker.org>
2. Verify CNAME record points to asperbeautyshop.lovable.app
3. Clear browser cache and cookies
4. Check Lovable dashboard for domain verification status

### Domain Not Working (Vercel)

1. Verify domain is added in Vercel project settings
2. Check DNS records match Vercel requirements
3. Wait for DNS propagation (can take up to 48 hours)
4. Check Vercel dashboard for domain verification status
5. Ensure SSL certificate is provisioned (automatic)

### Build Failures (General)

1. Check environment variables are set correctly
2. Run `npm run lint` to check for errors
3. Test build locally: `npm run build && npm run preview`
4. Check build logs in platform dashboard

### Build Failures (Vercel-specific)

1. Verify all environment variables are set in Vercel dashboard
2. Check Node.js version compatibility (18.x recommended)
3. Review build logs in Vercel deployment details
4. Ensure `vercel.json` configuration is valid
5. Verify `package.json` build script is correct
6. Check for dependency installation issues

### API Integration Issues

1. Verify Supabase project is active
2. Check Shopify store is published
3. Test API endpoints in browser network tab
4. Verify environment variables match `.env.production`
5. Check CORS settings if API calls fail

### Routing Issues (SPA)

1. Verify `vercel.json` contains correct rewrites configuration
2. Test direct URL navigation to sub-routes
3. Check browser console for routing errors
4. Ensure React Router is properly configured

## 📞 Support Contacts

- **Lovable Platform Support**: <support@lovable.dev>
- **Vercel Support**: <https://vercel.com/support>
- **Shopify Support**: Via Shopify admin dashboard
- **Supabase Support**: Via Supabase dashboard
- **Domain Registrar**: Check your DNS provider documentation

## ✅ Post-Deployment Checklist

After deploying to <www.asperbeautyshop.com>:

- [ ] Verify custom domain loads correctly
- [ ] Test HTTPS redirect works
- [ ] Check non-www redirects to www
- [ ] Test all main pages load
- [ ] Verify Shopify product fetching works
- [ ] Test shopping cart and checkout flow
- [ ] Confirm Supabase auth works
- [ ] Test beauty assistant AI chatbot
- [ ] Verify mobile responsiveness
- [ ] Test Arabic (RTL) language switching
- [ ] Submit sitemap to search engines
- [ ] Set up Google Search Console
- [ ] Configure analytics tracking
- [ ] Test PWA installation on mobile
- [ ] Verify social sharing meta tags
- [ ] Check robots.txt is accessible

## 🔄 Continuous Integration

For automated testing and deployment:

1. Consider setting up GitHub Actions
2. Add pre-commit hooks for linting
3. Set up automated E2E testing
4. Configure Lighthouse CI for performance monitoring

---

**Need Help?**
Refer to Lovable documentation: <https://docs.lovable.dev>
Or contact: <support@lovable.dev>
