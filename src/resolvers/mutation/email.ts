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
     return new PasswordService(_, {user: {id, password}}, {db}).change();
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
