
import { IResolvers } from "graphql-tools";
import GenreService from '../../services/genre.service';

const resolversGenreQuery: IResolvers = {
  Query: {
    async genres(_, {page, itemsPage}, { db }){
      console.log(page, itemsPage);
      
      return new GenreService(_,{}, {db}).items();
    },
    async genre(_, {id}, {db}){
     return new GenreService(_, {id}, {db}).detail();
    }
  },
};

export default resolversGenreQuery;