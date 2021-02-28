import { IMailOptions } from "./../../interfaces/email.interface";
import { findOneElement, updateOneElement } from "./../../lib/db-operations";
import { EXPIRETIME, MESSAGES, COLLECTIONS } from "./../../config/constants";
import { IResolvers } from "graphql-tools";
import JWT from "../../lib/jwt";
import UserService from "../../services/user.service";
import PasswordSecurity from "../../lib/hash";
import MailService from "../../services/mail.service";

// mutation para registrar usuario
const resolversEmailMutation: IResolvers = {
  Mutation: {
    async sendEmail(_, { mail }) {
      return new MailService().send(mail);
    },
    async activeUserEmail(_, { id, email }) {
      const token = new JWT().sign({ user: { id, email } }, EXPIRETIME.H1);
      const html = `Para activar la cuenta haz click sobre esto: <a href="${process.env.CLIENT_URL}/#/active/${token}"> Click aqui</a>`;
      const mail: IMailOptions = {
        html,
        to: email,
        subject: "Activar Usuario",
      };
      return new MailService().send(mail);
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
      // get user info
      const user = await findOneElement(COLLECTIONS.USERS, db, { email });
      if (!user) {
        return {
          status: false,
          message: `el usuario co el ${email} no existe`,
          user: null,
        };
      }
      const newUser = {
        id: user.id,
        email,
      };
      const token = new JWT().sign({ user: newUser }, EXPIRETIME.M15);
      console.log(token);

      const html = `Para cambiar la contraseña haz click sobre esto: <a href="${process.env.CLIENT_URL}/#/reset/${token}"> Click aqui</a>`;
      const mail: IMailOptions = {
        to: email, // list of receivers
        subject: "Cambiar Contraseña", // Subject line
        html, // html body
      };
      return new MailService().send(mail);
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
