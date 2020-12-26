import environment from './environments';

if(process.env.NODE_ENV !=='production'){
    const env = environment;
}

export const SECRET_KEY = process.env.SECRET || 'diego'

export enum COLLECTIONS {
    USERS='users'
}

export enum MESSAGES {
    TOKEN_VERIFY_FAILED= "Token no valido",
    LOGIN_ERROR= "Usuario y contrasenia incorrectos",
    LOGIN_SUCCESS="Logueo exitoso"
}

export enum EXPIRETIME{
    H1 = 60 * 60,
    H24 = H1 * 24,
    M15 = H1/4,
    D3=H24*3
}