import { getCategorias , getProductosByEmpresa} from "@/Connections/productos";
import { getSession } from "@/lib/authentication";
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
  async getProductos() {
      const session = await getSession();
      if (!session) throw new Error("No autorizado");
      const empresaId = session.empresa_id;
      const res = await getProductosByEmpresa(empresaId);
      if (!res.ok) throw new Error("Error al obtener productos");
      const data = res?.data;
      return data?.content || [];
    },
};
