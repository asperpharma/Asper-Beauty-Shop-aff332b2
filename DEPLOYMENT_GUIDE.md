# Deployment & Domain Setup Guide

**Last Updated**: January 23, 2026
**Status**: ✅ Fully Connected

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

## 📦 Deployment Workflow

### Automatic Deployment (via Lovable)

1. Push changes to `main` branch
2. Lovable automatically:
   - Detects changes via Git webhook
   - Runs `npm run build`
   - Deploys to asperbeautyshop.lovable.app
   - Deploys to <www.asperbeautyshop.com> (custom domain)
   - Invalidates CDN cache

### Manual Deployment

```bash
# 1. Build production bundle
npm run build

# 2. Preview locally (optional)
npm run preview

# 3. Deploy via Lovable CLI (if available)
lovable deploy --production

# Or push to main branch to trigger automatic deployment
git add .
git commit -m "Deploy to production"
git push origin main
```

### Deploying from Your Machine

If Vercel/Netlify/Lovable is connected to the repository, you can deploy directly from your local machine using one of the following methods:

#### Method 1: Direct Push to Main (if you have permissions)

If your GitHub account has write permissions to the `main` branch:

```bash
# Ensure you're on the main branch and up to date
git checkout main
git pull origin main

# Make your changes and commit
git add .
git commit -m "Your deployment message"

# Push directly to main to trigger deployment
git push origin main
```

**Note**: This method requires that `main` is not protected or that your account has bypass permissions.

#### Method 2: Deploy via Feature/Deploy Branch

If you want to use a dedicated deployment branch (e.g., `deploy/asper-updates`):

```bash
# Create or switch to the deployment branch
git checkout -b deploy/asper-updates
# Or if it already exists:
# git checkout deploy/asper-updates
# git pull origin deploy/asper-updates

# Make your changes and commit
git add .
git commit -m "Your deployment message"

# Push to the deployment branch
git push origin deploy/asper-updates
```

This approach is useful when:
- The `main` branch is protected
- You want to stage changes before merging to production
- `deploy/asper-updates` is configured as an allowed branch for deployment

#### Method 3: Merge Locally and Push

If you've been working on the `deploy/asper-updates` branch and want to merge to `main`:

```bash
# Ensure both branches are up to date
git checkout deploy/asper-updates
git pull origin deploy/asper-updates

git checkout main
git pull origin main

# Merge the deployment branch into main
git merge deploy/asper-updates

# Resolve any conflicts if they occur
# Then push to trigger deployment
git push origin main
```

**Use this method only if**:
- The `main` branch is pushable from your account
- You have resolved any merge conflicts locally
- You want to combine multiple commits from the deployment branch

#### Branch Protection Considerations

Depending on your repository settings:

- **Protected Main Branch**: If `main` requires pull request reviews, you'll need to create a PR instead of pushing directly
- **Required Status Checks**: Ensure all CI/CD checks pass before merging
- **Required Reviews**: You may need approval from repository maintainers
- **Allowed Push Branches**: Check if `deploy/asper-updates` or other branches are configured for direct deployment

To check branch protection rules:
1. Go to GitHub repository → Settings → Branches
2. View protection rules for `main` or other branches
3. Verify your account has necessary permissions

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

### Domain Not Working

1. Check DNS propagation: <https://dnschecker.org>
2. Verify CNAME record points to asperbeautyshop.lovable.app
3. Clear browser cache and cookies
4. Check Lovable dashboard for domain verification status

### Build Failures

1. Check environment variables are set correctly
2. Run `npm run lint` to check for errors
3. Test build locally: `npm run build && npm run preview`
4. Check Lovable build logs in dashboard

### API Integration Issues

1. Verify Supabase project is active
2. Check Shopify store is published
3. Test API endpoints in browser network tab
4. Verify environment variables match `.env.production`

## 📞 Support Contacts

- **Lovable Platform Support**: <support@lovable.dev>
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
