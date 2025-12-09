#!/bin/bash

# Script to push StudyPilot to GitHub
# Run this script after installing Xcode Command Line Tools if needed

echo "Initializing git repository..."
git init

echo "Adding all files..."
git add .

echo "Creating initial commit..."
git commit -m "Initial commit: StudyPilot - AI-powered study tools app"

echo "Setting branch to main..."
git branch -M main

echo "Adding remote repository..."
git remote add origin https://github.com/sirbxueonline-arch/silver-happiness.git

echo "Pushing to GitHub..."
git push -u origin main

echo "Done! Your code has been pushed to GitHub."

