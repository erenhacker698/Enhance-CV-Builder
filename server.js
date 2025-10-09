// Minimal Next.js server for Passenger/cPanel
// Starts Next using the port provided by the host (e.g., Passenger sets PORT)

const { createServer } = require('http');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000; // Passenger sets PORT automatically
const hostname = process.env.HOST || '127.0.0.1';

const app = next({ dev, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (err) {
      console.error('Error handling request', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, hostname, () => {
    console.log(`Next.js app ready on http://${hostname}:${port} (dev=${dev})`);
  });
}).catch((err) => {
  console.error('Failed to start Next.js server:', err);
  process.exit(1);
});
