const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('Conflict');
        break;
      }

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Bad Request');
        break;
      }

      const limitSizeStream = new LimitSizeStream({limit: 1024 * 1014});
      const writeStream = fs.createWriteStream(filepath);

      req
          .on('aborted', () => {
            if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
            req.destroy();
          })
          .pipe(limitSizeStream)
          .on('error', (error) => {
            if (error.code === 'LIMIT_EXCEEDED') {
              res.statusCode = 413;
              res.end('Payload too large');
              req.destroy();
            }
          })
          .pipe(writeStream)
          .on('finish', () => {
            res.statusCode = 201;
            res.end('Created');
          });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
