import { IResolvers } from "graphql-tools";


const resolversQuery: IResolvers = {
  Query:{
    users(root, args, context, info){       
        return [
            {
                id: 1,
                name: "Diego",
                lastname: "Arevalo",
                email: "diegoavelar@gmail.com",
                password: "123456",
                registerDate: "12-12-2012",
                birthdate: "04-10-1996"
            }
        ]
    }
  }
}

export default resolversQuery;