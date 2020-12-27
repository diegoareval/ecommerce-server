import { COLLECTIONS, MESSAGES } from './../config/constants';
import { IResolvers } from "graphql-tools";
import bcrypt from "bcrypt"

// mutation para registrar usuario
const resolversMutation: IResolvers = {
  Mutation:{
    async register(_, {user}, {db}){     
      // comprobar si usuario existe
      const checkUser  = await db.collection(COLLECTIONS.USERS).findOne({email: user.email}) 
      if(checkUser !== null) {
        return {
          status: false,
          message: MESSAGES.USER_EXIST + user.email,
          user: null
        }
      }
        // comprobar el ultimo usuario para obtener el id
        const lastUser = await db.collection(COLLECTIONS.USERS).
        find().limit(1).sort({registerDate: -1}).toArray();

        if(lastUser.length === 0) {
            user.id = 1
        }else{
            user.id = lastUser[0].id+1
        }
        // asignar la fecha
          user.registerDate = new Date().toISOString()
          // encriptar password
          user.password = bcrypt.hashSync(user.password, 10);
        // guardar el documento
        return await db.collection(COLLECTIONS.USERS).insertOne(user).then(async () =>{
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

export default resolversMutation;