import GMR from 'graphql-merge-resolvers';
import resolversGenreMutation from './genre';
import resolversUsersMutation from './user';

const mutationResolvers = GMR.merge([
    resolversUsersMutation,
    resolversGenreMutation
])

export default mutationResolvers;