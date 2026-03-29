#!/bin/bash

# Repository Cleanup Script
# This script helps delete unnecessary branches after they have been unprotected in GitHub settings
# 
# PREREQUISITES:
# 1. All branches must be unprotected in GitHub settings first
# 2. You must have admin/push access to the repository
# 3. Run this script from the repository root directory
#
# WARNING: This script will DELETE branches. Review the list carefully before running.

set -e  # Exit on error

echo "======================================"
echo "Asper Beauty Shop - Branch Cleanup"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Fetch latest from remote
echo "Fetching latest from remote..."
git fetch origin --prune

# List of branches to delete
BRANCHES_TO_DELETE=(
    "copilot/check-hall-website-functionality"
    "copilot/complete-task"
    "copilot/configure-github-pages-deployment"
    "copilot/connect-settings-upgrades"
    "copilot/delete-extra-branches"
    "copilot/fix-all-issues"
    "copilot/fix-and-run"
    "copilot/fix-and-save-everything"
    "copilot/fix-bug-in-application"
    "copilot/fix-everything"
    "copilot/fix-issue-with-c"
    "copilot/fix-issues-to-publish-website"
    "copilot/identify-code-improvements"
    "copilot/pull-request-and-remove-unnecessary-data"
    "copilot/refactor-duplicated-code"
    "copilot/sss"
    "copilot/update-copilot-instructions"
    "asperpharma-patch-1"
    "branch"
    "name-the-name"
    "new-branch"
    "2026-01-17-iaj3-fd97e"
    "2026-01-22-n57a"
    "revert-24-revert-23-revert-22-revert-21-revert-20-revert-18-copilot/fix-issue-with-c"
)

echo ""
echo -e "${YELLOW}The following ${#BRANCHES_TO_DELETE[@]} branches will be deleted:${NC}"
echo ""
for branch in "${BRANCHES_TO_DELETE[@]}"; do
    echo "  - $branch"
done
echo ""

# Ask for confirmation
echo -e "${RED}WARNING: This will permanently delete these branches from the remote repository!${NC}"
read -p "Are you sure you want to continue? (type 'yes' to proceed): " confirmation

# Trim whitespace
confirmation=$(echo "$confirmation" | xargs)

if [ "$confirmation" != "yes" ]; then
    echo -e "${YELLOW}Cleanup cancelled.${NC}"
    exit 0
fi

echo ""
echo "Starting branch deletion..."
echo ""

# Track statistics
deleted_count=0
failed_count=0
skipped_count=0

# Delete each branch
for branch in "${BRANCHES_TO_DELETE[@]}"; do
    echo -n "Deleting $branch... "
    
    # Check if branch exists on remote
    if git ls-remote --exit-code --heads origin "$branch" > /dev/null 2>&1; then
        # Try to delete the branch
        if git push origin --delete "$branch" 2>/dev/null; then
            echo -e "${GREEN}✓ Deleted${NC}"
            ((deleted_count++))
        else
            echo -e "${RED}✗ Failed (may be protected)${NC}"
            ((failed_count++))
        fi
    else
        echo -e "${YELLOW}○ Does not exist${NC}"
        ((skipped_count++))
    fi
done

echo ""
echo "======================================"
echo "Cleanup Summary"
echo "======================================"
echo -e "${GREEN}Deleted: $deleted_count${NC}"
echo -e "${RED}Failed: $failed_count${NC}"
echo -e "${YELLOW}Skipped: $skipped_count${NC}"
echo "Total: ${#BRANCHES_TO_DELETE[@]}"
echo ""

if [ $failed_count -gt 0 ]; then
    echo -e "${YELLOW}Note: Failed deletions are likely due to branch protection.${NC}"
    echo "Please unprotect these branches in GitHub settings and run this script again."
    echo "Branch settings: https://github.com/asperpharma/Asper-Beauty-Shop/settings/branches"
fi

if [ $deleted_count -gt 0 ]; then
    echo -e "${GREEN}Cleanup completed successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review and close associated pull requests"
    echo "2. Run 'npm audit fix' to address security vulnerabilities"
    echo "3. Consider running 'npx update-browserslist-db@latest'"
fi

echo ""
