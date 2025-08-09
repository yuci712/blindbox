@echo off
chcp 65001 > nul
cls
echo =========================================
echo   盲盒抽盒机 - 简化版启动 (Python)
echo =========================================
echo.
echo ⚠️  注意: 此版本不支持前端路由
echo     建议使用 start.bat (需要Node.js)
echo.

echo 🚀 启动后端服务...
cd backend
start "后端API" /MIN node bootstrap.js
timeout /t 3 /nobreak > nul
echo    ✅ 后端API: http://localhost:7001
echo.

echo 🌐 启动前端服务 (Python HTTP Server)...
cd ..\frontend
start "前端Web" /MIN python -m http.server 8080
timeout /t 2 /nobreak > nul
echo    ✅ 前端Web: http://localhost:8080
echo.

echo 🎉 启动完成！
echo.
echo 📋 使用说明:
echo    1. 访问: http://localhost:8080
echo    2. 管理员: admin / admin123
echo    3. 用户: testuser / password123
echo.
echo ⚠️  已知问题:
echo    - 刷新页面可能显示404
echo    - 不支持直接访问子路径
echo    - 建议使用根路径访问并通过导航操作
echo.
echo 💡 正在打开浏览器...
start http://localhost:8080
echo.
pause
