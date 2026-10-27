@echo off
chcp 65001 > nul
title SMAKBOT - Servidor Local
echo ========================================================
echo          SMAKBOT - Servidor Local Iniciado
echo ========================================================
echo.
echo Abriendo SMAKBOT en tu navegador...
echo  - Chatbot:   http://localhost:8000/index.html
echo  - Admin:     http://localhost:8000/admin.html
echo  - Showroom:  http://localhost:8000/SMAK-landing-page/index.html
echo.
echo (Para detener el servidor en cualquier momento, presiona Ctrl+C o cierra esta ventana)
echo ========================================================
echo.

start "" "http://localhost:8000/index.html"

where python >nul 2>nul
if %errorlevel% equ 0 (
    python -m http.server 8000
) else (
    npx -y serve -p 8000 .
)
