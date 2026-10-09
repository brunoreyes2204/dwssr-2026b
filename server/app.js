//Función para manejar errores de la aplicación
import createError from 'http-errors';
//Importar el framework Express
import express from 'express';
//Importa módulos para manejar rutas
import path from 'node:path';
//Importar módulos para manejar cookis
import cookieParser from 'cookie-parser';
//Importar módulos para manejar logs
import logger from 'morgan';
//Importando biblioteca de debug 👍
import createDebug from 'debug';
//Se importan las rutas de la aplicación 
//var indexRouter = require('./routes/index');
import indexRouter from '#routes/index.js';
//var usersRouter = require('./routes/users');
import usersRouter from '#routes/users.js';
//Importando el registrador de helper
import {registerViteHelper} from './lib/vite.js'
//Imports para crear dirname 
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
//Importando el template engine handlebars 
import hbs from 'hbs'
//Creando la variable
//Creación del objeto debug 👍
const debug=createDebug('desarrollo-de-aplicaciones-ssr-2026b:app');
//Creando variables de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Se crea la aplicación Express
debug("🔨Creando backend");
var app = express();

// Configuración de la vista del motor de plantillas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//Registro helper
registerViteHelper(hbs);

//Configuración de middlewares para manejar solicitudes HTTP
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//Archivos estáticos para producción
if(process.env.NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
}
//Configuración de la carpeta pública para servir archivos estáticos
debug("🔨 Creando servidor de archivos estáticos");
app.use(express.static(path.join(__dirname, '..', 'public')));
//Registramos las rutas de la aplicación
debug("🛣️Registrando rutas");
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//module.exports = app;
export default app;