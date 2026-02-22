#!/bin/bash

# Deployment Verification Script for Asper Beauty Shop
# This script verifies that the website is properly deployed and accessible

set -e

echo "🚀 Verifying Asper Beauty Shop Deployment..."
echo "=============================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Production URLs
PRODUCTION_URL="https://www.asperbeautyshop.com"
LOVABLE_URL="https://asperbeautyshop.lovable.app"

# Function to check URL accessibility
check_url() {
    local url=$1
    local name=$2
    
    echo -n "Checking $name ($url)... "
    
    if curl -f -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        return 1
    fi
}

# Function to check HTTPS redirect
check_https_redirect() {
    local url=$1
    echo -n "Checking HTTPS redirect for $url... "
    
    local response=$(curl -s -o /dev/null -w "%{redirect_url}" "http://$url")
    if [[ $response == https://* ]]; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        return 1
    fi
}

# Function to check specific endpoints
check_endpoint() {
    local base_url=$1
    local endpoint=$2
    local name=$3
    
    echo -n "Checking $name endpoint ($endpoint)... "
    
    local status_code=$(curl -f -s -o /dev/null -w "%{http_code}" "${base_url}${endpoint}")
    if [[ $status_code == "200" ]]; then
        echo -e "${GREEN}✓ OK (200)${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ Status: $status_code${NC}"
        return 1
    fi
}

# Main verification steps
echo "1. Checking Primary Domain"
echo "-------------------------"
check_url "$PRODUCTION_URL" "Production Site"
echo ""

echo "2. Checking Lovable Development URL"
echo "-----------------------------------"
check_url "$LOVABLE_URL" "Lovable Dev Site"
echo ""

echo "3. Checking HTTPS Redirects"
echo "---------------------------"
check_https_redirect "www.asperbeautyshop.com"
echo ""

echo "4. Checking Key Endpoints"
echo "------------------------"
check_endpoint "$PRODUCTION_URL" "/" "Homepage"
check_endpoint "$PRODUCTION_URL" "/sitemap.xml" "Sitemap"
check_endpoint "$PRODUCTION_URL" "/robots.txt" "Robots.txt"
check_endpoint "$PRODUCTION_URL" "/manifest.json" "PWA Manifest"
echo ""

echo "5. Checking SPA Routes (should return 200)"
echo "-----------------------------------------"
# Note: These should all return 200 due to SPA _redirects configuration
check_endpoint "$PRODUCTION_URL" "/collections/skin-care" "Collections Page"
check_endpoint "$PRODUCTION_URL" "/brands" "Brands Page"
check_endpoint "$PRODUCTION_URL" "/contact" "Contact Page"
echo ""

echo "6. Checking DNS Configuration"
echo "-----------------------------"
echo -n "DNS lookup for www.asperbeautyshop.com... "
if host www.asperbeautyshop.com > /dev/null 2>&1; then
    echo -e "${GREEN}✓ OK${NC}"
    host www.asperbeautyshop.com | head -2
else
    echo -e "${RED}✗ FAILED${NC}"
fi
echo ""

echo "7. Checking SSL Certificate"
echo "---------------------------"
echo -n "SSL certificate for www.asperbeautyshop.com... "
if echo | openssl s_client -servername www.asperbeautyshop.com -connect www.asperbeautyshop.com:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${YELLOW}⚠ Could not verify certificate${NC}"
fi
echo ""

echo "=============================================="
echo -e "${GREEN}✅ Deployment Verification Complete!${NC}"
echo ""
echo "Next Steps:"
echo "1. Test shopping cart and checkout flow"
echo "2. Verify Shopify product fetching"
echo "3. Test Supabase authentication"
echo "4. Test AI Beauty Assistant"
echo "5. Verify language switching (EN/AR)"
echo "6. Test mobile responsiveness"
echo ""
echo "For detailed status, see: DEPLOYMENT_GUIDE.md"
