import { checkData } from './../lib/utils';
import { findOneElement, assignDocumentId } from "./../lib/db-operations";
import { COLLECTIONS } from "./../config/constants";
import { IContextData } from "./../interfaces/context-data.interface";
import ResolverOperationsServices from "./resolvers-operations.service";
import slugify from "slugify";

class GenreService extends ResolverOperationsServices {
  collection = COLLECTIONS.GENRES;
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  // obteniendo todos los generos y retornando en el formato correcto
  async items() {
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;

    const result = await this.list(COLLECTIONS.GENRES, "generos", page, itemsPage);
    return {
      info: result.info,
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
    if (!checkData(genre || "")) {
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
    const id = await assignDocumentId(this.getDb(), this.collection, { id: -1 })
    console.log(id);
    
    const genreObject = {
      id,
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

  async modify() {
    const id = this.getVariables().id;
    const genre = this.getVariables().genre;

    // comprobar que el id es correcto
    if (!checkData(String(id) || "")) {
      return {
        status: false,
        message: "Debes especificar correctamente el elemento a editar",
        genre: null,
      };
    }

    

    if (!checkData(genre || "")) {
      return {
        status: false,
        message:
          "Debes especificar correctamente el genero del elemento a editar",
        genre: null,
      };
    }
    // payload
    const objectUpdate = {
      name: genre,
      slug: slugify(genre || "", { lower: true }),
    };
    // actualizar elemento
    const result = await this.update(
      this.collection,
      { id },
      objectUpdate,
      "genero"
    );
    return {
      status: result.status,
      message: result.message,
      genre: result.item,
    };
  }

  async delete(){
    const id = this.getVariables().id;

    if (!checkData(String(id) || "")) {
      return {
        status: false,
        message: "Debes especificar correctamente el elemento a eliminar",
        genre: null,
      };
    }
    const result = await this.remove(
      this.collection,
      { id },
      "genero"
    );
    return {
      status: result.status,
      message: result.message,
      genre: null,
    };
  }

  async block(){
    const id = this.getVariables().id;
    if (!checkData(String(id) || "")) {
      return {
        status: false,
        message: "Debes especificar correctamente el elemento a bloquear",
        genre: null,
      };
    }
    const result = await this.update(this.collection, {id}, {active: false}, "género");
        return {
          status: result.status,
          message: (result.status)? "Bloqueado correctamente": "No se ha bloqueado",
        }
  }

  
  private async checkInDatabase(value: string) {
    return await findOneElement(this.collection, this.getDb(), { name: value });
  }
}

export default GenreService;
