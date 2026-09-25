//funcion para manejar errores
import createError from 'http-errors'
//Importar el framework express
import express from 'express'
//Importa modulos para manejar rutas
import path from 'node:path'
//Importa modulos para manejar cookies
import cookieParser from 'cookie-parser'
//Importa modulos para manejar logs
import logger from 'morgan'
//Importando biblioteca de debug
import createDebug from "debug" //🐧
  //Import para crear Dirname
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

//Creacion del objeto debug
const debug = createDebug('dwssr-2026b:server') //🐧
//Creando las variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

//Importar las rutas de la aplicación
  //var indexRouter = require('./routes/index'); <---forma vieja
import indexRouter from './routes/index.js'
  //var usersRouter = require('./routes/users'); <---forma vieja
import usersRouter from './routes/users.js'

//Crear la aplicación express
debug("🔨 Creando backend") //🐧
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
debug("🔨 Creando servidor de archivos estáticos") //🐧
app.use(express.static(path.join(__dirname, '..', 'public')));


// Registramos las rutas
debug("🛣️ Registrando rutas") //🐧
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

//module.exports = app;
export default app;