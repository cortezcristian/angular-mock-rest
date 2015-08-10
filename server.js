var Sequelize = require('sequelize'),
    epilogue = require('epilogue'),
    http = require('http');

// Define your models
var database = new Sequelize('database', '', '', {
       dialect: 'sqlite',
       storage: 'db/database.sqlite'
 });
var User = database.define('User', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

var Proveedores = database.define('Proveedores', {
    idProveedor       : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	nombre            : Sequelize.STRING,
	apellido          : Sequelize.STRING,
	email             : Sequelize.STRING,
    dir               : Sequelize.STRING

}, {tableName: 'Proveedores'});

// Initialize server
var server, app;
if (process.env.USE_RESTIFY) {
  var restify = require('restify');

  app = server = restify.createServer()
  app.use(restify.queryParser());
  app.use(restify.bodyParser());
} else {
  var express = require('express'),
      bodyParser = require('body-parser');

  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  server = http.createServer(app);
}

// Initialize epilogue
epilogue.initialize({
  app: app,
  sequelize: database
});

// Create REST resource
var userResource = epilogue.resource({
  model: User,
  endpoints: ['/users', '/users/:id']
});

// Create REST resource
var proveedorResource = epilogue.resource({
  model: Proveedores,
  endpoints: ['/proveedores', '/proveedores/:id']
});

// Create database and listen
database
  .sync({ force: true })
  .then(function() {
    var host = '0.0.0.0',
        port = 9001;
    server.listen(port, host, function() {

      console.log('listening at http://%s:%s', host, port);
    });
  });
