import { IResolvers } from "graphql-tools";
import { transport } from "../../config/mailer";

// mutation para registrar usuario
const resolversEmailMutation: IResolvers = {
  Mutation: {
    sendEmail() {
      return new Promise((resolve, reject) => {
        // send mail with defined transport object
        transport.sendMail({
          from: '"Ecommerce 👻" <diego2000avelar@gmail.com>', // sender address
          to: "devssoftware72@gmail.com", // list of receivers
          subject: "Hello ✔", // Subject line
          text: "Hello world?", // plain text body
        //  html: "<b>Hello world?</b>", // html body
        }, (error, _)=> {
            (error)?reject(error): resolve("correo enviado correctamente")
        });
      });
    },
  },
};

export default resolversEmailMutation;
