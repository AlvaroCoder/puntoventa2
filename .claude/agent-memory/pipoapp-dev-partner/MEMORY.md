# PipoApp — Agent Memory

## Auth y contexto de usuario
- `useAuth()` de `@/Context/AuthContext` retorna `{ user, loading, isAuthenticated, loginUser }`
- `user.empresa_id` es el campo del tenant en el cliente
- El token se obtiene de `user.access_token` (ya desencriptado por `getSession()`)

## Capa de conexión
- Todas las llamadas usan `fetchWithAuth` de `@/lib/fetchwithAuth` (maneja el Bearer token internamente)
- Si la URL empieza con `http` se usa directa sin prefijo base (útil para Spring Boot)
- Los endpoints Spring Boot usan `NEXT_PUBLIC_BASE_URL_2` (puerto 8085)
- Los endpoints Express usan `BASE_URL` (puerto 3030) y rutas `/api/...`

## Patrón de extracción de datos de respuesta API
```js
const raw = res?.data?.content ?? res?.data?.data ?? res?.data ?? []
```
Aplicar siempre — Spring Boot puede usar `content` (paginado), Express usa `data`.

## Módulo de productos (Spring Boot — puerto 8085)
- `createProducto(payload)` → POST `http://localhost:8085/api/productos`
- `createVariante(payload)` → POST `http://localhost:8085/api/variantes`
- `getCategorias()` → Express (BASE_CATEGORIA del EndpointsRouter, puerto 3030)
- `getProductosByEmpresa(empresaId)` → GET `http://localhost:8085/api/productos/empresa/:id`
- Paginado: respuesta puede traer `res?.data?.content` (Spring Page)

## Módulo de tiendas (Express — puerto 3030)
- `getTiendasByEmpresa(empresaId)` → GET `/api/tienda/empresa/:id`

## Módulo de almacenes (Spring Boot — puerto 8085)
- `getAlmacenesByTienda(tiendaId)` → GET `http://localhost:8085/api/almacen/almacenes?tiendaId=X`
- `createAlmacen(data)` → POST `http://localhost:8085/api/almacen/almacenes`

## Módulo de proveedores (Express — puerto 3030)
- `getProveedoresByEmpresa(empresaId)` → GET `http://localhost:3030/api/proveedor/empresa/:id`

## Módulo de logística OC (Spring Boot — puerto 8085)
- `createOrdenCompra(data)` → POST `http://localhost:8085/api/ordenes-compra`
- `enviarOrdenCompra(id)` → POST `http://localhost:8085/api/ordenes-compra/:id/enviar`

## Convención de comillas en JSX
- Las comillas literales `"` dentro de texto JSX deben escaparse como `&quot;`
- ESLint (next/no-unescaped-entities) lo reporta como error de severidad Error

## Patrones de diseño UI
- Barra sticky inferior formulario: `fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]`
- Sección wrapper: `bg-white rounded-2xl border border-gray-100 shadow-sm` con header `px-6 py-4 border-b border-gray-50`
- Breadcrumb: `flex items-center gap-2 text-sm text-gray-400` + `<ChevronRight size={14} />`
- Segmented control: botones adjacentes con `rounded-lg border overflow-hidden`, activo con `bg-[#1F4363] text-white`
- Chip seleccionable activo: `bg-[#1F4363] text-white border-[#1F4363]`, inactivo: `border-gray-200 text-gray-600`

## Hook useGenerarCodigo (src/hooks/useGenerarCodigo.js)
- `generarCodigo(nombre)` → "Zapatilla Nike Air" → "ZAP-NIK-AIR-001"
- Usa `useRef` para el correlativo (persiste entre renders, no provoca re-render)
- `resetContador(valor?)` → reinicia el correlativo

## Formulario Crear Producto (src/app/dashboard/inventario/crear/)
- `page.js` reescrito con componentes separados en `components/`
- Lógica crítica: si `hayStockIngresado && !precio_venta` → deshabilitar botón Guardar + alerta inline
- `buildPayload(conStock)` filtra nulos antes de enviar
- Flujo variantes: `createProducto` → obtener `id` → `Promise.allSettled(createVariante[])`
- Ver `patterns.md` para detalles de cada componente

## Formulario Crear OC (src/app/dashboard/logistica/ordenes-compra/crear/)
- Layout: 40% datos | 60% líneas en desktop, una columna en móvil
- `BuscadorProducto`: filtrado local en frontend (≥2 chars), siempre muestra "Crear nuevo" al final
- `DrawerProductoNuevo`: Sheet lateral, crea producto y lo agrega como línea con badge "Nuevo"
- `TablaLineasOC`: si producto ya existe en lineas → incrementa cantidad en lugar de duplicar
- Estado `BORRADOR` vs `ENVIADA`: botón "Guardar borrador" vs "Crear y enviar"
- Ver `patterns.md` para detalles de payload

