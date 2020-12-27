import { MESSAGES, EXPIRETIME } from './../config/constants';
import {SECRET_KEY} from '../config/constants'
import jwt from "jsonwebtoken"
import { IJwt } from '../interfaces/jwt.interface';
class JWT{
   private secretKey = SECRET_KEY as string
   sign(data: IJwt, expiresIn: number = EXPIRETIME.H24){
       return jwt.sign({user: data.user}, this.secretKey, {
        expiresIn // tiempo de caducidad del token
      });
   }

   verify(token: string) {
     try {
        return jwt.verify(token, this.secretKey);
     }
     catch(e) {
         return MESSAGES.TOKEN_VERIFY_FAILED
     }
   }
}
export default JWT