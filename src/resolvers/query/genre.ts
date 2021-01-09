import { COLLECTIONS } from './../../config/constants';
import { findOneElement } from './../../lib/db-operations';
import { IResolvers } from "graphql-tools";
import GenreService from '../../services/genre.service';

const resolversGenreQuery: IResolvers = {
  Query: {
    async genres(_, __, { db }){
      return new GenreService(_,__, {db}).items();
    },
    async genre(_, {id}, {db}){
     return {
         status: true,
         message: "hi",
         genre: findOneElement(COLLECTIONS.GENRES, db, {id})
     }
    }
  },
};

export default resolversGenreQuery;