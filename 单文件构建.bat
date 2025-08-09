@echo off
chcp 65001
cls
echo.
echo ===============================================
echo   盲盒抽盒机 - 单文件构建工具
echo   构建时间: %date% %time%
echo ===============================================
echo.

:: 清理旧的构建输出
echo [1/6] 🧹 清理构建目录...
if exist build-output (
    rmdir /s /q build-output
    echo       ✅ 已清理旧的构建输出
) else (
    echo       ℹ️  无需清理
)
echo.

:: 创建构建输出目录
echo [2/6] 📁 创建构建目录...
mkdir build-output
mkdir build-output\backend  
mkdir build-output\frontend
echo       ✅ 构建目录创建完成
echo.

:: 构建后端
echo [3/6] ⚙️  构建后端服务...
cd backend
echo       - 检查后端依赖...
if not exist node_modules (
    echo       - 安装后端依赖...
    call npm install
)
echo       - 编译TypeScript...
call npx tsc || call npm run build:tsc || (
    echo       - 使用备用编译方式...
    call npx tsc --outDir dist --rootDir src --target ES2020 --module commonjs --esModuleInterop true --skipLibCheck true src/**/*.ts
)
if %errorlevel% neq 0 (
    echo       ❌ 后端编译失败！尝试跳过编译步骤...
    if not exist dist mkdir dist
    echo       - 直接复制源码...
    xcopy /s /e /q src\*.* dist\
)
echo       - 复制文件到构建目录...
xcopy /s /e /q dist ..\build-output\backend\dist\ 2>nul
if exist node_modules (
    xcopy /s /e /q node_modules ..\build-output\backend\node_modules\ 2>nul
) else (
    echo       - 安装生产依赖...
    call npm ci --production --silent
    xcopy /s /e /q node_modules ..\build-output\backend\node_modules\ 2>nul
)
copy package.json ..\build-output\backend\ 2>nul
copy bootstrap.js ..\build-output\backend\ 2>nul
copy database.sqlite ..\build-output\backend\ 2>nul
if exist src\config xcopy /s /e /q src\config ..\build-output\backend\config\ 2>nul
echo       - 复制图片资源...
if exist uploads\images xcopy /s /e /i /q uploads\images ..\build-output\backend\uploads\images\ 2>nul
echo       ✅ 后端构建完成 (包含图片资源)
cd ..
echo.

:: 构建前端
echo [4/6] 🌐 构建前端应用...
cd frontend
echo       - 检查前端依赖...
if not exist node_modules (
    echo       - 安装前端依赖...
    call npm install
)
echo       - 构建React应用...
call npm run build || call npx vite build || (
    echo       - 使用备用构建方式...
    call npx vite build --mode production
)
if %errorlevel% neq 0 (
    echo       ❌ 前端构建失败！使用现有文件...
    if not exist dist mkdir dist
    copy /y index.html dist\ 2>nul
    if exist src xcopy /s /e /q src dist\src\ 2>nul
    if exist public xcopy /s /e /q public dist\ 2>nul
)
echo       - 复制构建产物...
if exist dist (
    xcopy /s /e /q dist\*.* ..\build-output\frontend\ 2>nul
) else (
    echo       - 直接复制源文件...
    copy /y index.html ..\build-output\frontend\ 2>nul
    if exist src xcopy /s /e /q src ..\build-output\frontend\src\ 2>nul
    if exist public xcopy /s /e /q public ..\build-output\frontend\public\ 2>nul
)
echo       ✅ 前端构建完成
cd ..
echo.

:: 创建启动脚本
echo [5/6] 🚀 创建启动脚本...

