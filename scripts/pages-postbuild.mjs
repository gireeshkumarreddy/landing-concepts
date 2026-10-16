// GitHub Pages has no SPA rewrites. Copy the built index.html into one folder per
// route (so /<repo>/sagewell/ answers 200 on a direct visit or refresh) and to 404.html
// (so any other path still boots the app and shows its own not-found page).
import fs from 'node:fs';
import path from 'node:path';
import { SITES } from '../src/sites.js';

const dist = path.resolve('dist');
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

for (const { slug } of SITES) {
  fs.mkdirSync(path.join(dist, slug), { recursive: true });
  fs.writeFileSync(path.join(dist, slug, 'index.html'), html);
}
fs.writeFileSync(path.join(dist, '404.html'), html);
// Serve files as-is (no Jekyll processing of the asset folder).
fs.writeFileSync(path.join(dist, '.nojekyll'), '');

console.log(`pages-postbuild: wrote ${SITES.length} route pages, 404.html and .nojekyll`);
