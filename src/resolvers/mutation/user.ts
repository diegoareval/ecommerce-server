import { assignDocumentId, findOneElement, insertOneElement } from './../../lib/db-operations';
import { COLLECTIONS, MESSAGES } from './../../config/constants';
import { IResolvers } from "graphql-tools";
import PasswordSecurity from "./../../lib/hash"

// mutation para registrar usuario
const resolversUsersMutation: IResolvers = {
  Mutation:{
    async register(_, {user}, {db}){     
      // comprobar si usuario existe
      const checkUser  = await findOneElement(COLLECTIONS.USERS, db, {email: user.email}) 
      if(checkUser !== null) {
        return {
          status: false,
          message: MESSAGES.USER_EXIST + user.email,
          user: null
        }
      }
        // comprobar el ultimo usuario para obtener el id
        user.id = await assignDocumentId(db, COLLECTIONS.USERS)
        // asignar la fecha
          user.registerDate = new Date().toISOString()
          // encriptar password
          user.password = new PasswordSecurity().hash(user.password)
        // guardar el documento
        return await insertOneElement(COLLECTIONS.USERS, db, user).then(async () =>{
           return {
             status: true,
             message: MESSAGES.REGISTER_SUCCESS,
             user
           }
        }).catch((err: Error) =>{
            console.log(err.message);
             return {
              status: false,
              message: MESSAGES.REGISTER_ERROR,
              user: null
            }
        });
    }
  }
}

export default resolversUsersMutation;