import { IPaginationOptions } from './pagination-options';
import { IUser } from "./user.interface";

export interface IVariables {
    id?: number | string;
    genre?: string;
    user?: IUser;
    pagination?: IPaginationOptions;
    tag?: string;
}