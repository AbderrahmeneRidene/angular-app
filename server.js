const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

const DIST_FOLDER = path.join(__dirname, 'dist/azure-ad-bootstrap/browser');

// servir Angular
app.use(express.static(DIST_FOLDER));

// fallback pour le routing Angular
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_FOLDER, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Angular app running on port ${PORT}`);
});
