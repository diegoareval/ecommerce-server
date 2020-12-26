import query from "./query";
import mutation from "./mutation"
import { IResolvers } from "graphql-tools";

// lista de resolvers donde se incluye queries y mutations
const resolvers: IResolvers = {
  ...query,
  ...mutation
}

export default resolvers;