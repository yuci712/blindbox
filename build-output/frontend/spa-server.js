const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const STATIC_PATH = './';

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
  const parsedUrl = url.parse(req.url);
  let pathname = `.${parsedUrl.pathname}`;

  console.log(`📡 请求: ${req.method} ${req.url}`);

  // 如果是根路径，返回index.html
  if (pathname === './') {
    pathname = './index.html';
  }

  // 检查是否是API请求（应该转发到后端）
  if (req.url.startsWith('/api/')) {
    // 代理API请求到后端
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: 7001,
      path: req.url,
      method: req.method,
      headers: req.headers
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error('❌ API代理错误:', err);
      res.writeHead(500);
      res.end('API服务不可用');
    });

    req.pipe(proxyReq);
    return;
  }

  // 检查文件是否存在
  if (fs.existsSync(pathname)) {
    // 文件存在，直接返回
    fs.readFile(pathname, (err, data) => {
      if (err) {
        console.error('❌ 读取文件错误:', err);
        res.statusCode = 500;
        res.end('Error getting the file: ' + err);
      } else {
        const ext = path.parse(pathname).ext;
        res.setHeader('Content-type', mimeTypes[ext] || 'text/plain');
        
        // 添加CORS头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
        
        console.log(`✅ 返回文件: ${pathname}`);
        res.end(data);
      }
    });
  } else {
    // 文件不存在，检查是否是前端路由
    // 对于所有不存在的非静态资源请求，返回index.html (SPA fallback)
    const ext = path.parse(pathname).ext;
    if (!ext || ext === '.html') {
      // 没有扩展名或html扩展名，可能是前端路由，返回index.html
      fs.readFile('./index.html', (err, data) => {
        if (err) {
          console.error('❌ 读取index.html错误:', err);
          res.statusCode = 404;
          res.end('Page not found');
        } else {
          res.setHeader('Content-type', 'text/html');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
          res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
          
          console.log(`🔄 SPA路由fallback: ${req.url} -> index.html`);
          res.end(data);
        }
      });
    } else {
      // 有扩展名的静态资源请求，但文件不存在，返回404
      console.log(`❌ 静态资源不存在: ${pathname}`);
      res.statusCode = 404;
      res.end('File not found');
    }
  }
});

server.listen(PORT, () => {
  console.log(`✅ 前端服务器启动成功: http://localhost:${PORT}`);
  console.log('🌐 支持SPA路由，API请求将代理到后端 http://localhost:7001');
});

// 处理进程退出
process.on('SIGINT', () => {
  console.log('\n🛑 前端服务器正在关闭...');
  server.close(() => {
    console.log('✅ 前端服务器已关闭');
    process.exit(0);
  });
});
