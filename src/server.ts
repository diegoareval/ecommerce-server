import express from "express";
import cors from "cors";
import compression from "compression";
import { createServer } from "http";
import environments from "./config/environments";
import { ApolloServer } from "apollo-server-express";
import schema from "./schema"
import expressPlayground from "graphql-playground-middleware-express"

// configuracion de variables de entorno
if (process.env.NODE_ENV !== "production") {
  const env = environments;
  console.log(env);
}

async function init() {
  const app = express();
  app.use(cors());
  app.use(compression());

  const server = new ApolloServer({
    schema,
    introspection: true
  });

  server.applyMiddleware({app});

  app.get("/", expressPlayground({
    endpoint: '/graphql'
  }));

  const httpServer = createServer(app);
  const PORT = process.env.PORT || 2002;
  httpServer.listen(
    {
      port: PORT,
    },
    () => console.log("running on port: "+PORT)
  );
}

init();
