#!/bin/bash

# Branch Cleanup Helper Script
# This script helps identify and clean up stale branches in the repository

set -e

COLOR_RED='\033[0;31m'
COLOR_GREEN='\033[0;32m'
COLOR_YELLOW='\033[1;33m'
COLOR_BLUE='\033[0;34m'
COLOR_RESET='\033[0m'

echo -e "${COLOR_BLUE}================================${COLOR_RESET}"
echo -e "${COLOR_BLUE}Branch Cleanup Helper${COLOR_RESET}"
echo -e "${COLOR_BLUE}================================${COLOR_RESET}"
echo ""

# Check if git is available
if ! command -v git &> /dev/null; then
    echo -e "${COLOR_RED}Error: git is not installed${COLOR_RESET}"
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo -e "${COLOR_RED}Error: Not in a git repository${COLOR_RESET}"
    exit 1
fi

# Fetch latest changes
echo -e "${COLOR_YELLOW}Fetching latest changes...${COLOR_RESET}"
git fetch --all --prune
echo ""

# Function to list merged branches
list_merged_branches() {
    echo -e "${COLOR_BLUE}=== Merged Branches (Safe to Delete) ===${COLOR_RESET}"
    echo ""
    
    # Ensure we're on main
    git checkout main 2>/dev/null || git checkout origin/main 2>/dev/null || true
    
    MERGED_BRANCHES=$(git branch -r --merged | grep -v HEAD | grep -v main | sed 's/origin\///' || true)
    
    if [ -z "$MERGED_BRANCHES" ]; then
        echo -e "${COLOR_GREEN}No merged branches found.${COLOR_RESET}"
    else
        echo "$MERGED_BRANCHES" | while read branch; do
            echo -e "  ${COLOR_GREEN}✓${COLOR_RESET} $branch"
        done
    fi
    echo ""
}

# Function to list stale branches
list_stale_branches() {
    echo -e "${COLOR_BLUE}=== Stale Branches (90+ days) ===${COLOR_RESET}"
    echo ""
    
    NINETY_DAYS_AGO=$(date -d '90 days ago' +%s 2>/dev/null || date -v-90d +%s 2>/dev/null)
    FOUND_STALE=false
    
    for branch in $(git branch -r | grep -v HEAD | sed 's/origin\///'); do
        LAST_COMMIT_DATE=$(git log -1 --format="%at" "origin/$branch" 2>/dev/null || echo "0")
        
        if [ "$LAST_COMMIT_DATE" != "0" ] && [ "$LAST_COMMIT_DATE" -lt "$NINETY_DAYS_AGO" ]; then
            LAST_COMMIT_HUMAN=$(git log -1 --format="%ai" "origin/$branch")
            DAYS_OLD=$(( ($(date +%s) - LAST_COMMIT_DATE) / 86400 ))
            AUTHOR=$(git log -1 --format="%an" "origin/$branch")
            
            echo -e "  ${COLOR_YELLOW}⚠${COLOR_RESET}  $branch"
            echo -e "      Last commit: $LAST_COMMIT_HUMAN ($DAYS_OLD days ago)"
            echo -e "      Author: $AUTHOR"
            echo ""
            FOUND_STALE=true
        fi
    done
    
    if [ "$FOUND_STALE" = false ]; then
        echo -e "${COLOR_GREEN}No stale branches found.${COLOR_RESET}"
    fi
    echo ""
}

# Function to list all branches
list_all_branches() {
    echo -e "${COLOR_BLUE}=== All Remote Branches ===${COLOR_RESET}"
    echo ""
    
    for branch in $(git branch -r | grep -v HEAD | sed 's/origin\///'); do
        LAST_COMMIT=$(git log -1 --format="%ai" "origin/$branch" 2>/dev/null || echo "N/A")
        AUTHOR=$(git log -1 --format="%an" "origin/$branch" 2>/dev/null || echo "N/A")
        echo -e "  • $branch"
        echo -e "    Last: $LAST_COMMIT by $AUTHOR"
    done
    echo ""
}

# Function to delete branches
delete_branches() {
    echo -e "${COLOR_YELLOW}WARNING: This will delete branches from the remote repository!${COLOR_RESET}"
    echo -e "${COLOR_YELLOW}Make sure you have reviewed the branches before deleting.${COLOR_RESET}"
    echo ""
    read -p "Enter branch names to delete (space-separated), or 'cancel' to abort: " branches
    
    if [ "$branches" = "cancel" ]; then
        echo "Cancelled."
        return
    fi
    
    for branch in $branches; do
        echo -e "${COLOR_YELLOW}Deleting branch: $branch${COLOR_RESET}"
        if git push origin --delete "$branch"; then
            echo -e "${COLOR_GREEN}✓ Deleted: $branch${COLOR_RESET}"
        else
            echo -e "${COLOR_RED}✗ Failed to delete: $branch${COLOR_RESET}"
        fi
    done
    echo ""
}

# Function to show branch info
show_branch_info() {
    read -p "Enter branch name: " branch
    
    echo ""
    echo -e "${COLOR_BLUE}=== Branch Info: $branch ===${COLOR_RESET}"
    echo ""
    
    # Last commit
    echo -e "${COLOR_YELLOW}Last Commit:${COLOR_RESET}"
    git log -1 --format="  Author: %an <%ae>%n  Date: %ai%n  Message: %s" "origin/$branch" 2>/dev/null || echo "  Branch not found"
    echo ""
    
    # Check if merged
    echo -e "${COLOR_YELLOW}Merge Status:${COLOR_RESET}"
    if git branch -r --merged main | grep -q "origin/$branch"; then
        echo -e "  ${COLOR_GREEN}✓ Merged into main${COLOR_RESET}"
    else
        echo -e "  ${COLOR_RED}✗ Not merged${COLOR_RESET}"
    fi
    echo ""
    
    # Recent commits
    echo -e "${COLOR_YELLOW}Recent Commits (last 5):${COLOR_RESET}"
    git log -5 --oneline "origin/$branch" 2>/dev/null || echo "  Branch not found"
    echo ""
}

# Main menu
while true; do
    echo -e "${COLOR_BLUE}What would you like to do?${COLOR_RESET}"
    echo "  1) List merged branches (safe to delete)"
    echo "  2) List stale branches (90+ days old)"
    echo "  3) List all branches"
    echo "  4) Show branch info"
    echo "  5) Delete branches"
    echo "  6) Refresh (fetch latest)"
    echo "  7) Exit"
    echo ""
    read -p "Choose an option (1-7): " choice
    echo ""
    
    case $choice in
        1)
            list_merged_branches
            ;;
        2)
            list_stale_branches
            ;;
        3)
            list_all_branches
            ;;
        4)
            show_branch_info
            ;;
        5)
            delete_branches
            ;;
        6)
            echo -e "${COLOR_YELLOW}Fetching latest changes...${COLOR_RESET}"
            git fetch --all --prune
            echo ""
            ;;
        7)
            echo -e "${COLOR_GREEN}Goodbye!${COLOR_RESET}"
            exit 0
            ;;
        *)
            echo -e "${COLOR_RED}Invalid option${COLOR_RESET}"
            echo ""
            ;;
    esac
done
