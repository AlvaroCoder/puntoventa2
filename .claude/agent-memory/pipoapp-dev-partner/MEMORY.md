# PipoApp — Agent Memory

## Auth y contexto de usuario
- `useAuth()` de `@/Context/AuthContext` retorna `{ user, loading, isAuthenticated, loginUser }`
- `user.empresa_id` es el campo del tenant en el cliente
- El token se obtiene de `user.access_token` (ya desencriptado por `getSession()`)

## Capa de conexión
- Todas las llamadas usan `fetchWithAuth` de `@/lib/fetchwithAuth` (maneja el Bearer token internamente)
- Firma: `fetchWithAuth(url, { method, body }, target?)` — target puede ser `'express'` para la API Express
- Los endpoints Spring Boot usan `NEXT_PUBLIC_BASE_URL_2` (puerto 8085)
- Los endpoints Express usan `BASE_URL` (puerto 3030) y rutas `/api/...`

## Patrón de extracción de datos de respuesta API
```js
const raw = res?.data?.data?.data ?? res?.data?.data ?? res?.data ?? []
```
Aplicar siempre porque la anidación varía entre Express y Spring Boot.

## Módulo de productos (Spring Boot — puerto 8085)
- `createProducto(payload)` → POST `/api/productos` — retorna `{ ok, data: { id, ... } }`
- `createVariante(payload)` → POST `/api/variantes`
- `getCategorias()` → usa `fetchWithAuth(BASE_CATEGORIA, {}, 'express')` (Express, no Spring)
- `getProductosByEmpresa(empresaId)` → GET `/api/productos/empresa/:id`

## Módulo de tiendas (Express — puerto 3030)
- `getTiendasByEmpresa(empresaId)` → GET `/api/tienda/empresa/:id`

## Convención de comillas en JSX
- Las comillas literales `"` dentro de texto JSX deben escaparse como `&quot;`
- ESLint (next/no-unescaped-entities) lo reporta como error de severidad Error

## Patrones de diseño UI
- Chip seleccionable: `bg-[#1F4363] text-white border-[#1F4363]` cuando activo, `border-gray-200 text-gray-600` cuando inactivo
- Toggle custom (sin librería): div con transición translate-x-5 / translate-x-0 en el knob
- Panel lateral sticky: `sticky top-20` con `max-h-[420px] overflow-y-auto` para lista larga
- Modo lote: acumular snapshots `{ form, variantes, varianteTiendaGlobal, id: Date.now() }` en `listProducts`

## Archivos clave creados/modificados
- `src/app/dashboard/bd/inventario/create/page.js` — página de creación de producto con modo lote
