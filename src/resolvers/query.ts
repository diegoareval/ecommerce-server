import { COLLECTIONS } from "./../config/constants";
import { IResolvers } from "graphql-tools";

const resolversQuery: IResolvers = {
  Query: {
    async users(_, __, { db }) {
      try {
        // obtener la lista de todos los usuarios
        return {
          status: true,
          message: "Lista cargada satisfactoriamente",
          users: await db.collection(COLLECTIONS.USERS).find().toArray()
        }
      } catch (err) {
        console.log(err);
        return {
          status: false,
          message: "Ha ocurrido un error",
          users: []
        }
      }
    },
  },
};

export default resolversQuery;
