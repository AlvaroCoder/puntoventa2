const BASE_URL = process.env.BASE_URL;

export async function LOGIN_USER(data) {
    return await fetch(BASE_URL+'/api/usuarios/login',{
        method : 'POST',
        mode : 'cors',
        headers : {
            'Content-Type' :'application/json'
        },
        body : JSON.stringify(data)
    })
}

export async function LOGIN_GOOGLE(credential) {
    return await fetch(BASE_URL+'/api/usuarios/google', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
    });
}