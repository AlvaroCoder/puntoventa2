export const BASE_URL = process.env.BASE_URL;

export const URL_SUNAT = {
    VALIDATE_DNI: `${BASE_URL}?documento=`
};

export const URL_USER = {
    LOGIN_USER: `${BASE_URL}/api/usuarios/login`,
    LOGIN_GOOGLE: `${BASE_URL}/api/usuarios/google`,
    REGISTER_USER : `${BASE_URL}/api/usuarios/register`
}

export const URL_CLIENTS = {
    GET_CLIENT: `${BASE_URL}/api/cliente`,
    CREATE_CLIENT : `${BASE_URL}/api/cliente`
}

export const URL_EMPRESA = {
    GET_COMPANY: `${BASE_URL}/api/empresas`,
    CREATE_COMPANY : `${BASE_URL}/api/empresas`
}