function agregarPath(categorias) {
  const mapa = new Map(categorias.map((cat) => [cat.id, cat]));

  function obtenerPath(categoria) {
    if (categoria.categoria_padre_id === null) {
      return categoria.nombre;
    }
    const padre = mapa.get(categoria.categoria_padre_id);
    return `${obtenerPath(padre)}/${categoria.nombre}`;
  }

  return categorias.map((cat) => ({
    ...cat,
    path: obtenerPath(cat),
  }));
}

export const inventarioService = {
  async getCategorias() {
    const response = await fetch('/api/categoria', { method: 'GET' });
    if (!response.ok) throw new Error("Error al obtener categorias");
    const raw = await response.json();
    return agregarPath(raw?.data || []);
  },
  async createCategoria(body) {
    const response = await fetch("/api/categoria", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error("Error al crear la categoria");
    const data = await response.json();
    return data
  },
  async getProductos() {
    const response = await fetch('/api/producto', { method: 'GET' });
    if (!response.ok) throw new Error("Error al obtener productos");
    const raw = await response.json();
      return raw?.data?.content || [];
  },
  async getProductosByTienda(tiendaId) {
    const response = await fetch(`/api/producto/tienda?tiendaId=${tiendaId}`, {method : 'GET'});
      if (!response.ok) throw new Error("Error al obtener productos");
      const raw = await response.json();
      return raw?.content || [];
  },
  async getProductoById(idProducto) {
    const response = await fetch(`/api/producto/${idProducto}`, { method: 'GET' });
    if (!response.ok) throw new Error("Error al obtener producto");
    const raw = await response.json();
    return raw?.data?.content || [];
  },
  async getTiendas() {
    const response = await fetch('/api/tienda', { method: 'GET' });
    if (!response.ok) throw new Error("Error al obtener tiendas");
    const data = await response.json();
    return data?.data || [];
  },
  async createProducto(body) {
    const response = await fetch("/api/producto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("Error al crear la categoria");
    const data = await response.json();
    return data;
  },
  async guardarImagen(file) {
    const formData = new FormData();
    formData.append('archivo', file);
    const response = await fetch('/api/image', { method: 'POST', body: formData });
    if (!response.ok) throw new Error('Error al subir la imagen');
    const data = await response.json();
    return data;
  },
  async getAlmacenes() {
    const response = await fetch('/api/almacenes', {
      method: 'GET'
    });

    if (!response.ok) throw new Error('Error al cargar los almacenes');
    const data = await response.json();
    return data?.data || []
  },
  async createTienda(body) {
    const response = await fetch("/api/tienda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error("Error al crear la categoria");
    const data = await response.json();
    return data;
  },
  async getBajoStock(tiendaId) {
    const response = await fetch(`/api/producto/bajo-stock/${tiendaId}`, {
      method: 'GET'
    });
    if (!response.ok) throw new Error("Error al cargar los almacenes");
    const data = await response.json();
    return data?.data || [];
  },

  async getEstadoInventario(tiendaId) {
    const qs = tiendaId ? `?tiendaId=${tiendaId}` : ''
    const response = await fetch(`/api/analytics/estado-inventario${qs}`)
    if (!response.ok) throw new Error('Error al obtener estado inventario')
    const json = await response.json()
    return json?.data ?? json
  },

  async getValorInventario(tiendaId) {
    const qs = tiendaId ? `?tiendaId=${tiendaId}` : ''
    const response = await fetch(`/api/analytics/valor-inventario${qs}`)
    if (!response.ok) throw new Error('Error al obtener valor inventario')
    const json = await response.json()
    return json?.data ?? json
  },

  async getTopProductos(tiendaId, dias = 30) {
    const qs = new URLSearchParams({ ...(tiendaId ? { tiendaId } : {}), dias }).toString()
    const response = await fetch(`/api/analytics/top-productos?${qs}`)
    if (!response.ok) throw new Error('Error al obtener top productos')
    const json = await response.json()
    return json?.data ?? json
  },

  async getMovimientosSemanales(tiendaId, semanas = 8) {
    const qs = new URLSearchParams({ ...(tiendaId ? { tiendaId } : {}), semanas }).toString()
    const response = await fetch(`/api/analytics/movimientos-semanales?${qs}`)
    if (!response.ok) throw new Error('Error al obtener movimientos semanales')
    const json = await response.json()
    return json?.data ?? json
  },

};
