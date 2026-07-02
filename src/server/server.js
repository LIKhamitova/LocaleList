const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const LOCALES_PATH = path.join(__dirname, 'locales.json');
const STATIC_ROOT = path.join(__dirname, '..');

// MIME types for static files
const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js':   'text/javascript',
};

let localesData;

try {
  localesData = fs.readFileSync(LOCALES_PATH, 'utf-8');
} catch (err) {
  console.error('Failed to read locales.json:', err.message);
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  // API: GET /locales
  if (req.url === '/locales') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(localesData);
    return;
  }

  // Static files
  let filePath;
  if (req.url === '/') {
    filePath = path.join(STATIC_ROOT, 'index.html');
  } else {
    // Only allow safe extensions — prevents directory traversal
    const ext = path.extname(req.url).toLowerCase();
    if (ext !== '.html' && ext !== '.css' && ext !== '.js') {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
      return;
    }
    filePath = path.join(STATIC_ROOT, req.url);
  }

  // Prevent directory traversal outside STATIC_ROOT
  if (!filePath.startsWith(STATIC_ROOT)) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Forbidden' }));
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, 'utf-8', (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = server;
