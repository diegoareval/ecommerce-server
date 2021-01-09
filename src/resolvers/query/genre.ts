import { MESSAGES, COLLECTIONS } from './../../config/constants';
import { IResolvers } from "graphql-tools";
import { findAllElements } from '../../lib/db-operations';

const resolversGenreQuery: IResolvers = {
  Query: {
    async genres(_, __, { db }){
      try{
         return {
             status: true,
             message: MESSAGES.GENRES_SUCCESS,
             genres: await findAllElements(COLLECTIONS.GENRES, db)
         };
      }
      catch(error){
        return {
            status: false,
            message: `${MESSAGES.GENRES_ERROR} ${error}`,
            genres: null
        };
      }
    }
  },
};

export default resolversGenreQuery;