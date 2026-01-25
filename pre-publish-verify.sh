#!/bin/bash

# Pre-Publishing Verification Script for Asper Beauty Shop
# This script automates many checks from PRE_PUBLISH_CHECKLIST.md
# Run this before deploying to production

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   Asper Beauty Shop - Pre-Publishing Verification        ║"
echo "║   Comprehensive checks before production deployment       ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Color codes for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0
WARN=0
TOTAL=0

# Functions
check_pass() {
    echo -e "${GREEN}✅ PASS${NC} $1"
    ((PASS++))
    ((TOTAL++))
}

check_fail() {
    echo -e "${RED}❌ FAIL${NC} $1"
    ((FAIL++))
    ((TOTAL++))
}

check_warn() {
    echo -e "${YELLOW}⚠️  WARN${NC} $1"
    ((WARN++))
    ((TOTAL++))
}

section_header() {
    echo ""
    echo -e "${BLUE}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}${BOLD}$1${NC}"
    echo -e "${BLUE}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Start verification
START_TIME=$(date +%s)

# =============================================================================
section_header "1. Environment & Dependencies"
# =============================================================================

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    check_pass "Node.js installed: $NODE_VERSION"
else
    check_fail "Node.js not installed"
fi

# Check npm version
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    check_pass "npm installed: $NPM_VERSION"
else
    check_fail "npm not installed"
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    check_pass "Dependencies installed (node_modules exists)"
else
    check_fail "Dependencies not installed (run: npm install)"
fi

# Check package.json
if [ -f "package.json" ]; then
    check_pass "package.json exists"
else
    check_fail "package.json missing"
fi

# =============================================================================
section_header "2. Critical Files & Directories"
# =============================================================================

# Configuration files
[ -f ".env" ] && check_pass ".env file exists" || check_warn ".env file missing (check .env.production)"
[ -f ".env.production" ] && check_pass ".env.production exists" || check_fail ".env.production missing"
[ -f "vite.config.ts" ] && check_pass "vite.config.ts exists" || check_fail "vite.config.ts missing"
[ -f "tsconfig.json" ] && check_pass "tsconfig.json exists" || check_fail "tsconfig.json missing"
[ -f "tailwind.config.ts" ] && check_pass "tailwind.config.ts exists" || check_fail "tailwind.config.ts missing"

# Source directories
[ -d "src" ] && check_pass "src/ directory exists" || check_fail "src/ directory missing"
[ -d "src/components" ] && check_pass "src/components/ exists" || check_fail "src/components/ missing"
[ -d "src/pages" ] && check_pass "src/pages/ exists" || check_fail "src/pages/ missing"
[ -d "src/lib" ] && check_pass "src/lib/ exists" || check_fail "src/lib/ missing"
[ -d "public" ] && check_pass "public/ directory exists" || check_fail "public/ directory missing"

# =============================================================================
section_header "3. SEO & PWA Files"
# =============================================================================

[ -f "public/sitemap.xml" ] && check_pass "sitemap.xml exists" || check_fail "sitemap.xml missing"
[ -f "public/robots.txt" ] && check_pass "robots.txt exists" || check_fail "robots.txt missing"
[ -f "public/manifest.json" ] && check_pass "manifest.json exists" || check_fail "manifest.json missing"
[ -f "public/favicon.png" ] && check_pass "favicon.png exists" || check_warn "favicon.png missing"
[ -f "public/_redirects" ] && check_pass "_redirects file exists (SPA routing)" || check_warn "_redirects missing (SPA routing may not work)"

# Check sitemap contains production domain
if [ -f "public/sitemap.xml" ]; then
    if grep -q "www.asperbeautyshop.com" "public/sitemap.xml"; then
        check_pass "sitemap.xml contains production domain"
    else
        check_fail "sitemap.xml missing production domain (www.asperbeautyshop.com)"
    fi
fi

# Check robots.txt contains production domain
if [ -f "public/robots.txt" ]; then
    if grep -q "www.asperbeautyshop.com" "public/robots.txt"; then
        check_pass "robots.txt contains production domain"
    else
        check_warn "robots.txt missing production domain"
    fi
fi

# =============================================================================
section_header "4. Environment Variables"
# =============================================================================

if [ -f ".env.production" ]; then
    # Check for required environment variables
    grep -q "VITE_SUPABASE_URL" ".env.production" && check_pass "VITE_SUPABASE_URL configured" || check_fail "VITE_SUPABASE_URL missing"
    grep -q "VITE_SUPABASE_PROJECT_ID" ".env.production" && check_pass "VITE_SUPABASE_PROJECT_ID configured" || check_fail "VITE_SUPABASE_PROJECT_ID missing"
    grep -q "VITE_SUPABASE_PUBLISHABLE_KEY" ".env.production" && check_pass "VITE_SUPABASE_PUBLISHABLE_KEY configured" || check_fail "VITE_SUPABASE_PUBLISHABLE_KEY missing"
    grep -q "VITE_SITE_URL" ".env.production" && check_pass "VITE_SITE_URL configured" || check_fail "VITE_SITE_URL missing"
    grep -q "VITE_SHOPIFY_STORE_DOMAIN" ".env.production" && check_pass "VITE_SHOPIFY_STORE_DOMAIN configured" || check_fail "VITE_SHOPIFY_STORE_DOMAIN missing"
    grep -q "VITE_SHOPIFY_STOREFRONT_TOKEN" ".env.production" && check_pass "VITE_SHOPIFY_STOREFRONT_TOKEN configured" || check_fail "VITE_SHOPIFY_STOREFRONT_TOKEN missing"
    
    # Check production URL is correct
    if grep -q "VITE_SITE_URL=\"https://www.asperbeautyshop.com\"" ".env.production"; then
        check_pass "Production URL is www.asperbeautyshop.com"
    else
        check_warn "Production URL may not be set to www.asperbeautyshop.com"
    fi
fi

# =============================================================================
section_header "5. Integration Files"
# =============================================================================

# Shopify integration
if [ -f "src/lib/shopify.ts" ]; then
    check_pass "Shopify integration file exists"
    
    # Check for key functions
    grep -q "fetchProducts" "src/lib/shopify.ts" && check_pass "fetchProducts function exists" || check_fail "fetchProducts missing"
    grep -q "createStorefrontCheckout" "src/lib/shopify.ts" && check_pass "createStorefrontCheckout function exists" || check_fail "createStorefrontCheckout missing"
    grep -q "sanitizeSearchTerm" "src/lib/shopify.ts" && check_pass "XSS protection (sanitizeSearchTerm) exists" || check_warn "XSS protection may be missing"
else
    check_fail "src/lib/shopify.ts missing"
fi

# Supabase integration
[ -f "src/integrations/supabase/client.ts" ] && check_pass "Supabase client exists" || check_fail "Supabase client missing"

# Category mapping
[ -f "src/lib/categoryMapping.ts" ] && check_pass "Category mapping exists" || check_fail "Category mapping missing"

# Product utils
[ -f "src/lib/productUtils.ts" ] && check_pass "Product utilities exist" || check_fail "Product utilities missing"

# =============================================================================
section_header "6. State Management & Context"
# =============================================================================

[ -f "src/stores/cartStore.ts" ] && check_pass "Cart store exists" || check_fail "Cart store missing"
[ -f "src/stores/wishlistStore.ts" ] && check_pass "Wishlist store exists" || check_fail "Wishlist store missing"
[ -f "src/contexts/LanguageContext.tsx" ] && check_pass "Language context exists (i18n)" || check_fail "Language context missing"

# =============================================================================
section_header "7. Core Components"
# =============================================================================

[ -f "src/App.tsx" ] && check_pass "Main App component exists" || check_fail "App.tsx missing"
[ -f "src/main.tsx" ] && check_pass "Main entry point exists" || check_fail "main.tsx missing"
[ -f "src/components/Header.tsx" ] && check_pass "Header component exists" || check_fail "Header missing"
[ -f "src/components/Footer.tsx" ] && check_pass "Footer component exists" || check_fail "Footer missing"
[ -f "src/components/ProductCard.tsx" ] && check_pass "ProductCard component exists" || check_fail "ProductCard missing"
[ -f "src/components/CartDrawer.tsx" ] && check_pass "CartDrawer component exists" || check_fail "CartDrawer missing"
[ -d "src/components/ui" ] && check_pass "shadcn/ui components directory exists" || check_fail "UI components missing"

# =============================================================================
section_header "8. Documentation"
# =============================================================================

[ -f "README.md" ] && check_pass "README.md exists" || check_fail "README.md missing"
[ -f "DEPLOYMENT_GUIDE.md" ] && check_pass "DEPLOYMENT_GUIDE.md exists" || check_warn "Deployment guide missing"
[ -f "CONNECTION_STATUS.md" ] && check_pass "CONNECTION_STATUS.md exists" || check_warn "Connection status missing"
[ -f "SECURITY_STATUS.md" ] && check_pass "SECURITY_STATUS.md exists" || check_warn "Security status missing"
[ -f "PRE_PUBLISH_CHECKLIST.md" ] && check_pass "PRE_PUBLISH_CHECKLIST.md exists" || check_warn "Pre-publish checklist missing"
[ -f ".cursorrules" ] && check_pass ".cursorrules exists" || check_warn "Cursor AI rules missing"

# =============================================================================
section_header "9. Build System Tests"
# =============================================================================

echo -e "${YELLOW}Running build tests (this may take a moment)...${NC}"

# Test TypeScript compilation
if npx tsc --noEmit &> /dev/null; then
    check_pass "TypeScript compilation succeeds"
else
    check_fail "TypeScript compilation failed (check for type errors)"
fi

# Test linting
echo -e "${YELLOW}Running ESLint...${NC}"
if npm run lint &> /tmp/lint-output.txt; then
    check_pass "Linting passed with no errors"
else
    # Check if only warnings
    if grep -q "warning" /tmp/lint-output.txt && ! grep -q "error" /tmp/lint-output.txt; then
        check_warn "Linting has warnings but no errors"
    else
        check_fail "Linting failed with errors"
    fi
fi

# Test production build
echo -e "${YELLOW}Running production build (this may take a minute)...${NC}"
if npm run build &> /tmp/build-output.txt; then
    check_pass "Production build succeeds"
    
    # Check if dist folder was created
    if [ -d "dist" ]; then
        check_pass "dist/ directory created"
        
        # Check critical files in dist
        [ -f "dist/index.html" ] && check_pass "dist/index.html exists" || check_fail "dist/index.html missing"
        [ -f "dist/_redirects" ] && check_pass "dist/_redirects exists (SPA routing)" || check_warn "dist/_redirects missing"
        
        # Check bundle size
        DIST_SIZE=$(du -sh dist/ | cut -f1)
        check_pass "Build size: $DIST_SIZE"
        
        # Count JavaScript bundles
        JS_COUNT=$(find dist/assets -name "*.js" 2>/dev/null | wc -l)
        check_pass "JavaScript bundles: $JS_COUNT files"
        
        # Count CSS bundles
        CSS_COUNT=$(find dist/assets -name "*.css" 2>/dev/null | wc -l)
        check_pass "CSS bundles: $CSS_COUNT files"
    else
        check_fail "dist/ directory not created"
    fi
else
    check_fail "Production build failed (check build logs)"
fi

# =============================================================================
section_header "10. Security Checks"
# =============================================================================

# Check for common security issues
echo -e "${YELLOW}Running security audit...${NC}"

# Check .gitignore contains .env
if [ -f ".gitignore" ]; then
    if grep -q "^\.env$" ".gitignore"; then
        check_pass ".env is in .gitignore"
    else
        check_fail ".env NOT in .gitignore (security risk!)"
    fi
fi

# npm audit (show critical and high only)
if npm audit --audit-level=high &> /tmp/audit-output.txt; then
    check_pass "No high/critical security vulnerabilities"
else
    # Parse npm audit output more reliably by looking for actual vulnerability counts
    # npm audit output typically shows: "X vulnerabilities (Y severity1, Z severity2)"
    CRITICAL="0"
    HIGH="0"
    
    # Look for specific patterns in npm audit JSON output
    if npm audit --json > /tmp/audit-json.txt 2>&1; then
        if command -v jq &> /dev/null; then
            # Use jq if available for accurate parsing
            CRITICAL=$(jq '.metadata.vulnerabilities.critical // 0' /tmp/audit-json.txt 2>/dev/null || echo "0")
            HIGH=$(jq '.metadata.vulnerabilities.high // 0' /tmp/audit-json.txt 2>/dev/null || echo "0")
        else
            # Fallback: parse the summary line
            if grep -q "vulnerabilities" /tmp/audit-output.txt; then
                # Count severity keywords in context
                CRITICAL=$(grep -i "critical severity" /tmp/audit-output.txt 2>/dev/null | wc -l | tr -d ' ')
                HIGH=$(grep -i "high severity" /tmp/audit-output.txt 2>/dev/null | wc -l | tr -d ' ')
            fi
        fi
    fi
    
    if [ "$CRITICAL" != "0" ] || [ "$HIGH" != "0" ]; then
        check_fail "Security vulnerabilities found: $CRITICAL critical, $HIGH high (run: npm audit for details)"
    else
        check_warn "Some security vulnerabilities found (run: npm audit for details)"
    fi
fi

# Check for console.log in production code (basic check)
# Exclude comments by checking for console.log that's not preceded by //
if grep -rn "console\.log" src/ --include="*.tsx" --include="*.ts" | grep -v "^\s*//" | grep -v "^\s*\*" > /dev/null; then
    check_warn "console.log statements found in src/ (consider removing for production)"
else
    check_pass "No console.log statements in production code"
fi

# Check for debugger statements
if grep -r "debugger" src/ --include="*.tsx" --include="*.ts" > /dev/null; then
    check_fail "debugger statements found in src/ (must remove for production)"
else
    check_pass "No debugger statements found"
fi

# =============================================================================
section_header "11. Git Status"
# =============================================================================

# Check git status
if command -v git &> /dev/null; then
    # Check for uncommitted changes
    if git diff-index --quiet HEAD -- 2>/dev/null; then
        check_pass "No uncommitted changes"
    else
        check_warn "Uncommitted changes detected (consider committing before deploy)"
    fi
    
    # Check current branch
    BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
    if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
        check_pass "On main/master branch"
    else
        check_warn "Not on main/master branch (current: $BRANCH)"
    fi
else
    check_warn "Git not available (cannot check repository status)"
fi

# =============================================================================
# Final Summary
# =============================================================================

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                   VERIFICATION SUMMARY                    ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo -e "  ${GREEN}✅ Passed:${NC}  $PASS"
echo -e "  ${RED}❌ Failed:${NC}  $FAIL"
echo -e "  ${YELLOW}⚠️  Warnings:${NC} $WARN"
echo -e "  ${BOLD}Total Checks: $TOTAL${NC}"
echo ""
echo -e "  Time taken: ${DURATION}s"
echo ""

# Determine overall status
if [ $FAIL -eq 0 ]; then
    if [ $WARN -eq 0 ]; then
        echo -e "${GREEN}${BOLD}🎉 EXCELLENT! All checks passed.${NC}"
        echo -e "${GREEN}Your site is ready for production deployment!${NC}"
        echo ""
        echo "Next steps:"
        echo "  1. Review PRE_PUBLISH_CHECKLIST.md for manual checks"
        echo "  2. Test in browser: npm run preview"
        echo "  3. Deploy: git push origin main"
        EXIT_CODE=0
    else
        echo -e "${YELLOW}${BOLD}⚠️  GOOD! All critical checks passed, but there are warnings.${NC}"
        echo -e "${YELLOW}Review warnings above before deploying.${NC}"
        EXIT_CODE=0
    fi
else
    echo -e "${RED}${BOLD}❌ FAILED! Critical issues found.${NC}"
    echo -e "${RED}Please fix the failed checks before deploying to production.${NC}"
    echo ""
    echo "Common fixes:"
    echo "  - Missing dependencies: npm install"
    echo "  - Build errors: Check /tmp/build-output.txt"
    echo "  - Lint errors: npm run lint"
    echo "  - Security issues: npm audit fix"
    EXIT_CODE=1
fi

echo ""
echo "For detailed manual checklist, see: PRE_PUBLISH_CHECKLIST.md"
echo ""

# Cleanup
rm -f /tmp/lint-output.txt /tmp/build-output.txt /tmp/audit-output.txt

exit $EXIT_CODE
