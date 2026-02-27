# VIP Files Copy Script

## Overview

The `copy-vip-files.sh` script automates copying files from a VIP folder to this
project repository, specifically for deploying updates to the main site. This
includes social media integration configs, Google Merchant Center settings, and
deployment checklists.

## Purpose

This script is used to:

- Copy deployment documentation from a VIP folder to the project
- Optionally copy environment configuration templates
- Automatically commit and push changes to the repository

## Prerequisites

1. **VIP Folder**: You must have access to the VIP folder containing the source
   files
2. **Git Repository**: This script should be run from within the project
   repository
3. **Git Credentials**: Ensure you have push access to the repository

## Configuration

Before running the script, update these variables at the top of
`copy-vip-files.sh`:

```bash
SOURCE_VIP_FOLDER="/path/to/VIP-folder"           # Update to actual VIP folder location
TARGET_PROJECT_FOLDER="/path/to/project-repo"     # Update to your project repo location
```

## Usage

1. **Make the script executable** (if not already):
   ```bash
   chmod +x copy-vip-files.sh
   ```

2. **Run the script**:
   ```bash
   ./copy-vip-files.sh
   ```

3. **Follow the prompts**:
   - The script will automatically copy `APPLY_TO_MAIN_SITE.md`
   - You'll be asked if you want to copy `env.main-site.example`
   - You'll be asked if you want to create a local `.env` file for development

## What It Does

### Automatic Actions

1. **Validates paths**: Checks that both source and target folders exist
2. **Copies APPLY_TO_MAIN_SITE.md**: Always copies this file from VIP folder to
   project root
3. **Commits changes**: Automatically stages, commits, and pushes to git

### Interactive Prompts

1. **Copy env.main-site.example?** (y/N)
   - If yes: Copies the environment configuration template to the project
   - If no: Skips this file

2. **Create .env for local dev?** (y/N)
   - Only asked if you chose to copy env.main-site.example
   - Creates a local `.env` file for development use
   - **WARNING**: Never commit this file with real secrets!

## Files Handled

### APPLY_TO_MAIN_SITE.md

- **Purpose**: Contains deployment checklist and main site application
  instructions
- **Action**: Always copied
- **Committed**: Yes

### env.main-site.example

- **Purpose**: Template for environment variables needed on main site
- **Action**: Copied only if you confirm
- **Committed**: Yes (it's a template, no secrets)

### .env (local development)

- **Purpose**: Local development environment variables
- **Action**: Created only if you confirm (copies from env.main-site.example)
- **Committed**: No (automatically ignored by .gitignore)

## Security Notes

⚠️ **Important Security Considerations**:

1. **Never commit real secrets**: The `.env` file created for local development
   should contain real values and must never be committed
2. **Templates only**: Only `env.main-site.example` (template with placeholder
   values) should be committed
3. **Check .gitignore**: Ensure `.env.local`, `.env.development.local`, etc. are
   in `.gitignore`
4. **Review before pushing**: The script automatically commits and pushes -
   review the changes before running

## Git Operations

The script performs these git operations automatically:

```bash
git add APPLY_TO_MAIN_SITE.md
git add env.main-site.example  # Only if you chose to copy it
git commit -m "Apply to main site: social, Google Merchant Center, all pages checklist"
git push
```

## Troubleshooting

### "Source folder not found"

- Verify the `SOURCE_VIP_FOLDER` path is correct
- Ensure you have read access to the VIP folder

### "Target repo not found"

- Verify the `TARGET_PROJECT_FOLDER` path is correct
- Ensure you're pointing to a valid git repository

### "File not found: /path/to/VIP-folder/APPLY_TO_MAIN_SITE.md"

- Verify the VIP folder contains the required files
- Check file names and spelling

### Git push fails

- Ensure you have push access to the repository
- Check your git credentials are configured
- Verify you're on the correct branch

## Example Workflow

```bash
# 1. Edit the script to set your paths
vim copy-vip-files.sh

# 2. Update the paths
SOURCE_VIP_FOLDER="/home/user/vip-files"
TARGET_PROJECT_FOLDER="/home/user/asper-beauty-shop"

# 3. Run the script
./copy-vip-files.sh

# Output:
# [✓] Copied APPLY_TO_MAIN_SITE.md
# Do you want to copy env.main-site.example? (y/N): y
# [✓] Copied env.main-site.example
# Do you also want to create .env for local dev (never committed)? (y/N): y
# [✓] Created .env for local dev (remember to fill real values)
# Make sure .env is listed in .gitignore (never commit real secrets!)
# [copilot/copy-vip-file-to-project abc1234] Apply to main site: social, Google Merchant Center, all pages checklist
#  2 files changed, 150 insertions(+)
# All done! Files copied, committed, and pushed to repository.
```

## Related Scripts

- `verify-connections.sh`: Validates all integrations and configurations are
  properly set up
- `scripts/audit-categories.ts`: Analyzes product categorization in Shopify
  store

## Support

For issues or questions:

- Email: asperpharma@gmail.com
- Phone: +962 79 065 6666
