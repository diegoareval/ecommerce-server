import GMR from 'graphql-merge-resolvers';
import resolversUsersMutation from './user';

const mutationResolvers = GMR.merge([
    resolversUsersMutation
])

export default mutationResolvers;