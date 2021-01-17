import { COLLECTIONS } from './../../config/constants';
import { countElements } from './../../lib/db-operations';

import { IResolvers } from "graphql-tools";
import GenreService from '../../services/genre.service';
import { pagination } from '../../lib/pagination';

const resolversGenreQuery: IResolvers = {
  Query: {
    async genres(_, {page, itemsPage}, { db }){
      console.log(await countElements(COLLECTIONS.GENRES, db));
      console.log(await pagination(db, COLLECTIONS.GENRES, page, itemsPage));
      return new GenreService(_,{}, {db}).items();
    },
    async genre(_, {id}, {db}){
     return new GenreService(_, {id}, {db}).detail();
    }
  },
};

export default resolversGenreQuery;