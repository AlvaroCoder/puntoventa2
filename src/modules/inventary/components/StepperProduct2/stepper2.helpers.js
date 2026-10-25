export const generateCodigo = () =>
  `PROD-${String(Math.floor(Math.random() * 999999) + 1).padStart(6, "0")}`;

export function generarCodigoTienda(nombre) {
  const prefix =
    nombre.trim().slice(0, 3).toUpperCase().replace(/\s/g, "") || "TDA";
  const num = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
  return `${prefix}-${num}`;
}
export const initial = (codigo) => ({
  nombre: "",
  codigo,
  categoria: null,
  precio_venta: "",
  precio_compra: "",
  stock_inicial: 0,
  unidad: "Unidad",
  tiene_variantes: false,
  variantes: [],
});
