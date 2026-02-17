# Datadog Synthetics CI Setup Guide

This guide explains how to configure and use Datadog Synthetics testing in the CI/CD pipeline.

## Overview

The Datadog Synthetics CI workflow (`.github/workflows/datadog-synthetics.yml`) runs automated browser and API tests to validate the application's functionality across different scenarios.

## Current Status

⚠️ **Workflow Created but Requires Configuration**

The workflow file has been added to the repository, but Datadog secrets need to be configured before tests can run. The workflow is designed to gracefully skip tests if secrets are not configured, preventing CI failures.

## Workflow Triggers

The workflow runs on:
- **Push to main branch**: Tests production deployment
- **Pull requests**: Validates changes before merge
- **Daily schedule**: 6 AM UTC daily health checks
- **Manual dispatch**: Can be triggered manually via GitHub Actions UI

## Prerequisites

### 1. Datadog Account Setup

1. Sign up for [Datadog](https://www.datadoghq.com/)
2. Navigate to **Synthetic Monitoring** in Datadog dashboard
3. Create synthetic tests for your application:
   - **Browser tests**: Simulate user interactions (e.g., product browsing, cart operations)
   - **API tests**: Validate backend endpoints (e.g., Shopify API, Supabase functions)

### 2. GitHub Secrets Configuration

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

#### Required Datadog Secrets
- **DATADOG_API_KEY**: Your Datadog API key
  - Get from: Organization Settings → API Keys in Datadog
  - Click "New Key" if needed
- **DATADOG_APP_KEY**: Your Datadog Application key
  - Get from: Organization Settings → Application Keys in Datadog
  - Click "New Key" if needed

#### Required Environment Secrets (Already Configured)
- VITE_SUPABASE_PROJECT_ID
- VITE_SUPABASE_PUBLISHABLE_KEY
- VITE_SUPABASE_URL
- VITE_SHOPIFY_STORE_DOMAIN
- VITE_SHOPIFY_STOREFRONT_TOKEN
- VITE_SHOPIFY_API_VERSION

## Configuring Tests

### Option 1: Run All Tests with Tag
Edit the workflow file to use a tag-based search:

```yaml
- name: Run Datadog Synthetics tests
  uses: DataDog/synthetics-ci-github-action@v1.14.0
  with:
    api-key: ${{ secrets.DATADOG_API_KEY }}
    app-key: ${{ secrets.DATADOG_APP_KEY }}
    test-search-query: 'tag:ci'  # Run all tests tagged with 'ci'
```

### Option 2: Run Specific Tests
Specify test IDs directly:

```yaml
- name: Run Datadog Synthetics tests
  uses: DataDog/synthetics-ci-github-action@v1.14.0
  with:
    api-key: ${{ secrets.DATADOG_API_KEY }}
    app-key: ${{ secrets.DATADOG_APP_KEY }}
    public-ids: 'abc-def-ghi,123-456-789'  # Comma-separated test IDs
```

## Recommended Test Scenarios

### Browser Tests
1. **Homepage Load**: Verify www.asperbeautyshop.com loads correctly
2. **Product Browsing**: Navigate collections (skin-care, hair-care, make-up, body-care, fragrances, tools-devices)
3. **Search Functionality**: Test product search with various keywords
4. **Add to Cart**: Add product to cart and verify cart state
5. **Checkout Flow**: Validate redirect to Shopify checkout
6. **Language Toggle**: Test EN/AR language switching and RTL layout
7. **Mobile Responsiveness**: Test on mobile viewports (responsive design)

### API Tests
1. **Shopify Products API**: Fetch products from Storefront API (GraphQL)
2. **Supabase Auth**: Test authentication endpoints
3. **Beauty Assistant**: Validate AI assistant serverless function (Gemini 2.5 Flash)
4. **Health Check**: Verify site is accessible at production URL

## Workflow Behavior

### When Datadog is Not Configured (Current State)
- ✅ Workflow runs successfully without failing
- ⏭️ Synthetics tests are skipped
- 📝 Output shows configuration instructions
- ✅ Build step still validates code compiles correctly
- ✅ CI passes without blocking merges

### When Datadog is Configured
- 🧪 All configured tests will run
- 📊 Results are logged in workflow output
- 📈 Detailed results available in Datadog dashboard
- ⚠️ Tests marked as `continue-on-error: true` won't block deployment (by design)

## Monitoring & Alerts

1. **Datadog Dashboard**: View test results, trends, and performance metrics
2. **GitHub Actions**: See test status in PR checks
3. **Alerts**: Configure Datadog alerts for test failures or performance degradation

## Troubleshooting

### Workflow Shows "Action Required"
- This is expected for new workflow files from Copilot agents
- Repository admin needs to approve the workflow run once
- After first approval, subsequent runs will execute automatically

### Tests Not Running
- Verify DATADOG_API_KEY and DATADOG_APP_KEY secrets are set in repository settings
- Check test IDs or search query is correctly configured in workflow file
- Ensure tests are active in Datadog dashboard
- Verify tests have the correct tags if using tag-based search

### Build Failures
- Check environment variables are properly configured
- Verify Shopify and Supabase credentials are valid
- Review build logs for specific errors
- Ensure all dependencies install correctly

### Test Failures
- Review Datadog dashboard for detailed failure information
- Check if application is accessible at production URL
- Verify test scenarios match current application behavior
- Update tests if application functionality changed

## Cost Considerations

- Datadog Synthetics tests consume billable test runs
- Consider limiting scheduled runs frequency if needed
- Use `test-search-query` to control which tests run in CI
- Monitor usage in Datadog billing dashboard
- Free tier may be sufficient for initial testing

## Technical Details

### Action Version
The workflow uses `DataDog/synthetics-ci-github-action@v1.14.0`, which is a stable release that supports:
- Hyphenated parameter names (`api-key`, `app-key`)
- Tag-based test selection
- Test ID filtering
- Detailed result reporting

### Previous Issues (Now Fixed)
- ❌ Version `@v1` didn't exist (fixed by using `@v1.14.0`)
- ❌ Parameter names used underscores (fixed by using hyphens: `api-key`, `app-key`)
- ✅ Workflow now configured correctly

## Next Steps

1. **Repository Admin**: Approve the workflow run in GitHub Actions
2. **Optional**: Configure Datadog account and add secrets for active testing
3. **Optional**: Create synthetic tests in Datadog dashboard
4. **Optional**: Update workflow file to specify which tests to run

## Additional Resources

- [Datadog Synthetics Documentation](https://docs.datadoghq.com/synthetics/)
- [GitHub Action for Datadog Synthetics](https://github.com/DataDog/synthetics-ci-github-action)
- [Continuous Testing Best Practices](https://docs.datadoghq.com/synthetics/cicd_integrations/)
- [Asper Beauty Shop Architecture](ARCHITECTURE_DIAGRAM.md)

---

**Contact**: asperpharma@gmail.com | +962 79 065 6666 | Amman, Jordan
