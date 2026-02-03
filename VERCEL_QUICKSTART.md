# 🚀 Quick Vercel Deployment Steps

This file contains the minimal steps needed to deploy Asper Beauty Shop to Vercel **right now**.

## Prerequisites
- ✅ GitHub repository: `asperpharma/Asper-Beauty-Shop-aff332b2`
- ✅ Vercel account (free): https://vercel.com/signup

---

## Method 1: Web Dashboard (Easiest - 5 minutes)

### Step 1: Import Project
1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Select: `asperpharma/Asper-Beauty-Shop-aff332b2`

### Step 2: Configure (Auto-detected)
Vercel will automatically detect:
- ✅ Framework: **Vite**
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Install Command: `npm install`

**No changes needed** - just verify these settings are correct.

### Step 3: Add Environment Variables
Click "Environment Variables" and add these 7 variables:

```bash
VITE_SUPABASE_PROJECT_ID=rgehleqcubtmcwyipyvi
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnZWhsZXFjdWJ0bWN3eWlweXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NDM5MDEsImV4cCI6MjA4MzQxOTkwMX0.8BEpVzIvWc2do2v8v3pOP3txcTs52HsM4F7KVavlQNU
VITE_SUPABASE_URL=https://rgehleqcubtmcwyipyvi.supabase.co
VITE_SITE_URL=https://your-project.vercel.app
VITE_SHOPIFY_STORE_DOMAIN=lovable-project-milns.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=9daedc472c5910e742ec88bdaad108e2
VITE_SHOPIFY_API_VERSION=2025-07
```

**Note**: You'll update `VITE_SITE_URL` after first deployment with your actual Vercel URL.

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait 1-2 minutes for build to complete
3. Get your live URL: `https://asper-beauty-shop-xxx.vercel.app`

### Step 5: Update VITE_SITE_URL
1. Copy your Vercel deployment URL
2. Go to: Settings → Environment Variables
3. Edit `VITE_SITE_URL` and paste your URL
4. Redeploy (Deployments tab → click "..." → Redeploy)

---

## Method 2: Vercel CLI (Advanced - 3 minutes)

### Step 1: Install & Login
```bash
npm i -g vercel
vercel login
```

### Step 2: Deploy
```bash
cd /path/to/Asper-Beauty-Shop-aff332b2
vercel --prod
```

### Step 3: Add Environment Variables
Run these commands and enter the values when prompted:
```bash
vercel env add VITE_SUPABASE_PROJECT_ID production
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY production
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SITE_URL production
vercel env add VITE_SHOPIFY_STORE_DOMAIN production
vercel env add VITE_SHOPIFY_STOREFRONT_TOKEN production
vercel env add VITE_SHOPIFY_API_VERSION production
```

### Step 4: Redeploy with Variables
```bash
vercel --prod
```

---

## After Deployment: Verify Everything Works

### Checklist
- [ ] Site loads at your Vercel URL
- [ ] Homepage displays correctly
- [ ] Products load from Shopify
- [ ] Shopping cart works
- [ ] Beauty Assistant chatbot responds
- [ ] Language switching works (EN/AR)
- [ ] Mobile view is responsive
- [ ] All images load

### Quick Test URLs
After deployment, test these routes:
- Homepage: `/`
- Collections: `/collections/skin-care`
- Product: `/product/any-product-handle`
- Brands: `/brands`
- Cart: Click cart icon in header

---

## Optional: Add Custom Domain

### Step 1: Add Domain in Vercel
1. Project Settings → Domains
2. Click "Add"
3. Enter: `your-domain.com`

### Step 2: Configure DNS
Add these records at your DNS provider:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600

Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

### Step 3: Wait for SSL
- Vercel auto-provisions SSL (5-10 minutes)
- Check: Settings → Domains → verify green checkmark

---

## Automatic Deployments (Bonus)

Once connected, every push to `main` branch automatically deploys!

```bash
git push origin main
# → Vercel detects push
# → Builds automatically
# → Deploys to production
# → Live in 1-2 minutes
```

---

## Troubleshooting

### Build Fails?
1. Check environment variables are set correctly
2. View build logs in Vercel dashboard
3. Run `npm run build` locally to test
4. Verify Node.js version is 18.x

### Site Shows 404 for Routes?
- This is fixed by `vercel.json` rewrites
- Verify `vercel.json` is committed to repo
- Check Vercel detected it (Build settings tab)

### API Calls Fail?
1. Verify environment variables in Vercel dashboard
2. Check `VITE_SITE_URL` matches your deployment URL
3. Test Supabase/Shopify endpoints in browser console

---

## Support

- **Documentation**: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) (full guide)
- **Vercel Help**: https://vercel.com/support
- **Project Contact**: asperpharma@gmail.com

---

**⚡ You're all set!** Follow Method 1 above and you'll be live on Vercel in ~5 minutes.
