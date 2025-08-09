@echo off
chcp 65001 > nul
cls
echo ===============================================
echo   盲盒抽盒机 - 开发环境启动
echo ===============================================
echo.
echo 🚀 启动开发环境 (推荐使用此方式)...
echo.

:: 检查Node.js
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未安装 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: 启动后端开发服务器
echo [1/2] 🔧 启动后端服务...
cd ..\backend
start "后端开发服务器" cmd /c "npm run dev"
echo       等待后端启动...
timeout /t 5 /nobreak > nul
echo       ✅ 后端服务: http://localhost:7001

:: 启动前端开发服务器  
echo.
echo [2/2] 🌐 启动前端服务...
cd ..\frontend
start "前端开发服务器" cmd /c "npm run dev"
echo       等待前端启动...
timeout /t 3 /nobreak > nul
echo       ✅ 前端服务: http://localhost:5173

echo.
echo ===============================================
echo   🎉 开发环境启动完成！
echo ===============================================
echo.
echo 🌐 访问地址:
echo    前端: http://localhost:5173
echo    后端API: http://localhost:7001
echo.
echo 👤 测试账号:
echo    管理员: admin / admin123
echo    普通用户: testuser / password123
echo.
echo 📋 功能特性:
echo    ✅ 8个核心功能完整实现
echo    ✅ 4个创新特色功能
echo    ✅ 现代化UI设计
echo    ✅ 完整权限管理
echo.
echo 💡 正在打开浏览器...
timeout /t 2 /nobreak > nul
start http://localhost:5173
echo.

pause
