# Vercel Deployment Guide for Asper Beauty Shop

Complete guide for deploying the Asper Beauty Shop application to Vercel.

## 📋 Prerequisites

- Vercel account (free tier available at <https://vercel.com>)
- GitHub repository access
- Environment variables from `.env.production`

## 🚀 Quick Start

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Login to Vercel**
   - Go to <https://vercel.com>
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Choose `asperpharma/Asper-Beauty-Shop-aff332b2`

3. **Configure Project**
   - Framework Preset: **Vite** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Add Environment Variables**
   
   Add these environment variables in the "Environment Variables" section:

   ```
   VITE_SUPABASE_PROJECT_ID=rgehleqcubtmcwyipyvi
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnZWhsZXFjdWJ0bWN3eWlweXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NDM5MDEsImV4cCI6MjA4MzQxOTkwMX0.8BEpVzIvWc2do2v8v3pOP3txcTs52HsM4F7KVavlQNU
   VITE_SUPABASE_URL=https://rgehleqcubtmcwyipyvi.supabase.co
   VITE_SITE_URL=https://your-project.vercel.app
   VITE_SHOPIFY_STORE_DOMAIN=lovable-project-milns.myshopify.com
   VITE_SHOPIFY_STOREFRONT_TOKEN=9daedc472c5910e742ec88bdaad108e2
   VITE_SHOPIFY_API_VERSION=2025-07
   ```

   **Important**: Update `VITE_SITE_URL` with your actual Vercel deployment URL after first deployment.

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (usually 1-2 minutes)
   - Your site will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # From project root
   cd /path/to/Asper-Beauty-Shop-aff332b2
   
   # Production deployment
   vercel --prod
   
   # Follow prompts to configure project
   ```

4. **Set Environment Variables via CLI**
   ```bash
   vercel env add VITE_SUPABASE_PROJECT_ID production
   vercel env add VITE_SUPABASE_PUBLISHABLE_KEY production
   vercel env add VITE_SUPABASE_URL production
   vercel env add VITE_SITE_URL production
   vercel env add VITE_SHOPIFY_STORE_DOMAIN production
   vercel env add VITE_SHOPIFY_STOREFRONT_TOKEN production
   vercel env add VITE_SHOPIFY_API_VERSION production
   ```

## ⚙️ Configuration Files

The repository includes Vercel-specific configuration:

### `vercel.json`

Configures build settings, SPA routing, caching, and security headers:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Key Features**:
- ✅ SPA routing (all routes redirect to index.html)
- ✅ Asset caching (1 year for static assets)
- ✅ Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- ✅ Automatic index.html redirect

### `.vercelignore`

Excludes unnecessary files from deployment to reduce bundle size:
- `node_modules/`
- Build artifacts (`dist/`, `.vite/`)
- Environment files (`.env`, `.env.local`)
- Development tools and documentation

## 🔄 Automatic Deployments

Once connected to GitHub, Vercel automatically deploys:

- **Production**: Every push to `main` branch
- **Preview**: Every pull request gets a unique preview URL
- **Rollback**: Previous deployments available in dashboard

### Deployment Flow

```
GitHub Push → Vercel Webhook → Build → Deploy → Live
     ↓              ↓           ↓        ↓        ↓
   main         Triggered    npm run  Optimize   CDN
   branch       instantly     build    & Cache  Update
```

## 🌐 Custom Domain Setup

### Add Custom Domain

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Click "Add Domain"
4. Enter your domain (e.g., `www.asperbeautyshop.com`)
5. Follow DNS configuration instructions

### DNS Configuration

**For www subdomain** (recommended):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**For apex domain**:
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

### SSL Certificate

- ✅ Automatic SSL provisioning (Let's Encrypt)
- ✅ Auto-renewal
- ✅ HTTPS enforced by default

## 📊 Monitoring & Analytics

### Vercel Analytics

Enable analytics in project settings:
1. Go to "Analytics" tab
2. Click "Enable Analytics"
3. View real-time performance metrics

### Performance Monitoring

- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Page load times
- Conversion tracking

## 🔍 Troubleshooting

### Build Fails

**Issue**: Build fails with "Module not found" error

**Solution**:
1. Check `package.json` dependencies
2. Clear Vercel build cache: Settings → General → Reset Build Cache
3. Verify Node.js version (18.x recommended)
4. Run `npm install` locally to test

**Issue**: Environment variables not loading

**Solution**:
1. Verify all env vars are set in Vercel dashboard
2. Redeploy after adding new variables
3. Check variable names match exactly (case-sensitive)

### Routing Issues

**Issue**: Direct navigation to routes shows 404

**Solution**:
- Verify `vercel.json` contains rewrites configuration
- Check that `dist/index.html` exists after build
- Ensure React Router is properly configured

**Issue**: Assets not loading

**Solution**:
1. Check asset paths in build output
2. Verify `dist/assets/` directory exists
3. Check browser console for 404 errors
4. Ensure base path in `vite.config.ts` is correct

### API Connection Issues

**Issue**: Shopify/Supabase API calls fail

**Solution**:
1. Verify environment variables in Vercel
2. Check CORS settings in Supabase dashboard
3. Test API endpoints using browser DevTools
4. Ensure `VITE_SITE_URL` matches deployed URL

## 🎯 Best Practices

### Performance

- ✅ Enable Edge Caching for static assets
- ✅ Use Image Optimization (Vercel Image component)
- ✅ Enable Compression (Gzip/Brotli)
- ✅ Implement code splitting
- ✅ Lazy load components

### Security

- ✅ Never commit `.env` files
- ✅ Use environment variables for all secrets
- ✅ Enable security headers (configured in `vercel.json`)
- ✅ Use HTTPS only (automatic on Vercel)
- ✅ Implement CORS policies

### Deployment

- ✅ Test builds locally before deploying
- ✅ Use preview deployments for testing
- ✅ Monitor build times
- ✅ Set up Slack/Discord notifications
- ✅ Enable automatic preview cleanup

## 📈 Next Steps

After successful deployment:

1. **Verify Functionality**
   - [ ] Test all main pages
   - [ ] Verify Shopify product loading
   - [ ] Test shopping cart and checkout
   - [ ] Confirm authentication works
   - [ ] Test Beauty Assistant AI chatbot
   - [ ] Verify mobile responsiveness
   - [ ] Test Arabic (RTL) language mode

2. **Configure Monitoring**
   - [ ] Enable Vercel Analytics
   - [ ] Set up error tracking (e.g., Sentry)
   - [ ] Configure uptime monitoring
   - [ ] Add Google Analytics/Tag Manager

3. **SEO Setup**
   - [ ] Submit sitemap to Google Search Console
   - [ ] Add site to Bing Webmaster Tools
   - [ ] Configure robots.txt
   - [ ] Set up structured data
   - [ ] Verify Open Graph tags

4. **Performance Optimization**
   - [ ] Run Lighthouse audit
   - [ ] Optimize images further
   - [ ] Enable ISR/SSG if needed
   - [ ] Configure CDN caching rules

## 📞 Support

- **Vercel Documentation**: <https://vercel.com/docs>
- **Vercel Support**: <https://vercel.com/support>
- **Community Forum**: <https://github.com/vercel/vercel/discussions>
- **Project Contact**: asperpharma@gmail.com

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Deployment Documentation](https://vercel.com/docs/deployments/overview)
- [Environment Variables Guide](https://vercel.com/docs/environment-variables)
- [Custom Domains Guide](https://vercel.com/docs/custom-domains)
- [Build Configuration](https://vercel.com/docs/build-step)

---

**Ready to deploy?** Follow the Quick Start guide above or refer to the full [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for more details.
