# Datadog Synthetics CI Setup Guide

This guide explains how to configure and use Datadog Synthetics testing in the CI/CD pipeline.

## Overview

The Datadog Synthetics CI workflow (`.github/workflows/datadog-synthetics.yml`) runs automated browser and API tests to validate the application's functionality across different scenarios.

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

Add the following secrets to your GitHub repository (Settings → Secrets → Actions):

#### Required Datadog Secrets
- **DATADOG_API_KEY**: Your Datadog API key (get from Organization Settings → API Keys)
- **DATADOG_APP_KEY**: Your Datadog Application key (get from Organization Settings → Application Keys)

#### Required Environment Secrets
- **VITE_SUPABASE_PROJECT_ID**: Supabase project ID
- **VITE_SUPABASE_PUBLISHABLE_KEY**: Supabase public API key
- **VITE_SUPABASE_URL**: Supabase project URL
- **VITE_SHOPIFY_STORE_DOMAIN**: Shopify store domain
- **VITE_SHOPIFY_STOREFRONT_TOKEN**: Shopify Storefront API token
- **VITE_SHOPIFY_API_VERSION**: Shopify API version

## Configuring Tests

### Option 1: Run All Tests with Tag
Edit the workflow file to use a tag-based search:

```yaml
- name: Run Datadog Synthetics tests
  uses: DataDog/synthetics-ci-github-action@v1
  with:
    api_key: ${{ secrets.DATADOG_API_KEY }}
    app_key: ${{ secrets.DATADOG_APP_KEY }}
    test_search_query: 'tag:ci'  # Run all tests tagged with 'ci'
```

### Option 2: Run Specific Tests
Specify test IDs directly:

```yaml
- name: Run Datadog Synthetics tests
  uses: DataDog/synthetics-ci-github-action@v1
  with:
    api_key: ${{ secrets.DATADOG_API_KEY }}
    app_key: ${{ secrets.DATADOG_APP_KEY }}
    public_ids: 'abc-def-ghi,123-456-789'  # Comma-separated test IDs
```

## Recommended Test Scenarios

### Browser Tests
1. **Homepage Load**: Verify www.asperbeautyshop.com loads correctly
2. **Product Browsing**: Navigate collections (skin-care, hair-care, etc.)
3. **Search Functionality**: Test product search with various keywords
4. **Add to Cart**: Add product to cart and verify cart state
5. **Checkout Flow**: Validate redirect to Shopify checkout
6. **Language Toggle**: Test EN/AR language switching
7. **Mobile Responsiveness**: Test on mobile viewports

### API Tests
1. **Shopify Products API**: Fetch products from Storefront API
2. **Supabase Auth**: Test authentication endpoints
3. **Beauty Assistant**: Validate AI assistant serverless function
4. **Health Check**: Verify site is accessible

## Workflow Behavior

### When Datadog is Not Configured
- Workflow will run successfully but skip Synthetics tests
- Output will show configuration instructions
- Build step still validates code compiles correctly

### When Datadog is Configured
- All configured tests will run
- Results are logged in workflow output
- Detailed results available in Datadog dashboard
- Tests marked as `continue-on-error: true` won't block deployment

## Monitoring & Alerts

1. **Datadog Dashboard**: View test results, trends, and performance metrics
2. **GitHub Actions**: See test status in PR checks
3. **Alerts**: Configure Datadog alerts for test failures or performance degradation

## Troubleshooting

### Tests Not Running
- Verify DATADOG_API_KEY and DATADOG_APP_KEY secrets are set
- Check test IDs or search query is correctly configured
- Ensure tests are active in Datadog dashboard

### Build Failures
- Check environment variables are properly configured
- Verify Shopify and Supabase credentials are valid
- Review build logs for specific errors

### Test Failures
- Review Datadog dashboard for detailed failure information
- Check if application is accessible at production URL
- Verify test scenarios match current application behavior

## Cost Considerations

- Datadog Synthetics tests consume billable test runs
- Consider limiting scheduled runs frequency if needed
- Use `test_search_query` to control which tests run in CI
- Monitor usage in Datadog billing dashboard

## Additional Resources

- [Datadog Synthetics Documentation](https://docs.datadoghq.com/synthetics/)
- [GitHub Action for Datadog Synthetics](https://github.com/DataDog/synthetics-ci-github-action)
- [Continuous Testing Best Practices](https://docs.datadoghq.com/synthetics/cicd_integrations/)
