# Complete Deployment Instructions

## 🚀 Asper Beauty Shop - Full Deployment Guide

This document provides step-by-step instructions for deploying the Asper Beauty Shop website to production.

---

## Deployment Options

### Option 1: GitHub Pages (Recommended for Quick Start)

GitHub Pages provides free, fast hosting with automatic SSL certificates.

#### Steps to Enable GitHub Pages:

1. **Navigate to Repository Settings:**
   - Go to: https://github.com/asperpharma/Asper-Beauty-Shop-aff332b2/settings/pages

2. **Configure GitHub Pages:**
   - Source: Select "GitHub Actions"
   - The workflow file `.github/workflows/pages.yml` is already configured

3. **Trigger Deployment:**
   - Push to main branch OR
   - Go to Actions tab and manually trigger "Deploy to GitHub Pages" workflow
   - URL: https://github.com/asperpharma/Asper-Beauty-Shop-aff332b2/actions

4. **Access Your Site:**
   - Site will be live at: `https://asperpharma.github.io/Asper-Beauty-Shop-aff332b2/`
   - Custom domain can be configured in Settings → Pages

#### Custom Domain Setup for GitHub Pages:

1. In repository Settings → Pages → Custom domain
2. Enter: `www.asperbeautyshop.com`
3. Add DNS records at your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: asperpharma.github.io
   ```
4. Wait for DNS propagation (5-30 minutes)
5. Enable "Enforce HTTPS" checkbox

---

### Option 2: Lovable Platform (Original Design)

Lovable provides integrated hosting with their development platform.

#### Steps:

1. **Connect Repository to Lovable:**
   - Log in to Lovable Dashboard: https://lovable.dev
   - Connect GitHub repository: asperpharma/Asper-Beauty-Shop-aff332b2
   - Authorize Lovable to access the repository

2. **Configure Project:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables:**
   In Lovable Dashboard → Settings → Environment Variables:
   ```
   VITE_SUPABASE_URL=https://rgehleqcubtmcwyipyvi.supabase.co
   VITE_SUPABASE_PROJECT_ID=rgehleqcubtmcwyipyvi
   VITE_SUPABASE_PUBLISHABLE_KEY=<your-key>
   VITE_SITE_URL=https://www.asperbeautyshop.com
   VITE_SHOPIFY_STORE_DOMAIN=lovable-project-milns.myshopify.com
   VITE_SHOPIFY_STOREFRONT_TOKEN=<your-token>
   VITE_SHOPIFY_API_VERSION=2025-07
   ```

4. **Deploy:**
   - Lovable will automatically deploy on push to main
   - Site available at: `asperbeautyshop.lovable.app`

5. **Configure Custom Domain:**
   - Add domain in Lovable Dashboard
   - Configure DNS CNAME record:
     ```
     Type: CNAME
     Name: www
     Value: asperbeautyshop.lovable.app
     ```

---

### Option 3: Netlify

Netlify is another excellent option for static site hosting.

#### Steps:

1. **Sign up at Netlify:** https://www.netlify.com

2. **Import Project:**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and authorize
   - Select: asperpharma/Asper-Beauty-Shop-aff332b2

3. **Build Settings:**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Environment Variables:**
   Add all VITE_* variables from `.env.production`

5. **Deploy:**
   - Click "Deploy site"
   - Site will be available at: `<random-name>.netlify.app`

6. **Custom Domain:**
   - Go to Domain settings
   - Add custom domain: www.asperbeautyshop.com
   - Follow DNS configuration instructions

---

### Option 4: Vercel

Vercel provides excellent performance and easy GitHub integration.

#### Steps:

1. **Sign up at Vercel:** https://vercel.com

2. **Import Project:**
   - Click "Add New Project"
   - Import from GitHub: asperpharma/Asper-Beauty-Shop-aff332b2

3. **Configure:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: dist

4. **Environment Variables:**
   Add all VITE_* variables

5. **Deploy:**
   - Click Deploy
   - Site available at: `<project-name>.vercel.app`

6. **Custom Domain:**
   - Go to Settings → Domains
   - Add: www.asperbeautyshop.com
   - Configure DNS as instructed

---

## Post-Deployment Checklist

After deploying to any platform, verify:

### Core Functionality:
- [ ] Homepage loads correctly
- [ ] Product pages display properly
- [ ] Collections pages work
- [ ] Shopping cart functions
- [ ] Checkout redirects to Shopify
- [ ] Wishlist persists
- [ ] Search functionality works

### Integrations:
- [ ] Shopify products load
- [ ] Supabase authentication works
- [ ] AI Beauty Assistant responds
- [ ] Social media links work

### Bilingual Support:
- [ ] English/Arabic language toggle
- [ ] RTL layout for Arabic
- [ ] Translated content displays

### Mobile & Performance:
- [ ] Mobile responsive design
- [ ] Images load and optimize
- [ ] PWA installable
- [ ] Page speed acceptable

### SEO & Analytics:
- [ ] Sitemap accessible (/sitemap.xml)
- [ ] Robots.txt accessible (/robots.txt)
- [ ] Meta tags present
- [ ] SSL certificate active
- [ ] Google Analytics tracking (if configured)

---

## Verification Commands

### Test Build Locally:
```bash
npm install
npm run build
npm run preview
```

### Run Deployment Verification:
```bash
./scripts/verify-deployment.sh
```

### Check Environment Variables:
```bash
# View current environment
cat .env.production