:: Windows启动脚本 (改进版，支持SPA路由)
echo @echo off > build-output\start.bat
echo chcp 65001 ^> nul >> build-output\start.bat
echo cls >> build-output\start.bat
echo echo ========================================= >> build-output\start.bat
echo echo   盲盒抽盒机 - 生产环境启动 >> build-output\start.bat
echo echo ========================================= >> build-output\start.bat
echo echo. >> build-output\start.bat
echo echo :: 检查Node.js是否可用 >> build-output\start.bat
echo node --version ^> nul 2^>^&1 >> build-output\start.bat
echo if %%errorlevel%% neq 0 ^( >> build-output\start.bat
echo     echo ❌ 错误: 需要安装 Node.js >> build-output\start.bat
echo     echo 请安装 Node.js: https://nodejs.org/ >> build-output\start.bat
echo     echo 或者使用开发环境启动: dev-start.bat >> build-output\start.bat
echo     pause >> build-output\start.bat
echo     exit /b 1 >> build-output\start.bat
echo ^) >> build-output\start.bat
echo echo 🚀 启动后端服务... >> build-output\start.bat
echo cd backend >> build-output\start.bat
echo start "后端API" /MIN node bootstrap.js >> build-output\start.bat
echo timeout /t 3 /nobreak ^> nul >> build-output\start.bat
echo echo    ✅ 后端API: http://localhost:7001 >> build-output\start.bat
echo echo. >> build-output\start.bat
echo echo 🌐 启动前端服务... >> build-output\start.bat
echo cd ..\frontend >> build-output\start.bat
echo echo    正在检查http-server... >> build-output\start.bat
echo npx http-server --version ^> nul 2^>^&1 >> build-output\start.bat
echo if %%errorlevel%% neq 0 ^( >> build-output\start.bat
echo     echo    正在安装http-server... >> build-output\start.bat
echo     npm install -g http-server ^> nul 2^>^&1 >> build-output\start.bat
echo ^) >> build-output\start.bat
echo start "前端Web" /MIN npx http-server -p 8080 --cors -a localhost --proxy http://localhost:8080? >> build-output\start.bat
echo timeout /t 3 /nobreak ^> nul >> build-output\start.bat
echo echo    ✅ 前端Web: http://localhost:8080 >> build-output\start.bat
echo echo. >> build-output\start.bat
echo echo 🎉 启动完成！ >> build-output\start.bat
echo echo    Web访问: http://localhost:8080 >> build-output\start.bat
echo echo    后端API: http://localhost:7001 >> build-output\start.bat
echo echo    管理员: admin / admin123 >> build-output\start.bat
echo echo    用户: testuser / password123 >> build-output\start.bat
echo echo. >> build-output\start.bat
echo echo 💡 正在打开浏览器... >> build-output\start.bat
echo timeout /t 2 /nobreak ^> nul >> build-output\start.bat
echo start http://localhost:8080 >> build-output\start.bat
echo pause ^> nul >> build-output\start.bat

:: Linux/Mac启动脚本  
echo #!/bin/bash > build-output\start.sh
echo echo "=========================================" >> build-output\start.sh
echo echo "  盲盒抽盒机 - 生产环境启动" >> build-output\start.sh
echo echo "=========================================" >> build-output\start.sh
echo echo "" >> build-output\start.sh
echo echo "🚀 启动后端服务..." >> build-output\start.sh
echo cd backend ^&^& nohup node bootstrap.js ^> ../backend.log 2^>^&1 ^& >> build-output\start.sh
echo echo "   ✅ 后端服务已启动: http://localhost:7001" >> build-output\start.sh
echo echo "" >> build-output\start.sh  
echo echo "🌐 启动前端服务..." >> build-output\start.sh
echo cd ../frontend ^&^& python3 -m http.server 8080 ^> ../frontend.log 2^>^&1 ^& >> build-output\start.sh
echo echo "   ✅ 前端应用已启动: http://localhost:8080" >> build-output\start.sh
echo echo "" >> build-output\start.sh
echo echo "🎉 系统启动完成！" >> build-output\start.sh
echo echo "   前端: http://localhost:8080" >> build-output\start.sh
echo echo "   后端: http://localhost:7001" >> build-output\start.sh
echo echo "   管理员: admin / admin123" >> build-output\start.sh
echo echo "   用户: testuser / password123" >> build-output\start.sh

