const URL_BASE= "http://localhost:3030"
const URL_VERIRIFICAR_DOCUMENTO = URL_BASE+"/api/usuarios/verificar-documento";
const URL_VERIFICAR_EMAIL = URL_BASE + "/api/usuarios/verificar-email";


export async function getVerificarDocumento(documento) {
    return await fetch(`${URL_VERIRIFICAR_DOCUMENTO}/${documento}`, {
        method: 'GET',
        mode: 'cors',
    }).then((resp) => resp.json());
};

export async function getVerificarEmail(email) {
    return await fetch(`${URL_VERIFICAR_EMAIL}/${email}`, {
        method: 'GET',
        mode : 'cors'
    }).then((resp)=>  resp.json())
};