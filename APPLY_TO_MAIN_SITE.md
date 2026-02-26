# Apply All Updates, Brain & Everything to Main Website

This guide provides a comprehensive checklist for applying all updates from this
development repository to the main production site.

## 🎯 Main Site Information

- **Main Site URL**: https://asperbeautyshop-com.lovable.app/
- **Production URL**: https://www.asperbeautyshop.com
- **Repository**: asperpharma/understand-project
- **Lovable Project**:
  https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6/settings
- **Current Dev Repo**: asperpharma/Asper-Beauty-Shop-aff332b2

---

## 📋 Pre-Deployment Checklist

### 1. Environment Configuration

- [ ] Copy `env.main-site.example` to main site repository
- [ ] Verify all environment variables in Lovable project settings
- [ ] Update `.env` file for local development (never commit!)
- [ ] Confirm Supabase project ID and API keys
- [ ] Verify Shopify Storefront API credentials
- [ ] Check custom domain DNS settings (CNAME record)

### 2. Code Review

- [ ] Review all changes in current branch
- [ ] Run `npm run lint` to check for code issues
- [ ] Run `npm run build` to verify production build
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Verify bilingual support (English/Arabic, RTL)
- [ ] Check all social media links (9 platforms)

### 3. Integration Testing

- [ ] Test Shopify product fetching
- [ ] Verify checkout flow works
- [ ] Test beauty assistant AI chatbot
- [ ] Verify cart persistence (localStorage)
- [ ] Test wishlist functionality
- [ ] Confirm authentication flows
- [ ] Check all page routes work correctly

### 4. Performance & SEO

- [ ] Verify image optimization (`<OptimizedImage>` component)
- [ ] Check lazy loading for heavy components
- [ ] Validate meta tags and OpenGraph for social sharing
- [ ] Test page load times
- [ ] Verify sitemap.xml is up to date
- [ ] Check robots.txt configuration

### 5. Security Review

- [ ] Run `./verify-connections.sh` (48 security checks)
- [ ] Confirm no hardcoded secrets in code
- [ ] Verify HTTPS for all external requests
- [ ] Check Supabase RLS policies
- [ ] Validate input sanitization (search, forms)
- [ ] Review SECURITY.md for compliance

### 6. Social Media & Marketing

- [ ] Verify Instagram integration (@asper.beauty.shop)
- [ ] Test Facebook page link
- [ ] Confirm TikTok profile connection
- [ ] Check WhatsApp business number (+962 79 065 6666)
- [ ] Validate X (Twitter) profile
- [ ] Test YouTube channel link
- [ ] Verify LinkedIn page
- [ ] Check Snapchat profile
- [ ] Confirm Pinterest board
- [ ] Review Google Merchant Center setup

---

## 🚀 Deployment Steps

### Step 1: Prepare Changes

```bash
# In development repository (Asper-Beauty-Shop-aff332b2)
git status
git log --oneline -10
npm run lint
npm run build
npm run preview
```

### Step 2: Copy Files to Main Site

Use the provided automation script:

```bash
chmod +x apply_to_understand_project.sh
./apply_to_understand_project.sh
```

Or manually:

```bash
# Update these paths
SOURCE_REPO="/path/to/Asper-Beauty-Shop-aff332b2"
TARGET_REPO="/path/to/understand-project"

# Copy critical files
cp -r $SOURCE_REPO/src $TARGET_REPO/
cp -r $SOURCE_REPO/public $TARGET_REPO/
cp $SOURCE_REPO/package.json $TARGET_REPO/
cp $SOURCE_REPO/package-lock.json $TARGET_REPO/
cp $SOURCE_REPO/.env.production $TARGET_REPO/

# DO NOT copy .env (contains local secrets)
```

### Step 3: Update Main Repository

```bash
cd understand-project
npm install
npm run build
git add .
git commit -m "Apply updates from dev repo: [describe changes]"
git push origin main
```

### Step 4: Update Lovable Project

1. Go to
   https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6/settings
2. Navigate to Environment Variables
3. Paste values from `env.main-site.example`
4. Save and trigger rebuild

### Step 5: Verify Deployment

- [ ] Check main site loads: https://asperbeautyshop-com.lovable.app/
- [ ] Verify custom domain: https://www.asperbeautyshop.com
- [ ] Test critical user flows (browse, cart, checkout)
- [ ] Monitor error logs in Supabase
- [ ] Check Shopify admin for orders

---

## 🔄 Post-Deployment

### Monitoring

- [ ] Watch for console errors in browser DevTools
- [ ] Monitor Supabase function logs
- [ ] Check Shopify API rate limits
- [ ] Review analytics (if configured)

### Rollback Plan

If issues occur:

```bash
cd understand-project
git log --oneline -5
git revert [commit-hash]
git push origin main
```

Or redeploy previous working version in Lovable.

### Documentation Updates

- [ ] Update CONNECTION_STATUS.md with latest results
- [ ] Document any new features in README.md
- [ ] Update DEPLOYMENT_GUIDE.md if process changed
- [ ] Note any breaking changes in CHANGELOG (if exists)

---

## 📞 Support Contacts

- **Technical Issues**: asperpharma@gmail.com
- **Lovable Support**: https://lovable.dev/support
- **Shopify Support**: https://help.shopify.com
- **Supabase Support**: https://supabase.com/support

---

## 🔐 Security Notes

- **NEVER** commit `.env` files with real secrets
- **ALWAYS** use environment variables for API keys
- **VERIFY** all user inputs are sanitized
- **CHECK** that RLS policies are enabled on Supabase tables
- **ENSURE** HTTPS is enforced on custom domain
- **REVIEW** SECURITY.md before each deployment

---

## 📚 Related Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Detailed deployment instructions
- [Architecture Diagram](ARCHITECTURE_DIAGRAM.md) - System architecture
- [Social Media Integration](SOCIAL_MEDIA_INTEGRATION.md) - Platform setup
- [Copilot Instructions](.github/copilot-instructions.md) - AI development guide
- [Security Status](SECURITY_STATUS.md) - Security audit results

---

**Last Updated**: 2026-02-26 **Maintained By**: Asper Pharma Development Team
