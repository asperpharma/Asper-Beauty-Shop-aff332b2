#!/bin/bash
# Vercel Deployment Verification Script

set -e

echo "🔍 Vercel Deployment Configuration Verification"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check vercel.json exists
echo -n "1. Checking vercel.json exists... "
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ vercel.json not found${NC}"
    exit 1
fi

# Validate vercel.json is valid JSON
echo -n "2. Validating vercel.json syntax... "
if python3 -m json.tool vercel.json > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Invalid JSON${NC}"
    exit 1
fi

# Check .vercelignore exists
echo -n "3. Checking .vercelignore exists... "
if [ -f ".vercelignore" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ .vercelignore not found${NC}"
    exit 1
fi

# Check VERCEL_DEPLOYMENT.md exists
echo -n "4. Checking VERCEL_DEPLOYMENT.md exists... "
if [ -f "VERCEL_DEPLOYMENT.md" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ VERCEL_DEPLOYMENT.md not found${NC}"
    exit 1
fi

# Check package.json has build script
echo -n "5. Checking package.json build script... "
if grep -q '"build".*"vite build"' package.json; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Build script not found${NC}"
    exit 1
fi

# Check if node_modules exists (dependencies installed)
echo -n "6. Checking dependencies are installed... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ node_modules not found - run 'npm install'${NC}"
fi

# Test build
echo -n "7. Testing production build... "
if npm run build > /tmp/build.log 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Build failed - check /tmp/build.log${NC}"
    exit 1
fi

# Check dist directory exists
echo -n "8. Checking dist output directory... "
if [ -d "dist" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ dist directory not found${NC}"
    exit 1
fi

# Check index.html exists in dist
echo -n "9. Checking dist/index.html exists... "
if [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ dist/index.html not found${NC}"
    exit 1
fi

# Check assets directory exists in dist
echo -n "10. Checking dist/assets directory... "
if [ -d "dist/assets" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ dist/assets directory not found${NC}"
    exit 1
fi

# Check environment variables documentation
echo -n "11. Checking .env.production file... "
if [ -f ".env.production" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ .env.production not found${NC}"
fi

# Verify required environment variables are documented
echo -n "12. Checking environment variables in .env.production... "
if [ -f ".env.production" ]; then
    required_vars=("VITE_SUPABASE_URL" "VITE_SHOPIFY_STORE_DOMAIN" "VITE_SHOPIFY_STOREFRONT_TOKEN")
    all_found=true
    for var in "${required_vars[@]}"; do
        if ! grep -q "$var" .env.production; then
            all_found=false
            break
        fi
    done
    if [ "$all_found" = true ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}⚠ Some required variables missing${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Skipped - .env.production not found${NC}"
fi

echo ""
echo "=============================================="
echo -e "${GREEN}✓ All checks passed!${NC}"
echo ""
echo "📦 Your project is ready for Vercel deployment!"
echo ""
echo "Next steps:"
echo "  1. Push changes to GitHub"
echo "  2. Import repository at https://vercel.com/new"
echo "  3. Configure environment variables"
echo "  4. Deploy!"
echo ""
echo "Or use Vercel CLI:"
echo "  npm i -g vercel"
echo "  vercel login"
echo "  vercel --prod"
echo ""
