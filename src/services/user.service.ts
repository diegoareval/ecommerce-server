
import { COLLECTIONS } from "./../config/constants";
import { IContextData } from "./../interfaces/context-data.interface";
import ResolverOperationsServices from "./resolvers-operations";


class UserService extends ResolverOperationsServices {
  private collection = COLLECTIONS.USERS;
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  // obteniendo todos los generos y retornando en el formato correcto
  async items() {
    const result = await this.list(this.collection, "Usuarios");
    return {
      status: result.status,
      message: result.message,
      users: result.items,
    };
  }

}

export default UserService;
