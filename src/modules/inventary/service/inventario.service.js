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
  async getTiendas() {
    const res = await fetch('/api/tienda', { method: 'GET' });
    if (!res.ok) throw new Error("Error al obtener tiendas");
    const data = await res.json();
    return data?.data || [];
  }
};
