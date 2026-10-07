//Biblioteca file Stream
import fs from 'node:fs';
//Biblioteca de rutas
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path'
//Creando variables de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
 /**
  * Helper para Handlebars que geera las etiquetas de Vite
  * EN DESARROLLO: Conecta al servidor de desarrollo de Vite
  * EN PRODUCCIÓN: Usa los archivos compilados de Vite
  */
 export function viteAssets(){
    //Obtener modo de ejecución
    const isDev = process.env.NODE_ENV !== 'production'
    //Rescatando la URL del sservidor de desarrollo
    const viteDevServer = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'

    //Si estamos en modo de desarrollo
    if (isDev) {
        // En desarrollo cargamos los archivos 
        // del front-end directamnente desde el servidor
        // de desarrollo de Vite
        return `
            <script type="module" src="${viteDevServer}/@vite/client"></script>
            <script type="module" src="${viteDevServer}/main.js"></script>
        `;
    }
        // En producción leemos el manifest
        // y generamos las etiquetas finales de producción
        const manifestPath = path.join(__dirname, '..','..','dist','vite','manifest.json');

        //Si no existe el manifest
        if (!fs.existsSync(manifestPath)){
            console.warn("Vite manifest not found. Run 'npm run build'")
            return '';
    }
        //Leyendo y parseando el manifiesto que genera vite en la compilación de los archivos de font-end
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        //Obteniendo la ruta del punto de entrega del front-end
        const mainEntry = manifest['main.js']
        //Guarda el main.js
        if(!mainEntry){
            console.warn('Archivo main.js no esta disponible en el manifiesto de Vite')
            return''
        }

        let tags = ''

        //CSS files
        if(mainEntry.css){
            mainEntry.css.forEach(cssFile => {
                tags += `<link rel="stylesheet" href="/${cssFile}">\n`
            });
        }

        //JS files
        tags += `<script type="module" src="/${mainEntry.file}" defer></script>\n`

        return tags;
}
        //Funcion registradora del helper de handlebars

        export function registerViteHelper(hbs){
            hbs.registerHelper('viteAssets', ()=>{
                return new hbs.SafeString(viteAssets())
            })
        }

