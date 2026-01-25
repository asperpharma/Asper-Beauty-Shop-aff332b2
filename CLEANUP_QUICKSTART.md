# Branch & PR Cleanup - Quick Reference

## Current State (January 2026)
- **26 branches** in repository
- **34 pull requests** (many open)
- **Action needed**: Consolidate and clean up

## Quick Actions

### 1. Review & Close Stale PRs (Priority: High)

```bash
# List all open PRs
gh pr list --state open

# Close a stale PR
gh pr close <number> --comment "Closing due to inactivity. Reopen if work resumes."
```

**Candidates for closure:**
- PR #29 (invalid problem statement)
- PR #26 (duplicate of #27)
- PR #6 (minor formatting - merge or close)
- PRs with no activity for 60+ days

### 2. Merge Ready PRs (Priority: High)

Review and merge these if ready:
- PR #31, #30, #15, #14 (TypeScript improvements - may overlap, pick best)
- PR #28 (documentation cleanup)
- PR #27 (dependency updates)
- PR #4 (React Hook fixes)

### 3. Delete Merged Branches (Priority: Medium)

```bash
# Check merged branches
git branch -r --merged main | grep -v main

# Delete a merged branch
git push origin --delete <branch-name>
```

### 4. Review Unclear Branches (Priority: Low)

Branches with unclear purposes:
- `branch`
- `new-branch`
- `name-the-name`
- `copilot/sss`
- `asperpharma-patch-1`

**Action:** Review commit history, then either rename with clear purpose or delete.

## Automated Tools

### 1. Helper Script (Interactive)
```bash
./scripts/cleanup-branches.sh
```

**Features:**
- List merged branches
- List stale branches (90+ days)
- Show branch info
- Delete branches interactively

### 2. GitHub Actions Workflow

**Automated weekly report:**
- Runs every Monday 00:00 UTC
- Creates/updates issue with findings
- Lists stale and merged branches
- Provides deletion commands

**Manual trigger:**
```bash
gh workflow run branch-cleanup.yml
```

## Step-by-Step Cleanup Process

### Week 1: PRs
1. Review all open PRs
2. Close invalid/stale PRs (comment reason)
3. Merge ready PRs
4. Convert WIP PRs to draft status
5. Request reviews on pending PRs

### Week 2: Branches
1. Delete branches from merged PRs
2. Review stale branches (90+ days)
3. Delete branches from closed PRs
4. Rename unclear branches or delete

### Week 3: Policies
1. Enable branch protection on `main`
2. Set up PR template (if not exists)
3. Configure auto-delete merged branches
4. Document branching strategy

### Week 4: Monitoring
1. Review automation results
2. Adjust policies as needed
3. Train team on new processes
4. Schedule quarterly audits

## Commands Cheat Sheet

### List Operations
```bash
# All branches with dates
for branch in $(git branch -r | sed 's/origin\///'); do
  echo "$branch: $(git log -1 --format='%ai' origin/$branch)"
done

# Merged branches
git branch -r --merged main | grep -v main

# Stale branches (90+ days)
# See ./scripts/cleanup-branches.sh
```

### Delete Operations
```bash
# Single branch
git push origin --delete <branch-name>

# Multiple branches
for branch in branch1 branch2 branch3; do
  git push origin --delete $branch
done
```

### PR Operations (requires GitHub CLI)
```bash
# List PRs by status
gh pr list --state open
gh pr list --state closed
gh pr list --draft

# Close PR
gh pr close <number> --comment "Reason for closing"

# Merge PR
gh pr merge <number> --squash

# View PR details
gh pr view <number>
```

### Bulk Operations
```bash
# Add label to multiple PRs
gh pr list --search "label:needs-review" --json number | \
  jq -r '.[].number' | \
  xargs -I {} gh pr edit {} --add-label "priority"

# Close multiple stale PRs
for pr in 29 26 6; do
  gh pr close $pr --comment "Closing stale PR"
done
```

## Branch Naming Convention (Going Forward)

```
<type>/<short-description>

Types:
- feature/    New features
- fix/        Bug fixes
- docs/       Documentation
- chore/      Maintenance
- hotfix/     Urgent fixes
- release/    Release preparation
```

**Examples:**
- `feature/payment-integration`
- `fix/cart-calculation-bug`
- `docs/update-api-guide`
- `chore/dependency-updates`

## Protection & Automation Settings

### Main Branch Protection
- ✅ Require PR reviews (1 minimum)
- ✅ Require status checks
- ✅ Require branches up to date
- ✅ Require conversation resolution
- ✅ Auto-delete head branches after merge

### Repository Settings
- Enable auto-merge for PRs
- Enable automatically delete head branches
- Require linear history (optional)
- Set default branch to `main`

## Monitoring & Maintenance

### Weekly
- [ ] Review open PRs
- [ ] Check CI/CD failures
- [ ] Respond to cleanup issues
- [ ] Update labels/milestones

### Monthly
- [ ] Audit branch list
- [ ] Close stale PRs
- [ ] Update documentation
- [ ] Review automation reports

### Quarterly
- [ ] Deep audit of all branches/PRs
- [ ] Review and update policies
- [ ] Archive old documentation
- [ ] Team training refresh

## Resources

| Document | Purpose |
|----------|---------|
| [BRANCH_MANAGEMENT.md](BRANCH_MANAGEMENT.md) | Complete branch management guide |
| [PR_MANAGEMENT.md](PR_MANAGEMENT.md) | Pull request guidelines |
| [scripts/cleanup-branches.sh](scripts/cleanup-branches.sh) | Interactive cleanup tool |
| [.github/workflows/branch-cleanup.yml](.github/workflows/branch-cleanup.yml) | Automated monitoring |

## Need Help?

1. **Check documentation** first (guides above)
2. **Run cleanup script** for interactive help
3. **Review automation** reports in Issues
4. **Ask in team chat** for guidance
5. **Tag @maintainers** in urgent cases

---

**Last Updated:** January 25, 2026  
**Next Audit:** April 2026
