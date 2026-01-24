#!/bin/bash

# Pull Request Review Helper
# This script helps identify pull requests that should be reviewed for closure
# 
# PREREQUISITES:
# - GitHub CLI (gh) must be installed and authenticated
# - Run from the repository root directory

set -e

echo "======================================"
echo "Pull Request Review Helper"
echo "======================================"
echo ""

# Colors
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is not installed."
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "Error: Not authenticated with GitHub CLI."
    echo "Run: gh auth login"
    exit 1
fi

echo "Fetching open pull requests..."
echo ""

# Get all open PRs
PR_LIST=$(gh pr list --state open --json number,title,headRefName,updatedAt,author --limit 100)

# Count PRs
PR_COUNT=$(echo "$PR_LIST" | jq '. | length')

echo -e "${GREEN}Found $PR_COUNT open pull requests${NC}"
echo ""

# Identify WIP PRs
echo -e "${YELLOW}=== Work In Progress (WIP) PRs ===${NC}"
echo "$PR_LIST" | jq -r '.[] | select(.title | contains("[WIP]")) | "PR #\(.number): \(.title)\n  Branch: \(.headRefName)\n  Updated: \(.updatedAt)\n"'

echo ""
echo -e "${YELLOW}=== PRs Related to Branches Marked for Deletion ===${NC}"

# List of branches to delete (matching cleanup script)
BRANCHES=(
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
)

for branch in "${BRANCHES[@]}"; do
    MATCHING_PR=$(echo "$PR_LIST" | jq -r ".[] | select(.headRefName == \"$branch\") | \"PR #\(.number): \(.title)\n  Branch: \(.headRefName)\n  Updated: \(.updatedAt)\n\"")
    if [[ -n "$MATCHING_PR" ]]; then
        echo "$MATCHING_PR"
    fi
done

echo ""
echo -e "${CYAN}=== Summary ===${NC}"
echo "Total Open PRs: $PR_COUNT"
echo ""
echo "Next Steps:"
echo "1. Review each PR listed above"
echo "2. Close PRs that are:"
echo "   - Duplicates"
echo "   - Stale/abandoned WIP"
echo "   - Related to branches being deleted"
echo "   - Superseded by other work"
echo ""
echo "To close a PR:"
echo "  gh pr close <PR-number> --comment \"Closing because...\""
echo ""

# Offer interactive closure
read -p "Would you like to review PRs interactively? (y/n): " interactive

# Normalize to lowercase and handle y/Y
if [[ "${interactive,,}" == "y" ]]; then
    echo ""
    echo "Opening PR list in browser..."
    gh pr list --web
fi
