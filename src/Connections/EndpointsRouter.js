const BASE_URL_SPRING = process.env.NEXT_PUBLIC_BASE_URL_2 ?? 'http://localhost:8085'

const BASE_CAJA = BASE_URL_SPRING + '/api/cajas';
const BASE_INVENTARIO = BASE_URL_SPRING + '/api/inventario';
const BASE_PRODUCTO = BASE_URL_SPRING + '/api/productos';
const BASE_VARIANTES = BASE_URL_SPRING + '/api/variantes';

export const CAJA_ENDPOINTS = {
    getAllCajasByTienda: (tiendaId) => `${BASE_CAJA}?tiendaId=${tiendaId}`,
    getCajaByTienda : (tiendaId, idCaja) => `${BASE_CAJA}/${idCaja}?tiendaId=${tiendaId}`,
    createCaja: () => BASE_CAJA,
    updateCaja: (cajaId, tiendaId) => `${BASE_CAJA}/${cajaId}?tiendaId=${tiendaId}`,
    getSesionActual: (cajaId) => `${BASE_CAJA}/${cajaId}/sesion`,
    getSesionesActivas : (tiendaId)=>`${BASE_CAJA}/sesiones/activas?tiendaId=${tiendaId}`,
    getSesionesByCaja: (cajaId) => `${BASE_CAJA}/sesiones?cajaId=${cajaId}`,
    abrirCaja: (sesionId) => `${BASE_CAJA}/sesiones/${sesionId}/abrir`,
    cerrarCaja: (sesionId) => `${BASE_CAJA}/sesiones/${sesionId}/cerrar`,
    getSesionesActivas: (tiendaId) => `${BASE_CAJA}/sesiones/activas?tiendaId=${tiendaId}`,
    registerMovements: (cajaId) => `${BASE_CAJA}/${cajaId}/movimientos`,
    getMovementsByCaja: (cajaId) => `${BASE_CAJA}/${cajaId}/movimientos`,
}

export const INVENTARIO_ENDPOINTS = {
    getStockByTienda: (tiendaId) => `${BASE_INVENTARIO}/tienda/${tiendaId}`,
    getStockByProducto: (tiendaId, productoId) => `${BASE_INVENTARIO}/producto/${productoId}/tienda/${tiendaId}`,
    getBajoStockProducto: (tiendaId) => `${BASE_INVENTARIO}/tienda/${tiendaId}/bajo-stock`,
    actualizarUbicacion : ()=> `${BASE_INVENTARIO}/ubicacion`,
}

export const PRODUCTO_ENDPOINTS = {
    createProducto: () => `${BASE_PRODUCTO}`,
    getAllProductosByIdEmpresa : (empresaId)=>`${BASE_PRODUCTO}/empresa/${empresaId}` 
}

export const VARIANTES_ENDPOINTS = {
    createVariante : ()=>`${BASE_VARIANTES}`
}