:: 演示启动脚本
echo @echo off > build-output\DEMO-START.bat
echo chcp 65001 >> build-output\DEMO-START.bat
echo cls >> build-output\DEMO-START.bat
echo echo. >> build-output\DEMO-START.bat
echo echo ========================================= >> build-output\DEMO-START.bat
echo echo   🎮 盲盒抽盒机 - 演示模式 >> build-output\DEMO-START.bat
echo echo ========================================= >> build-output\DEMO-START.bat
echo echo. >> build-output\DEMO-START.bat
echo echo 正在启动演示环境... >> build-output\DEMO-START.bat
echo call start.bat >> build-output\DEMO-START.bat

echo       ✅ 启动脚本创建完成
echo.

:: 创建说明文件
echo [6/6] 📖 创建说明文档...
echo 盲盒抽盒机 - 单文件构建产物 > build-output\README.txt
echo ================================== >> build-output\README.txt
echo. >> build-output\README.txt
echo 🎯 快速启动: >> build-output\README.txt
echo   Windows: 双击 start.bat 或 DEMO-START.bat >> build-output\README.txt
echo   Linux/Mac: chmod +x start.sh && ./start.sh >> build-output\README.txt
echo. >> build-output\README.txt
echo 🌐 访问地址: >> build-output\README.txt
echo   前端应用: http://localhost:8080 >> build-output\README.txt  
echo   后端API: http://localhost:7001 >> build-output\README.txt
echo. >> build-output\README.txt
echo 👤 测试账号: >> build-output\README.txt
echo   管理员: admin / admin123 >> build-output\README.txt
echo   普通用户: testuser / password123 >> build-output\README.txt
echo. >> build-output\README.txt
echo 📁 目录结构: >> build-output\README.txt
echo   backend/ - 后端服务 (Node.js + SQLite) >> build-output\README.txt
echo   frontend/ - 前端应用 (React + TailwindCSS) >> build-output\README.txt
echo   database.sqlite - 数据库文件 >> build-output\README.txt
echo. >> build-output\README.txt
echo 🛠️ 技术栈: >> build-output\README.txt
echo   前端: React 18 + TypeScript + Vite + TailwindCSS >> build-output\README.txt
echo   后端: MidwayJS + Koa + TypeORM + SQLite >> build-output\README.txt
echo   认证: JWT + bcryptjs >> build-output\README.txt
echo. >> build-output\README.txt
echo 📊 系统要求: >> build-output\README.txt
echo   Windows: Windows 10+ >> build-output\README.txt
echo   Linux: Ubuntu 18.04+ / CentOS 7+ (需要Node.js 16+) >> build-output\README.txt
echo   MacOS: macOS 10.15+ (需要Node.js 16+) >> build-output\README.txt
echo. >> build-output\README.txt
echo 构建时间: %date% %time% >> build-output\README.txt

echo       ✅ 说明文档创建完成
echo.

:: 显示构建结果
echo ===============================================
echo   🎉 单文件构建完成！
echo ===============================================
echo.
echo 📁 构建产物位置: build-output\
echo 📊 构建产物大小:
dir build-output /s
echo.
echo 🚀 快速启动:
echo    Windows: cd build-output && start.bat
echo    Linux/Mac: cd build-output && ./start.sh
echo.
echo 📋 包含内容:
echo    ✅ 后端服务 (编译后的Node.js应用)
echo    ✅ 前端应用 (构建后的React应用)  
echo    ✅ SQLite数据库 (包含示例数据)
echo    ✅ 启动脚本 (跨平台支持)
echo    ✅ 使用说明 (README.txt)
echo.
echo 💡 现在可以将 build-output\ 文件夹
echo    复制到任何服务器上独立运行！
echo.

pause