# Test with environment variables
npm run build
```

---

## Troubleshooting

### Build Fails:
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Check Node.js version: `node --version` (should be 18+)
3. Review build logs for errors
4. Verify environment variables are set

### Site Not Accessible:
1. Check DNS propagation: https://dnschecker.org
2. Verify DNS records are correct
3. Wait 24-48 hours for full DNS propagation
4. Clear browser cache

### Blank Page:
1. Check browser console for errors
2. Verify base path in vite.config.ts
3. Check that dist/index.html exists
4. Verify _redirects file is included in build

### API Errors:
1. Verify Supabase project is active
2. Check Shopify store is published
3. Verify environment variables match production
4. Test API endpoints in browser DevTools

---

## GitHub Actions Workflows

The repository includes automated workflows:

### 1. Deploy to GitHub Pages (`.github/workflows/pages.yml`)
- Triggers on push to main
- Builds and deploys to GitHub Pages
- URL: https://asperpharma.github.io/Asper-Beauty-Shop-aff332b2/

### 2. Deploy to Production (`.github/workflows/deploy.yml`)
- Triggers on push to main
- Builds production bundle
- Creates deployment artifact
- Note: Actual deployment depends on configured platform

### 3. Deno Tests (`.github/workflows/deno.yml`)
- Runs linting and type checking
- Validates edge functions

---

## Quick Deployment Script

For immediate deployment to GitHub Pages:

```bash
# 1. Enable GitHub Pages in repository settings
# 2. Push to trigger deployment
git add .
git commit -m "Deploy website to production"
git push origin main

# 3. Check deployment status
# Visit: https://github.com/asperpharma/Asper-Beauty-Shop-aff332b2/actions

# 4. Access deployed site
# URL: https://asperpharma.github.io/Asper-Beauty-Shop-aff332b2/
```

---

## Support & Resources

- **Repository:** https://github.com/asperpharma/Asper-Beauty-Shop-aff332b2
- **Documentation:** See DEPLOYMENT_GUIDE.md for detailed information
- **Issues:** Report at GitHub Issues
- **Contact:** asperpharma@gmail.com

---

## Success Metrics

Your site is successfully deployed when:

✅ URL loads without errors  
✅ HTTPS is enforced  
✅ All pages are accessible  
✅ Products load from Shopify  
✅ Shopping cart works  
✅ Language switching works  
✅ Mobile responsive  
✅ SSL certificate valid  
✅ SEO files accessible (sitemap, robots.txt)  

---

**Last Updated:** 2026-02-22  
**Status:** Ready for deployment  
**Recommended Option:** GitHub Pages for immediate availability
