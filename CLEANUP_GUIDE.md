# Repository Cleanup Guide

## Overview
This guide provides instructions for cleaning up the Asper Beauty Shop repository by removing unnecessary branches and managing pull requests.

## Current Status (as of 2026-01-24)

### Repository Health
- ✅ **Build Status**: Project builds successfully
- ✅ **Dependencies**: All dependencies installed correctly
- ⚠️ **Vulnerabilities**: 4 vulnerabilities detected (3 moderate, 1 high) - should be reviewed
- ⚠️ **Browserslist**: Data is 7 months old - consider updating

### Branch Status
- **Total Branches**: 25 branches
- **Protected Branches**: All 25 branches are currently protected
- **Main Branch**: `main` (commit: 36879ae)
- **Extra Branches to Delete**: 22+ unnecessary branches

### Pull Request Status
- **Open PRs**: 32+ pull requests
- **WIP PRs**: Many are marked as [WIP] (Work In Progress)
- **Duplicate/Stale PRs**: Multiple PRs with similar purposes

## Problem: All Branches Are Protected

**Critical Issue**: All branches including unnecessary ones are protected, which prevents deletion via git commands or scripts. This requires administrative action through GitHub's web interface or API with admin privileges.

## Recommended Cleanup Actions

### Step 1: Unprotect and Delete Unnecessary Branches

The following branches should be unprotected and deleted (GitHub Admin Required):

#### Copilot-Generated Branches (Task-Specific)
These were created for specific tasks and are no longer needed:
- `copilot/check-hall-website-functionality`
- `copilot/complete-task`
- `copilot/configure-github-pages-deployment`
- `copilot/connect-settings-upgrades`
- `copilot/delete-extra-branches` (current PR branch - delete after merging/closing)
- `copilot/fix-all-issues`
- `copilot/fix-and-run`
- `copilot/fix-and-save-everything`
- `copilot/fix-bug-in-application`
- `copilot/fix-everything`
- `copilot/fix-issue-with-c`
- `copilot/fix-issues-to-publish-website`
- `copilot/identify-code-improvements`
- `copilot/pull-request-and-remove-unnecessary-data`
- `copilot/refactor-duplicated-code`
- `copilot/sss`
- `copilot/update-copilot-instructions`

#### Test/Temporary Branches
- `asperpharma-patch-1`
- `branch`
- `name-the-name`
- `new-branch`

#### Dated Branches (Likely Temporary)
- `2026-01-17-iaj3-fd97e`
- `2026-01-22-n57a`

#### Revert Chain Branches
- `revert-24-revert-23-revert-22-revert-21-revert-20-revert-18-copilot/fix-issue-with-c`

**Note about revert chain**: This extremely long revert chain suggests a problematic merge/revert history. This typically happens when:
1. Multiple attempts were made to revert changes
2. Each revert was itself reverted, creating a chain
3. This indicates confusion about which state the code should be in

This branch should be deleted as it represents a problematic workflow that has likely been resolved in a different way. If you need to understand what this branch was trying to achieve, check the git history and associated PRs (PRs #18-24) before deletion.

### Step 2: Review and Close Unnecessary Pull Requests

Review the 32+ open PRs and close those that are:
- Duplicates
- Marked as WIP with no recent activity
- Superseded by other PRs
- Related to branches that will be deleted

**Top PR candidates for review/closure:**
- PR #32: [WIP] Remove all extra branches and complete tasks
- PR #31: [WIP] Fix all existing issues in project
- PR #30: [WIP] Fix issues related to saving data
- PR #29: Unable to proceed: Problem statement "sss" provides no actionable requirements
- PR #28: [WIP] Pull all request data and delete unnecessary entries
- _(Continue reviewing remaining 27+ PRs)_

### Step 3: Address Security Vulnerabilities

After cleanup, address the 4 npm security vulnerabilities:
```bash
npm audit
npm audit fix
# Review and manually fix any remaining issues
```

### Step 4: Update Dependencies (Optional but Recommended)

```bash
# Update browserslist data
npx update-browserslist-db@latest

# Check for outdated packages
npm outdated

# Update packages as appropriate
npm update
```

## Instructions for Repository Admins

### To Unprotect and Delete a Branch:

1. **Via GitHub Web Interface:**
   - Go to: `https://github.com/asperpharma/Asper-Beauty-Shop/settings/branches`
   - Find the branch in the protection rules
   - Click "Delete" or "Edit" → Remove protection
   - Go to: `https://github.com/asperpharma/Asper-Beauty-Shop/branches`
   - Delete the unprotected branch

2. **Via GitHub CLI (if available):**
   ```bash
   # Unprotect branch (requires admin access)
   gh api repos/asperpharma/Asper-Beauty-Shop/branches/{branch}/protection -X DELETE
   
   # Delete branch
   gh api repos/asperpharma/Asper-Beauty-Shop/git/refs/heads/{branch} -X DELETE
   ```

3. **Via git (after unprotecting on GitHub):**
   ```bash
   git push origin --delete {branch-name}
   ```

### To Close Pull Requests:

1. **Via GitHub Web Interface:**
   - Go to the PR page
   - Click "Close pull request"
   - Optionally add a comment explaining why

2. **Via GitHub CLI:**
   ```bash
   gh pr close {PR-number} --comment "Closing as duplicate/stale"
   ```

## Branches to Keep

Only these branches should remain after cleanup:
- `main` - Primary production branch

All other branches can be deleted after ensuring no valuable work is lost.

## Post-Cleanup Verification

After cleanup, verify:
1. ✅ Only `main` branch remains
2. ✅ All stale PRs are closed
3. ✅ Build still works: `npm run build`
4. ✅ Lint passes: `npm run lint`
5. ✅ Security vulnerabilities addressed
6. ✅ Dependencies updated

## Summary

This repository has accumulated many task-specific branches and PRs from Copilot agents. A thorough cleanup requires:

1. **Administrative access** to unprotect branches in GitHub settings
2. **Manual review** of PRs to determine which should be closed
3. **Code verification** to ensure no valuable work is lost
4. **Security updates** to address vulnerabilities

The codebase itself is healthy and builds successfully. The cleanup is primarily about repository hygiene and removing accumulated task branches.
