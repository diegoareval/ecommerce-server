import { findOneElement } from "./../../lib/db-operations";
import { EXPIRETIME, MESSAGES, COLLECTIONS } from "./../../config/constants";
import { IResolvers } from "graphql-tools";
import { transport } from "../../config/mailer";
import JWT from "../../lib/jwt";
import UserService from "../../services/user.service";

// mutation para registrar usuario
const resolversEmailMutation: IResolvers = {
  Mutation: {
    async sendEmail(_, { mail }) {
      return new Promise((resolve, reject) => {
        // send mail with defined transport object
        transport.sendMail(
          {
            from: '"Ecommerce 👻" <diego2000avelar@gmail.com>', // sender address
            to: mail.to, // list of receivers
            subject: mail.subject, // Subject line
            //text: "Hello world?", // plain text body
            html: mail.html, // html body
          },
          (error, _) => {
            error
              ? reject({
                  status: false,
                  message: error,
                })
              : resolve({
                  status: true,
                  message: "correo enviado correctamente a: " + mail.to,
                  mail,
                });
          }
        );
      });
    },
    async activeUserEmail(_, { id, email }) {
      const token = new JWT().sign({ user: { id, email } }, EXPIRETIME.H1);
      const html = `Para activar la cuenta haz click sobre esto: <a href="${process.env.CLIENT_URL}/#/active/${token}"> Click aqui</a>`;
      return new Promise((resolve, reject) => {
        // send mail with defined transport object

        transport.sendMail(
          {
            from: '"Ecommerce 👻" <diego2000avelar@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Activar Usuario", // Subject line
            html, // html body
          },
          (error, _) => {
            error
              ? reject({
                  status: false,
                  message: error,
                })
              : resolve({
                  status: true,
                  message: "correo enviado correctamente a: " + email,
                  mail: null,
                });
          }
        );
      });
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
      return new Promise((resolve, reject) => {
        // send mail with defined transport object

        transport.sendMail(
          {
            from: '"Ecommerce 👻" <diego2000avelar@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Cambiar Contraseña", // Subject line
            html, // html body
          },
          (error, _) => {
            error
              ? reject({
                  status: false,
                  message: error,
                })
              : resolve({
                  status: true,
                  message: "correo enviado correctamente a: " + email,
                  mail: null,
                });
          }
        );
      });
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
      // check correct id
      // encrypt password
      // update the correct user
      return{
        status: true,
        message: "correcto"
      }
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
