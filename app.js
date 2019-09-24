const express = require('express');
      http = require('http');
      path = require('path');
      session = require('express-session');
      app = express();
      mysql      = require('mysql');
      bodyParser = require('body-parser');
      db = require(__dirname, 'models/db')
var expressValidator = require('express-validator');
var index = require('./routes/index');
var register = require('./routes/register');

app.use('/', index);
app.use('/', register);

var engine = require('ejs-mate');
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


var server = http.createServer(app);

var port = 8995;
server.listen(port);

module.exports = app;
