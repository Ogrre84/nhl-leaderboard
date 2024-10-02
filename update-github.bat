@echo off
REM Navigate to your project directory
cd /d "C:\nhl-leaderboard" 

REM Stage all changes
git add .

REM Commit the changes
git commit -m "Update project files"

REM Push the changes to the remote repository
git push origin main REM Replace 'main' with your branch name if different
