const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

const distFolder = path.join(__dirname, 'dist/azure-ad-bootstrap/browser');

// Servir Angular build
app.use(express.static(distFolder));

// Favicon fallback pour éviter les 503
app.get('/favicon.ico', (req, res) => res.sendFile(path.join(distFolder, 'favicon.ico')));

// Toutes les routes Angular redirigent vers index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(distFolder, 'index.html'));
});

app.listen(port, () => console.log(`Server started on port ${port}`));
