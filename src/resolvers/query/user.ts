import { IResolvers } from "graphql-tools";
import UserService from '../../services/user.service';

const resolversUsersQuery: IResolvers = {
  Query: {
    async users(_, {page, itemsPage}, context) {
      return new UserService(_, {pagination: {page, itemsPage}}, context).items();
    },
    async login(_, { email, password }, context) {
      return new UserService(_, {user:{email, password}}, context).login();
    },
    async me(_, __, context) {
      return new UserService(_,__, context).auth()
  },
}
};

export default resolversUsersQuery;
