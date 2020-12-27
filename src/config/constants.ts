import environment from './environments';

if(process.env.NODE_ENV !=='production'){
    const env = environment;
}

export const SECRET_KEY = process.env.SECRET || 'diego'

export enum COLLECTIONS {
    USERS='users'
}

export enum MESSAGES {
    TOKEN_VERIFY_FAILED= "Token no valido, Inicia sesion de nuevo",
    LOGIN_ERROR= "Usuario y contrasenia incorrectos",
    LOGIN_SUCCESS="Logueo exitoso",
    LOAD_USERS_ERROR="Ha ocurrido un error",
    LOAD_USERS_SUCCESS="Lista cargada satisfactoriamente",
    USER_NOT_FOUND="Usuario no encontrado",
    USER_EXIST="Usuario ya existe: ",
    REGISTER_ERROR="Error al registrar usuario",
    REGISTER_SUCCESS="Se ha registrado el usuario correctamente",
    TOKEN_SUCCESS="Usuario autenticado correctamente mediante token"
}

export enum EXPIRETIME{
    H1 = 60 * 60,
    H24 = H1 * 24,
    M15 = H1/4,
    D3=H24*3
}