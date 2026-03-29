# Pull Request Management Guide

## Current PR Status

As of January 2026, the repository has **34 pull requests** with many still open. This document provides guidelines for managing PRs effectively.

## PR Review Status

### Open PRs Requiring Action

| PR # | Title | Status | Recommended Action |
|------|-------|--------|-------------------|
| 34 | Fix and merge all branches together | Active | Current cleanup initiative |
| 33 | d | Review | Unclear title - needs clarification |
| 32 | Repository cleanup | Review | Should be merged with #34 |
| 31 | Fix TypeScript type safety | Review | Needs code review |
| 30 | Replace all `any` types | Review | Duplicate of #31? |
| 29 | Unable to proceed: "sss" | Close | Invalid problem statement |
| 28 | Remove obsolete documentation | Review | Needs verification |
| 27 | Update dependencies | Review | Needs testing |
| 26 | Update dependencies | Close | Duplicate of #27 |
| 17 | Deployment readiness verification | Review | Important for production |
| 15 | Fix TypeScript linting errors | Review | May be superseded by #31 |
| 14 | Fix TypeScript type safety | Review | Duplicate of #31? |
| 12 | Performance optimizations | Review | Needs benchmarking |
| 11 | Configure GitHub Pages | Review | Deployment configuration |
| 10 | Verify lovable.ai integrations | Review | Integration verification |
| 9 | Verify project completion | Review | Status check |
| 8 | Prepare for production | Review | Pre-launch checklist |
| 7 | Refactor product showcases | Review | Code quality improvement |
| 6 | Fix formatting in SECURITY_STATUS.md | Close | Minor formatting issue |
| 4 | Fix React Hook violations | Review | Important for stability |

## PR Lifecycle Management

### 1. Opening a PR

**Before opening:**
- Ensure your branch is up to date with `main`
- Run linters and tests locally
- Write a clear, descriptive title
- Fill out the PR template completely

**PR Title Convention:**
```
<type>: <description>

Types: feat, fix, docs, chore, refactor, perf, test, ci
```

Examples:
- `feat: Add product filtering by category`
- `fix: Resolve checkout cart calculation bug`
- `docs: Update API integration guide`
- `chore: Update dependencies to latest versions`

**PR Description Should Include:**
- Summary of changes
- Motivation and context
- Testing performed
- Screenshots (for UI changes)
- Related issues/PRs
- Breaking changes (if any)
- Checklist of completed items

### 2. During Review

**For PR Authors:**
- Respond to review comments promptly
- Make requested changes or discuss alternatives
- Keep the PR updated with main
- Resolve conversations when addressed
- Request re-review after significant changes

**For Reviewers:**
- Review within 24-48 hours of request
- Be constructive and specific in feedback
- Approve when satisfied or request changes
- Resolve your own conversations when satisfied

### 3. Merging

**Before merging:**
- ✅ All CI checks pass
- ✅ At least 1 approval (for main branch)
- ✅ All conversations resolved
- ✅ Branch is up to date with main
- ✅ No merge conflicts

**After merging:**
- Delete the branch (automated in most cases)
- Close related issues
- Update project board (if applicable)
- Notify stakeholders of significant changes

### 4. Closing Without Merging

Valid reasons to close a PR:
- Duplicate of another PR
- Work is no longer needed
- Better solution implemented elsewhere
- Author abandoned the work
- Does not align with project direction

**When closing:**
- Add a comment explaining why
- Link to alternative PR/issue if applicable
- Thank the contributor for their effort
- Tag as "wontfix" or "duplicate" as appropriate

## PR Hygiene Rules

### Stale PR Policy

A PR is considered stale if:
- No activity for 60 days
- Author hasn't responded to feedback in 30 days
- Blockers preventing merge for 90+ days

**Process for stale PRs:**
1. Add "stale" label
2. Comment asking for status update
3. Wait 14 days for response
4. Close if no response, with explanation

### Draft PRs

Use draft status when:
- Work is incomplete
- You want early feedback
- PR depends on other changes
- Running CI tests before formal review

**Draft PR Guidelines:**
- Mark as "WIP:" in title or use GitHub draft feature
- List remaining tasks in description
- Request specific feedback if needed
- Convert to ready when complete

### Small, Focused PRs

**Preferred PR size:**
- < 400 lines changed (ideal)
- < 1000 lines changed (acceptable)
- \> 1000 lines changed (should be split)

**Tips for smaller PRs:**
- One logical change per PR
- Split refactoring from feature work
- Break large features into milestones
- Use feature flags for incremental releases

## PR Review Guidelines

### What to Review

**Code Quality:**
- Readability and maintainability
- Follows project conventions
- Appropriate comments/documentation
- No obvious bugs or edge cases

**Functionality:**
- Solves the stated problem
- Handles error cases
- Doesn't break existing features
- Performance implications

