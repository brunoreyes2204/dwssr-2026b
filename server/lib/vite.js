//Biblioteca dile stream
import fs from 'node:fs'
//Biblioteca de rutas
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
//importando Debug
import createDebug from "debug"

//creacion del objeto Debug
const debug = createDebug('dwssr-2026b:server')

//Creando variables de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/*
*Helper para Handlebars que genera las etiquetas de Vite
*EN DESARROLLO: Conecta al servidor de desarrollo de Vite
*EN PRODUCCIÓN: Usa los archivos compilados de Vite
    */ 
export function viteAssets() {
//Obtener modo de ejecución 
const isDev = process.env.NODE_ENV !== 'production'
//Rescatando la URL  del servidor de desarrollo
const viteDevServer = process.env.VITE_DEV_SERVER || 'http://localhost:5173'

//Si estamos en modo de desarrollo
if (isDev) {
//DEn desarrollo cargamos los arechivos del frontend directamente
//del servidor de desarrollo de Vite
  return `
    <script type="module" src="${viteDevServer}/@vite/client"></script>
    <script type="module" src="${viteDevServer}/main.js"></script>
  `;
} 
//En producción leemos el manifest
//Y generamos las etiquetas finales de producción
const manifestPath = join(__dirname, '..', '..','dist', '.vite','manifest.json')





//Si no existe el manifest
if (!fs.existsSync(manifestPath)) {
    debug("Vite manifest not found. Run 'npm run build'");
    return ''
}
//Leyendo y parseando a JSON el archivo de manifiesto que 
//genera vite en la compilación de 
//los archivos del front-end
const manifest= JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
//Obteniendo la ruta del punto de entrada del front-end 
const mainEntry = manifest['main.js']
//Guarda el main.js
if(!mainEntry){
  debug('Archivo main.js no está disponible en el manifiesto de Vite')
  return ''
}

let tags = ''

//CSS files
if(mainEntry.css){
  mainEntry.css.forEach(cssFile => {
    tags += `<link rel="stylesheet" href="/${cssFile}">\n`
})

}
//JS files
tags += `<script type="module" src="/${mainEntry.file}"defer></script>`;

return tags;
}
/*
Función registradora del helper de Handlebars 
*/ 
export function registerViteHelper(hbs){
  hbs.registerHelper('viteAssets', ()=>
    //Sanitizando la salida del helper
     new hbs.SafeString(viteAssets())
  );
}