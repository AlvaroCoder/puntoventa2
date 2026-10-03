'use client'
import React, { useEffect, useState } from 'react'
import { Store } from 'lucide-react'
import { Title } from '@/components/Titles/Title'
import CajaCard from '@/components/Cards/CajaCard'
import { getTiendasByEmpresa } from '@/Connections/tiendas'
import { useAuth } from '@/Context/AuthContext'
import { getCajaByTienda } from '@/Connections/caja'
import PanelTiendas from '@/components/Panel/PanelTiendas'
import SwitcherLoader from '@/components/Navigation/SwitcherLoader'

const fmt = v =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v ?? 0)

const totalVentasHoy =0
const totalTx        = 0

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
    default: // CERRADA
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

export default function PageVentas() {
    const { user } = useAuth();
const [tiendas, setTiendas] = useState([]);
const [cajas, setCajas] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

    useEffect(() => {
    if (!user?.empresa_id) return; 

    let cancelado = false;

    async function fetchData() {
        setLoading(true);
        setError(null);
        try {
        const responseTiendas = await getTiendasByEmpresa(user.empresa_id);
        const dataTiendas = responseTiendas.data?.data ?? [];

        const responsesCajas = await Promise.all(
            dataTiendas.map((t) => getCajaByTienda(t.id)),
        );
        
        const dataCajas = responsesCajas.map((r) => r.data ?? []);
        
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

    return (
      <div className="p-6 flex flex-col gap-6 bg-[#E1E7F0] min-h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Title>Resumen de Ventas</Title>
            <p
              className="text-xs mt-0.5"
              style={{ color: "rgba(31, 47, 87, 0.55)" }}
            >
              Visualiza el resumen de tus ventas
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Ventas hoy",
              value: fmt(totalVentasHoy),
              color: "#198E7B",
            },
            {
              label: "Cajas abiertas",
              value: 0,
              color: "#3960A9",
            },
            { label: "Transacciones", value: totalTx, color: "#FF821E" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl px-5 py-4"
              style={{ border: "0.5px solid rgba(31,47,87,0.1)" }}
            >
              <p
                className="text-[11px] font-medium"
                style={{ color: "rgba(31,47,87,0.45)" }}
              >
                {s.label}
              </p>
              <p
                className="text-xl font-extrabold mt-0.5"
                style={{ color: s.color }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <SwitcherLoader loading={loading}>
          {tiendas.map((tienda) => (
            <PanelTiendas key={tienda?.id} tienda={tienda} />
          ))}
        </SwitcherLoader>
      </div>
    );
}