**Testing:**
- Adequate test coverage
- Tests actually test the changes
- Edge cases covered
- Tests pass consistently

**Security:**
- No sensitive data exposed
- Input validation present
- Authentication/authorization correct
- Dependencies secure

### Review Etiquette

**Do:**
- Be respectful and constructive
- Explain the "why" behind suggestions
- Offer alternatives when requesting changes
- Acknowledge good work
- Use "I think" or "Consider" for suggestions

**Don't:**
- Be dismissive or condescending
- Nitpick minor style issues (use linters)
- Block on personal preferences
- Request changes without explanation
- Forget to follow up on your reviews

### Approval Criteria

Approve when:
- Code meets quality standards
- Tests are adequate
- Documentation is updated
- No blocking issues remain
- Minor suggestions can be addressed later

Request changes when:
- Bugs or security issues present
- Insufficient testing
- Breaks existing functionality
- Major architectural concerns
- Does not meet requirements

## Automated PR Management

### GitHub Actions

The repository includes automated workflows for:

1. **CI/CD Pipeline** (`.github/workflows/deno.yml`)
   - Linting
   - Type checking
   - Tests
   - Build verification

2. **Branch Cleanup** (`.github/workflows/branch-cleanup.yml`)
   - Monitors stale branches
   - Reports cleanup opportunities
   - Runs weekly

### PR Labels

Use these labels to categorize PRs:

| Label | Description |
|-------|-------------|
| `bug` | Fixes a bug |
| `enhancement` | New feature or improvement |
| `documentation` | Documentation updates |
| `dependencies` | Dependency updates |
| `breaking-change` | Introduces breaking changes |
| `needs-review` | Waiting for reviewer |
| `needs-changes` | Changes requested |
| `ready-to-merge` | Approved and ready |
| `stale` | Inactive for extended period |
| `wontfix` | Will not be implemented |
| `duplicate` | Duplicate of another PR |

## Conflict Resolution

### Merge Conflicts

**Prevention:**
- Keep PRs small and focused
- Merge main into your branch regularly
- Coordinate with team on overlapping work
- Use feature branches for experimental work

**Resolution:**
1. Update your branch with latest main:
   ```bash
   git checkout main
   git pull
   git checkout your-branch
   git merge main
   ```

2. Resolve conflicts in your editor
   - Keep, remove, or combine changes
   - Test thoroughly after resolution
   - Run linters and tests

3. Commit the merge:
   ```bash
   git add .
   git commit -m "Merge main and resolve conflicts"
   git push
   ```

4. Request re-review if significant changes

### Disagreements in Review

If you disagree with review feedback:
1. Respond with your reasoning
2. Seek to understand the concern
3. Propose alternatives
4. Escalate to team lead if needed
5. Remember: code review is collaborative

## Bulk PR Management

### Closing Multiple Stale PRs

```bash
# Using GitHub CLI
gh pr list --state open --json number,title,updatedAt | \
  jq -r '.[] | select(.updatedAt < "'$(date -d '60 days ago' -I)'") | .number' | \
  xargs -I {} gh pr close {} --comment "Closing due to inactivity"
```

### Reviewing PR List

```bash
# List all open PRs
gh pr list --state open

# List PRs by label
gh pr list --label "needs-review"

# List PRs by author
gh pr list --author "username"

# List draft PRs
gh pr list --state open --draft
```

### Batch Operations

```bash
# Add label to multiple PRs
for pr in 4 7 12 15; do
  gh pr edit $pr --add-label "needs-review"
done

# Request review on multiple PRs
for pr in 4 7 12; do
  gh pr review $pr --approve -b "LGTM"
done
```

## Checklist for PR Authors

Before requesting review:
- [ ] Code is well-tested
- [ ] Linters pass
- [ ] Build succeeds
- [ ] Documentation updated
- [ ] Changelog updated (if applicable)
- [ ] Screenshots included (for UI changes)
- [ ] Branch is up to date with main
- [ ] PR description is complete
- [ ] Related issues linked
- [ ] Breaking changes noted

## Checklist for Reviewers

Before approving:
- [ ] Code quality is acceptable
- [ ] Tests cover the changes
- [ ] No obvious bugs
- [ ] Security implications considered
- [ ] Performance impact acceptable
- [ ] Documentation adequate
- [ ] Follows project conventions
- [ ] Breaking changes are justified

## Resources

- [BRANCH_MANAGEMENT.md](BRANCH_MANAGEMENT.md) - Branch management guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [GitHub PR Best Practices](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests)
- [Effective Code Review](https://google.github.io/eng-practices/review/)

## Questions?

If you have questions about PR management:
1. Check this guide and other documentation
2. Ask in team chat
3. Create a discussion in the repository
4. Contact a maintainer

---

**Last Updated:** January 2026  
**Maintained By:** Asper Beauty Shop Team
