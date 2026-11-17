'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { getTiendasByEmpresa } from '@/Connections/tiendas'
import { useAuth } from '@/Context/AuthContext'
import { getCajaByTienda, getSesionesActivas } from '@/Connections/caja'
import PageVentas from '@/modules/ventas/PageVentas'


function formatearCaja(caja) {
  const base = {
    id: caja.id,
    nombre: caja.nombre,
    codigo: caja.codigo,
    estado: caja.estado ?? "CERRADA",
  };

  switch (base.estado) {
    case "ABIERTA":
      return {
        ...base,
        cajero: caja.cajero ?? "-",
        hora_apertura: formatearHora(caja.hora_apertura),
        ventas_hoy: Number(caja.ventas_hoy ?? 0),
        num_ventas: Number(caja.num_ventas ?? 0),
      };
    case "TRASPASO":
      return {
        ...base,
        cajero: caja.cajero ?? "-",
        hora_apertura: formatearHora(caja.hora_apertura),
        monto_traspaso: Number(caja.monto_traspaso ?? 0),
      };
    default:
      return {
        ...base,
        ultimo_cierre: caja.ultimo_cierre ?? "Sin registros",
        ultimo_cajero: caja.ultimo_cajero ?? "-",
      };
  }
}

function formatearHora(fecha) {
  if (!fecha) return "-";
  const d = new Date(fecha);
  if (isNaN(d)) return fecha;
  return d.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function unirTiendasConCajas(tiendas = [], cajasPorTienda = []) {
  return tiendas.map((tienda, i) => {
    const cajas = Array.isArray(cajasPorTienda[i]) ? cajasPorTienda[i] : [];

    return {
      id: tienda.id,
      nombre: tienda.nombre,
      codigo: tienda.codigo,
      ubicacion: tienda.direccion ?? "",
      responsable: tienda.responsable,
      activa: tienda.activa,
      cajas: cajas.map(formatearCaja),
    };
  });
}

export default function VentasController() {
    const { user } = useAuth();
    const [tiendas, setTiendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cajaSesiones, setCajaSesiones] = useState(null);

    useEffect(() => {
    if (!user?.empresa_id) return; 
    let cancelado = false;
    async function fetchData() {
        setLoading(true);
        setError(null);
        try {
        const responseTiendas = await getTiendasByEmpresa(user.empresa_id);
        const dataTiendas = responseTiendas.data?.data ?? [];

        const [responsesCajas, responsesSesiones] = await Promise.all([
          Promise.all(dataTiendas.map((t) => getCajaByTienda(t.id))),
          Promise.all(dataTiendas.map((t) => getSesionesActivas(t.id))),
        ]);
        const dataCajas = responsesCajas.map((r) => r.data ?? []);
          const dataSesiones = responsesSesiones.map((r) => r.data ?? []);

          const sesionesPorTienda = dataTiendas.map((t, i) => ({
            tienda_id: t.id,
            cantidad: dataSesiones[i].length,
            sesiones: dataSesiones[i],
          }));
           const totalSesiones = sesionesPorTienda.reduce(
             (acc, s) => acc + s.cantidad,
             0,
           );
                    
          setCajaSesiones({
            total: totalSesiones,
            porTienda: sesionesPorTienda,
          });
            const data = unirTiendasConCajas(dataTiendas, dataCajas);
            setTiendas(data)
        } catch (err) {
            console.error("Error cargando tiendas/cajas:", err);
            if (!cancelado) setError(err);
        } finally {
            if (!cancelado) setLoading(false);
        }
    }

    fetchData();
    return () => {
        cancelado = true;
    };
    }, [user?.empresa_id]);

  const todasCajas = useMemo(() => tiendas.flatMap(t => t.cajas), [tiendas])

  const totalVentasHoy = useMemo(
    () => todasCajas.filter(c => c.estado === 'ABIERTA').reduce((s, c) => s + (c.ventas_hoy || 0), 0),
    [todasCajas],
  )

  const totalTransacciones = useMemo(
    () => todasCajas.filter(c => c.estado === 'ABIERTA').reduce((s, c) => s + (c.num_ventas || 0), 0),
    [todasCajas],
  )

  const cajasAbiertas = useMemo(
    () => todasCajas.filter(c => c.estado === 'ABIERTA').length,
    [todasCajas],
  )

  const totalCajas = todasCajas.length
  const efectivoEnCajas = totalVentasHoy

  return (
    <PageVentas
      tiendas={tiendas}
      loading={loading}
      cajaSesiones={cajaSesiones}
      metrics={{ totalVentasHoy, totalTransacciones, cajasAbiertas, totalCajas, efectivoEnCajas }}
    />
  )
}