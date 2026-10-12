import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  //Ignora los build de front-end
  {
    ignores: [
      "dist/**", //Ignora carpeta de distribución
      "node_modules/**"
    ]
  },
  // 2)Config del Back-end
  { 
    files: ["server/**/*.{js,mjs}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { 
      ecmaVersion: "latest",
      sourceType:"module",
      globals: {
        ...globals.node
      } 
    }   
  },
  // 2.1) Config de Vite
  { 
    files: ["vite.config.js"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { 
      ecmaVersion: "latest",
      sourceType:"module",
      globals: {
        ...globals.node
      } 
    }   
  },
  // 3) Codigo del Front-end
  { 
    files: ["src/**/*.{js,mjs}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { 
      ecmaVersion: "latest",
      sourceType:"module",
      globals: {
        ...globals.browser
      } 
    }   
  },
  // 4) Opcional si hay js en public
  { 
    files: ["public/**/*.{js,mjs}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { 
      ecmaVersion: "latest",
      sourceType:"module",
      globals: {
        ...globals.browser
      } 
    }   
  },
]);
