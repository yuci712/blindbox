#!/bin/bash

echo "========================================="
echo "  盲盒抽盒机 - 生产环境启动"  
echo "========================================="
echo ""

# 检查Node.js是否可用
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 需要安装 Node.js"
    echo "请安装 Node.js: https://nodejs.org/"
    echo "或者使用开发环境启动: cd .. && ./dev-start.sh"
    echo ""
    exit 1
fi

echo "🚀 启动后端服务..."
cd backend
nohup node bootstrap.js > ../backend.log 2>&1 &
BACKEND_PID=$!
sleep 3

# 检查后端是否启动成功
if kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "   ✅ 后端API: http://localhost:7001"
else
    echo "   ❌ 后端启动失败，请检查 backend.log"
    exit 1
fi
echo ""

echo "🌐 启动前端服务..."  
cd ../frontend

# 创建简单的SPA服务器
if [ ! -f "spa-server.js" ]; then
    echo "   正在创建SPA服务器..."
    cat > spa-server.js << 'EOF'
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8080;
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;
  if (filePath === './') filePath = './index.html';
  
  // SPA路由支持 - 如果文件不存在且不是API请求，返回index.html
  if (!fs.existsSync(filePath) && !req.url.startsWith('/api')) {
    filePath = './index.html';
  }
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if(error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('服务器错误: ' + error.code + ' ..\n');
      }
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, () => {
  console.log(`前端服务器运行在 http://localhost:${port}`);
});
EOF
fi

# 启动前端SPA服务器
nohup node spa-server.js > ../frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 2

# 检查前端是否启动成功
if kill -0 "$FRONTEND_PID" 2>/dev/null; then
    echo "   ✅ 前端Web: http://localhost:8080"
else
    echo "   ❌ 前端启动失败，请检查 frontend.log"
    kill "$BACKEND_PID" 2>/dev/null
    exit 1
fi
echo ""

echo "🎉 启动完成！"
echo "   Web访问: http://localhost:8080"
echo "   后端API: http://localhost:7001" 
echo "   管理员: admin / admin123"
echo "   用户: testuser / password123"
echo ""
echo "💡 服务已在后台运行"
echo "   查看后端日志: tail -f backend.log"
echo "   查看前端日志: tail -f frontend.log"
echo "   停止服务: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# 保存PID到文件以便后续停止
echo "$BACKEND_PID" > backend.pid
echo "$FRONTEND_PID" > frontend.pid

# 如果是交互式终端，打开浏览器
if [ -t 0 ]; then
    echo "💡 正在打开浏览器..."
    sleep 2
    if command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:8080
    elif command -v open &> /dev/null; then
        open http://localhost:8080
    fi
fi
