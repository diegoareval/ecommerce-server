import { COLLECTIONS } from './../config/constants';
import { IResolvers } from "graphql-tools";


const resolversMutation: IResolvers = {
  Mutation:{
    async register(_, {user}, {db}){       
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
        // guardar el documento
        return await db.collection(COLLECTIONS.USERS).insertOne(user).then(async () =>{
           return user;
        }).catch((err: Error) =>{
            console.log(err.message);
            return null;
        });
    }
  }
}

export default resolversMutation;