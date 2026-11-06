//Función para manejar errores de la aplicación
import createError from 'http-errors';
//Importar el framework Express
import express from 'express';
//Importa módulos para manejar rutas
import path, { dirname } from 'node:path';
//Importar módulos para manejar cookis
import cookieParser from 'cookie-parser';
//Importar módulos para manejar logs
import morgan from 'morgan';
//Imports para crear dirname 
import { fileURLToPath } from 'node:url';


//Se importan las rutas de la aplicación 
 
import indexRouter from '#routes/index.js';
// eslint-disable-next-line import-x/no-rename-default
import usersRouter from '#routes/users.js';
//importando la función de configuración de hbs
import configureHandlebars from './lib/handlebars.js';
//Importando la configuracion de Winston logger
import logger from './lib/winston.js';


//Creando variables de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Se crea la aplicación Express
logger.info("🔨Creando backend")
const app = express();

// Configurar el motor de vistas con hbs
configureHandlebars(app)

//Configuración de middlewares para manejar solicitudes HTTP
app.use(
  morgan('dev',{
    stream : {
      write:(msg)=>logger.info(msg.trim())
     }
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Archivos estáticos para producción
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
}
//Configuración de la carpeta pública para servir archivos estáticos
logger.info('🔨 Creando servidor de archivos estáticos');
app.use(express.static(path.join(__dirname, '..', 'public')));

//Registramos las rutas de la aplicación
logger.info('🛣️Registrando rutas')
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler

app.use((err, req, res, _next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? {
    status: err.status || 500,
    stack: err.stack
  } : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//module.exports = app;
export default app;