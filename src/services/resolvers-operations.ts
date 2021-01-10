import { IVariables } from "./../interfaces/variable.interface";
import { IContextData } from "./../interfaces/context-data.interface";
import { findAllElements, insertOneElement, findOneElement } from "../lib/db-operations";

class ResolverOperationsServices {
  private root: object;
  private variables: IVariables;
  private context: IContextData;
  constructor(root: object, variables: IVariables, context: IContextData) {
    this.root = root;
    this.variables = variables;
    this.context = context;
  }
 
  protected getVariables(): IVariables {return this.variables}
  // listar informacion
  protected async list(collection: string, listElement: string) {
    try {
      return {
        status: true,
        message: `Lista de ${listElement} cargada correctamente`,
        items: await findAllElements(collection, this.context.db),
      };
    } catch (error) {
      return {
        status: false,
        message: `La lista de ${listElement} no se pudo cargar: ${error}`,
        items: null,
      };
    }
  }

  // detalles de un item especifico
  protected async get(collection: string) {
    const collectionLabel = collection
      .toLowerCase()
      .substr(0, collection.length - 1);
    try {
      return await findOneElement(collection, this.context.db, {
        id: this.variables.id,
      }).then((result) => {
        if (result) {
          return {
            status: true,
            message: `${collectionLabel} ha sido cargada correctamente con sus detalles`,
            item: result,
          };
        }
        return {
          status: true,
          message: `${collectionLabel} no ha obtenido detalles porque no existe`,
          item: null,
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Error inesperado al querer cargar los detalles de ${collectionLabel}`,
        item: null,
      };
    }
  }

  // agregar item
  protected async add(collection: string, document: object, item: string) {
    try {
       return await insertOneElement(collection, this.context.db, document).then((res)=>{
         if(res.result.ok === 1){
          return {
            status: true,
            message: `se inserto correctamente el ${item}`,
            item: document
          };
         }
         return {
          status: false,
          message: `No se ha insertado el ${item}`,
          item: null
        };
       });
    }catch(error){
      return {
        status: false,
        message: `error inesperado al insertar ${item}`,
        item: null
      };
    }
  }

  // modificar item

  // eliminar item
}

export default ResolverOperationsServices;
