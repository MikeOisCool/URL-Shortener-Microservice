require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
let urlDatabase = [];
app.use(bodyParser.urlencoded({ extended: false }));
const isValidUrl = (url) => {
  const urlPattern = /^(http|https):\/\/[^ "]+$/;
  return urlPattern.test(url);
};



app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  
  if (!isValidUrl(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Generiere eine ID (short_url)
  const shortUrl = urlDatabase.length + 1;
  urlDatabase.push({ original_url: originalUrl, short_url: shortUrl });

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// GET: Weiterleitung von der Kurz-URL zur Original-URL
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);
  const urlEntry = urlDatabase.find(entry => entry.short_url === shortUrl);

  if (urlEntry) {
    return res.redirect(urlEntry.original_url);
  } else {
    return res.json({ error: "No URL found for this short_url" });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
