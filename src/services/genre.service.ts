import { COLLECTIONS } from './../config/constants';
import { IContextData } from './../interfaces/context-data.interface';
import ResolverOperationsServices from "./resolvers-operations";

class GenreService extends ResolverOperationsServices{

    constructor(root: object, variables: object, context: IContextData){
    super(root, variables, context)
    }

    // obteniendo todos los generos y retornando en el formato correcto
    async items(){
        const result = await this.list(COLLECTIONS.GENRES, "generos")
        return {
           status: result.status,
           message: result.message,
           genres: result.items
        }
    }

    async detail(){
        const result = await this.get(COLLECTIONS.GENRES)
        // console.log("resultado",result.genre?.item);
        
        return {
           status: result.status,
           message: result.message,
           genre: result.item
        }
    }

    // listar informacion
  

    // detalles de un item especifico

    // agregar item

    // modificar item

    // eliminar item
}

export default GenreService