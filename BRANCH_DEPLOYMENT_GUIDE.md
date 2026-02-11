# Branch Deployment Guide

**Last Updated**: February 11, 2026  
**Status**: ✅ Configured for Multi-Branch Deployment

## 🌿 Deployment Branches

This repository supports deployment from multiple branches to provide flexibility in the deployment workflow while maintaining stability.

### Primary Deployment Branch: `main`

- **Purpose**: Production-ready code
- **Protection**: Protected branch with required approvals
- **Auto-Deploy**: ✅ Yes (to production)
- **Target Environments**:
  - <https://www.asperbeautyshop.com> (custom domain)
  - <https://asperbeautyshop.lovable.app> (Lovable primary)

### Alternative Deployment Branch: `deploy/asper-updates`

- **Purpose**: Staged updates for Asper-specific features and content
- **Protection**: Configurable (can be protected or open)
- **Auto-Deploy**: ✅ Yes (to staging/preview)
- **Target Environments**:
  - Preview deployments (if configured on Lovable/Vercel/Netlify)
  - Can be configured for production if needed

## 🚀 Deployment Workflows

### Deploying to Production (via `main` branch)

```bash
# Option 1: Push directly (requires permissions)
git checkout main
git pull origin main
# Make your changes
git add .
git commit -m "Production update: description"
git push origin main

# Option 2: Via Pull Request (recommended)
git checkout -b feature/my-feature
# Make your changes
git add .
git commit -m "Add my feature"
git push origin feature/my-feature
# Create PR to main, get approval, merge
```

### Deploying via `deploy/asper-updates` branch

```bash
# Option 1: Push directly
git checkout deploy/asper-updates
git pull origin deploy/asper-updates
# Make your changes
git add .
git commit -m "Asper update: description"
git push origin deploy/asper-updates

# Option 2: Sync from main
git checkout deploy/asper-updates
git merge main
git push origin deploy/asper-updates

# Option 3: Cherry-pick specific commits
git checkout deploy/asper-updates
git cherry-pick <commit-hash>
git push origin deploy/asper-updates
```

## 🔒 Branch Protection Rules

### Recommended Settings for `main` Branch

**Required in GitHub Settings → Branches → Branch Protection Rules**:

- ✅ Require pull request reviews before merging
  - Required approvals: 1+
- ✅ Require status checks to pass before merging
  - Required checks: Deno CI, Build verification
- ✅ Require conversation resolution before merging
- ✅ Require linear history (optional)
- ✅ Include administrators (optional, for stricter control)

### Recommended Settings for `deploy/asper-updates` Branch

**More flexible for rapid updates**:

- ⚠️ Require pull request reviews (optional)
- ✅ Require status checks to pass before merging
  - Required checks: Deno CI, Build verification
- ⚙️ Allow force pushes: No (recommended)
- ⚙️ Allow deletions: No

## 🌐 Platform-Specific Configuration

### Lovable Platform

Lovable automatically deploys from configured branches. To enable `deploy/asper-updates`:

1. Go to Lovable Dashboard → Project Settings
2. Navigate to Git & Deployments
3. Add `deploy/asper-updates` as a deployment branch
4. Configure environment:
   - **Production**: `main` branch
   - **Preview**: `deploy/asper-updates` branch

Environment variables are shared across branches unless overridden.

### Vercel (if connected)

Add `vercel.json` configuration:

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "deploy/asper-updates": true
    }
  },
  "github": {
    "autoAlias": true,
    "autoJobCancelation": true
  }
}
```

### Netlify (if connected)

Add to `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[context.production]
  branch = "main"

[context.deploy-asper-updates]
  branch = "deploy/asper-updates"
  command = "npm run build"
  publish = "dist"
```

## 🔄 GitHub Actions Integration

The repository's GitHub Actions workflow (`.github/workflows/deno.yml`) is configured to run on both branches:

```yaml
on:
  push:
    branches: ["main", "deploy/asper-updates"]
  pull_request:
    branches: ["main", "deploy/asper-updates"]
