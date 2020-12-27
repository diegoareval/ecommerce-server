import { IResolvers } from "graphql-tools";

const resolversProductsQuery: IResolvers = {
  Query: {
    async products() {
      return true
    }
  },
};

export default resolversProductsQuery;
