import { assignDocumentId, findOneElement, insertOneElement } from './../../lib/db-operations';
import { COLLECTIONS, MESSAGES } from './../../config/constants';
import { IResolvers } from "graphql-tools";
import GenreService from '../../services/genre.service';

// mutation para registrar usuario
const resolversGenreMutation: IResolvers = {
  Mutation:{
    addGenre(_, variables, context){
     return new GenreService(_,variables, context).insert();
    }
  }
}

export default resolversGenreMutation;