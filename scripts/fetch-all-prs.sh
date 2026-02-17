#!/bin/bash

# Script to fetch all pull request branches from the GitHub repository
# This allows developers to work with and review any PR locally

set -e

echo "🔄 Fetching all pull request branches..."

# Get the repository information
REPO_URL=$(git config --get remote.origin.url)
echo "📦 Repository: $REPO_URL"

# Fetch all branches and PRs from origin
echo "⬇️  Fetching all remote branches..."
git fetch origin '+refs/heads/*:refs/remotes/origin/*' --prune

# Fetch all pull request refs
echo "🔀 Fetching all pull request refs..."
git fetch origin '+refs/pull/*/head:refs/remotes/origin/pr/*' || {
    echo "⚠️  Note: Unable to fetch PR refs directly. This might require additional repository permissions."
    echo "    You can still fetch specific PRs using: git fetch origin pull/<PR_NUMBER>/head:pr-<PR_NUMBER>"
}

# List all remote branches
echo ""
echo "✅ Available remote branches:"
git branch -r | grep -v '\->' | sed 's/origin\//  • /' | head -20

# Count branches
BRANCH_COUNT=$(git branch -r | grep -cv '\->')
echo ""
echo "📊 Total remote branches fetched: $BRANCH_COUNT"

# List PR branches if they exist
PR_COUNT=$(git branch -r | grep -c 'origin/pr/' || echo "0")
if [ "$PR_COUNT" -gt 0 ]; then
    echo "🔀 Pull request branches: $PR_COUNT"
    git branch -r | grep 'origin/pr/' | sed 's/origin\/pr\//  • PR #/' | head -10
fi

echo ""
echo "✨ Done! You can now checkout any branch using:"
echo "   git checkout -b <local-branch-name> origin/<remote-branch-name>"
echo ""
echo "📚 To list all branches: git branch -r"
echo "🔄 To update branches: git fetch --all"
