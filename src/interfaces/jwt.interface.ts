import { IUser } from "./user.interface";

export  interface IJwt {
    id?: string
    user: IUser
    email?: String;
}