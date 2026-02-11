# Quick Deployment Reference

This is a quick reference guide for deploying to the Asper Beauty Shop. For detailed information, see [BRANCH_DEPLOYMENT_GUIDE.md](./BRANCH_DEPLOYMENT_GUIDE.md).

## Deployment Branches

| Branch | Purpose | Auto-Deploy | Environment |
|--------|---------|-------------|-------------|
| `main` | Production code | ✅ Yes | Production (www.asperbeautyshop.com) |
| `deploy/asper-updates` | Rapid updates | ✅ Yes | Staging/Preview |

## Quick Commands

### Deploy to Production (main branch)

```bash
# Via PR (recommended)
git checkout -b feature/my-feature
git add .
git commit -m "Add feature"
git push origin feature/my-feature
# Create PR on GitHub → Get approval → Merge

# Direct push (requires permissions)
git checkout main
git pull origin main
git add .
git commit -m "Update"
git push origin main
```

### Deploy to Staging (deploy/asper-updates)

```bash
# Direct push
git checkout deploy/asper-updates
git pull origin deploy/asper-updates
git add .
git commit -m "Update content"
git push origin deploy/asper-updates

# Sync with main
git checkout deploy/asper-updates
git merge main
git push origin deploy/asper-updates
```

## Pre-Deployment Checklist

- [ ] `npm run build` - Build succeeds
- [ ] `npm run lint` - No linting errors
- [ ] Test locally with `npm run preview`
- [ ] Commit message is clear
- [ ] No sensitive data in changes

## Common Tasks

**Hotfix to production:**
```bash
git checkout main
git pull origin main
# Make fix
git add .
git commit -m "Fix: description"
git push origin main
```

**Update product content:**
```bash
git checkout deploy/asper-updates
git pull origin deploy/asper-updates
# Update content
git add .
git commit -m "Update: product descriptions"
git push origin deploy/asper-updates
```

**Rollback:**
```bash
git revert <commit-hash>
git push origin <branch-name>
```

## Platform URLs

- **Production**: https://www.asperbeautyshop.com
- **Lovable Dev**: https://asperbeautyshop.lovable.app
- **GitHub Actions**: https://github.com/asperpharma/Asper-Beauty-Shop-aff332b2/actions

## Need Help?

- 📖 [Full Branch Deployment Guide](./BRANCH_DEPLOYMENT_GUIDE.md)
- 📖 [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- 📖 [Contributing Guidelines](./CONTRIBUTING.md)
- 📧 Email: asperpharma@gmail.com
