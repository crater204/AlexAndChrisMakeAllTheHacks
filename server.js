var fs = require('fs');
var express = require('express');
var app = express();
var io = require('socket.io').listen(app.listen(8080));
var pagesHandler = require('./Server/webpages.js')(app);
var api = require('./Server/api')(io);
