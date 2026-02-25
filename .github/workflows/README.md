# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the Asper Beauty Shop project.

## Available Workflows

### 1. Deno (`deno.yml`)

**Purpose**: Runs linting, type checking, and tests for Deno-based code (primarily Supabase edge functions).

**Trigger**: 
- Push to `main` branch
- Pull requests to `main` branch

**Steps**:
- Formats check with `deno fmt --check`
- Linting with `deno lint`
- Type checking for edge functions
- Running tests with `deno test`

### 2. Sync Files to Lovable (`files-to-lovable.yml`)

**Purpose**: Automatically syncs file changes (added, modified, deleted) to Lovable via webhook on every push.

**Trigger**: 
- Push to any branch (`**`)

**Setup Required**:
1. Go to your GitHub repository settings
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add a secret named `LOVABLE_WEBHOOK_URL` with your Lovable webhook endpoint URL

**What it does**:
- Checks out the repository with the last 2 commits
- Detects which files were added, modified, or deleted in the latest commit
- Sends a JSON payload to the configured Lovable webhook with:
  - Repository information
  - Branch name
  - Commit details (SHA, message, author, timestamp)
  - Lists of changed files (added, modified, deleted)

**Example JSON Payload**:
```json
{
  "repository": "asperpharma/Asper-Beauty-Shop-aff332b2",
  "branch": "main",
  "commit": {
    "sha": "abc123...",
    "message": "Add new feature",
    "author": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "timestamp": "2026-02-25T13:00:00Z"
  },
  "changes": {
    "added": ["src/components/NewComponent.tsx"],
    "modified": ["src/pages/Index.tsx", "README.md"],
    "deleted": ["src/utils/deprecated.ts"]
  }
}
```

**Note**: If the `LOVABLE_WEBHOOK_URL` secret is not configured, the workflow will still run successfully but will just log the detected changes without sending them anywhere.

## Troubleshooting

### Workflow not triggering
- Check that the workflow file is in the `.github/workflows/` directory
- Ensure the YAML syntax is valid
- Verify branch protection rules aren't blocking the workflow

### Lovable sync not working
- Verify the `LOVABLE_WEBHOOK_URL` secret is correctly configured
- Check the workflow run logs in the **Actions** tab
- Ensure the webhook endpoint is accessible and accepting POST requests

### How to view workflow runs
1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Select the workflow you want to inspect
4. Click on a specific run to see detailed logs

## Contributing

When adding new workflows:
1. Follow the existing naming convention (kebab-case `.yml` files)
2. Add comprehensive comments explaining the workflow's purpose
3. Update this README with documentation for the new workflow
4. Test the workflow on a branch before merging to main
