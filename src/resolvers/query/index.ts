import GMR from 'graphql-merge-resolvers';
import resolversProductsQuery from './product';
import resolversUsersQuery from './user';

const queryResolvers = GMR.merge([
    resolversUsersQuery,
    resolversProductsQuery
])

export default queryResolvers