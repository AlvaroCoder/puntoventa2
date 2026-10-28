'use client';
import { useState, useEffect } from 'react';

const MOCK = {
  id: 1,
  codigo: 'PROD-651908',
  nombre: 'Zapatilla Air Force A12',
  categoria: 'Zapatillas',
  marca: 'Nike',
  codigoBarras: '7751234567012',
  descripcion: 'Zapatilla urbana de cuero sintético, suela de goma.',
  unidadMedida: 'Par',
  precioVenta: 260.0,
  costoUnitario: 150.0,
  aplicaIgv: true,
  impuestoPorcentaje: 18,
  imagenUrl: null,
  stockTotal: 4,
  estadoStock: 'Stock bajo',
  activoEnVenta: true,
  ultimaEdicion: 'hace 2 días por Alvaro',
  colores: ['Negro', 'Blanco'],
  tallas: ['38', '39', '40', '41', '42'],
  stockMatrix: {
    Negro: { '38': 0, '39': 1, '40': 2, '41': 0, '42': 0 },
    Blanco: { '38': 0, '39': 0, '40': 1, '41': 0, '42': 0 },
  },
  stockMinimoPorTalla: 1,
  notaPrecioVariante:
    'La talla 42 tiene precio propio: S/ 269.90. Se edita en la tabla de variantes.',
  vendidosUltimos30: 14,
  ingresosUltimos30: 3640,
  diasStockEstimado: 9,
  movimientos: [
    {
      id: 1,
      tipo: 'venta',
      cantidad: -1,
      referencia: 'B001-000124',
      detalle: 'Negro 40',
      tiempo: 'hoy 16:28',
    },
    {
      id: 2,
      tipo: 'venta',
      cantidad: -2,
      referencia: 'B001-000119',
      detalle: 'Negro 41',
      tiempo: 'ayer',
    },
    {
      id: 3,
      tipo: 'ingreso',
      cantidad: +6,
      referencia: 'OC-0007',
      detalle: 'Almacen Stack',
      tiempo: '22 Oct',
    },
    {
      id: 4,
      tipo: 'ajuste',
      cantidad: -1,
      referencia: 'producto dañado',
      detalle: 'Por Pedro',
      tiempo: '20 Oct',
    },
  ],
  alertaMinimo: 2,
  visibleEnCaja: true,
};

export default function useProductoDetalle(id) {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      try {
        setProducto({ ...MOCK, id: Number(id) });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [id]);

  return { producto, loading, error };
}
