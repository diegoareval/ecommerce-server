import { IMailOptions } from "./../../interfaces/email.interface";
import { findOneElement, updateOneElement } from "./../../lib/db-operations";
import { EXPIRETIME, MESSAGES, COLLECTIONS } from "./../../config/constants";
import { IResolvers } from "graphql-tools";
import JWT from "../../lib/jwt";
import UserService from "../../services/user.service";
import PasswordSecurity from "../../lib/hash";
import MailService from "../../services/mail.service";
import PasswordService from "../../services/password.service";

// mutation para registrar usuario
const resolversEmailMutation: IResolvers = {
  Mutation: {
    async sendEmail(_, { mail }) {
      return new MailService().send(mail);
    },
    async activeUserEmail(_, { id, email }) {
      return new  UserService(_, {user:{ id, email}}, {}).active()
    },
    async activeUserAction(_, { id, birthdate, password }, { token, db }) {
      const verify = verifyToken(token, id);
      if (verify?.status === false) {
        return {
          status: verify.status,
          message: verify.message,
        };
      }

      return new UserService(
        _,
        { id, user: { birthdate, password } },
        { token, db }
      ).unblock(true);
    },
    async resetPassword(_, { email }, { db }) {
      console.log(email);
      
     return new PasswordService(_, {user: {email}}, {db}).sendMail();
    },
    async changePassword(_, { id, password }, { db, token }) {
      //check token
      const verify = verifyToken(token, id);
      if (verify?.status === false) {
        return {
          status: verify.status,
          message: verify.message,
        };
      }
      // check correct id and password
      if (id === undefined || id === "") {
        return { status: false, message: "debes especificar un id" };
      }
      if (password === undefined || password === "") {
        return { status: false, message: "debes especificar un password" };
      }
      // encrypt password
      password = new PasswordSecurity().hash(password);
      // update the correct user
      return await updateOneElement(
        COLLECTIONS.USERS,
        db,
        { id },
        { $set: { password } }
      )
        .then((res) => {
          if (res.result.nModified === 1 && res.result.ok) {
            return {
              status: true,
              message: "contraseña cambiada correctamente",
            };
          }
          return {
            status: false,
            message: "no se pudo cambiar la contraseña",
          };
        })
        .catch((err) => {
          return {
            status: false,
            message: "ocurrio un error: " + err,
          };
        });
    },
  },
};

function verifyToken(token: string, id: string) {
  // verify token
  const checkToken = new JWT().verify(token);
  if (checkToken === MESSAGES.TOKEN_VERIFY_FAILED) {
    return {
      status: false,
      message: "El periodo para activar el usuario ha finalizado",
      user: null,
    };
  }
  // si el token es valido
  const user = Object.values(checkToken)[0];
  if (user.id !== id) {
    return {
      status: false,
      message: "El token no corresponde al usuario",
      user: null,
    };
  }
}

export default resolversEmailMutation;
