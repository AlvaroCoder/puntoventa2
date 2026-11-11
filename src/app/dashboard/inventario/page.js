'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import MetricCard from '@/components/Cards/MetricCard'
import CreateLinkButton from '@/shared/components/CreateLinkButton';
import useInventario from '@/modules/inventary/hooks/useInventario';
import useTienda from '@/modules/inventary/hooks/useTienda';
import PageLoader from '@/components/Loading/PageLoader'
import { inventarioService } from '@/modules/inventary/service/inventario.service';

const fmtMoney = (v) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v ?? 0)

function StatusBadge({ stock }) {
  const critico = stock <= 2
  return (
    <span
      className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
      style={
        critico
          ? { background: '#FEF3C7', color: '#B45309' }
          : { background: '#FFF9EC', color: '#D97706' }
      }
    >
      {critico ? 'Casi agotado' : 'Stock bajo'}
    </span>
  )
}

export default function PageInventarioResumen() {
  const router = useRouter();

  const { productos, loading: loadingProductos } = useInventario();
  const { tiendas, loading: loadingTiendas } = useTienda();
  const [bajoStockPorTienda, setBajoStockPorTienda] = useState({});
  const [loadingBajoStock, setLoadingBajoStock] = useState(false);

  useEffect(() => {
    if (!tiendas.length) return;
    setLoadingBajoStock(true);
    Promise.all(
      tiendas.map(async (tienda) => {
        try {
          const data = await inventarioService.getBajoStock(tienda.id);
          return { tienda, productos: Array.isArray(data) ? data : [] };
        } catch {
          return { tienda, productos: [] };
        }
      })
    )
      .then((resultados) => {
        const agrupado = {};
        resultados.forEach(({ tienda, productos }) => {
          if (productos.length > 0) {
            agrupado[tienda.id] = { tienda, productos };
          }
        });
        setBajoStockPorTienda(agrupado);
      })
      .finally(() => setLoadingBajoStock(false));
  }, [tiendas]);

  const totalProductos = productos.length;

  const totalUnidades = useMemo(
    () => productos?.reduce((s, p) => s + Number(p.stockTotal ?? p.stock ?? 0), 0),
    [productos],
  );

  const valorInventario = useMemo(
    () =>
      productos?.reduce(
        (s, p) => s + Number(p.precioVenta ?? 0) * Number(p.stockTotal ?? p.stock ?? 0),
        0,
      ),
    [productos],
  );

  const paraReponer = useMemo(
    () => Object.values(bajoStockPorTienda).reduce((s, { productos }) => s + productos.length, 0),
    [bajoStockPorTienda],
  );

  const loading = loadingProductos || loadingTiendas;

  if (loading) {
    return <PageLoader />
  }

  return (
    <div className="p-6 flex flex-col gap-6 bg-[#E1E7F0] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#1F2F57" }}>
            ¿Cómo está tu inventario hoy?
          </h1>
          <p className="text-xs mt-1" style={{ color: "rgba(31,47,87,0.5)" }}>
            {tiendas.length} tienda{tiendas.length !== 1 ? 's' : ''} activa{tiendas.length !== 1 ? 's' : ''}
          </p>
        </div>
        <CreateLinkButton href="/dashboard/inventario/productos/crear/lote">
          Ingresar Productos
        </CreateLinkButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Productos registrados"
          value={totalProductos}
          sub={`${totalUnidades} unidades en total`}
        />
        <MetricCard
          label="Tu inventario vale"
          value={fmtMoney(valorInventario)}
          sub="A precio de venta"
        />
        <MetricCard
          accent
          label="Tienes que reponer"
          value={`${paraReponer} ${paraReponer === 1 ? 'producto' : 'productos'}`}
          sub="Ver cuáles"
          onSubClick={() =>
            document.getElementById('tabla-bajo-stock')?.scrollIntoView({ behavior: 'smooth' })
          }
        />
      </div>

      <div
        id="tabla-bajo-stock"
        className="bg-white rounded-xl overflow-hidden"
        style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '0.5px solid rgba(31,47,87,0.08)' }}
        >
          <span className="text-sm font-bold" style={{ color: '#1F2F57' }}>
            Productos por agotarse
          </span>
          <CreateLinkButton href="/dashboard/inventario/productos/crear/lote">
            Ingresar productos
          </CreateLinkButton>
        </div>

        {loadingBajoStock ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={20} className="animate-spin" style={{ color: 'rgba(31,47,87,0.4)' }} />
          </div>
        ) : Object.keys(bajoStockPorTienda).length === 0 ? (
          <div className="py-12 flex items-center justify-center">
            <p className="text-sm font-semibold" style={{ color: 'rgba(31,47,87,0.4)' }}>
              Todos tus productos tienen suficiente stock
            </p>
          </div>
        ) : (
          Object.values(bajoStockPorTienda).map(({ tienda, productos: items }, grupoIdx) => (
            <div key={tienda.id}>
              <div
                className="px-6 py-2 flex items-center gap-2"
                style={{
                  background: 'rgba(31,47,87,0.03)',
                  borderTop: grupoIdx === 0 ? 'none' : '0.5px solid rgba(31,47,87,0.08)',
                  borderBottom: '0.5px solid rgba(31,47,87,0.08)',
                }}
              >
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(31,47,87,0.5)' }}>
                  {tienda.nombre ?? `Tienda ${tienda.id}`}
                </span>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(31,47,87,0.08)', color: 'rgba(31,47,87,0.6)' }}
                >
                  {items.length} producto{items.length !== 1 ? 's' : ''}
                </span>
              </div>

              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '0.5px solid rgba(31,47,87,0.06)' }}>
                    {['Producto', 'Quedan', 'Estado', ''].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider"
                        style={{ color: 'rgba(31,47,87,0.4)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => {
                    const stock = Number(item.stockActual ?? item.stock_actual ?? item.stock ?? 0);
                    const unidad = item.unidadMedida ?? item.unidad_medida ?? item.unidad ?? 'und';
                    return (
                      <tr
                        key={item.id ?? i}
                        style={{
                          borderTop: i === 0 ? 'none' : '0.5px solid rgba(31,47,87,0.05)',
                        }}
                      >
                        <td className="px-6 py-3.5">
                          <span className="text-sm font-semibold" style={{ color: '#1F2F57' }}>
                            {item.nombre}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-sm font-medium" style={{ color: '#1F2F57' }}>
                          {stock} {unidad}
                        </td>
                        <td className="px-6 py-3.5">
                          <StatusBadge stock={stock} />
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/inventario/productos/${item.productoId ?? item.producto_id ?? item.id}`,
                              )
                            }
                            className="text-xs font-semibold hover:underline"
                            style={{ color: '#3960A9' }}
                          >
                            Reponer
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
