@echo off
echo ========================================
echo   Service On Call - Deploy to GitHub
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git tidak ditemukan!
    echo.
    echo Silakan install Git terlebih dahulu dari:
    echo https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [1/5] Initializing Git repository...
git init

echo.
echo [2/5] Adding remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/riski2005saputra-stack/SERVICEONCALL.git

echo.
echo [3/5] Adding all files...
git add .

echo.
echo [4/5] Creating commit...
git commit -m "Deploy Service On Call website"

echo.
echo [5/5] Pushing to GitHub...
git branch -M main
git push -u origin main --force

echo.
echo ========================================
echo   Deploy Selesai!
echo ========================================
echo.
echo Langkah selanjutnya:
echo 1. Buka https://vercel.com
echo 2. Sign in dengan GitHub
echo 3. Import repository: SERVICEONCALL
echo 4. Klik Deploy
echo.
echo Website Anda akan online dalam 2-3 menit!
echo.
pause
