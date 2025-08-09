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

:: 创建SPA服务器（如果不存在）
if not exist "spa-server.js" (
    echo    正在创建SPA服务器...
    echo const http = require('http'^); > spa-server.js
    echo const fs = require('fs'^); >> spa-server.js
    echo const path = require('path'^); >> spa-server.js
    echo const url = require('url'^); >> spa-server.js
    echo. >> spa-server.js
    echo const PORT = 8080; >> spa-server.js
    echo const mimeTypes = { >> spa-server.js
    echo   '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', >> spa-server.js
    echo   '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpg', >> spa-server.js
    echo   '.gif': 'image/gif', '.svg': 'image/svg+xml', '.woff': 'font/woff', >> spa-server.js
    echo   '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject' >> spa-server.js
    echo }; >> spa-server.js
    echo. >> spa-server.js
    echo const server = http.createServer((req, res^) =^> { >> spa-server.js
    echo   const parsedUrl = url.parse(req.url^); >> spa-server.js
    echo   let pathname = '.' + parsedUrl.pathname; >> spa-server.js
    echo   console.log(`请求: ${req.method} ${req.url}`^); >> spa-server.js
    echo   if (pathname === './'^) pathname = './index.html'; >> spa-server.js
    echo. >> spa-server.js
    echo   // API代理 >> spa-server.js
    echo   if (req.url.startsWith('/api/'^)^) { >> spa-server.js
    echo     const proxyReq = http.request({ >> spa-server.js
    echo       hostname: 'localhost', port: 7001, path: req.url, >> spa-server.js
    echo       method: req.method, headers: req.headers >> spa-server.js
    echo     }, (proxyRes^) =^> { >> spa-server.js
    echo       res.writeHead(proxyRes.statusCode, proxyRes.headers^); >> spa-server.js
    echo       proxyRes.pipe(res^); >> spa-server.js
    echo     }^); >> spa-server.js
    echo     proxyReq.on('error', (err^) =^> { >> spa-server.js
    echo       res.writeHead(500^); res.end('API服务不可用'^); >> spa-server.js
    echo     }^); >> spa-server.js
    echo     req.pipe(proxyReq^); return; >> spa-server.js
    echo   } >> spa-server.js
    echo. >> spa-server.js
    echo   // 文件服务 >> spa-server.js
    echo   if (fs.existsSync(pathname^)^) { >> spa-server.js
    echo     const ext = path.parse(pathname^).ext; >> spa-server.js
    echo     const contentType = mimeTypes[ext] ^|^| 'text/plain'; >> spa-server.js
    echo     res.setHeader('Content-type', contentType^); >> spa-server.js
    echo     res.setHeader('Access-Control-Allow-Origin', '*'^); >> spa-server.js
    echo     fs.readFile(pathname, (err, data^) =^> { >> spa-server.js
    echo       if (err^) { res.writeHead(500^); res.end('读取错误'^); } >> spa-server.js
    echo       else { res.end(data^); } >> spa-server.js
    echo     }^); >> spa-server.js
    echo   } else { >> spa-server.js
    echo     // SPA路由fallback >> spa-server.js
    echo     const ext = path.parse(pathname^).ext; >> spa-server.js
    echo     if (!ext ^|^| ext === '.html'^) { >> spa-server.js
    echo       console.log(`SPA路由: ${req.url} -^> index.html`^); >> spa-server.js
    echo       res.setHeader('Content-type', 'text/html'^); >> spa-server.js
    echo       res.setHeader('Access-Control-Allow-Origin', '*'^); >> spa-server.js
    echo       fs.readFile('./index.html', (err, data^) =^> { >> spa-server.js
    echo         if (err^) { res.writeHead(404^); res.end('Page not found'^); } >> spa-server.js
    echo         else { res.end(data^); } >> spa-server.js
    echo       }^); >> spa-server.js
    echo     } else { >> spa-server.js
    echo       res.writeHead(404^); res.end('File not found'^); >> spa-server.js
    echo     } >> spa-server.js
    echo   } >> spa-server.js
    echo }^); >> spa-server.js
    echo. >> spa-server.js
    echo server.listen(PORT, (^) =^> { >> spa-server.js
    echo   console.log(`前端服务器: http://localhost:${PORT}`^); >> spa-server.js
    echo   console.log('支持SPA路由，API代理到 :7001'^); >> spa-server.js
    echo }^); >> spa-server.js
)

echo    启动SPA服务器...
start "前端Web" /MIN node spa-server.js
timeout /t 3 /nobreak > nul
echo    ✅ 前端Web: http://localhost:8080
echo.

echo 🎉 启动完成！
echo    Web访问: http://localhost:8080
echo    后端API: http://localhost:7001
echo    管理员: admin / admin123
echo    用户: testuser / password123
echo.
echo ✅ 功能特性:
echo    - 完整SPA路由支持
echo    - 8个核心功能完整实现
echo    - 4个创新特色功能
echo    - 现代化UI设计
echo    - 管理员权限系统
echo.
echo 💡 正在打开浏览器...
timeout /t 2 /nobreak > nul
start http://localhost:8080
echo.
echo 按任意键关闭此窗口（服务将继续在后台运行）
pause > nul
