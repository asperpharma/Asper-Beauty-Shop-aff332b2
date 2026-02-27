# Pull Request Merge Guidelines

## 🚀 Deployment Process Overview

**IMPORTANT**: This repository deploys to production automatically when code is merged to the `main` branch via Lovable platform.

## Production Deployment

- **Platform**: Lovable
- **Production URLs**:
  - https://www.asperbeautyshop.com (custom domain)
  - https://asperbeautyshop.lovable.app (Lovable URL)
- **Auto-Deploy Trigger**: Push to `main` branch
- **Build Process**: Automatic (npm run build)
- **Deployment Time**: ~2-5 minutes after merge

## PR Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
# or
git checkout -b copilot/task-description
```

### 2. Develop and Test

- Make your changes
- Test locally: `npm run dev`
- Verify build: `npm run build && npm run preview`
- Run linter: `npm run lint`

### 3. Open Pull Request

- Create PR targeting `main` branch
- Fill out PR template completely
- Request review from maintainers
- Ensure CI checks pass (GitHub Actions workflow)

### 4. Code Review

- Address review comments
- Make requested changes
- Push updates to the same branch
- CI will re-run automatically

### 5. Merge to Main

**Before merging, ensure:**

- ✅ All CI checks are passing
- ✅ Code review approved by at least one maintainer
- ✅ No merge conflicts with `main`
- ✅ Build verification completed successfully
- ✅ Changes have been tested locally

**To merge:**

1. **Option A - GitHub UI**:
   - Click "Merge pull request" button
   - Choose merge strategy:
     - **Squash and merge** (recommended for feature PRs)
     - **Rebase and merge** (for clean linear history)
     - **Create merge commit** (for preserving PR history)
   - Confirm merge

2. **Option B - Command Line**:
   ```bash
   git checkout main
   git pull origin main
   git merge --no-ff feature/your-feature-name
   git push origin main
   ```

### 6. Post-Merge

After merging to `main`:

1. **Automatic Actions**:
   - Lovable detects the push to `main`
   - Runs `npm run build` automatically
   - Deploys to production URLs
   - Invalidates CDN cache

2. **Verify Deployment**:
   - Wait 2-5 minutes for deployment
   - Check https://www.asperbeautyshop.com
   - Test key functionality
   - Monitor Lovable dashboard for deployment status

3. **Clean Up**:
   - Delete the feature branch (optional)
   - Close related issues
   - Update project documentation if needed

## Branch Protection (Recommended Settings)

To prevent accidental direct pushes to `main`, configure these settings in GitHub:

1. Go to Repository Settings → Branches
2. Add branch protection rule for `main`:
   - ✅ Require pull request reviews before merging (1 approval)
   - ✅ Require status checks to pass before merging
     - `verify-build` (from deploy-to-production.yml)
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators (optional)
   - ✅ Do not allow bypassing the above settings

## Common Issues

### Problem: PR Not Deploying After Merge

**Cause**: PR was not merged to `main` branch

**Solution**: 
- Verify the PR target branch is `main`
- Check PR status - it must show "Merged" (not just "Closed")
- Verify commit appears in `main` branch history

### Problem: Build Failing After Merge

**Cause**: Code passed local tests but fails in CI/CD

**Solution**:
- Check GitHub Actions logs for error details
- Reproduce the issue locally with `npm run build`
- Create a hotfix PR to address the issue
- Fast-track review and merge

### Problem: Multiple PRs Pending, None Merged

**Cause**: PRs created but never reviewed/merged

**Solution**:
- Prioritize PRs for review
- Use PR labels: `ready-for-review`, `needs-changes`, `approved`
- Set up regular PR review schedule (e.g., daily)
- Consider using auto-merge for simple, low-risk PRs

## Best Practices

### For Contributors

1. **Keep PRs Small**: Easier to review and less risky to merge
2. **Test Thoroughly**: Don't rely only on CI
3. **Update Documentation**: Keep docs in sync with code
4. **Write Clear Descriptions**: Help reviewers understand your changes
5. **Respond to Reviews**: Address feedback promptly

### For Maintainers

1. **Review Promptly**: Don't let PRs go stale
2. **Merge Regularly**: Get approved changes into production
3. **Communicate**: Let contributors know review status
4. **Monitor Deployments**: Watch for issues after merges
5. **Document Decisions**: Explain why PRs are approved/rejected

## Deployment Checklist

Before merging any PR to `main`:

- [ ] PR has clear description and links to related issues
- [ ] Code follows project style guidelines
- [ ] All tests pass locally and in CI
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors or warnings
- [ ] Changes tested in multiple browsers (if UI changes)
- [ ] Mobile responsiveness verified (if UI changes)
- [ ] Bilingual support tested (EN/AR)
- [ ] No security vulnerabilities introduced
- [ ] Environment variables documented (if added)
- [ ] Breaking changes documented in CHANGELOG
- [ ] At least one approval from maintainer

## Emergency Procedures

### Hotfix for Production Issue

1. Create hotfix branch from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-issue
   ```

2. Make minimal fix
3. Test thoroughly
4. Open PR with `[HOTFIX]` prefix
5. Request urgent review
6. Merge as soon as approved
7. Monitor production closely

### Rollback Failed Deployment

1. Identify last working commit:
   ```bash
   git log main --oneline -10
   ```

2. Create rollback PR:
   ```bash
   git checkout -b hotfix/rollback-to-COMMIT_SHA
   git revert BAD_COMMIT_SHA
   git push origin hotfix/rollback-to-COMMIT_SHA
   ```

3. Open PR, get approval, merge immediately
4. Lovable will deploy the rollback

## Questions?

- **Deployment Issues**: Contact Lovable support at support@lovable.dev
- **Repository Access**: Contact repository maintainers
- **General Questions**: Open a discussion in GitHub Discussions

---

**Last Updated**: February 2026  
**Maintainer**: asperpharma
