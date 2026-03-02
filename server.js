const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;
const ROOT = process.cwd();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const safeJoin = (base, target) => {
  const targetPath = '.' + path.normalize('/' + target);
  return path.join(base, targetPath);
};

const serveFile = (filePath, res) => {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    res.writeHead(200, { 'Content-Type': type });
    res.end(content);
  });
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURI((req.url || '/').split('?')[0]);
  const requestPath = urlPath === '/' ? '/index.html' : urlPath;
  const localPath = safeJoin(ROOT, requestPath);

  if (!localPath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(localPath, (error, stats) => {
    if (!error && stats.isFile()) {
      serveFile(localPath, res);
      return;
    }

    // SPA-style fallback to avoid 404 when refreshing non-root URLs
    serveFile(path.join(ROOT, 'index.html'), res);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
