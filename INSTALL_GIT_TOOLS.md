# Install Git Command Line Tools - Manual Steps

## Method 1: App Store (Easiest)

1. Open **App Store** on your Mac
2. Search for **"Xcode"**
3. Click **"Get"** or **"Install"** (this will install Command Line Tools automatically)
4. Wait for installation (large download, ~12GB)

## Method 2: Direct Download (Faster - Only Command Line Tools)

1. Open Terminal
2. Run: `xcode-select --install`
3. When dialog appears, click **"Install"**
4. Wait for download (~500MB)

## Method 3: Download Package Directly

Visit: https://developer.apple.com/download/all/

1. Sign in with Apple ID
2. Search for "Command Line Tools"
3. Download the latest version for your macOS
4. Install the .pkg file

## After Installation

Once installed, run these commands:

```bash
cd /Users/KaanG/Desktop/cursor
git init
git add .
git commit -m "Initial commit: StudyPilot"
git branch -M main
git remote add origin https://github.com/sirbxueonline-arch/silver-happiness.git
git push -u origin main
```

## Alternative: Use GitHub Desktop

If you prefer a GUI:
1. Download GitHub Desktop: https://desktop.github.com/
2. Sign in with GitHub
3. Add your repository
4. Commit and push through the GUI