## Módulo Inventario — Resumen (rediseño completo)
- Layout: `src/app/dashboard/inventario/layout.js` — exporta `InventarioContext` con `{ tiendaId }`
- Selector de tienda persiste en `localStorage` key `'inventario_tienda_id'`
- Si tiendas.length <= 1: solo span con nombre; si > 1: `<select>` nativo sin bordes
- Submenú nav: gap-7 px-6, activo con `borderBottom: '2px solid #1EB3B2'`
- Hook: `src/hooks/useInventarioResumen.js` — fallback a MOCK_RESUMEN si API falla, intervalo 5 min
- API inventario resumen: `http://localhost:8085/api/inventario/resumen?tienda_id=X`
- Cromática del módulo inventario: Navy #1F2F57, Blue #3960A9, Teal #1EB3B2, Alert #E8A020, Error #C0392B
- Skeleton: `animate-pulse` con `backgroundColor: 'rgba(31,47,87,0.06)'`
- Títulos de sección: `text-xs uppercase tracking-wide` color `rgba(31,47,87,0.55)`

## Pantalla Detalle Producto (arquitectura hexagonal)
- Hook: `src/modules/inventary/hooks/useProductoDetalle.js` — retorna `{ producto, loading, error }`, mock con delay 400ms
- UI pura: `src/modules/inventary/PageProductoDetalle.js` — recibe todas las props del controller, sin estado propio
- Controller: `src/app/dashboard/inventario/productos/[id]/page.js` — usa `useParams()`, sincroniza `alertaMinimo` y `visibleEnCaja` via `useEffect` cuando carga el producto
- Patrón cardHeader: componente `CardHeader({ title, action })` reutilizable dentro del page
- Tabla matriz stock: `border-separate` + `borderSpacing: '2px'` para el efecto de celdas separadas
- `cellStyle(value, minimo)`: 0 → rojo, ≤ mínimo → ámbar, > mínimo → texto normal
- Switch reutilizado de `@/modules/inventary/components/Switch` (props: `on`, `toggle`)

## Módulo Trabajadores (arquitectura hexagonal)
- Hook: `src/modules/trabajadores/hooks/useTrabajadores.js` — mock 500ms, retorna `{ trabajadores, loading, error, setTrabajadores }`
- Card: `src/modules/trabajadores/components/TrabajadorCard.js` — motion.div, menu ⋮ con MenuDesplegable (cierre por click fuera), badges rol+tienda, footer condicional (caja vs último acceso)
- UI pura: `src/modules/trabajadores/PageTrabajadores.js` — InviteCard dashed al final del grid, sección ROLES_INFO con 3 cards, estado vacío
- Controller: `src/app/dashboard/trabajadores/page.js` — handleInvitar/handleEditar/handleEliminar, router.push
- Color badges rol: Administrador #3960A9, Cajero #0E9090, Almacenero #B87A10
- InviteCard: hover cambia borderColor via onMouseEnter/onMouseLeave (no via Tailwind)

## Módulo Ventas — Resumen (arquitectura hexagonal)
- Controller: `src/app/dashboard/ventas/page.js` — exporta `VentasController` (no `PageVentas` para evitar colisión de nombre con el import)
- UI pura: `src/modules/ventas/PageVentas.js` — recibe `{ tiendas, loading, metrics, cajaSesiones }`
- `cajaSesiones`: `{ total, porTienda: [{ tienda_id, cantidad, sesiones }] }` — pasado desde el controller sin lógica de auto-cierre
- `metrics`: `{ totalVentasHoy, totalTransacciones, cajasAbiertas, totalCajas, efectivoEnCajas }` calculados con `useMemo` a partir de `todasCajas`
- `todasCajas = tiendas.flatMap(t => t.cajas)` — dato derivado de las tiendas ya procesadas
- Selector de tienda (dropdown): visible solo si `tiendas.length > 1`, filtra `tiendasFiltradas`
- Layout: columna principal flex-1 + panel actividad w-72 sticky (hidden en mobile, lg:block)
- Panel `ActividadHoy`: usa `MOCK_ACTIVIDAD` (datos hardcodeados hasta integrar API de ventas)
- Cromática: teal #198E7B (ventas), blue #3960A9 (transacciones), navy #1F2F57 (cajas), orange #FF821E (efectivo)
- Estado vacío caja: card dashed con hover `onMouseEnter/onMouseLeave` para `borderColor`
- `CajaCard` importado desde `@/components/Cards/CajaCard` — NO modificar, ya tiene toda la lógica

