import { getCategorias } from "@/Connections/productos";

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
    const response = await getCategorias();
    const raw = response?.data?.data || [];
    return agregarPath(raw);
  },
};
