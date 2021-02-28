import GMR from 'graphql-merge-resolvers';
import resolversGenreQuery from './genre';
import resolversProductsQuery from './product';
import resolversTagQuery from './tag';
import resolversUsersQuery from './user';

const queryResolvers = GMR.merge([
    resolversUsersQuery,
    resolversProductsQuery,
    resolversGenreQuery,
    resolversTagQuery
])

export default queryResolvers