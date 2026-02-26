#!/bin/bash

# =============================================================================
# Apply Updates to understand-project Repository
# =============================================================================
# This script automates copying files from this development repository to the
# main production repository (understand-project) and commits the changes.
#
# Features:
# - Checks if source files exist before copying
# - Interactive prompts for file selection
# - Optional .env copying for local development
# - Git commit and push automation
# - Clear confirmations at each step
#
# Usage:
#   chmod +x apply_to_understand_project.sh
#   ./apply_to_understand_project.sh
#
# =============================================================================

set -e  # Exit on error

# === CONFIGURATION ===
# Update these paths to match your local setup
SOURCE_DEV_FOLDER="${SOURCE_DEV_FOLDER:-/path/to/Asper-Beauty-Shop-aff332b2}"
TARGET_PROJECT_FOLDER="${TARGET_PROJECT_FOLDER:-/path/to/understand-project}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# === HELPER FUNCTIONS ===

print_header() {
    echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

confirm() {
    read -p "$1 (y/n): " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

# === VALIDATION ===

print_header "Apply Updates to understand-project"

# Check if paths are configured
if [[ "$SOURCE_DEV_FOLDER" == "/path/to/Asper-Beauty-Shop-aff332b2" ]]; then
    print_error "SOURCE_DEV_FOLDER is not configured!"
    print_info "Edit this script and set SOURCE_DEV_FOLDER to your actual path."
    echo
    echo "Example:"
    echo "  SOURCE_DEV_FOLDER=\"/home/user/projects/Asper-Beauty-Shop-aff332b2\""
    exit 1
fi

if [[ "$TARGET_PROJECT_FOLDER" == "/path/to/understand-project" ]]; then
    print_error "TARGET_PROJECT_FOLDER is not configured!"
    print_info "Edit this script and set TARGET_PROJECT_FOLDER to your actual path."
    echo
    echo "Example:"
    echo "  TARGET_PROJECT_FOLDER=\"/home/user/projects/understand-project\""
    exit 1
fi

# Validate source folder exists
if [[ ! -d "$SOURCE_DEV_FOLDER" ]]; then
    print_error "Source folder does not exist: $SOURCE_DEV_FOLDER"
    exit 1
fi

# Validate target folder exists
if [[ ! -d "$TARGET_PROJECT_FOLDER" ]]; then
    print_error "Target folder does not exist: $TARGET_PROJECT_FOLDER"
    exit 1
fi

# Check if target is a git repository
if [[ ! -d "$TARGET_PROJECT_FOLDER/.git" ]]; then
    print_error "Target folder is not a git repository: $TARGET_PROJECT_FOLDER"
    exit 1
fi

print_success "Source folder: $SOURCE_DEV_FOLDER"
print_success "Target folder: $TARGET_PROJECT_FOLDER"
echo

# === FILE SELECTION ===

print_header "Select Files to Copy"

# File list to copy
declare -A FILES_TO_COPY

# Check for APPLY_TO_MAIN_SITE.md
if [[ -f "$SOURCE_DEV_FOLDER/APPLY_TO_MAIN_SITE.md" ]]; then
    if confirm "Copy APPLY_TO_MAIN_SITE.md?"; then
        FILES_TO_COPY["APPLY_TO_MAIN_SITE.md"]=1
        print_success "Will copy APPLY_TO_MAIN_SITE.md"
    fi
else
    print_warning "APPLY_TO_MAIN_SITE.md not found in source folder"
fi

echo

# Check for env.main-site.example
if [[ -f "$SOURCE_DEV_FOLDER/env.main-site.example" ]]; then
    if confirm "Copy env.main-site.example?"; then
        FILES_TO_COPY["env.main-site.example"]=1
        print_success "Will copy env.main-site.example"
    fi
else
    print_warning "env.main-site.example not found in source folder"
fi

echo

# Optional: Copy .env for local development (NEVER commit this!)
COPY_ENV=0
if [[ -f "$SOURCE_DEV_FOLDER/.env" ]]; then
    echo -e "${YELLOW}WARNING: .env contains secrets and should NEVER be committed!${NC}"
    if confirm "Copy .env for local development? (not recommended)"; then
        COPY_ENV=1
        print_warning "Will copy .env (ensure .gitignore excludes it!)"
    fi
fi

echo

# Check if any files selected
if [[ ${#FILES_TO_COPY[@]} -eq 0 ]] && [[ $COPY_ENV -eq 0 ]]; then
    print_error "No files selected to copy. Exiting."
    exit 0
fi

# === CONFIRMATION ===

print_header "Confirmation"
echo "The following files will be copied:"
for file in "${!FILES_TO_COPY[@]}"; do
    echo "  - $file"
done
if [[ $COPY_ENV -eq 1 ]]; then
    echo "  - .env (for local dev only)"
fi
echo
echo "From: $SOURCE_DEV_FOLDER"
echo "To:   $TARGET_PROJECT_FOLDER"
echo

if ! confirm "Proceed with copying?"; then
    print_info "Operation cancelled."
    exit 0
fi

# === COPY FILES ===

print_header "Copying Files"

for file in "${!FILES_TO_COPY[@]}"; do
    cp "$SOURCE_DEV_FOLDER/$file" "$TARGET_PROJECT_FOLDER/$file"
    print_success "Copied $file"
done

if [[ $COPY_ENV -eq 1 ]]; then
    cp "$SOURCE_DEV_FOLDER/.env" "$TARGET_PROJECT_FOLDER/.env"
    print_warning "Copied .env (verify .gitignore excludes it!)"
fi

echo

# === GIT COMMIT ===

print_header "Git Commit"

cd "$TARGET_PROJECT_FOLDER"

# Optional: Create a new branch before committing
CREATE_BRANCH=0
if confirm "Create a new branch for these changes?"; then
    CREATE_BRANCH=1
    BRANCH_NAME="main-site-update-$(date +%Y%m%d-%H%M%S)"
    git checkout -b "$BRANCH_NAME"
    print_success "Created and switched to branch: $BRANCH_NAME"
    echo
fi

# Check for uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    print_info "Changes detected. Staging files..."
    
    # Add only the copied files (not .env)
    for file in "${!FILES_TO_COPY[@]}"; do
        git add "$file"
        print_success "Staged $file"
    done
    
    echo
    read -p "Enter commit message (or press Enter for default): " COMMIT_MSG
    
    if [[ -z "$COMMIT_MSG" ]]; then
        COMMIT_MSG="Apply updates from dev repo: social, env template, automation script"
    fi
    
    git commit -m "$COMMIT_MSG"
    print_success "Committed changes"
    
    echo
    if confirm "Push to remote?"; then
        if [[ $CREATE_BRANCH -eq 1 ]]; then
            git push -u origin "$BRANCH_NAME"
            print_success "Pushed to remote on branch: $BRANCH_NAME"
        else
            git push
            print_success "Pushed to remote"
        fi
    else
        print_info "Changes committed locally. Run 'git push' manually when ready."
    fi
else
    print_info "No changes to commit."
fi

# === COMPLETION ===

print_header "Completion Summary"
print_success "Files successfully copied and committed!"
echo
echo "Next steps:"
echo "  1. Review changes: cd $TARGET_PROJECT_FOLDER && git log -1 -p"
echo "  2. Update Lovable environment variables"
echo "  3. Test locally: npm install && npm run build && npm run preview"
echo "  4. Deploy when ready: git push (if not done yet)"
echo
print_info "See APPLY_TO_MAIN_SITE.md for complete deployment checklist."
echo

print_success "Script completed successfully!"
