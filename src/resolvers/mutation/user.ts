import { IResolvers } from "graphql-tools";
import UserService from '../../services/user.service';

// mutation para registrar usuario
const resolversUsersMutation: IResolvers = {
  Mutation:{
    async register(_, {user}, context){     
     return new UserService(_, {user}, context).register()
    },
    deleteUser(_, variables, context){
      return new UserService(_, variables, context).delete()
    },
    updateUser(_, variables, context){
      return new UserService(_, variables, context).modify()
    }
  }
}

export default resolversUsersMutation;