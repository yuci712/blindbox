const http = require('http'); 
const fs = require('fs'); 
const path = require('path'); 
const url = require('url'); 
 
const server = http.createServer((req, res) => { 
  const parsedUrl = url.parse(req.url, true); 
  let pathname = parsedUrl.pathname; 
 
  // CORS headers 
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
 
  // API 代理到后端 
  if (pathname.startsWith('/api')) { 
    const options = { 
      hostname: '127.0.0.1', 
      port: 7001, 
      path: req.url, 
      method: req.method, 
      headers: req.headers 
    }; 
    const proxyReq = require('http').request(options, (proxyRes) => { 
      res.writeHead(proxyRes.statusCode, proxyRes.headers); 
      proxyRes.pipe(res); 
    }); 
    proxyReq.on('error', (err) => { 
      console.error('API proxy error:', err); 
      res.writeHead(500); 
      res.end('Backend service unavailable'); 
    }); 
    req.pipe(proxyReq); 
    return; 
  } 
 
  // 上传文件代理 
  if (pathname.startsWith('/uploads')) { 
    const options = { 
      hostname: '127.0.0.1', 
      port: 7001, 
      path: req.url, 
      method: req.method, 
      headers: req.headers 
    }; 
    const proxyReq = require('http').request(options, (proxyRes) => { 
      res.writeHead(proxyRes.statusCode, proxyRes.headers); 
      proxyRes.pipe(res); 
    }); 
    proxyReq.on('error', (err) => { 
      res.writeHead(404); 
      res.end('File not found'); 
    }); 
    req.pipe(proxyReq); 
    return; 
  } 
 
  // 前端路由处理 - SPA fallback 
  if (pathname === '/' || !pathname.includes('.')) { 
    pathname = '/index.html'; 
  } 
 
  const filePath = path.join(__dirname, pathname); 
  fs.readFile(filePath, (err, data) => { 
    if (err) { 
      if (!pathname.includes('.')) { 
        // 如果是路由，返回index.html 
        fs.readFile(path.join(__dirname, 'index.html'), (indexErr, indexData) => { 
          if (indexErr) { 
            res.writeHead(404); 
            res.end('Not Found'); 
          } else { 
            res.writeHead(200, { 'Content-Type': 'text/html' }); 
            res.end(indexData); 
          } 
        }); 
      } else { 
        res.writeHead(404); 
        res.end('Not Found'); 
      } 
      return; 
    } 
    const ext = path.extname(filePath); 
    const mimeTypes = { 
      '.html': 'text/html', 
      '.js': 'application/javascript', 
      '.css': 'text/css', 
      '.png': 'image/png', 
      '.jpg': 'image/jpeg', 
      '.jpeg': 'image/jpeg', 
      '.gif': 'image/gif', 
      '.svg': 'image/svg+xml', 
      '.ico': 'image/x-icon' 
    }; 
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' }); 
    res.end(data); 
  }); 
}); 
 
server.listen(8080, () => { 
  console.log('前端服务器: http://localhost:8080'); 
  console.log('支持SPA路由，API代理到 :7001'); 
}); 
