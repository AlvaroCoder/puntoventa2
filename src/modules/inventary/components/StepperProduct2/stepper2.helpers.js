export const generateCodigo = () =>
  `PROD-${String(Math.floor(Math.random() * 999999) + 1).padStart(6, "0")}`;

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
