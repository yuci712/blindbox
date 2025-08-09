@echo off
chcp 65001 > nul
cls
echo =========================================
echo   盲盒抽盒机 - 生产环境启动
echo =========================================
echo.

:: 检查Node.js是否可用
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 需要安装 Node.js
    echo 请安装 Node.js: https://nodejs.org/
    echo 或者使用开发环境启动: dev-start.bat
    echo.
    pause
    exit /b 1
)

echo 🚀 启动后端服务...
cd backend
start "后端API" /MIN node bootstrap.js
timeout /t 3 /nobreak > nul
echo    ✅ 后端API: http://localhost:7001
echo.

echo 🌐 启动前端服务...
cd ..\frontend

:: 优先使用内置的SPA服务器
if exist spa-server.js (
    echo    使用内置SPA服务器...
    start "前端Web" /MIN node spa-server.js
) else (
    :: 备选方案：使用http-server
    echo    正在检查http-server...
    npx http-server --version > nul 2>&1
    if %errorlevel% neq 0 (
        echo    正在安装http-server...
        npm install -g http-server > nul 2>&1
    )
    start "前端Web" /MIN npx http-server -p 8080 --cors -a localhost --proxy http://localhost:8080?
)

timeout /t 3 /nobreak > nul
echo    ✅ 前端Web: http://localhost:8080
echo.

echo 🎉 启动完成！
echo    Web访问: http://localhost:8080
echo    后端API: http://localhost:7001
echo    管理员: admin / admin123
echo    用户: testuser / password123
echo.
echo 💡 正在打开浏览器...
timeout /t 2 /nobreak > nul
start http://localhost:8080
echo.
echo 按任意键关闭此窗口...
pause > nul
