import { IResolvers } from "graphql-tools";
import { transport } from "../../config/mailer";

// mutation para registrar usuario
const resolversEmailMutation: IResolvers = {
  Mutation: {
    sendEmail(_, {mail}) {
      console.log(mail);
      
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
  },
};

export default resolversEmailMutation;
