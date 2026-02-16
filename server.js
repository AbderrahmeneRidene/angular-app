const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

const distFolder = path.join(__dirname, 'dist/azure-ad-bootstrap/browser');

app.use(express.static(distFolder));

app.get('/*', (req, res) => {
  res.sendFile(path.join(distFolder, 'index.html'));
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(distFolder, 'favicon.ico'));
});

app.listen(port, () => console.log(`Server started on port ${port}`));
