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

  // 如果是根路径，返回index.html
  if (pathname === './') {
    pathname = './index.html';
  }

  // 检查文件是否存在
  fs.access(pathname, fs.constants.F_OK, (err) => {
    if (err) {
      // 文件不存在，返回index.html (SPA fallback)
      pathname = './index.html';
    }

    fs.readFile(pathname, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Error getting the file: ${err}.');
      } else {
        const ext = path.parse(pathname).ext;
        res.setHeader('Content-type', mimeTypes[ext] || 'text/plain');
        
        // 添加CORS头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
        
        res.end(data);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`✅ 前端服务器启动成功: http://localhost:${PORT}`);
});
