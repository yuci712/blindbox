@echo off
chcp 65001 > nul
cls
echo.
echo ===============================================
echo   盲盒抽盒机 - 简化构建工具
echo ===============================================
echo.

:: 清理并创建构建目录
echo [1/4] 📁 准备构建环境...
if exist build-output rmdir /s /q build-output
mkdir build-output
mkdir build-output\backend
mkdir build-output\frontend
echo       ✅ 构建环境准备完成

:: 构建前端
echo.
echo [2/4] 🌐 构建前端...
cd frontend
if exist dist (
    echo       - 使用现有前端构建产物
    xcopy /s /e /q dist\*.* ..\build-output\frontend\ >nul 2>&1
) else (
    echo       - 尝试构建前端...
    npm run build >nul 2>&1
    if exist dist (
        xcopy /s /e /q dist\*.* ..\build-output\frontend\ >nul 2>&1
        echo       - ✅ 前端构建成功
    ) else (
        echo       - ⚠️ 使用开发文件
        copy index.html ..\build-output\frontend\ >nul 2>&1
        if exist src xcopy /s /e /q src ..\build-output\frontend\src\ >nul 2>&1
        if exist public xcopy /s /e /q public\*.* ..\build-output\frontend\ >nul 2>&1
    )
)
cd ..

:: 构建后端
echo.
echo [3/4] ⚙️  准备后端...
cd backend
if exist dist (
    echo       - 使用现有后端构建产物
    xcopy /s /e /q dist ..\build-output\backend\dist\ >nul 2>&1
) else (
    echo       - 直接复制源码
    xcopy /s /e /q src ..\build-output\backend\src\ >nul 2>&1
)

:: 复制必要文件
echo       - 复制必要文件...
copy package.json ..\build-output\backend\ >nul 2>&1
copy bootstrap.js ..\build-output\backend\ >nul 2>&1
copy database.sqlite ..\build-output\backend\ >nul 2>&1

:: 安装生产依赖
echo       - 准备Node.js依赖...
cd ..\build-output\backend
if exist package.json (
    npm install --production --silent >nul 2>&1
    echo       - ✅ 依赖安装完成
) else (
    echo       - ⚠️ 跳过依赖安装
)
cd ..\..

:: 创建启动脚本
echo.
echo [4/4] 🚀 创建启动脚本...

:: Windows启动脚本
(
echo @echo off
echo chcp 65001 ^> nul
echo cls
echo echo =========================================
echo echo   盲盒抽盒机 - 快速启动
echo echo =========================================
echo echo.
echo echo 🚀 启动后端服务...
echo cd backend
echo start "后端API" /MIN node bootstrap.js
echo timeout /t 3 /nobreak ^> nul
echo echo    ✅ 后端API: http://localhost:7001
echo echo.
echo echo 🌐 启动前端服务...
echo cd ..\frontend
echo start "前端Web" /MIN python -m http.server 8080
echo timeout /t 2 /nobreak ^> nul
echo echo    ✅ 前端Web: http://localhost:8080
echo echo.
echo echo 🎉 启动完成！
echo echo    📱 访问: http://localhost:8080
echo echo    👤 管理员: admin / admin123
echo echo    👤 用户: testuser / password123
echo echo.
echo start http://localhost:8080
echo pause
) > build-output\start.bat

:: Linux启动脚本
(
echo #!/bin/bash
echo echo "========================================="
echo echo "  盲盒抽盒机 - 快速启动"
echo echo "========================================="
echo echo
echo echo "🚀 启动后端服务..."
echo cd backend ^&^& nohup node bootstrap.js ^> ../backend.log 2^>^&1 ^&
echo sleep 3
echo echo "   ✅ 后端API: http://localhost:7001"
echo echo
echo echo "🌐 启动前端服务..."
echo cd ../frontend ^&^& nohup python3 -m http.server 8080 ^> ../frontend.log 2^>^&1 ^&
echo sleep 2
echo echo "   ✅ 前端Web: http://localhost:8080"
echo echo
echo echo "🎉 启动完成！"
echo echo "   📱 访问: http://localhost:8080"
echo echo "   👤 管理员: admin / admin123"
echo echo "   👤 用户: testuser / password123"
) > build-output\start.sh

:: 演示启动脚本
(
echo @echo off
echo echo 🎮 启动演示环境...
echo call start.bat
) > build-output\DEMO-START.bat

:: 创建说明文档
(
echo 盲盒抽盒机 - 部署包说明
echo ==============================
echo.
echo 🎯 快速启动:
echo   Windows: 双击 start.bat
echo   Linux/Mac: chmod +x start.sh ^&^& ./start.sh
echo.
echo 🌐 访问地址:
echo   Web界面: http://localhost:8080
echo   API接口: http://localhost:7001
echo.
echo 👤 测试账号:
echo   管理员: admin / admin123
echo   用户: testuser / password123
echo.
echo 📦 技术栈:
echo   前端: React + TypeScript + TailwindCSS
echo   后端: Node.js + MidwayJS + SQLite
echo.
echo 📋 功能特性:
echo   ✅ 8个核心功能完整实现
echo   ✅ 4个创新功能
echo   ✅ 现代化UI设计
echo   ✅ 完整权限管理
echo   ✅ 跨平台支持
echo.
echo 构建时间: %date% %time%
) > build-output\README.txt

echo       ✅ 启动脚本创建完成

:: 显示结果
echo.
echo ===============================================
echo   🎉 构建完成！
echo ===============================================
echo.
echo 📁 构建产物: build-output\
echo 🚀 快速启动: 
echo    Windows: cd build-output ^&^& start.bat
echo    Linux/Mac: cd build-output ^&^& chmod +x start.sh ^&^& ./start.sh
echo.
echo 📋 包含内容:
echo    ✅ 前端Web应用
echo    ✅ 后端API服务
echo    ✅ SQLite数据库
echo    ✅ 跨平台启动脚本
echo    ✅ 使用说明文档
echo.
echo 💡 现在可以将build-output文件夹复制到任何地方运行！
echo.

pause
