var express = require('express');
var fs = require ("fs");
require("coffee-script");
var app = express();

var extractor = require(__dirname + '/extractor');
var site = require(__dirname + '/site');
var duplicates = require(__dirname + '/duplicates');
var logs = require(__dirname + '/logs');
var temps = require(__dirname + '/compileTemplates.coffee');



app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.locals.basedir = app.get('views');

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static('static'));


app.get('/', site.index);
app.get('/controller/:id', site.config);
app.post('/controller/:id/save', site.save);
app.post('/controller/:id/generate', site.generate);
app.post('/controller/:id/delete', site.deleteFailure);
app.post('/controller/:id/refresh', site.refreshList);
app.get('/logs', logs.index);
app.get('/duplicates', duplicates.index);


app.listen(3001);
console.log('Express app started on port 3001');