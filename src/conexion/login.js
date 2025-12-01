const BASE_URL = process.env.BASE_URL;

export async function LOGIN_USER(data) {
    return await fetch(BASE_URL+'/register/users/login',{
        method : 'POST',
        mode : 'cors',
        headers : {
            'Content-Type' :'application/json'
        },
        body : JSON.stringify(data)
    })
}