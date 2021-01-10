import { findOneElement, assignDocumentId } from "./../lib/db-operations";
import { COLLECTIONS } from "./../config/constants";
import { IContextData } from "./../interfaces/context-data.interface";
import ResolverOperationsServices from "./resolvers-operations";
import slugify from "slugify";

class GenreService extends ResolverOperationsServices {
  collection = COLLECTIONS.GENRES;
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  // obteniendo todos los generos y retornando en el formato correcto
  async items() {
    const result = await this.list(COLLECTIONS.GENRES, "generos");
    return {
      status: result.status,
      message: result.message,
      genres: result.items,
    };
  }

  async detail() {
    const result = await this.get(this.collection);
    // console.log("resultado",result.genre?.item);

    return {
      status: result.status,
      message: result.message,
      genre: result.item,
    };
  }

  async insert() {
    // comprobar que no esta en blanco y no esta indefinido
    const genre = this.getVariables().genre;
    if (!this.checkData(genre || "")) {
      return {
        status: false,
        message: "El genero no se ha podido crear, especificarlo correctamente",
        genre: null,
      };
    }
    // comprobar que no existe
    if (await this.checkInDatabase(genre || "")) {
      return {
        status: false,
        message: "El genero especificado ya existe en la base de datos",
        genre: null,
      };
    }
    // si valida las opciones anterior insertar documento
    const genreObject = {
      id: assignDocumentId(this.getDb(), this.collection, { id: -1 }),
      name: genre,
      slug: slugify(genre || "", { lower: true }),
    };
    const result = await this.add(this.collection, genreObject, "genero");
    return {
      status: result.status,
      message: result.message,
      genre: result.item,
    };
  }

  async modify(){
    const id = {id: '4'}
    const objectUpdate = {
      name: "action 1",
      slug: slugify("action 1", {lower: true})
    }
    const result = await this.update(this.collection, id, objectUpdate, "genero")
    return {
      status: result.status,
      message: result.message,
      genre: result.item,
    };
  }

  private checkData(value: string) {
    return value === "" || value === undefined ? false : true;
  }
  private async checkInDatabase(value: string) {
    return await findOneElement(this.collection, this.getDb(), { name: value });
  }
}

export default GenreService;
