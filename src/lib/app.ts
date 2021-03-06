import chalk from "chalk"
import { IContext } from "../interfaces/context.interface";
import express from "express";
import cors from "cors";
import compression from "compression";
import { createServer } from "http";
import { ApolloServer } from "apollo-server-express";
import schema from "../schema";
import expressPlayground from "graphql-playground-middleware-express";
import Database from "./database";
export default class App {
  async init() {
    const app = express();
    const database = new Database();
    app.use(cors());
    app.use(compression());
    const db = await database.init();

    const context = async ({ req, connection }: IContext) => {
      const token = req ? req.headers.authorization : connection.authorization;
      return {
        db,
        token,
      };
    };
    const server = new ApolloServer({
      schema,
      introspection: true,
      context,
    });

    server.applyMiddleware({ app });

    app.get(
      "/",
      expressPlayground({
        endpoint: "/graphql",
      })
    );

    const httpServer = createServer(app);
    const PORT = process.env.PORT || 2002;
    httpServer.listen(
      {
        port: PORT,
      },
      () => 
      {
        console.log("+++++conected++++++++++++++")
      console.log(`Status: ${chalk.greenBright("online on ")} ${PORT}`);
      console.log("+++++conected++++++++++++++")
      }
    );
  }
}
