// Local stand-in for GitHub Pages: serves dist/ under /landing-concepts/ with no SPA
// fallback — folder → index.html, missing → 404.html (status 404), dir without slash → 301.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PREFIX = '/landing-concepts';
const ROOT = path.resolve('dist');
const PORT = +(process.env.PORT || 4180);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json' };

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (!url.startsWith(PREFIX)) { res.writeHead(404).end('outside site'); return; }
  let rel = url.slice(PREFIX.length) || '/';
  let file = path.join(ROOT, rel);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!rel.endsWith('/')) { res.writeHead(301, { Location: url + '/' }).end(); return; }
    file = path.join(file, 'index.html');
  }
  if (!fs.existsSync(file)) {
    res.writeHead(404, { 'Content-Type': TYPES['.html'] }).end(fs.readFileSync(path.join(ROOT, '404.html')));
    return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' }).end(fs.readFileSync(file));
}).listen(PORT, () => console.log(`pages-sim on http://localhost:${PORT}${PREFIX}/`));
