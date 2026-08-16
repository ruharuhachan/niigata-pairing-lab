import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';

const root = resolve('dist');
const basePath = (process.env.BASE_PATH ?? '/niigata-pairing-lab').replace(/\/$/, '');
const port = Number(process.env.PORT ?? 4321);
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  if (url.pathname === basePath) {
    response.writeHead(308, { Location: `${basePath}/` });
    response.end();
    return;
  }

  const relativePath = url.pathname.startsWith(`${basePath}/`)
    ? url.pathname.slice(basePath.length)
    : url.pathname;
  let filePath = resolve(root, `.${relativePath}`);
  if (!filePath.startsWith(`${root}${sep}`) && filePath !== root) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  if (existsSync(filePath) && statSync(filePath).isDirectory())
    filePath = resolve(filePath, 'index.html');
  if (!existsSync(filePath)) {
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    createReadStream(resolve(root, '404.html')).pipe(response);
    return;
  }

  const contentType = mimeTypes[extname(filePath)] ?? 'application/octet-stream';
  response.writeHead(200, { 'Content-Type': contentType });
  createReadStream(filePath).pipe(response);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Static test server ready on port ${port}.`);
});
