# Branch Management Guide

## Current Situation

As of January 2026, the Asper Beauty Shop repository has accumulated **26 branches** and **34 pull requests** (many still open). This document provides guidance on cleaning up and managing branches going forward.

## Branch Inventory

### Active Development Branches
- `main` - Primary development branch (protected)
- `copilot/fix-merge-branches` - Current branch management initiative

### Branches Requiring Review

The following branches were identified and need review:

| Branch Name | Status | Action Needed |
|------------|--------|---------------|
| `2026-01-17-iaj3-fd97e` | Protected | Review if still needed |
| `2026-01-22-n57a` | Protected | Review if still needed |
| `asperpharma-patch-1` | Protected | Review patch contents |
| `branch` | Protected | Generic name - review purpose |
| `copilot/check-hall-website-functionality` | Protected | Check if completed |
| `copilot/complete-task` | Protected | Check if completed |
| `copilot/configure-github-pages-deployment` | Protected | Check if completed |
| `copilot/connect-settings-upgrades` | Protected | Check if completed |
| `copilot/delete-extra-branches` | Protected | Ironically needs review |
| `copilot/fix-all-issues` | Protected | Check if completed |
| `copilot/fix-and-run` | Protected | Check if completed |
| `copilot/fix-and-save-everything` | Protected | Check if completed |
| `copilot/fix-bug-in-application` | Protected | Check if completed |
| `copilot/fix-everything` | Protected | Check if completed |
| `copilot/fix-issue-with-c` | Protected | Check if completed |
| `copilot/fix-issues-to-publish-website` | Protected | Check if completed |
| `copilot/identify-code-improvements` | Protected | Check if completed |
| `copilot/pull-request-and-remove-unnecessary-data` | Protected | Check if completed |
| `copilot/refactor-duplicated-code` | Protected | Check if completed |
| `copilot/sss` | Protected | Unclear purpose |
| `copilot/update-copilot-instructions` | Protected | Check if completed |
| `name-the-name` | Protected | Generic name - review purpose |
| `new-branch` | Protected | Generic name - review purpose |
| `revert-24-revert-23-...` | Protected | Revert chain - likely stale |

## Cleanup Strategy

### Phase 1: Immediate Actions

1. **Review Open Pull Requests**
   - Close PRs that are no longer relevant
   - Merge PRs that are ready
   - Update stale PRs or convert to draft

2. **Identify Merged Work**
   - Check which branches have already been merged into `main`
   - Mark these for deletion

3. **Identify Abandoned Work**
   - Branches with no activity for 30+ days
   - Branches from reverted or closed PRs

### Phase 2: Branch Consolidation

1. **Delete Merged Branches**
   ```bash
   # List merged branches (run from main)
   git branch --merged main
   
   # Delete merged remote branches
   git push origin --delete <branch-name>
   ```

2. **Delete Stale Branches**
   - Branches older than 90 days with no open PR
   - Branches from abandoned work
   - Revert chains that are no longer relevant

3. **Keep Active Branches**
   - Branches with open, active PRs
   - Branches under active development
   - Protected branches serving a purpose

### Phase 3: Automation

Implement automated branch cleanup using GitHub Actions (see `.github/workflows/branch-cleanup.yml`).

## Branch Naming Convention

Going forward, use this convention:

```
<type>/<description>

Types:
- feature/   - New features
- fix/       - Bug fixes
- docs/      - Documentation updates
- chore/     - Maintenance tasks
- hotfix/    - Urgent production fixes
- release/   - Release branches
```

Examples:
- `feature/add-payment-integration`
- `fix/cart-checkout-error`
- `docs/update-readme`
- `chore/update-dependencies`

## Branch Protection Rules

Recommended settings for `main` branch:

- ✅ Require pull request reviews (1 reviewer minimum)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Require conversation resolution
- ❌ Do not allow force pushes
- ❌ Do not allow deletions

## Pull Request Management

### PR Lifecycle

1. **Open** - Active development
2. **Draft** - Work in progress, not ready for review
3. **Review** - Ready for team review
4. **Approved** - Reviewed and approved, ready to merge
5. **Merged** - Integrated into main
6. **Closed** - Declined or abandoned

### PR Hygiene

- Close stale PRs (no activity for 60 days)
- Update PR descriptions with current status
- Link PRs to related issues
- Use draft status for work in progress
- Delete branch after merging

## Automated Cleanup

The repository now includes a GitHub Actions workflow (`.github/workflows/branch-cleanup.yml`) that:

1. **Runs weekly** - Every Monday at 00:00 UTC
2. **Identifies stale branches** - No commits for 90 days
3. **Notifies maintainers** - Creates an issue with findings
4. **Suggests deletions** - Provides commands for cleanup

## Manual Cleanup Commands

### List All Remote Branches
```bash
git fetch --all
git branch -r
```

### Check Branch Status
```bash
# Check if branch is merged
git branch -r --merged main | grep <branch-name>

# Check last commit date
git log -1 --format="%ai" origin/<branch-name>

# Check associated PRs
gh pr list --state all --head <branch-name>
```

### Delete Remote Branch
```bash
# Single branch
git push origin --delete <branch-name>

# Multiple branches
for branch in branch1 branch2 branch3; do
  git push origin --delete $branch
done
```

### Bulk Operations
```bash
# List branches older than 90 days (requires local fetch)
git for-each-ref --sort=-committerdate refs/remotes/origin/ \
  --format='%(committerdate:short) %(refname:short)' | \
  awk '$1 < "'$(date -d '90 days ago' +%Y-%m-%d)'" {print $2}'

# List merged branches (excluding main)
git branch -r --merged main | grep -v "main" | sed 's/origin\///'
```

## Review Checklist

Before deleting a branch, verify:

- [ ] Branch has been merged or work is no longer needed
- [ ] No open pull requests reference the branch
- [ ] No other branches depend on this branch
- [ ] No deployment or CI/CD processes reference the branch
- [ ] Team has been notified if this was a shared branch

## Maintenance Schedule

| Task | Frequency | Owner |
|------|-----------|-------|
| Review open PRs | Weekly | Team Lead |
| Close stale PRs | Monthly | Maintainers |
| Delete merged branches | After merge | PR Author |
| Audit branch list | Quarterly | Team Lead |
| Update this document | As needed | Team |

## Getting Help

If you're unsure about deleting a branch:

1. Check the branch history: `git log origin/<branch-name>`
2. Check for open PRs: `gh pr list --head <branch-name>`
3. Ask in team chat or create a discussion
4. When in doubt, keep it and tag for review

## See Also

- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [GOVERNANCE.md](GOVERNANCE.md) - Repository governance
- [GitHub Flow](https://guides.github.com/introduction/flow/) - Branch workflow guide