```

**What runs on each push**:

1. ✅ Deno formatting check
2. ✅ Deno linter
3. ✅ TypeScript type-checking for Supabase functions
4. ✅ Deno test suite

## 🛠️ Common Deployment Scenarios

### Scenario 1: Hotfix to Production

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# Make fix and test
# ...

# Push directly to main (if you have permissions)
git checkout main
git merge hotfix/critical-fix
git push origin main
```

### Scenario 2: Asper Content Update

```bash
# Use deploy/asper-updates for content-focused changes
git checkout deploy/asper-updates
git pull origin deploy/asper-updates

# Update content (e.g., product descriptions, images)
# ...

git add .
git commit -m "Update product catalog for February"
git push origin deploy/asper-updates
```

### Scenario 3: Feature Development

```bash
# Create feature branch
git checkout -b feature/new-payment-method

# Develop and test
# ...

# Create PR to main for review
git push origin feature/new-payment-method
# Open PR on GitHub
```

### Scenario 4: Sync deploy/asper-updates with main

```bash
# Keep deploy/asper-updates up-to-date with main
git checkout deploy/asper-updates
git pull origin deploy/asper-updates
git merge origin/main
git push origin deploy/asper-updates
```

## ⚠️ Important Guidelines

### When to Use `main` Branch

- ✅ New features that affect core functionality
- ✅ Bug fixes that impact user experience
- ✅ Security updates
- ✅ Breaking changes
- ✅ Updates that require team review

### When to Use `deploy/asper-updates` Branch

- ✅ Product catalog updates
- ✅ Content changes (descriptions, images)
- ✅ Marketing copy updates
- ✅ Minor UI tweaks
- ✅ Configuration changes
- ✅ Rapid iterations on Asper-specific features

### Never Do This

- ❌ Force push to protected branches
- ❌ Commit sensitive data (API keys, passwords)
- ❌ Skip testing before deployment
- ❌ Deploy broken code
- ❌ Merge without resolving conflicts
- ❌ Delete deployment branches

## 🔍 Monitoring Deployments

### Check Deployment Status

**Lovable**:

- Dashboard: <https://lovable.dev/projects/asper-beauty-shop>
- View deployment logs and status
- Rollback if needed

**GitHub Actions**:

- Actions tab: <https://github.com/asperpharma/Asper-Beauty-Shop-aff332b2/actions>
- View CI/CD status for each push
- Check workflow logs for errors

### Rollback a Deployment

**Via Git** (revert to previous commit):

```bash
git checkout main
git revert <bad-commit-hash>
git push origin main
```

**Via Platform** (Lovable/Vercel/Netlify):

- Use platform dashboard to redeploy a previous version
- Or manually revert the git commit and push

## 📊 Deployment Checklist

Before deploying to any branch:

- [ ] Code compiles without errors (`npm run build`)
- [ ] Linter passes (`npm run lint`)
- [ ] All tests pass (if applicable)
- [ ] Local preview looks correct (`npm run preview`)
- [ ] Environment variables are configured
- [ ] No sensitive data in commits
- [ ] Commit message is descriptive
- [ ] Breaking changes are documented

## 🆘 Troubleshooting

### Deployment Fails on `deploy/asper-updates`

1. Check GitHub Actions logs for errors
2. Verify branch is up-to-date: `git pull origin deploy/asper-updates`
3. Ensure no merge conflicts
4. Check Lovable/Vercel/Netlify logs

### Cannot Push to Branch (Permission Denied)

1. Verify you have write access to the repository
2. Check if branch is protected (requires PR)
3. Ensure you're authenticated: `git remote -v`
4. Try: `git push -u origin deploy/asper-updates`

### Branch Not Deploying Automatically

1. Verify branch is configured in platform dashboard
2. Check webhook is active (GitHub Settings → Webhooks)
3. Ensure build command is correct in config
4. Check platform integration status

## 📞 Support

**Questions about deployment?**

- **GitHub Issues**: [Report issues](https://github.com/asperpharma/Asper-Beauty-Shop-aff332b2/issues)
- **Team Contact**: asperpharma@gmail.com
- **Lovable Support**: <support@lovable.dev>

---

**Related Documentation**:

- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Platform-specific deployment
- [Contributing Guidelines](./CONTRIBUTING.md) - How to contribute
- [README](./README.md) - Project overview
