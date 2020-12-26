import query from "./query";
import mutation from "./mutation"
import { IResolvers } from "graphql-tools";


const resolvers: IResolvers = {
  ...query,
  ...mutation
}

export default resolvers;