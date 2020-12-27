import { COLLECTIONS, MESSAGES, EXPIRETIME } from "./../config/constants";
import { IResolvers } from "graphql-tools";
import JWT from "../lib/jwt";
import PasswordSecurity from "../lib/hash";

const resolversQuery: IResolvers = {
  Query: {
    async users(_, __, { db }) {
      try {
        // obtener la lista de todos los usuarios
        return {
          status: true,
          message: MESSAGES.LOAD_USERS_SUCCESS,
          users: await db.collection(COLLECTIONS.USERS).find().toArray(),
        };
      } catch (err) {
        console.log(err);
        return {
          status: false,
          message: MESSAGES.LOAD_USERS_ERROR,
          users: [],
        };
      }
    },
    async login(_, { email, password }, { db }) {
      try {
        const user = await db.collection(COLLECTIONS.USERS).findOne({ email });
        if (user === null) {
          return {
            status: false,
            message: MESSAGES.USER_NOT_FOUND,
            token: null,
          };
        }
        // obtener el usuario
        const passwordCheck = new PasswordSecurity().compareHashedPassword(
          password,
          user.password
        );
        const message = !passwordCheck
          ? MESSAGES.LOGIN_ERROR
          : MESSAGES.LOGIN_SUCCESS;

        if (passwordCheck !== null) {
          delete user.password;
          delete user.registerDate;
          delete user.birthdate;
        }
        return {
          status: true,
          message,
          token: !passwordCheck
            ? null
            : new JWT().sign({ user }, EXPIRETIME.H24),
        };
      } catch (err) {
        console.log(err);
        return {
          status: false,
          message: MESSAGES.LOGIN_ERROR,
          token: null,
        };
      }
    },
    async me(_, __, { token }) {
      console.log(token);
      let info = new JWT().verify(token);
      if (info === MESSAGES.TOKEN_VERIFY_FAILED) {
        return {
          status: false,
          message: info,
          user: null,
        };
      }
      return {
        status: true,
        message: MESSAGES.TOKEN_SUCCESS,
        user: Object.values(info)[0],
      };
    },
  },
};

export default resolversQuery;
