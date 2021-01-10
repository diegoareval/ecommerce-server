import { findOneElement } from './../lib/db-operations';

import { COLLECTIONS, EXPIRETIME, MESSAGES } from "./../config/constants";
import { IContextData } from "./../interfaces/context-data.interface";
import ResolverOperationsServices from "./resolvers-operations";
import PasswordSecurity from '../lib/hash';
import JWT from '../lib/jwt';


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

  // autenticarnos
  async auth(){
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

  // login
  async login(){
      const variables = this.getVariables().user
    try {
        const user = await findOneElement(this.collection, this.getDb(), { email: variables?.email });
        if (user === null) {
          return {
            status: false,
            message: MESSAGES.USER_NOT_FOUND,
            token: null,
          };
        }
        // obtener el usuario
        const passwordCheck = new PasswordSecurity().compareHashedPassword(
          variables?.password || '',
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
          user: !passwordCheck? null: user,
          status: passwordCheck,
          message,
          token: !passwordCheck
            ? null
            : new JWT().sign({ user }, EXPIRETIME.H24),
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

}

export default UserService;
