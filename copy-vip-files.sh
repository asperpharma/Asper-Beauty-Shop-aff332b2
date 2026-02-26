#!/bin/bash

# Asper Beauty Shop - VIP Files Copy Script
# This script copies files from a VIP folder to the project repository
# and commits them for deployment to the main site.

# === Customize these paths ===
SOURCE_VIP_FOLDER="/path/to/VIP-folder"           # Update to actual VIP folder location
TARGET_PROJECT_FOLDER="/path/to/project-repo"     # Update to your project repository location

# === Functions ===
function check_file_exists() {
  if [ ! -f "$1" ]; then
    echo "File not found: $1"
    exit 1
  fi
}

# === Checks ===
if [ ! -d "$SOURCE_VIP_FOLDER" ]; then
  echo "Source folder not found: $SOURCE_VIP_FOLDER"
  exit 1
fi
if [ ! -d "$TARGET_PROJECT_FOLDER" ]; then
  echo "Target repo not found: $TARGET_PROJECT_FOLDER"
  exit 1
fi

# === Check and Copy APPLY_TO_MAIN_SITE.md ===
SOURCE_APPLY="$SOURCE_VIP_FOLDER/APPLY_TO_MAIN_SITE.md"
check_file_exists "$SOURCE_APPLY"
cp "$SOURCE_APPLY" "$TARGET_PROJECT_FOLDER/"
echo "[✓] Copied APPLY_TO_MAIN_SITE.md"

# === Ask about env.main-site.example ===
SOURCE_ENV="$SOURCE_VIP_FOLDER/env.main-site.example"
read -p "Do you want to copy env.main-site.example? (y/N): " COPYENV
if [[ "$COPYENV" =~ ^[Yy] ]]; then
  check_file_exists "$SOURCE_ENV"
  cp "$SOURCE_ENV" "$TARGET_PROJECT_FOLDER/"
  echo "[✓] Copied env.main-site.example"
else
  echo "[skipped] env.main-site.example"
fi

# === Optionally copy .env for local development ===
read -p "Do you also want to create .env for local dev (never committed)? (y/N): " COPYLOCALENV
if [[ "$COPYLOCALENV" =~ ^[Yy] && "$COPYENV" =~ ^[Yy] ]]; then
  cp "$SOURCE_ENV" "$TARGET_PROJECT_FOLDER/.env"
  echo "[✓] Created .env for local dev (remember to fill real values)"
  echo "Make sure .env is listed in .gitignore (never commit real secrets!)"
fi

# === Git commit/push ===
cd "$TARGET_PROJECT_FOLDER" || exit 1
git add APPLY_TO_MAIN_SITE.md
if [[ "$COPYENV" =~ ^[Yy] ]]; then
  git add env.main-site.example
fi

git commit -m "Apply to main site: social, Google Merchant Center, all pages checklist"
git push

echo "All done! Files copied, committed, and pushed to repository."

# === End ===
