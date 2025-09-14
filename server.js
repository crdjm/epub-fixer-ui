const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3456;

// Serve static files from .next/static
app.use('/_next/static', express.static(path.join(__dirname, '.next', 'static')));

// Serve static files from public directory if it exists
if (fs.existsSync(path.join(__dirname, 'public'))) {
  app.use(express.static(path.join(__dirname, 'public')));
}

// Handle all API routes
app.get(/^\/api\/.*$/, (req, res) => {
  res.status(404).json({ error: 'API routes not available in static mode' });
});

// Serve the main page
app.get('/', (req, res) => {
  // Try to serve the built page HTML if it exists
  const htmlPath = path.join(__dirname, '.next', 'server', 'app', 'page.html');
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    // Fallback to a simple HTML page
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>EPUB Fixer UI</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <div id="__next">
            <h1>EPUB Fixer UI</h1>
            <p>Application is starting...</p>
          </div>
        </body>
      </html>
    `);
  }
});

// Handle all other routes by serving the main page (for client-side routing)
app.get(/.*/, (req, res) => {
  const htmlPath = path.join(__dirname, '.next', 'server', 'app', 'page.html');
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>EPUB Fixer UI</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <div id="__next">
            <h1>EPUB Fixer UI</h1>
            <p>Application is starting...</p>
          </div>
        </body>
      </html>
    `);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});