#!/usr/bin/env node

/**
 * Asper Beauty Shop - Health Check Script
 * 
 * Verifies that the main site and all integrations are working properly.
 * Run this after deployment to ensure everything is connected.
 * 
 * Usage:
 *   npm run health
 *   node scripts/health-check.cjs
 *   node scripts/health-check.cjs --url=https://custom-domain.com
 */

const https = require('https');
const http = require('http');

// Configuration
const DEFAULT_SITE_URL = process.env.VITE_SITE_URL || 'https://asperbeautyshop-com.lovable.app';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://rgehleqcubtmcwyipyvi.supabase.co';
const SHOPIFY_STORE = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'lovable-project-milns.myshopify.com';

// Parse command line arguments
const args = process.argv.slice(2);
const customUrl = args.find(arg => arg.startsWith('--url='))?.split('=')[1];
const SITE_URL = customUrl || DEFAULT_SITE_URL;

// ANSI color codes
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Stats
let passed = 0;
let failed = 0;
let warnings = 0;

/**
 * Makes an HTTP/HTTPS request and returns the response
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: options.timeout || 10000
    };

    const req = protocol.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', reject);
    
    // Set timeout explicitly
    if (options.timeout) {
      req.setTimeout(options.timeout, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    }
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

/**
 * Checks if a URL is accessible and returns expected status
 */
async function checkEndpoint(name, url, expectedStatus = 200) {
  try {
    const response = await makeRequest(url);
    
    if (response.statusCode === expectedStatus) {
      console.log(`${colors.green}✅${colors.reset} ${name}`);
      passed++;
      return true;
    } else {
      console.log(`${colors.yellow}⚠️${colors.reset} ${name} (Status: ${response.statusCode}, expected: ${expectedStatus})`);
      warnings++;
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}❌${colors.reset} ${name} (Error: ${error.message})`);
    failed++;
    return false;
  }
}

/**
 * Checks if a URL contains expected content
 */
async function checkContent(name, url, expectedContent) {
  try {
    const response = await makeRequest(url);
    
    if (response.statusCode === 200 && response.data.includes(expectedContent)) {
      console.log(`${colors.green}✅${colors.reset} ${name}`);
      passed++;
      return true;
    } else if (response.statusCode === 200) {
      console.log(`${colors.yellow}⚠️${colors.reset} ${name} (Content not found)`);
      warnings++;
      return false;
    } else {
      console.log(`${colors.red}❌${colors.reset} ${name} (Status: ${response.statusCode})`);
      failed++;
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}❌${colors.reset} ${name} (Error: ${error.message})`);
    failed++;
    return false;
  }
}

/**
 * Main health check routine
 */
async function runHealthChecks() {
  console.log(`${colors.bold}${colors.blue}🏥 Asper Beauty Shop - Health Check${colors.reset}`);
  console.log('='.repeat(50));
  console.log(`Site URL: ${SITE_URL}`);
  console.log(`Supabase: ${SUPABASE_URL}`);
  console.log(`Shopify: ${SHOPIFY_STORE}`);
  console.log('');

  // 1. Main Site Health
  console.log(`${colors.bold}🌐 Main Site${colors.reset}`);
  console.log('-'.repeat(50));
  await checkEndpoint('Homepage', SITE_URL);
  await checkEndpoint('Products page', `${SITE_URL}/products`);
  await checkEndpoint('Collections page', `${SITE_URL}/collections`);
  await checkContent('Site includes Asper branding', SITE_URL, 'Asper');
  console.log('');

  // 2. Static Assets
  console.log(`${colors.bold}📄 Static Assets${colors.reset}`);
  console.log('-'.repeat(50));
  await checkEndpoint('Robots.txt', `${SITE_URL}/robots.txt`);
  await checkEndpoint('Sitemap.xml', `${SITE_URL}/sitemap.xml`);
  await checkEndpoint('Manifest.json', `${SITE_URL}/manifest.json`);
  await checkEndpoint('Favicon', `${SITE_URL}/favicon.png`);
  console.log('');

  // 3. Supabase Health
  console.log(`${colors.bold}🗄️ Supabase Integration${colors.reset}`);
  console.log('-'.repeat(50));
  await checkEndpoint('Supabase API', `${SUPABASE_URL}/rest/v1/`);
  
  // Check Supabase Functions
  const beautyAssistantUrl = `${SUPABASE_URL}/functions/v1/beauty-assistant`;
  try {
    // Beauty Assistant expects POST with specific body, so we just check if it's accessible
    const response = await makeRequest(beautyAssistantUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'health check' })
    });
    
    if (response.statusCode === 200 || response.statusCode === 400) {
      // 400 is ok - means it's running but rejected our simple test
      console.log(`${colors.green}✅${colors.reset} Beauty Assistant function accessible`);
      passed++;
    } else {
      console.log(`${colors.yellow}⚠️${colors.reset} Beauty Assistant function (Status: ${response.statusCode})`);
      warnings++;
    }
  } catch (error) {
    console.log(`${colors.yellow}⚠️${colors.reset} Beauty Assistant function (Error: ${error.message})`);
    warnings++;
  }

  // Check Bulk Upload function
  const bulkUploadUrl = `${SUPABASE_URL}/functions/v1/bulk-product-upload`;
  try {
    const response = await makeRequest(bulkUploadUrl, {
      method: 'GET'
    });
    
    if (response.statusCode === 200 || response.statusCode === 400 || response.statusCode === 401) {
      // 401/400 is ok - means it's running but needs auth
      console.log(`${colors.green}✅${colors.reset} Bulk Upload function accessible`);
      passed++;
    } else {
      console.log(`${colors.yellow}⚠️${colors.reset} Bulk Upload function (Status: ${response.statusCode})`);
      warnings++;
    }
  } catch (error) {
    console.log(`${colors.yellow}⚠️${colors.reset} Bulk Upload function (Error: ${error.message})`);
    warnings++;
  }
  console.log('');

  // 4. Shopify Health
  console.log(`${colors.bold}🛍️ Shopify Integration${colors.reset}`);
  console.log('-'.repeat(50));
  await checkEndpoint('Shopify storefront', `https://${SHOPIFY_STORE}`);
  console.log('');

  // 5. Results Summary
  console.log('='.repeat(50));
  const total = passed + failed + warnings;
  console.log(`${colors.bold}Results:${colors.reset} ${colors.green}${passed} passed${colors.reset}, ${colors.yellow}${warnings} warnings${colors.reset}, ${colors.red}${failed} failed${colors.reset} (Total: ${total})`);
  console.log('');

  if (failed === 0 && warnings === 0) {
    console.log(`${colors.green}${colors.bold}🎉 All health checks passed! Site is fully operational.${colors.reset}`);
    console.log('');
    return 0;
  } else if (failed === 0) {
    console.log(`${colors.yellow}${colors.bold}⚠️ Health checks completed with warnings. Review issues above.${colors.reset}`);
    console.log('');
    return 0; // Don't fail on warnings
  } else {
    console.log(`${colors.red}${colors.bold}❌ Health checks failed. Please review errors above.${colors.reset}`);
    console.log('');
    console.log('Common fixes:');
    console.log('  1. Verify environment variables are set correctly');
    console.log('  2. Check that Supabase project is deployed');
    console.log('  3. Ensure Shopify store is accessible');
    console.log('  4. Review DNS configuration for custom domain');
    console.log('');
    return 1;
  }
}

// Run health checks
runHealthChecks()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    console.error(`${colors.red}Fatal error:${colors.reset}`, error);
    process.exit(1);
  });
