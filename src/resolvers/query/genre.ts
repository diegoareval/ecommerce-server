import { IResolvers } from "graphql-tools";
import GenreService from '../../services/genre.service';

const resolversGenreQuery: IResolvers = {
  Query: {
    async genres(_, __, { db }){
      return new GenreService(_,__, {db}).items();
    }
  },
};

export default resolversGenreQuery;