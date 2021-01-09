import GMR from 'graphql-merge-resolvers';
import resolversGenreQuery from './genre';
import resolversProductsQuery from './product';
import resolversUsersQuery from './user';

const queryResolvers = GMR.merge([
    resolversUsersQuery,
    resolversProductsQuery,
    resolversGenreQuery
])

export default queryResolvers