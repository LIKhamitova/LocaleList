const http = require('http');
const path = require('path');

// Start server on a random available port
const server = require(path.join(__dirname, '..', 'src', 'server', 'server.js'));

const TEST_PORT = process.env.PORT || 3001;

function request(url) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${server.address().port}${url}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      passed++;
      console.log(`  ✓ ${message}`);
    } else {
      failed++;
      console.error(`  ✗ ${message}`);
    }
  }

  // Wait a tick for server to be ready
  await new Promise(r => setTimeout(r, 100));

  console.log('Testing GET /locales...\n');

  const res = await request('/locales');

  // 1. Status code
  assert(res.status === 200, 'Status code is 200');

  // 2. Content-Type
  const ct = res.headers['content-type'] || '';
  assert(ct.includes('application/json'), 'Content-Type is application/json');

  // 3. Valid JSON array
  let data;
  try {
    data = JSON.parse(res.body);
    assert(Array.isArray(data), 'Response body is a JSON array');
  } catch {
    assert(false, 'Response body is valid JSON');
  }

  if (Array.isArray(data)) {
    // 4. Array length
    assert(data.length === 15, `Array contains 15 locales (got ${data.length})`);

    // 5. Each entry has required fields
    const requiredFields = ['code', 'language', 'country', 'currency', 'tld', 'flag', 'timezone', 'capital'];
    const currencyFields = ['code', 'symbol'];

    data.forEach((locale, i) => {
      requiredFields.forEach(field => {
        assert(locale.hasOwnProperty(field), `Entry ${i} has field '${field}'`);
      });

      if (locale.currency && typeof locale.currency === 'object') {
        currencyFields.forEach(f => {
          assert(locale.currency.hasOwnProperty(f), `Entry ${i} currency has field '${f}'`);
        });
      } else {
        assert(false, `Entry ${i} currency is an object`);
      }
    });

    // 6. Flag is an SVG string
    data.forEach((locale, i) => {
      assert(
        typeof locale.flag === 'string' && locale.flag.trim().startsWith('<svg'),
        `Entry ${i} flag is an inline SVG string`
      );
    });
  }

  // 7. 404 for unknown routes
  const res404 = await request('/nonexistent');
  assert(res404.status === 404, 'Unknown route returns 404');

  console.log(`\n${passed + failed} tests, ${passed} passed, ${failed} failed.`);

  server.close(() => {
    process.exit(failed > 0 ? 1 : 0);
  });
}

runTests().catch(err => {
  console.error('Test error:', err);
  server.close(() => process.exit(1));
});
