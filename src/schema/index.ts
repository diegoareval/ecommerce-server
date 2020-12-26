import { makeExecutableSchema } from "graphql-tools";
import { GraphQLSchema } from "graphql";
import 'graphql-import-node'
import typeDefs from './schema.graphql'
import resolvers from '../resolvers'

const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
    resolverValidationOptions: {
        requireResolversForResolveType: undefined
    }
})

export default schema