export async function getDataSunatClienteDni(dni) {
    const URL_DNI_SUNAT=process.env.NEXT_PUBLIC_URL_GET_DATA_SUNAT_DNI;
    return await fetch(URL_DNI_SUNAT+"?documento="+dni, {
        method :'GET',
        headers :{
            'Content-Type':'application/json'
        },
        mode : 'cors'
    })
}