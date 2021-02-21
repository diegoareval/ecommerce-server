import { IResolvers } from "graphql-tools";
import GenreService from '../../services/genre.service';

// mutation para registrar usuario
const resolversGenreMutation: IResolvers = {
  Mutation:{
    addGenre(_, variables, context){
     return new GenreService(_,variables, context).insert();
    },
    updateGenre(_, variables, context){
      return new GenreService(_,variables, context).modify();
     },
     deleteGenre(_, variables, context){
      return new GenreService(_,variables, context).delete();
     },
     blockGenre(_, variables, context){
      return new GenreService(_,variables, context).block();
     }

  }
}

export default resolversGenreMutation;