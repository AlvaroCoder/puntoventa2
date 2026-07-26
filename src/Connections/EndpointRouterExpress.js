const BASE_URL_EXPRESS = 'http://localhost:3030'

const BASE_EMPRESA = BASE_URL_EXPRESS + '/api/empresas';
const BASE_ESTANDAR = BASE_URL_EXPRESS + '/api/estandar';

export const EMPRESA_ENDPOINTS = {
    getAllEmpresas: () => BASE_EMPRESA,
    getEmpresaById: (empresaId) => `${BASE_EMPRESA}/${empresaId}`,
    getMyEmpresa:()=>`${BASE_EMPRESA}/mi-empresa`,
    createEmpresa: () => BASE_EMPRESA,
    updateEmpresa: (empresaId) => `${BASE_EMPRESA}/${empresaId}`,
    deleteEmpresa: (empresaId) => `${BASE_EMPRESA}/${empresaId}`,
    validateRucEmpresa: (ruc) => `${BASE_EMPRESA}/validar_ruc/${ruc}`,
}

export const CATEGORIA_ENDPOINTS = {
    getAllCategorias: () => `${BASE_URL_EXPRESS}/api/categorias`,
}

export const SEMILLA_ENDPOINTS = {
    getAllProductosEstandar: () => `${BASE_ESTANDAR}`,
    getProductosEstandarByRubro : (idRubro) => `${BASE_ESTANDAR}/rubro/${idRubro}`,
    importarAEmpresa: () => `${BASE_ESTANDAR}/importar-empresa`,
}
