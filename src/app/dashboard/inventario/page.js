'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2 } from 'lucide-react'
import { useAuth } from '@/Context/AuthContext'
import { getAlmacenesByUser } from '@/Connections/almacen'
import { getProductosBajoStock, getProductosByEmpresa } from '@/Connections/productos'
import MetricCard from '@/components/Cards/MetricCard'
import CreateLinkButton from '@/shared/components/CreateLinkButton'

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
  const { user } = useAuth();

  const [almacenes, setAlmacenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [bajoStock, setBajoStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ultimaActualizacion, setUltima] = useState(null);

  useEffect(() => {
    if (!user?.empresa_id) return;
    let cancelado = false;
    async function fetchAll() {
      setLoading(true);
      try {
        const [resAlm, resProds, resBajo] = await Promise.all([
          getAlmacenesByUser(),
          getProductosByEmpresa(user.empresa_id),
          getProductosBajoStock(user.empresa_id),
        ]);
        if (cancelado) return;
        setAlmacenes(resAlm?.data ?? []);
        setProductos(resProds?.data?.data ?? resProds?.data ?? []);
        setBajoStock(resBajo?.data?.data ?? resBajo?.data ?? []);
        setUltima(new Date());
      } catch (e) {
        console.error("Error cargando inventario:", e);
      } finally {
        if (!cancelado) setLoading(false);
      }
    }
    fetchAll();
    return () => {
      cancelado = true;
    };
  }, [user?.empresa_id]);

  const totalProductos = productos.length;
  /**
   * const totalUnidades   = useMemo(
    () => productos?.reduce((s, p) => s + Number(p.stock_total ?? p.stock ?? 0), 0),
    [productos],
  )
   */
  const totalUnidades = 10;

  /**
 * const valorInventario = useMemo(
    () =>
      productos?.reduce(
        (s, p) =>
          s +
          Number(p.precio_venta ?? 0) * Number(p.stock_total ?? p.stock ?? 0),
        0,
      ),
    [productos],
  );
 */

  const valorInventario = 1000;
  const paraReponer = bajoStock.length;

  const subtitleTime = ultimaActualizacion
    ? (() => {
        const min = Math.floor(
          (Date.now() - ultimaActualizacion.getTime()) / 60000,
        );
        return min === 0
          ? "Actualizado hace unos segundos"
          : `Actualizado hace ${min} minutos`;
      })()
    : null;

  return (
    <div className="p-6 flex flex-col gap-6 bg-[#E1E7F0] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#1F2F57" }}>
            ¿Cómo está tu inventario hoy?
          </h1>
          <p className="text-xs mt-1" style={{ color: "rgba(31,47,87,0.5)" }}>
            {subtitleTime ?? "Cargando..."}
            {almacenes.length > 0 && (
              <>
                {" "}
                · {almacenes.length} almacén{almacenes.length !== 1 ? "es" : ""}
              </>
            )}
          </p>
        </div>
        <CreateLinkButton
          href="/dashboard/inventario/productos/crear/lote"
        >
          Ingresar Productos
        </CreateLinkButton>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2
            size={22}
            className="animate-spin"
            style={{ color: "rgba(31,47,87,0.4)" }}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard
              label="Productos registrados"
              value={totalProductos}
              sub={`${totalUnidades.toLocaleString("es-PE")} unidades en total`}
            />
            <MetricCard
              label="Tu inventario vale"
              value={fmtMoney(valorInventario)}
              sub="A precio de venta"
            />
            <MetricCard
              accent
              label="Tienes que reponer"
              value={`${paraReponer} ${paraReponer === 1 ? "producto" : "productos"}`}
              sub="Ver cuáles"
              onSubClick={() =>
                document
                  .getElementById("tabla-bajo-stock")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            />
          </div>

          <div
            id="tabla-bajo-stock"
            className="bg-white rounded-xl overflow-hidden"
            style={{ border: "0.5px solid rgba(31,47,87,0.1)" }}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "0.5px solid rgba(31,47,87,0.08)" }}
            >
              <span className="text-sm font-bold" style={{ color: "#1F2F57" }}>
                Productos por agotarse
              </span>
                <CreateLinkButton
                  href="/dashboard/inventario/productos/crear/lote"
                >
                  Ingresar productos
              </CreateLinkButton>
            </div>

            {bajoStock.length === 0 ? (
              <div className="py-12 flex items-center justify-center">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "rgba(31,47,87,0.4)" }}
                >
                  Todos tus productos tienen suficiente stock
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr
                    style={{ borderBottom: "0.5px solid rgba(31,47,87,0.08)" }}
                  >
                    {["Producto", "Almacén", "Quedan", "Estado", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                          style={{ color: "rgba(31,47,87,0.4)" }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {bajoStock.map((item, i) => {
                    const stock = Number(item.stock_actual ?? item.stock ?? 0);
                    const unidad = item.unidad_medida ?? item.unidad ?? "und";
                    const almacen =
                      item.almacen_nombre ?? item.almacen?.nombre ?? "—";
                    return (
                      <tr
                        key={item.id ?? i}
                        style={{
                          borderTop:
                            i === 0
                              ? "none"
                              : "0.5px solid rgba(31,47,87,0.06)",
                        }}
                      >
                        <td className="px-6 py-3.5">
                          <span
                            className="text-sm font-semibold"
                            style={{ color: "#1F2F57" }}
                          >
                            {item.nombre}
                          </span>
                        </td>
                        <td
                          className="px-6 py-3.5 text-sm"
                          style={{ color: "rgba(31,47,87,0.6)" }}
                        >
                          {almacen}
                        </td>
                        <td
                          className="px-6 py-3.5 text-sm font-medium"
                          style={{ color: "#1F2F57" }}
                        >
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
                            style={{ color: "#3960A9" }}
                          >
                            Reponer
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}