## Módulo POS — Flujo de pago (arquitectura hexagonal + sessionStorage)
- `pos/page.js`: al presionar Cobrar → escribe `pos_cart` en sessionStorage → `router.push(.../payment?cajaId=X)`
- `pos_cart` contiene: `{ carrito, cajaSesionId, tiendaId, trabajadorId, empresaId, cliente }`
- `payment/page.js`: lee `pos_cart`, al completar → escribe `pos_venta` en sessionStorage → `router.push(.../success?cajaId=X)`
- `pos_venta` contiene: `{ ...ventaRes.data, carrito, cliente, tipoComprobante, metodo, total, montoRecibido, cambio, opGravada, igv }`
- `success/page.js`: lee `pos_venta`, "Nueva venta" limpia ambas keys y regresa al POS
- Stepper compartido: `src/modules/ventas/components/PosSteps.js` — prop `paso` (1=Productos, 2=Cobrar, 3=Comprobante)
- Cálculo fiscal: `opGravada = total / 1.18`, `igv = total - opGravada`; por línea `igvLinea = baseImponible * 0.18`
- Pills de efectivo: `roundUp50(total)` → { exacto, +50, +100 }; vuelto solo si `montoEfectivo > total`
- `ventasService.createVenta(body)` en `src/modules/ventas/service/ventas.service.js` — retorna `{ ok, error, data, message }`
- Si sessionStorage key falta → `router.replace(...)` al POS (guard en `useEffect` al montar)
- Background POS cromática: `#E8EDF5` (gray-blue), cards white con `border: 0.5px solid rgba(31,47,87,0.1)`, `border-radius: 16px`

## Archivos clave
- `src/hooks/useGenerarCodigo.js` — generación de códigos de producto
- `src/hooks/useInventarioResumen.js` — resumen de inventario con mock fallback
- `src/Connections/almacen/index.js` — getAlmacenesByTienda agregado
- `src/Connections/proveedores/index.js` — nuevo
- `src/Connections/logistica/index.js` — nuevo
- `src/app/dashboard/inventario/layout.js` — nuevo, InventarioContext
- `src/app/dashboard/inventario/page.js` — reescrito (Resumen)
- `src/app/dashboard/inventario/components/` — AlertasBanner, OperacionesPendientes, TarjetaOperacion, ResumenStock, TarjetaMetrica, ListaStockBajo, ItemStockBajo
- `src/app/dashboard/inventario/crear/page.js` — reescrito con componentes separados
- `src/app/dashboard/logistica/ordenes-compra/crear/page.js` — nuevo
- `src/modules/inventary/hooks/useProductoDetalle.js` — nuevo, detalle producto
- `src/modules/inventary/PageProductoDetalle.js` — nuevo, UI detalle producto
- `src/app/dashboard/inventario/productos/[id]/page.js` — reescrito (controller detalle)
- `src/modules/trabajadores/hooks/useTrabajadores.js` — nuevo
- `src/modules/trabajadores/components/TrabajadorCard.js` — nuevo
- `src/modules/trabajadores/PageTrabajadores.js` — nuevo
- `src/app/dashboard/trabajadores/page.js` — reescrito (controller)
- `src/modules/ventas/PageVentas.js` — reescrito (UI pura ventas)
- `src/app/dashboard/ventas/page.js` — reescrito (controller VentasController)
- `src/modules/ventas/components/PosSteps.js` — nuevo, stepper 3 pasos para el flujo POS
- `src/modules/ventas/PagePayment.js` — nuevo, pagina cobro (UI hexagonal)
- `src/modules/ventas/PageSuccess.js` — nuevo, pagina comprobante/ticket (UI hexagonal)
- `src/app/dashboard/ventas/caja/pos/payment/page.js` — wrapper Suspense + PagePayment
- `src/app/dashboard/ventas/caja/pos/success/page.js` — wrapper Suspense + PageSuccess
- `src/app/dashboard/ventas/caja/pos/page.js` — refactorizado: sin PosPaymentPanel, usa handleCobrar con sessionStorage
- `src/modules/ventas/PageCerrarCaja.js` — nuevo, UI cierre de caja (arqueo + ventas por método)
- `src/app/dashboard/ventas/caja/cerrar/page.js` — wrapper Suspense + PageCerrarCaja
