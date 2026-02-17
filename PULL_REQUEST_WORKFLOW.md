# Pull Request Workflow Guide

This guide explains how to fetch, review, and work with pull requests in the Asper Beauty Shop repository.

## 🚀 Quick Start

### Fetch All Pull Requests

Use the provided script to fetch all PR branches:

```bash
./scripts/fetch-all-prs.sh
```

This command will:
1. Fetch all remote branches from the repository
2. Fetch all pull request refs (available as `origin/pr/<PR_NUMBER>`)
3. Display a summary of available branches and PRs

## 📋 Common Workflows

### 1. Review a Specific Pull Request

To checkout and review a specific PR locally:

```bash
# Fetch all PRs first
./scripts/fetch-all-prs.sh

# Create a local branch from the PR
git checkout -b review-pr-50 origin/pr/50

# Now you can review, test, and run the code
npm install
npm run dev
```

### 2. List All Available PRs

View all PRs that have been fetched:

```bash
# List all PR branches
git branch -r | grep 'pr/'

# Or count them
git branch -r | grep 'pr/' | wc -l
```

### 3. Fetch Updates for Existing PRs

If a PR has been updated after you fetched it:

```bash
# Fetch all updates
git fetch origin '+refs/pull/*/head:refs/remotes/origin/pr/*'

# Or fetch a specific PR
git fetch origin pull/50/head:pr-50
```

### 4. Switch Between PRs

```bash
# List local branches
git branch

# Switch to a different PR branch
git checkout review-pr-60

# Or create a new one from a PR
git checkout -b test-pr-70 origin/pr/70
```

### 5. Test Multiple PRs

```bash
# Fetch all PRs
./scripts/fetch-all-prs.sh

# Checkout first PR
git checkout -b test-pr-50 origin/pr/50
npm install
npm run build
npm test

# Switch to second PR
git checkout main
git checkout -b test-pr-51 origin/pr/51
npm install
npm run build
npm test
```

## 🔍 Advanced Usage

### Fetch Specific PR Only

If you only need a specific PR without fetching all:

```bash
git fetch origin pull/50/head:pr-50
git checkout pr-50
```

### Compare PR with Main Branch

```bash
# Checkout the PR
git checkout -b review-pr-50 origin/pr/50

# See what changed compared to main
git diff main...review-pr-50

# See the commit history
git log main..review-pr-50
```

### View PR Metadata

Use GitHub CLI or API to get PR details:

```bash
# Using GitHub CLI (if installed)
gh pr view 50

# Or view in browser
# https://github.com/asperpharma/Asper-Beauty-Shop-aff332b2/pull/50
```

## 📊 Understanding the Output

When you run `./scripts/fetch-all-prs.sh`, you'll see:

```
🔄 Fetching all pull request branches...
📦 Repository: https://github.com/asperpharma/Asper-Beauty-Shop-aff332b2
⬇️  Fetching all remote branches...
🔀 Fetching all pull request refs...

✅ Available remote branches:
  • main
  • copilot/feature-branch
  • ...

📊 Total remote branches fetched: 134
🔀 Pull request branches: 72
  • PR #1
  • PR #10
  • ...

✨ Done! You can now checkout any branch using:
   git checkout -b <local-branch-name> origin/<remote-branch-name>
```

## 🛠️ Troubleshooting

### Issue: "Unable to fetch PR refs"

**Solution:** This might be due to repository permissions. You can still fetch specific PRs:
```bash
git fetch origin pull/50/head:pr-50
```

### Issue: "Branch already exists"

**Solution:** Delete the local branch first:
```bash
git branch -D review-pr-50
git checkout -b review-pr-50 origin/pr/50
```

### Issue: "Changes not showing up"

**Solution:** Make sure to fetch updates:
```bash
git fetch origin
./scripts/fetch-all-prs.sh
```

## 📝 Best Practices

1. **Fetch regularly**: Run `./scripts/fetch-all-prs.sh` periodically to stay updated
2. **Clean branch names**: Use descriptive names like `review-pr-50` or `test-pr-feature`
3. **Test thoroughly**: Always run `npm install`, `npm run build`, and `npm run lint` after checking out a PR
4. **Clean up**: Delete local PR branches after reviewing: `git branch -D review-pr-50`
5. **Keep main updated**: Regularly pull main branch: `git checkout main && git pull origin main`

## 🔗 Related Commands

```bash
# List all remote branches
git branch -r

# List all local branches
git branch

# Delete a local branch
git branch -D branch-name

# Fetch all updates from remote
git fetch --all

# Show current branch
git branch --show-current

# Show branch history
git log --oneline --graph --all
```

## 📚 Additional Resources

- [GitHub Pull Requests Documentation](https://docs.github.com/en/pull-requests)
- [Git Branching Guide](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
- [Asper Beauty Shop README](README.md)
- [Contributing Guide](CONTRIBUTING.md)

---

**Need help?** Contact asperpharma@gmail.com or open an issue.
