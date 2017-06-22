var express = require('express');
var app = express();

var cacheDuration = 30 * 24 * 60 * 60 * 1000; // 30 days

// Use compress middleware to gzip content
app.use(express.compress());

// Serve up content from public directory
app.use(express.static(__dirname + '/dist', {
  setHeaders: function(res, path) {
    res.setHeader('Expires', new Date(Date.now() + cacheDuration).toUTCString());
    res.setHeader('Last-Modified', (new Date()).toUTCString());
  }
}));

app.listen(3000);
