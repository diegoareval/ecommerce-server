import { COLLECTIONS, MESSAGES } from "./../config/constants";
import { IResolvers } from "graphql-tools";
import JWT from "../lib/jwt";

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
    async login(_, {email, password}, {db}){
      try {
        const emailVerify = await db.collection(COLLECTIONS.USERS).findOne({email})
        if(emailVerify === null) {
          return{
            status: false,
            message: "Usuario no existe",
            token: null
          }
        }
        // obtener el usuario
        const user = await db.collection(COLLECTIONS.USERS).findOne({email, password})
        const message = (user === null)? MESSAGES.LOGIN_ERROR: MESSAGES.LOGIN_SUCCESS

        if(user !==null){
          delete user.password
          delete user.registerDate
          delete user.birthdate
        }
        return {
          status: true,
          message,
          token: (user === null)? null : new JWT().sign({user})
        }
      } catch (err) {
        console.log(err);
        return {
          status: false,
          message: MESSAGES.LOGIN_ERROR,
          token: null
        }
      }
    }
  },
};

export default resolversQuery;
