import { IContextData } from './../interfaces/context-data.interface';
import { findAllElements } from "../lib/db-operations";

 class ResolverOperationsServices {
    private root: object;
    private variables: object;
    private context: IContextData;
    constructor(root: object, variables: object, context: IContextData){
     this.root = root;
     this.variables = variables;
     this.context = context;
    }

    // listar informacion
    protected async list(collection: string, listElement: string){
        try{
            return {
                status: true,
                message: `Lista de ${listElement} cargada correctamente`,
                items: await findAllElements(collection, this.context.db)
            };
         }
         catch(error){
           return {
               status: false,
               message: `La lista de ${listElement} no se pudo cargar: ${error}`,
               items: null
           };
         }
    }
    
    // detalles de un item especifico

    // agregar item

    // modificar item

    // eliminar item
}

export default ResolverOperationsServices