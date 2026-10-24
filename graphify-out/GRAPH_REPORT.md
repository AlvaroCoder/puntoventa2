# Graph Report - puntoventa-frontend  (2026-10-14)

## Corpus Check
- 221 files · ~72,479 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 1, .ico 1, .css 1)

## Summary
- 903 nodes · 2424 edges · 60 communities (43 shown, 17 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Product Creation Forms
- Auth & Workers Management
- Warehouse Create Forms
- Inventory Dashboard
- Inventory Navigation UI
- Inventory & Logistics Pages
- Project Configuration
- Sales & Cash Register
- Product Creation Stepper
- API Connection Layer
- UI Library Setup
- Category Management
- POS Interface
- Category Create Forms
- Login & Auth Forms
- Dev Agent Memory
- Shadcn UI Config
- Calendar & Date Picker
- Movement Tables
- Client Tables
- Purchase Orders
- Form UI Primitives
- Sidebar Navigation
- Product Quick Add Drawer
- Toast Notifications
- Animated UI Components
- POS Right Panel
- Company & Express API
- Spring Boot Endpoints
- Client Create
- Signup & Rubro Selection
- Images & Inventory Hook
- Inventory Data Cards
- POS Payment
- ESLint Dependencies
- Stock Summary
- New Product Drawer
- Batch Product Creation
- API URL Config
- Build Scripts
- Pending Operations
- Pricing Page
- Client Import Template
- Client History Panel
- Credit History
- Path Aliases
- Next.js Config
- PostCSS Config
- Dev Instructions
- Brand Assets
- Project Readme
- File Icon
- Globe Icon
- Login Right Illustration
- Login Left Illustration
- Window Icon

## God Nodes (most connected - your core abstractions)
1. `react` - 157 edges
2. `lucide-react` - 92 edges
3. `fetchWithAuth()` - 86 edges
4. `Button` - 62 edges
5. `cn()` - 55 edges
6. `next` - 52 edges
7. `useAuth()` - 51 edges
8. `Input` - 42 edges
9. `react-toastify` - 31 edges
10. `SwitcherLoader()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `fetchAlmacenes()` --calls--> `getAlmacenesByUser()`  [EXTRACTED]
  src/app/dashboard/inventario/productos/crear/lote/page.js → src/Connections/almacen/index.js
- `fetchData()` --calls--> `getClientesByEmpresa()`  [EXTRACTED]
  src/components/Panel/PosPanelClients.js → src/Connections/clientes/index.js
- `getMyEmpresa()` --calls--> `fetchWithAuth()`  [EXTRACTED]
  src/Connections/empresa/index.js → src/lib/fetchwithAuth.js
- `getProductosSemilla()` --calls--> `fetchWithAuth()`  [EXTRACTED]
  src/Connections/estandar/index.js → src/lib/fetchwithAuth.js
- `importarProductosEstandar()` --calls--> `fetchWithAuth()`  [EXTRACTED]
  src/Connections/estandar/index.js → src/lib/fetchwithAuth.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **PipoApp Backend API Modules (Express + Spring Boot)** — _claude_agent_memory_pipoapp_dev_partner_memory_module_productos, _claude_agent_memory_pipoapp_dev_partner_memory_module_tiendas, _claude_agent_memory_pipoapp_dev_partner_memory_module_almacenes, _claude_agent_memory_pipoapp_dev_partner_memory_module_proveedores, _claude_agent_memory_pipoapp_dev_partner_memory_module_logistica_oc [INFERRED 0.85]
- **PipoApp Agent Conventions (Response, Auth, Design)** — _claude_agents_pipoapp_dev_partner_response_format, _claude_agents_pipoapp_dev_partner_auth_flow, _claude_agents_pipoapp_dev_partner_design_system, _claude_agents_pipoapp_dev_partner_self_verification [EXTRACTED 1.00]

## Communities (60 total, 17 thin omitted)

### Community 0 - "Product Creation Forms"
Cohesion: 0.06
Nodes (68): react-toastify, SeccionBasica(), SeccionPrecios(), UNIDADES, TablaVariantes(), AVATAR_COLORS, CATEGORIA_BADGE, ClientCard() (+60 more)

### Community 1 - "Auth & Workers Management"
Cohesion: 0.06
Nodes (56): jose, @react-oauth/google, EMPTY_FORM, Page(), init(), ForgetPasswordPage(), ArcDecoration(), ImagePlaceholder() (+48 more)

### Community 2 - "Warehouse Create Forms"
Cohesion: 0.06
Nodes (38): ALMACEN_INITIAL(), AlmacenCard(), BASE_INPUT_STYLE, Field(), generarCodigoAlmacen(), Page(), fetchTiendas(), TIPO_ALMACEN (+30 more)

### Community 3 - "Inventory Dashboard"
Cohesion: 0.06
Nodes (31): next, AlertasBanner(), BannerItem(), CONFIG_ALERTA, ItemStockBajo(), ListaStockBajo(), OPCIONES, DAYS (+23 more)

### Community 4 - "Inventory Navigation UI"
Cohesion: 0.10
Nodes (29): Page(), DropdownConfiguracion(), DropdownMenuGroup(), InventarioLayout(), PageInventarioResumen(), getDataAlmacenes(), Layout(), RootLayout() (+21 more)

### Community 6 - "Project Configuration"
Cohesion: 0.06
Nodes (31): compat, __dirname, eslintConfig, __filename, dependencies, class-variance-authority, clsx, @emotion/react (+23 more)

### Community 7 - "Sales & Cash Register"
Cohesion: 0.13
Nodes (29): normalizarCaja(), PageCaja(), fetchData(), SkeletonCard(), esDeUnDiaAnterior(), fechaArrayADate(), fmt(), formatearCaja() (+21 more)

### Community 8 - "Product Creation Stepper"
Cohesion: 0.15
Nodes (16): CardProducto(), SeccionVariantes(), Info(), initial(), MoneyInput(), Stepper2(), fetchData(), submit() (+8 more)

### Community 9 - "API Connection Layer"
Cohesion: 0.14
Nodes (21): getCajaById(), getSesionesByCaja(), getClienteById(), getClienteSunat(), createCredito(), getCreditosByCliente(), getCreditosByEmpresa(), getCreditosVencidos() (+13 more)

### Community 10 - "UI Library Setup"
Cohesion: 0.09
Nodes (21): name, private, version, class-variance-authority, clsx, @emotion/react, @emotion/styled, eslint (+13 more)

### Community 11 - "Category Management"
Cohesion: 0.18
Nodes (15): lucide-react, agregarPath(), obtenerPath(), NIVEL_DOT, Page(), fetchData(), PathDisplay(), AlmacenCard() (+7 more)

### Community 12 - "POS Interface"
Cohesion: 0.15
Nodes (14): PagePOS(), POSContent(), ButtonsLoading(), ROUTE_LABELS, TopBarNavigation(), fmt(), MODO_LABEL, MODOS (+6 more)

### Community 13 - "Category Create Forms"
Cohesion: 0.18
Nodes (15): Field(), Page(), fetchData(), Toggle(), SearchableSelect(), InputFillable(), BASE_INPUT_STYLE, CreateCajaForm() (+7 more)

### Community 14 - "Login & Auth Forms"
Cohesion: 0.16
Nodes (13): FormLogin(), InputPassword(), InputUsername(), actionTypes, addToRemoveQueue(), dispatch(), genId(), listeners (+5 more)

### Community 15 - "Dev Agent Memory"
Cohesion: 0.12
Nodes (14): PipoApp Agent Memory, fetchWithAuth Utility, Formulario Crear Orden de Compra, Formulario Crear Producto, useGenerarCodigo Hook, Módulo Almacenes (Spring Boot port 8085), Módulo Inventario Resumen, Módulo Logística OC (Spring Boot port 8085) (+6 more)

### Community 16 - "Shadcn UI Config"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 17 - "Calendar & Date Picker"
Cohesion: 0.18
Nodes (10): @radix-ui/react-popover, react-calendar, ButtonActive(), ButtonCalendar(), AVATAR_COLORS, CATEGORIA_BADGE, ClientCard(), getAvatarColor() (+2 more)

### Community 18 - "Movement Tables"
Cohesion: 0.22
Nodes (13): SkeletonRow(), arrayToDate(), fmt(), fmtDate(), TablaMovimientos(), fmt(), fmtDate(), TablaSesiones() (+5 more)

### Community 19 - "Client Tables"
Cohesion: 0.28
Nodes (14): CATEGORIA_BADGE, HEADERS, SkeletonRows(), SortIcon(), TableClientsData(), TIPO_DOC_BADGE, Table, TableBody (+6 more)

### Community 20 - "Purchase Orders"
Cohesion: 0.20
Nodes (12): CrearOrdenCompraPage(), INITIAL_FORM, BuscadorProducto(), createOrdenCompra(), enviarOrdenCompra(), getOrdenById(), getOrdenesByEmpresa(), updateOrdenCompra() (+4 more)

### Community 21 - "Form UI Primitives"
Cohesion: 0.27
Nodes (11): @radix-ui/react-checkbox, Checkbox, SheetContent, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle (+3 more)

### Community 22 - "Sidebar Navigation"
Cohesion: 0.20
Nodes (7): @mui/icons-material, NAV_ITEMS, BD_ITEMS, GRAPH_ITEMS, EstadoBadge(), SkeletonRow(), TableTiendas()

### Community 23 - "Product Quick Add Drawer"
Cohesion: 0.27
Nodes (10): DrawerProducto(), generateCodigo(), GENEROS, INITIAL, SectionTitle(), TEMPORADAS, TIPOS_PROD, createProducto() (+2 more)

### Community 24 - "Toast Notifications"
Cohesion: 0.38
Nodes (8): Toast, ToastAction, ToastClose, ToastDescription, ToastTitle, toastVariants, ToastViewport, Toaster()

### Community 25 - "Animated UI Components"
Cohesion: 0.27
Nodes (4): framer-motion, PanelRouteHome(), WelcomPanel(), CardRouteHome()

### Community 26 - "POS Right Panel"
Cohesion: 0.42
Nodes (8): ProductosPage(), fetchDataProductos(), fmt(), normalizar(), PosRigthPanel(), fetchData(), getCategorias(), getProductosByEmpresa()

### Community 27 - "Company & Express API"
Cohesion: 0.28
Nodes (6): getMyEmpresa(), CATEGORIA_ENDPOINTS, EMPRESA_ENDPOINTS, SEMILLA_ENDPOINTS, getProductosSemilla(), importarProductosEstandar()

### Community 28 - "Spring Boot Endpoints"
Cohesion: 0.31
Nodes (7): CAJA_ENDPOINTS, INVENTARIO_ENDPOINTS, PRODUCTO_ENDPOINTS, VARIANTES_ENDPOINTS, deleteProducto(), getProductoById(), getProductosBajoStock()

### Community 29 - "Client Create"
Cohesion: 0.29
Nodes (5): BASE_INPUT_STYLE, CATEGORIAS_CLIENTE, CreateClientePage(), Field(), TIPOS_DOCUMENTO

### Community 30 - "Signup & Rubro Selection"
Cohesion: 0.43
Nodes (3): GridSelectCardRubro(), SelectableCard(), useFetch()

### Community 31 - "Images & Inventory Hook"
Cohesion: 0.32
Nodes (5): IMAGES_ENDPOINTS, uploadImage(), MOCK_RESUMEN, useInventarioResumen(), fetchWithAuthFormData()

### Community 32 - "Inventory Data Cards"
Cohesion: 0.57
Nodes (6): barColor(), CardDataInventario(), fetchInventario(), Chip(), getInventarioByAlmacen(), getInventarioByTienda()

### Community 33 - "POS Payment"
Cohesion: 0.43
Nodes (6): COMPROBANTES, fmt(), METODOS, PosPaymentPanel(), createMovimiento(), createVenta()

### Community 34 - "ESLint Dependencies"
Cohesion: 0.33
Nodes (6): devDependencies, eslint, eslint-config-next, @eslint/eslintrc, postcss, tailwindcss

### Community 35 - "Stock Summary"
Cohesion: 0.60
Nodes (4): METRICAS(), ResumenStock(), SkeletonMetrica(), TarjetaMetrica()

### Community 36 - "New Product Drawer"
Cohesion: 0.33
Nodes (4): DRAWER_INITIAL, IMPUESTOS, MOCK_CATEGORIAS, UNIDADES

### Community 37 - "Batch Product Creation"
Cohesion: 0.47
Nodes (5): LotePage(), fetchAlmacenes(), PASOS, Stepper(), getTrabajadorByIdUser()

### Community 38 - "API URL Config"
Cohesion: 0.33
Nodes (5): BASE_URL, URL_CLIENTS, URL_EMPRESA, URL_SUNAT, URL_USER

### Community 39 - "Build Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 40 - "Pending Operations"
Cohesion: 0.70
Nodes (3): OperacionesPendientes(), SkeletonOperacion(), TarjetaOperacion()

### Community 41 - "Pricing Page"
Cohesion: 0.50
Nodes (4): Button(), FAQS, METRICS, PreciosPage()

### Community 43 - "Client Import Template"
Cohesion: 0.50
Nodes (4): Plantilla Importar Clientes (Excel converted), Cliente Categoría Enum (REGULAR, DEUDOR, RESPONSABLE), Cliente Import Schema (columns), Tipo Documento Enum (DNI, RUC)

### Community 45 - "Credit History"
Cohesion: 0.83
Nodes (3): getHistorialCreditByIdClient(), ListHistorialCreditClient(), getDataCreditByCliente()

## Knowledge Gaps
- **33 isolated node(s):** `@emotion/react`, `@emotion/styled`, `@mui/material`, `motion`, `react-dom` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 260 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Inventory & Logistics Pages` to `Product Creation Forms`, `Auth & Workers Management`, `Warehouse Create Forms`, `Inventory Dashboard`, `Inventory Navigation UI`, `Sales & Cash Register`, `Product Creation Stepper`, `UI Library Setup`, `Category Management`, `POS Interface`, `Category Create Forms`, `Login & Auth Forms`, `Calendar & Date Picker`, `Movement Tables`, `Client Tables`, `Purchase Orders`, `Form UI Primitives`, `Sidebar Navigation`, `Product Quick Add Drawer`, `Toast Notifications`, `Animated UI Components`, `POS Right Panel`, `Client Create`, `Signup & Rubro Selection`, `Images & Inventory Hook`, `Inventory Data Cards`, `POS Payment`, `Stock Summary`, `New Product Drawer`, `Batch Product Creation`, `Pending Operations`, `Pricing Page`, `Marketing Cards`, `Client History Panel`, `Credit History`?**
  _High betweenness centrality (0.375) - this node is a cross-community bridge._
- **What connects `@emotion/react`, `@emotion/styled`, `@mui/material` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Product Creation Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.06269113149847094 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Category Management` to `Product Creation Forms`, `Auth & Workers Management`, `Warehouse Create Forms`, `Inventory Dashboard`, `Inventory Navigation UI`, `Inventory & Logistics Pages`, `Sales & Cash Register`, `Product Creation Stepper`, `UI Library Setup`, `POS Interface`, `Category Create Forms`, `Login & Auth Forms`, `Calendar & Date Picker`, `Client Tables`, `Purchase Orders`, `Form UI Primitives`, `Sidebar Navigation`, `Product Quick Add Drawer`, `Toast Notifications`, `Animated UI Components`, `POS Right Panel`, `Client Create`, `Signup & Rubro Selection`, `Inventory Data Cards`, `POS Payment`, `New Product Drawer`, `Batch Product Creation`, `Pricing Page`, `Client History Panel`, `Credit History`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Should `Auth & Workers Management` be split into smaller, more focused modules?**
  _Cohesion score 0.06050228310502283 - nodes in this community are weakly interconnected._
- **Why does `fetchWithAuth()` connect `API Connection Layer` to `Product Creation Forms`, `POS Payment`, `Warehouse Create Forms`, `Inventory Data Cards`, `Inventory Navigation UI`, `Batch Product Creation`, `Auth & Workers Management`, `Sales & Cash Register`, `Category Create Forms`, `Credit History`, `Client Tables`, `Purchase Orders`, `Product Quick Add Drawer`, `POS Right Panel`, `Company & Express API`, `Spring Boot Endpoints`, `Images & Inventory Hook`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `Warehouse Create Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.0641025641025641 - nodes in this community are weakly interconnected._