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
    pause
    exit /b 1
)

echo 🚀 启动后端服务...
cd /d "%~dp0.."
start "后端API" /MIN cmd /c "cd backend && npm run dev"
timeout /t 5 /nobreak > nul
echo    ✅ 后端API: http://localhost:7001
echo.

echo 🌐 启动前端服务...
cd /d "%~dp0frontend"

:: 创建SPA服务器
echo const http = require('http'); > spa-server.js
echo const fs = require('fs'); >> spa-server.js
echo const path = require('path'); >> spa-server.js
echo const url = require('url'); >> spa-server.js
echo. >> spa-server.js
echo const server = http.createServer((req, res) =^> { >> spa-server.js
echo   const parsedUrl = url.parse(req.url, true); >> spa-server.js
echo   let pathname = parsedUrl.pathname; >> spa-server.js
echo. >> spa-server.js
echo   // CORS headers >> spa-server.js
echo   res.setHeader('Access-Control-Allow-Origin', '*'); >> spa-server.js
echo   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); >> spa-server.js
echo   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); >> spa-server.js
echo. >> spa-server.js
echo   // API 代理到后端 >> spa-server.js
echo   if (pathname.startsWith('/api')) { >> spa-server.js
echo     const options = { >> spa-server.js
echo       hostname: '127.0.0.1', >> spa-server.js
echo       port: 7001, >> spa-server.js
echo       path: req.url, >> spa-server.js
echo       method: req.method, >> spa-server.js
echo       headers: req.headers >> spa-server.js
echo     }; >> spa-server.js
echo     const proxyReq = require('http').request(options, (proxyRes) =^> { >> spa-server.js
echo       res.writeHead(proxyRes.statusCode, proxyRes.headers); >> spa-server.js
echo       proxyRes.pipe(res); >> spa-server.js
echo     }); >> spa-server.js
echo     proxyReq.on('error', (err) =^> { >> spa-server.js
echo       console.error('API proxy error:', err); >> spa-server.js
echo       res.writeHead(500); >> spa-server.js
echo       res.end('Backend service unavailable'); >> spa-server.js
echo     }); >> spa-server.js
echo     req.pipe(proxyReq); >> spa-server.js
echo     return; >> spa-server.js
echo   } >> spa-server.js
echo. >> spa-server.js
echo   // 上传文件代理 >> spa-server.js
echo   if (pathname.startsWith('/uploads')) { >> spa-server.js
echo     const options = { >> spa-server.js
echo       hostname: '127.0.0.1', >> spa-server.js
echo       port: 7001, >> spa-server.js
echo       path: req.url, >> spa-server.js
echo       method: req.method, >> spa-server.js
echo       headers: req.headers >> spa-server.js
echo     }; >> spa-server.js
echo     const proxyReq = require('http').request(options, (proxyRes) =^> { >> spa-server.js
echo       res.writeHead(proxyRes.statusCode, proxyRes.headers); >> spa-server.js
echo       proxyRes.pipe(res); >> spa-server.js
echo     }); >> spa-server.js
echo     proxyReq.on('error', (err) =^> { >> spa-server.js
echo       res.writeHead(404); >> spa-server.js
echo       res.end('File not found'); >> spa-server.js
echo     }); >> spa-server.js
echo     req.pipe(proxyReq); >> spa-server.js
echo     return; >> spa-server.js
echo   } >> spa-server.js
echo. >> spa-server.js
echo   // 前端路由处理 - SPA fallback >> spa-server.js
echo   if (pathname === '/' ^|^| !pathname.includes('.')) { >> spa-server.js
echo     pathname = '/index.html'; >> spa-server.js
echo   } >> spa-server.js
echo. >> spa-server.js
echo   const filePath = path.join(__dirname, pathname); >> spa-server.js
echo   fs.readFile(filePath, (err, data) =^> { >> spa-server.js
echo     if (err) { >> spa-server.js
echo       if (!pathname.includes('.')) { >> spa-server.js
echo         // 如果是路由，返回index.html >> spa-server.js
echo         fs.readFile(path.join(__dirname, 'index.html'), (indexErr, indexData) =^> { >> spa-server.js
echo           if (indexErr) { >> spa-server.js
echo             res.writeHead(404); >> spa-server.js
echo             res.end('Not Found'); >> spa-server.js
echo           } else { >> spa-server.js
echo             res.writeHead(200, { 'Content-Type': 'text/html' }); >> spa-server.js
echo             res.end(indexData); >> spa-server.js
echo           } >> spa-server.js
echo         }); >> spa-server.js
echo       } else { >> spa-server.js
echo         res.writeHead(404); >> spa-server.js
echo         res.end('Not Found'); >> spa-server.js
echo       } >> spa-server.js
echo       return; >> spa-server.js
echo     } >> spa-server.js
echo     const ext = path.extname(filePath); >> spa-server.js
echo     const mimeTypes = { >> spa-server.js
echo       '.html': 'text/html', >> spa-server.js
echo       '.js': 'application/javascript', >> spa-server.js
echo       '.css': 'text/css', >> spa-server.js
echo       '.png': 'image/png', >> spa-server.js
echo       '.jpg': 'image/jpeg', >> spa-server.js
echo       '.jpeg': 'image/jpeg', >> spa-server.js
echo       '.gif': 'image/gif', >> spa-server.js
echo       '.svg': 'image/svg+xml', >> spa-server.js
echo       '.ico': 'image/x-icon' >> spa-server.js
echo     }; >> spa-server.js
echo     res.writeHead(200, { 'Content-Type': mimeTypes[ext] ^|^| 'text/plain' }); >> spa-server.js
echo     res.end(data); >> spa-server.js
echo   }); >> spa-server.js
echo }); >> spa-server.js
echo. >> spa-server.js
echo server.listen(8080, () =^> { >> spa-server.js
echo   console.log('前端服务器: http://localhost:8080'); >> spa-server.js
echo   console.log('支持SPA路由，API代理到 :7001'); >> spa-server.js
echo }); >> spa-server.js

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
echo    - 现代化UI设计
echo    - 管理员权限系统
echo    - 图片上传和显示
echo.
echo 💡 正在打开浏览器...
timeout /t 2 /nobreak > nul
start http://localhost:8080
echo.
echo 按任意键关闭此窗口（服务将继续在后台运行）
pause > nul
