@echo off
REM Navigate to your project directory
cd /d "C:\path\to\your\project"

REM Stage all changes
git add .

REM Commit the changes
git commit -m "Update project files"

REM Push the changes to the remote repository
git push origin main
