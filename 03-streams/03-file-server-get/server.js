const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Bad Request');
        break;
      }

      if (fs.existsSync(filepath)) {
        const stream = fs.createReadStream(filepath);

        stream.pipe(res).on('error', (error) => {
          throw new Error(error);
        });
      } else {
        res.statusCode = 404;
        res.end('Not found');
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

  req.on('aborted', () => {
    stream.destroy();
  });
});

module.exports = server;
