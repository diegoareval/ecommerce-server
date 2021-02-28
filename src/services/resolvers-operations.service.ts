import { updateOneElement, removeOneElement } from '../lib/db-operations';
import { IVariables } from "../interfaces/variable.interface";
import { IContextData } from "../interfaces/context-data.interface";
import { findAllElements, insertOneElement, findOneElement } from "../lib/db-operations";
import { Db } from "mongodb";
import { pagination } from '../lib/pagination';

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

  protected getDb(): Db {return this.context.db!}
  protected getToken(): string {return this.context.token!}
  // listar informacion
  protected async list(collection: string, listElement: string, page: number = 1, itemsPage: number = 20, filter: object = {active: {$ne: false}}) {
    try {
      const paginationData = await  pagination(this.getDb(), collection, page, itemsPage, filter);      
      return {
        info: {
          page: paginationData.page,
          pages: paginationData.pages,
          itemsPage: paginationData.itemsPage,
          total: paginationData.total
        },
        status: true,
        message: `Lista de ${listElement} cargada correctamente`,
        items: await findAllElements(collection, this.getDb(), filter, paginationData),
      };
    } catch (error) {
      return {
        info: null,
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
      return await findOneElement(collection, this.getDb(), {
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
       return await insertOneElement(collection, this.getDb(), document).then((res)=>{
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
  protected async update(collection: string, filter: object, objectUpdate: object, item: string){
       try{
        return await updateOneElement(collection, this.getDb(), filter, {
          $set:objectUpdate
        }).then((res)=>{
          if(res.result.nModified === 1 && res.result.ok ){
            return {
              status: true,
              message: `se actualizo correctamente el ${item}`,
              item: Object.assign({}, filter, objectUpdate)
            };
          }
          return {
            status: false,
            message: `No se ha actualizado el ${item}`,
            item: null
          };
        })
       }catch(error){
        return {
          status: false,
          message: `error inesperado al actualizar el ${item}`,
          item: null
        };
       }
  }

  // eliminar item
  protected async remove(collection: string, filter: object, item: string) {
       try{
         return await removeOneElement(collection, this.getDb(), filter).then((res) =>{
           if(res.deletedCount === 1){
              return{
                status: true,
                message: `se eliminado correctamente el ${item}`
              }
           }
           return {
            status: false,
            message: `No se ha eliminado el ${item}`,
          };
         })
       }catch(error){
        return {
          status: false,
          message: `error inesperado al eliminar el ${item}`
        };
       }
  }
}

export default ResolverOperationsServices;
