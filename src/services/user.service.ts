import { checkData } from "./../lib/utils";
import { findOneElement, assignDocumentId } from "./../lib/db-operations";

import { COLLECTIONS, EXPIRETIME, MESSAGES } from "./../config/constants";
import { IContextData } from "./../interfaces/context-data.interface";
import ResolverOperationsServices from "./resolvers-operations";
import PasswordSecurity from "../lib/hash";
import JWT from "../lib/jwt";

class UserService extends ResolverOperationsServices {
  private collection = COLLECTIONS.USERS;
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  // obteniendo todos los generos y retornando en el formato correcto
  async items() {
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    const result = await this.list(
      this.collection,
      "Usuarios",
      page,
      itemsPage
    );
    return {
      info: result.info,
      status: result.status,
      message: result.message,
      users: result.items,
    };
  }

  // autenticarnos
  async auth() {
    let info = new JWT().verify(this.getToken());
    if (info === MESSAGES.TOKEN_VERIFY_FAILED) {
      return {
        status: false,
        message: info,
        user: null,
      };
    }
    return {
      status: true,
      message: MESSAGES.TOKEN_SUCCESS,
      user: Object.values(info)[0],
    };
  }
  // registrar usuario
  async register() {
    const user = this.getVariables().user;
    // comprobar si usuario es nulo
    if (user === null) {
      return {
        status: false,
        message: "Debes especificar el usuario",
        user: null,
      };
    }
    // comprobar si usuario existe
    const checkUser = await findOneElement(this.collection, this.getDb(), {
      email: user?.email,
    });
    if (checkUser !== null) {
      return {
        status: false,
        message: MESSAGES.USER_EXIST + user?.email,
        user: null,
      };
    }
    // comprobar el ultimo usuario para obtener el id
    user!.id = await assignDocumentId(this.getDb(), this.collection);
    // asignar la fecha
    user!.registerDate = new Date().toISOString();
    // encriptar password
    user!.password = new PasswordSecurity().hash(user?.password || "");
    // guardar el documento
    const result = await this.add(this.collection, user || {}, "usuarios");
    return {
      status: result.status,
      message: result.message,
      user: result.item,
    };
  }

  // update
  // Modificar un usuario
  async modify() {
    const user = this.getVariables().user;
    // comprobar que user no es null
    if (user === null) {
      return {
        status: false,
        message: "Usuario no definido, procura definirlo",
        user: null,
      };
    }
    const filter = { id: user?.id };
    const result = await this.update(
      this.collection,
      filter,
      user || {},
      "usuario"
    );
    return {
      status: result.status,
      message: result.message,
      user: result.item,
    };
  }

  // eliminar
  async delete() {
    const id = this.getVariables().id;

    if (!checkData(String(id) || "")) {
      return {
        status: false,
        message: "Debes especificar correctamente el elemento a eliminar",
        genre: null,
      };
    }
    const result = await this.remove(this.collection, { id }, "usuarios");
    return {
      status: result.status,
      message: result.message,
      user: null,
    };
  }

  // login
  async login() {
    const variables = this.getVariables().user;
    try {
      const user = await findOneElement(this.collection, this.getDb(), {
        email: variables?.email,
      });
      if (user === null) {
        return {
          status: false,
          message: MESSAGES.USER_NOT_FOUND,
          token: null,
        };
      }
      // obtener el usuario
      const passwordCheck = new PasswordSecurity().compareHashedPassword(
        variables?.password || "",
        user.password
      );
      const message = !passwordCheck
        ? MESSAGES.LOGIN_ERROR
        : MESSAGES.LOGIN_SUCCESS;

      if (passwordCheck !== null) {
        delete user.password;
        delete user.registerDate;
        delete user.birthdate;
      }
      return {
        user: !passwordCheck ? null : user,
        status: passwordCheck,
        message,
        token: !passwordCheck ? null : new JWT().sign({ user }, EXPIRETIME.H24),
      };
    } catch (err) {
      console.log(err);
      return {
        status: false,
        message: MESSAGES.LOGIN_ERROR,
        token: null,
      };
    }
  }
  // block user
  async unblock(unblock: boolean = false){
    const id = this.getVariables().id;
    const user = this.getVariables().user;
    if (!checkData(String(id) || "")) {
      return {
        status: false,
        message: "Debes especificar correctamente el elemento a bloquear",
        user: null,
      };
    }
    if(user?.password==="1234"){
      return {
        status: false,
        message: "Debes cambiar el password",
        user: null,
      };
    }
    let update = {active: unblock};
    if(unblock){
        update = Object.assign({}, {active: true}, {birthdate: user?.birthdate, password: new PasswordSecurity().hash(user?.password || "")})
    }
    console.log(update);
    
    const result = await this.update(this.collection, {id}, update, "usuario");
    const action = (unblock)? 'Desbloqueado': 'Bloqueado';
        return {
          status: result.status,
          message: (result.status)? `${action} correctamente`: `No se ha ${action}`,
        }
  }
}

export default UserService;
