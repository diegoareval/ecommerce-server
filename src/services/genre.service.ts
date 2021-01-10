import { findOneElement } from './../lib/db-operations';
import { COLLECTIONS } from './../config/constants';
import { IContextData } from './../interfaces/context-data.interface';
import ResolverOperationsServices from "./resolvers-operations";

class GenreService extends ResolverOperationsServices{
    collection = COLLECTIONS.GENRES;
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
        const result = await this.get(this.collection)
        // console.log("resultado",result.genre?.item);
        
        return {
           status: result.status,
           message: result.message,
           genre: result.item
        }
    }

   async insert(){
       // comprobar que no esta en blanco y no esta indefinido
       const genre = this.getVariables().genre;
       if(!this.checkData(genre || '')){
          return {
              status: false,
              message: "El genero no se ha podido crear, especificarlo correctamente",
              genre: null
          }
       }
       // comprobar que no existe
       if(await this.checkInDatabase(genre || '')){
        return {
            status: false,
            message: "El genero especificado ya existe en la base de datos",
            genre: null
        }
       }
       // si valida las opciones anterior insertar documento
       const genreObject = {
           id: '',
           name: '',
           slug: ''
       }
    const result = await this.add(this.collection, {
        id: "85",
        name: genre,
        slug: "realidad-virtual"
    }, 'genero')
    
    return {
       status: result.status,
       message: result.message,
       genre: result.item
    }
   }

   private checkData(value: string) {
       return (value === '' || value===undefined)? false : true
   }
   private async checkInDatabase(value: string){
       return await findOneElement(this.collection, this.getDb(), {name: value})
   }
}

export default GenreService