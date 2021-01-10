import { assignDocumentId, findOneElement, insertOneElement } from './../../lib/db-operations';
import { COLLECTIONS, MESSAGES } from './../../config/constants';
import { IResolvers } from "graphql-tools";
import PasswordSecurity from "./../../lib/hash"
import UserService from '../../services/user.service';

// mutation para registrar usuario
const resolversUsersMutation: IResolvers = {
  Mutation:{
    async register(_, {user}, context){     
     return new UserService(_, {user}, context).register()
    }
  }
}

export default resolversUsersMutation;