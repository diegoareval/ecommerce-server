import { findOneElement } from "./../lib/db-operations";
import { EXPIRETIME, COLLECTIONS } from "./../config/constants";
import { IMailOptions } from "./../interfaces/email.interface";
import { IContextData } from "./../interfaces/context-data.interface";
import MailService from "./mail.service";
import ResolverOperationsServices from "./resolvers-operations.service";
import JWT from "../lib/jwt";

class PasswordService extends ResolverOperationsServices {
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  async sendMail() {
    // get user info
    const email = this.getVariables().user?.email || "";
    if (email === "") {
      return {
        status: false,
        message: `debes especificar un email`,
        user: null,
      };
    }
    const user = await findOneElement(COLLECTIONS.USERS, this.getDb(), {
      email,
    });
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
    const html = `Para cambiar la contraseña haz click sobre esto: <a href="${process.env.CLIENT_URL}/#/reset/${token}"> Click aqui</a>`;
    const mail: IMailOptions = {
      to: email, // list of receivers
      subject: "Cambiar Contraseña", // Subject line
      html, // html body
    };
    return new MailService().send(mail);
  }
}

export default PasswordService;
