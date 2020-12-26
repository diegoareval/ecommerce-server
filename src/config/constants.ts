import environment from './environments';

if(process.env.NODE_ENV !=='production'){
    const env = environment;
}

const SECRET_KEY = process.env.SECRET || 'diego'

export enum COLLECTIONS {
    USERS='users'
}