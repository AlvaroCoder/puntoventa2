const BASE_URL_SPRING = process.env.NEXT_PUBLIC_BASE_URL_2 ?? 'http://localhost:8085'
const BASE_URL_EXPRESS = process.env.NEXT_PUBLIC_BASE_URL_1 ?? 'http://localhost:3030'

const BASE_CAJA = BASE_URL_SPRING + '/api/cajas';
const BASE_CAJA_2 = BASE_URL_EXPRESS + '/api/caja'
const BASE_INVENTARIO = BASE_URL_SPRING + '/api/inventario';
const BASE_PRODUCTO = BASE_URL_SPRING + '/api/productos';
const BASE_VARIANTES = BASE_URL_SPRING + '/api/variantes';
const BASE_CATEGORIA = BASE_URL_EXPRESS + '/api/categoria';
const BASE_IMAGES = BASE_URL_SPRING + '/api/imagenes';
export const CAJA_ENDPOINTS = {
  getCajas: () => `${BASE_CAJA_2}`,
  getAllCajasByTienda: (tiendaId) => `${BASE_CAJA}?tiendaId=${tiendaId}`,
  getCajaByTienda: (tiendaId, idCaja) =>`${BASE_CAJA}/${idCaja}?tiendaId=${tiendaId}`,
  createCaja: () => BASE_CAJA,
  updateCaja: (cajaId, tiendaId) =>
    `${BASE_CAJA}/${cajaId}?tiendaId=${tiendaId}`,
  getSesionActual: (cajaId) => `${BASE_CAJA_2}/${cajaId}/sesion`,
  getSesionesByCaja: (cajaId) => `${BASE_CAJA}/sesiones?cajaId=${cajaId}`,
  abrirCaja: (sesionId) => `${BASE_CAJA}/sesiones/${sesionId}/abrir`,
  cerrarCaja: (sesionId) => `${BASE_CAJA}/sesiones/${sesionId}/cerrar`,
  getSesionesActivas: (tiendaId) =>
    `${BASE_CAJA}/sesiones/activas?tiendaId=${tiendaId}`,
  registerMovements: (cajaId) => `${BASE_CAJA}/${cajaId}/movimientos`,
  getMovementsByCaja: (cajaId) => `${BASE_CAJA}/${cajaId}/movimientos`,
};

export const INVENTARIO_ENDPOINTS = {
    getStockByTienda: (tiendaId) => `${BASE_INVENTARIO}/tienda/${tiendaId}`,
    getStockByAlmacen: (almacenId) => `${BASE_INVENTARIO}/almacen/${almacenId}`,
    getStockByProducto: (tiendaId, productoId) => `${BASE_INVENTARIO}/producto/${productoId}/tienda/${tiendaId}`,
    getBajoStockProducto: (tiendaId) => `${BASE_INVENTARIO}/tienda/${tiendaId}/bajo-stock`,
    actualizarUbicacion : ()=> `${BASE_INVENTARIO}/ubicacion`,
}

export const PRODUCTO_ENDPOINTS = {
    createProducto: () => `${BASE_PRODUCTO}`,
    getAllProductosByIdEmpresa : (empresaId)=>`${BASE_PRODUCTO}/empresa/${empresaId}` ,
    getAllCategoriesByUser: () => `${BASE_CATEGORIA}`,
  createCategoria: () => `${BASE_CATEGORIA}`,
}

export const VARIANTES_ENDPOINTS = {
    createVariante : ()=>`${BASE_VARIANTES}`
}

export const IMAGES_ENDPOINTS = {
    uploadImage : ()=>`${BASE_IMAGES}/subir`
}

const BASE_ANALYTICS = BASE_URL_SPRING + '/api/analytics'

export const ANALYTICS_ENDPOINTS = {
    estadoInventario:       (tiendaId)          => `${BASE_ANALYTICS}/estado-inventario${tiendaId ? `?tiendaId=${tiendaId}` : ''}`,
    valorInventario:        (tiendaId)          => `${BASE_ANALYTICS}/valor-inventario${tiendaId ? `?tiendaId=${tiendaId}` : ''}`,
    topProductos:           (tiendaId, dias=30) => `${BASE_ANALYTICS}/top-productos?${tiendaId ? `tiendaId=${tiendaId}&` : ''}dias=${dias}`,
    ventasDiarias:          (tiendaId, dias=30) => `${BASE_ANALYTICS}/ventas-diarias?${tiendaId ? `tiendaId=${tiendaId}&` : ''}dias=${dias}`,
    deadStock:              (tiendaId, dias=60) => `${BASE_ANALYTICS}/dead-stock?${tiendaId ? `tiendaId=${tiendaId}&` : ''}dias=${dias}`,
    movimientosSemanales:   (tiendaId, sem=8)   => `${BASE_ANALYTICS}/movimientos-semanales?${tiendaId ? `tiendaId=${tiendaId}&` : ''}semanas=${sem}`,
}