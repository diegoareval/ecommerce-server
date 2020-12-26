import { COLLECTIONS } from "./../config/constants";
import { IResolvers } from "graphql-tools";

const resolversQuery: IResolvers = {
  Query: {
    async users(_, __, { db }) {
      try {
        return await db.collection(COLLECTIONS.USERS).find().toArray();
      } catch (err) {
        console.log(err);
        return [];
      }
    },
  },
};

export default resolversQuery;
