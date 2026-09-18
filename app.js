//funcion para manejar errores
var createError = require('http-errors');
//Importar el framework express
var express = require('express');
//Importa modulos para manejar rutas
var path = require('path');
//Importa modulos para manejar cookies
var cookieParser = require('cookie-parser');
//Importa modulos para manejar logs
var logger = require('morgan');

//Importar las rutas de la aplicación
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//Crear la aplicación express
var app = express();

// Configurar el motor de vistas 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Configurar middlewares de la aplicación
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Configurar la carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));


// Registramos las rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Capturamos los errores 404 y los enviamos al manejador de errores
app.use(function(req, res, next) {
  next(createError(404));
});

// Manejador de errores
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
