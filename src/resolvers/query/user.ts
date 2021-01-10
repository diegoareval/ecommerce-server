import { findOneElement, findAllElements } from "./../../lib/db-operations";
import { COLLECTIONS, MESSAGES, EXPIRETIME } from "./../../config/constants";
import { IResolvers } from "graphql-tools";
import JWT from "./../../lib/jwt";
import PasswordSecurity from "./../../lib/hash";
import UserService from '../../services/user.service';

const resolversUsersQuery: IResolvers = {
  Query: {
    async users(_, __, context) {
      return new UserService(_, __, context).items();
    },
    async login(_, { email, password }, context) {
      return new UserService(_, {user:{email, password}}, context).login();
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

export default resolversUsersQuery;
