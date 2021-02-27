import { EXPIRETIME, MESSAGES } from './../../config/constants';
import { IResolvers } from "graphql-tools";
import { transport } from "../../config/mailer";
import JWT from "../../lib/jwt";

// mutation para registrar usuario
const resolversEmailMutation: IResolvers = {
  Mutation: {
    sendEmail(_, {mail}) {
      return new Promise((resolve, reject) => {
        // send mail with defined transport object
        transport.sendMail({
          from: '"Ecommerce 👻" <diego2000avelar@gmail.com>', // sender address
          to: mail.to, // list of receivers
          subject: mail.subject, // Subject line
          //text: "Hello world?", // plain text body
          html: mail.html, // html body
        }, (error, _)=> {
            (error)?reject({
              status: false,
              message: error
            }): resolve({
              status: true,
              message: "correo enviado correctamente a: "+ mail.to,
              mail
            })
        });
      });
    },
    activeUserEmail(_, {id, email}){
      return new Promise((resolve, reject) => {
        // send mail with defined transport object
        const token = new JWT().sign({user: {id, email}}, EXPIRETIME.H1);
        console.log(token);
        
        const html = `Para activar la cuenta haz sobre esto: <a href="${process.env.CLIENT_URL}/#/active/${token}"> Click aqui</a>`
        transport.sendMail({
          from: '"Ecommerce 👻" <diego2000avelar@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "Activar Usuario", // Subject line
          html, // html body
        }, (error, _)=> {
            (error)?reject({
              status: false,
              message: error
            }): resolve({
              status: true,
              message: "correo enviado correctamente a: "+ email,
              mail: null
            })
        });
      });
    },
    activeUserAction(_, {id,birthdate, password}, {token, db}){
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
      console.log(user, {id,birthdate, password});
      return {
        status: true,
        message: "Preparado para activar el usuario"
      }
    }
  },
};

export default resolversEmailMutation;
