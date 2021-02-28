import { IMailOptions } from './../interfaces/email.interface';
import { transport } from "../config/mailer";
class MailService {
  send(mail: IMailOptions){
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
  }
}

export default MailService;