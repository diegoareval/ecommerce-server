import environments from "./config/environments";
import App from './lib/app';

// configuracion de variables de entorno
if (process.env.NODE_ENV !== "production") {
  const env = environments;
  console.log(env);
}
 // inicializar aplicacion
new App().init();
