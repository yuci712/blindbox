const http = require('http'); 
const fs = require('fs'); 
const path = require('path'); 
const url = require('url'); 
 
const PORT = 8080; 
const mimeTypes = { 
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', 
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpg', 
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.woff': 'font/woff', 
  '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject' 
}; 
 
const server = http.createServer((req, res) => { 
  const parsedUrl = url.parse(req.url); 
  let pathname = '.' + parsedUrl.pathname; 
  console.log(`请求: ${req.method} ${req.url}`); 
  if (pathname === './') pathname = './index.html'; 
 
  // API代理 
  if (req.url.startsWith('/api/')) { 
    const proxyReq = http.request({ 
      hostname: 'localhost', port: 7001, path: req.url, 
      method: req.method, headers: req.headers 
    }, (proxyRes) => { 
      res.writeHead(proxyRes.statusCode, proxyRes.headers); 
      proxyRes.pipe(res); 
    }); 
    proxyReq.on('error', (err) => { 
      res.writeHead(500); res.end('API服务不可用'); 
    }); 
    req.pipe(proxyReq); return; 
  } 
 
  // 文件服务 
  if (fs.existsSync(pathname)) { 
    const ext = path.parse(pathname).ext; 
    const contentType = mimeTypes[ext] || 'text/plain'; 
    res.setHeader('Content-type', contentType); 
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    fs.readFile(pathname, (err, data) => { 
      if (err) { res.writeHead(500); res.end('读取错误'); } 
      else { res.end(data); } 
    }); 
  } else { 
    // SPA路由fallback 
    const ext = path.parse(pathname).ext; 
    if (!ext || ext === '.html') { 
      console.log(`SPA路由: ${req.url} -> index.html`); 
      res.setHeader('Content-type', 'text/html'); 
      res.setHeader('Access-Control-Allow-Origin', '*'); 
      fs.readFile('./index.html', (err, data) => { 
        if (err) { res.writeHead(404); res.end('Page not found'); } 
        else { res.end(data); } 
      }); 
    } else { 
      res.writeHead(404); res.end('File not found'); 
    } 
  } 
}); 
 
server.listen(PORT, () => { 
  console.log(`前端服务器: http://localhost:${PORT}`); 
  console.log('支持SPA路由，API代理到 :7001'); 
}); 
