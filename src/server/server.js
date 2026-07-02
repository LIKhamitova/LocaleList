const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const LOCALES_PATH = path.join(__dirname, 'locales.json');

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

  if (req.method === 'GET' && req.url === '/locales') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(localesData);
    return;
  }

  // 404 for anything else
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = server;
