import GMR from 'graphql-merge-resolvers';
import resolversEmailMutation from './email';
import resolversGenreMutation from './genre';
import resolversUsersMutation from './user';

const mutationResolvers = GMR.merge([
    resolversUsersMutation,
    resolversGenreMutation,
    resolversEmailMutation
])

export default mutationResolvers;