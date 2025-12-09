# GitHub Setup Instructions

## Issue
Your Mac needs Xcode Command Line Tools installed for git to work properly.

## Solution

### Option 1: Install Xcode Command Line Tools (Recommended)

Run this command in Terminal:
```bash
xcode-select --install
```

This will open a dialog. Click "Install" and wait for it to complete (may take 10-15 minutes).

### Option 2: Manual Git Commands

After installing Xcode Command Line Tools, run these commands in Terminal:

```bash
cd /Users/KaanG/Desktop/cursor

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: StudyPilot - AI-powered study tools app"

# Set branch to main
git branch -M main

# Add remote repository
git remote add origin https://github.com/sirbxueonline-arch/silver-happiness.git

# Push to GitHub
git push -u origin main
```

### Option 3: Use the Script

After installing Xcode Command Line Tools, you can run:

```bash
cd /Users/KaanG/Desktop/cursor
chmod +x push-to-github.sh
./push-to-github.sh
```

## Authentication

When you push, GitHub may ask for authentication. You can use:
- **Personal Access Token** (recommended): Create one at https://github.com/settings/tokens
- **GitHub CLI**: Install and authenticate with `gh auth login`

## Verify

After pushing, check your repository at:
https://github.com/sirbxueonline-arch/silver-happiness

All your StudyPilot files should be there!

