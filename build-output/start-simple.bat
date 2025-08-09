@echo off
chcp 65001 > nul
cls
echo =========================================
echo   盲盒抽盒机 - 简化版启动
echo =========================================
echo.

:: 检查Node.js是否可用
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 需要安装 Node.js
    echo 请安装 Node.js: https://nodejs.org/
    echo 或者使用开发环境启动: cd .. ^&^& dev-start.bat
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

:: 创建简单的SPA服务器
if not exist "spa-server.js" (
    echo    正在创建SPA服务器...
    echo const http = require('http'^); > spa-server.js
    echo const fs = require('fs'^); >> spa-server.js
    echo const path = require('path'^); >> spa-server.js
    echo. >> spa-server.js
    echo const port = 8080; >> spa-server.js
    echo const mimeTypes = { >> spa-server.js
    echo   '.html': 'text/html', >> spa-server.js
    echo   '.js': 'text/javascript', >> spa-server.js
    echo   '.css': 'text/css', >> spa-server.js
    echo   '.json': 'application/json', >> spa-server.js
    echo   '.png': 'image/png', >> spa-server.js
    echo   '.jpg': 'image/jpg', >> spa-server.js
    echo   '.gif': 'image/gif', >> spa-server.js
    echo   '.svg': 'image/svg+xml' >> spa-server.js
    echo }; >> spa-server.js
    echo. >> spa-server.js
    echo const server = http.createServer((req, res^) =^> { >> spa-server.js
    echo   let filePath = '.' + req.url; >> spa-server.js
    echo   if (filePath === './'^) filePath = './index.html'; >> spa-server.js
    echo   if (!fs.existsSync(filePath^) ^&^& !req.url.startsWith('/api'^)^) { >> spa-server.js
    echo     filePath = './index.html'; >> spa-server.js
    echo   } >> spa-server.js
    echo   const extname = String(path.extname(filePath^)^).toLowerCase(^); >> spa-server.js
    echo   const contentType = mimeTypes[extname] ^|^| 'application/octet-stream'; >> spa-server.js
    echo   fs.readFile(filePath, (error, content^) =^> { >> spa-server.js
    echo     if (error^) { >> spa-server.js
    echo       res.writeHead(404^); >> spa-server.js
    echo       res.end('404 Not Found'^); >> spa-server.js
    echo     } else { >> spa-server.js
    echo       res.writeHead(200, { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' }^); >> spa-server.js
    echo       res.end(content, 'utf-8'^); >> spa-server.js
    echo     } >> spa-server.js
    echo   }^); >> spa-server.js
    echo }^); >> spa-server.js
    echo. >> spa-server.js
    echo server.listen(port, (^) =^> console.log(`前端服务器运行在 http://localhost:${port}`^)^); >> spa-server.js
)

start "前端Web" /MIN node spa-server.js
timeout /t 3 /nobreak > nul
echo    ✅ 前端Web: http://localhost:8080
echo.

echo 🎉 启动完成！
echo.
echo 📋 使用说明:
echo    1. 访问: http://localhost:8080
echo    2. 管理员: admin / admin123
echo    3. 用户: testuser / password123
echo.
echo ✅ 功能特性:
echo    - 完整SPA路由支持
echo    - 8个核心功能完整实现
echo    - 4个创新特色功能
echo    - 现代化UI设计
echo.
echo 💡 正在打开浏览器...
timeout /t 2 /nobreak > nul
start http://localhost:8080
echo.
echo 按任意键关闭此窗口（服务将继续在后台运行）
pause > nul
