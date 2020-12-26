import query from "./query";
import { IResolvers } from "graphql-tools";


const resolvers: IResolvers = {
  ...query
}

export default resolvers;