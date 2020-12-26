import express from "express";
import cors from "cors";
import compression from "compression";
import { createServer } from "http";
import environments from "./config/environments";

// configuracion de variables de entorno
if (process.env.NODE_ENV !== "production") {
  const env = environments;
  console.log(env);
}

async function init() {
  const app = express();
  app.use(cors());
  app.use(compression());

  app.get("/", (_, res) => {
    res.send("hola mundo");
  });

  const httpServer = createServer(app);
  const PORT = process.env.PORT || 2002;
  httpServer.listen(
    {
      port: PORT,
    },
    () => console.log("port 2002")
  );
}

init();
