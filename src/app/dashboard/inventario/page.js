'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CustomSelect from '@/shared/components/Selectables/CustomSelect'
import useTienda from '@/modules/inventary/hooks/useTienda'
import { inventarioService } from '@/modules/inventary/service/inventario.service'

const C = {
  saludable: '#4CAF50',
  bajo: '#F5A623',
  agotado:   '#EF4444',
  azul: '#3960A9',
  teal: '#198E7B',
  navy: '#1F2F57',
  texto: 'rgba(31,47,87,0.5)',
}
const PALETTE = ['#3960A9', '#F97316', '#10B981', '#E8A020', '#EC4899', '#8B5CF6', '#06B6D4']

function DonutChart({ data, total, centerLabel }) {
  const r = 68, cx = 90, cy = 90, sw = 26
  const circumference = 2 * Math.PI * r
  const gap = 2
  let cum = 0
  const segments = data.map(d => {
    const fraction = total > 0 ? d.value / total : 0
    const dash   = Math.max(0, fraction * circumference - gap)
    const offset = circumference - cum
    cum += fraction * circumference
    return { ...d, dash, offset }
  })
  return (
    <svg width={180} height={180} viewBox="0 0 180 180" className="shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(31,47,87,0.07)" strokeWidth={sw} />
      {segments.map((seg, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={seg.color} strokeWidth={sw}
          strokeDasharray={`${seg.dash} ${circumference}`}
          strokeDashoffset={seg.offset}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
        />
      ))}
      <text x={cx} y={cy - 5} textAnchor="middle" fontWeight="800" fontSize="26" fill={C.navy}>{total}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill={C.texto}>{centerLabel}</text>
    </svg>
  )
}

function HBar({ items, valueKey = 'valor', labelKey = 'nombre', sublabelKey }) {
  const max = Math.max(...items.map(x => Number(x[valueKey])), 1)
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-32 shrink-0">
            <p className="text-xs font-bold truncate" style={{ color: C.navy }}>{item[labelKey]}</p>
            {sublabelKey && <p className="text-[11px]" style={{ color: C.texto }}>{item[sublabelKey]}</p>}
          </div>
          <div className="flex-1 h-6 rounded-sm overflow-hidden" style={{ background: 'rgba(31,47,87,0.05)' }}>
            <div
              className="h-full rounded-sm transition-all duration-500"
              style={{ width: `${(Number(item[valueKey]) / max) * 100}%`, background: PALETTE[i % PALETTE.length] }}
            />
          </div>
          <span className="text-sm font-bold w-10 text-right shrink-0" style={{ color: C.navy }}>
            {Number(item[valueKey]).toLocaleString('es-PE')}
          </span>
        </div>
      ))}
    </div>
  )
}

function GroupedVBar({ items }) {
  const W = 420, H = 170
  const PAD_L = 28, PAD_B = 42, PAD_T = 20
  const chartH = H - PAD_B - PAD_T
  const n = items.length
  const colW = n > 0 ? (W - PAD_L - 16) / n : 60
  const barW = Math.min(22, colW * 0.38)
  const max  = Math.max(...items.flatMap(x => [x.entradas, x.salidas]), 1)

  const ySteps = 4
  const yMax   = Math.ceil(max / 50) * 50 || 100
  const yLines = Array.from({ length: ySteps + 1 }, (_, i) => Math.round((yMax / ySteps) * i))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
      {/* grid */}
      {yLines.map(y => {
        const vy = PAD_T + chartH - (y / yMax) * chartH
        return (
          <g key={y}>
            <line x1={PAD_L} y1={vy} x2={W - 8} y2={vy} stroke="rgba(31,47,87,0.07)" strokeWidth={1} />
            <text x={PAD_L - 4} y={vy + 4} textAnchor="end" fontSize={9} fill={C.texto}>{y}</text>
          </g>
        )
      })}
      {items.map((item, i) => {
        const colX = PAD_L + i * colW + colW / 2
        const hE = Math.max(3, (item.entradas / yMax) * chartH)
        const hS = Math.max(3, (item.salidas  / yMax) * chartH)
        const xE = colX - barW - 2
        const xS = colX + 2
        const label = Array.isArray(item.fechaInicio)
          ? `${String(item.fechaInicio[2]).padStart(2, '0')}/${String(item.fechaInicio[1]).padStart(2, '0')}`
          : item.fechaInicio
            ? item.fechaInicio.slice(5).replace('-', '/')
            : `S${i + 1}`
        return (
          <g key={i}>
            <rect x={xE} y={PAD_T + chartH - hE} width={barW} height={hE} rx={3} fill={C.teal} />
            <rect x={xS} y={PAD_T + chartH - hS} width={barW} height={hS} rx={3} fill={C.azul} />
            <text x={colX} y={PAD_T + chartH + 14} textAnchor="middle" fontSize={10} fontWeight="600" fill={C.navy}>{label}</text>
          </g>
        )
      })}
    </svg>
  )
}

function Card({ title, subtitle, actionLabel, actionHref, children, footer, footerLabel, footerAction }) {
  const router = useRouter()
  return (
    <div className="bg-white rounded-2xl flex flex-col" style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}>
      <div className="flex items-start justify-between px-6 pt-5 pb-4">
        <div>
          <p className="text-base font-bold" style={{ color: C.navy }}>{title}</p>
          {subtitle && <p className="text-xs mt-0.5" style={{ color: C.texto }}>{subtitle}</p>}
        </div>
        {actionLabel && (
          <button
            onClick={() => router.push(actionHref)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-blue-50"
            style={{ border: '1px solid rgba(31,47,87,0.15)', color: C.navy }}
          >
            {actionLabel}
          </button>
        )}
      </div>
      <div className="flex-1 px-6 pb-4">{children}</div>
      {(footer || footerLabel) && (
        <div className="flex items-center justify-between px-6 py-3" style={{ borderTop: '0.5px solid rgba(31,47,87,0.07)' }}>
          <p className="text-xs" style={{ color: C.texto }}>{footer}</p>
          {footerLabel && (
            <button onClick={() => router.push(footerAction)} className="text-xs font-semibold hover:underline" style={{ color: C.azul }}>
              {footerLabel} →
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function Skeleton({ h = 160 }) {
  return <div className="rounded-xl animate-pulse" style={{ height: h, background: 'rgba(31,47,87,0.07)' }} />
}

function Empty({ msg = 'Sin datos' }) {
  return (
    <div className="flex items-center justify-center py-10">
      <p className="text-xs" style={{ color: C.texto }}>{msg}</p>
    </div>
  )
}

function useFetchAnalytics(fn, deps) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    fn().then(setData).catch(() => setData(null)).finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return { data, loading }
}

export default function PageInventarioResumen() {
  const [tiendaFiltro, setTiendaFiltro] = useState('')
  const tid = tiendaFiltro || null

  const { tiendas } = useTienda()

  // ── Carga de datos ────────────────────────────────────────────────────────
  const { data: estadoRaw, loading: loadingEstado } =
    useFetchAnalytics(() => inventarioService.getEstadoInventario(tid), [tid])

  const { data: valorRaw, loading: loadingValor } =
    useFetchAnalytics(() => inventarioService.getValorInventario(tid), [tid])

  const { data: topRaw, loading: loadingTop } =
    useFetchAnalytics(() => inventarioService.getTopProductos(tid, 30), [tid])

  const { data: movRaw, loading: loadingMov } =
    useFetchAnalytics(() => inventarioService.getMovimientosSemanales(tid, 8), [tid])

  // ── Derivaciones ─────────────────────────────────────────────────────────
  const estadoTotal = estadoRaw?.total ?? 0
  const estadoData  = [
    { label: 'Saludable', value: estadoRaw?.saludable ?? 0, color: C.saludable },
    { label: 'Bajo stock', value: estadoRaw?.bajoStock ?? 0, color: C.bajo },
    { label: 'Agotado',   value: estadoRaw?.agotado   ?? 0, color: C.agotado },
  ].filter(x => x.value > 0)

  const valorArr   = Array.isArray(valorRaw) ? valorRaw : []
  const valorTotal = valorArr.reduce((s, x) => s + Number(x.stockTotal ?? 0), 0)
  const valorData  = valorArr.map((x, i) => ({
    label: x.categoria,
    value: Number(x.stockTotal ?? 0),
    color: PALETTE[i % PALETTE.length],
    monto: Number(x.valorTotal ?? 0),
  }))

  const topArr = Array.isArray(topRaw) ? topRaw.slice(0, 5) : []
  const movArr = Array.isArray(movRaw) ? movRaw : []

  const horaActualizacion = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false })

  const opcionesTienda = [
    { id: '', nombre: 'Todas las tiendas' },
    ...tiendas,
  ]

  return (
    <div className="p-6 flex flex-col gap-5 bg-[#E1E7F0] min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: C.navy }}>Resumen de inventario</h1>
          <p className="text-xs mt-0.5" style={{ color: C.texto }}>Cómo está tu stock · actualizado {horaActualizacion}</p>
        </div>
        <div className="w-56 shrink-0">
          <CustomSelect
            value={tiendaFiltro}
            onChange={v => setTiendaFiltro(v === '' ? '' : String(v))}
            options={opcionesTienda}
            labelKey="nombre"
            valueKey="id"
            placeholder="Todas las tiendas"
          />
        </div>
      </div>

      {/* Grid 2×2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── 1. Estado del inventario ─────────────────────────────────────── */}
        <Card
          title="Estado del inventario"
          subtitle="Distribución actual de stock: saludable, bajo y agotado"
          actionLabel="Ver productos"
          actionHref="/dashboard/inventario/productos"
          footer={`Total: ${estadoTotal} productos`}
          footerLabel={`Ver los ${(estadoRaw?.bajoStock ?? 0) + (estadoRaw?.agotado ?? 0)} por reponer`}
          footerAction="/dashboard/inventario/productos"
        >
          {loadingEstado ? <Skeleton /> : !estadoRaw ? <Empty msg="Sin datos de inventario" /> : (
            <div className="flex items-center gap-6">
              <DonutChart
                data={estadoData.length ? estadoData : [{ label: '—', value: 1, color: 'rgba(31,47,87,0.1)' }]}
                total={estadoTotal}
                centerLabel="productos"
              />
              <div className="flex flex-col gap-3 flex-1">
                {[
                  { label: 'Saludable', value: estadoRaw?.saludable ?? 0, color: C.saludable },
                  { label: 'Bajo stock', value: estadoRaw?.bajoStock ?? 0, color: C.bajo },
                  { label: 'Agotado',   value: estadoRaw?.agotado   ?? 0, color: C.agotado },
                ].map(item => {
                  const pct = estadoTotal > 0 ? Math.round((item.value / estadoTotal) * 100) : 0
                  return (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: item.color }} />
                      <span className="text-xs flex-1" style={{ color: 'rgba(31,47,87,0.65)' }}>{item.label}</span>
                      <span className="text-xs font-bold w-7 text-right" style={{ color: C.navy }}>{item.value}</span>
                      <span className="text-xs w-9 text-right" style={{ color: C.texto }}>{pct}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </Card>

        {/* ── 2. Top productos más vendidos ────────────────────────────────── */}
        <Card
          title="Top productos vendidos"
          subtitle="Los 5 más vendidos en los últimos 30 días"
          actionLabel="Ver ventas"
          actionHref="/dashboard/ventas"
          footer="Basado en unidades vendidas · últimos 30 días"
          footerLabel="Ver reporte"
          footerAction="/dashboard/ventas"
        >
          {loadingTop ? <Skeleton /> : topArr.length === 0 ? <Empty msg="Sin ventas en los últimos 30 días" /> : (
            <HBar
              items={topArr}
              valueKey="totalVendido"
              labelKey="nombre"
              sublabelKey="totalIngresos"
            />
          )}
          {!loadingTop && topArr.length > 0 && (
            <p className="text-[11px] mt-3" style={{ color: C.texto }}>
              Número = unidades · S/ = ingresos totales
            </p>
          )}
        </Card>

        {/* ── 3. Valor del inventario por categoría ────────────────────────── */}
        <Card
          title="Valor por categoría"
          subtitle="Distribución del stock valorizado por categoría"
          actionLabel="Ver categorías"
          actionHref="/dashboard/inventario/categoria"
          footer={`Valor total: S/ ${valorArr.reduce((s, x) => s + Number(x.valorTotal ?? 0), 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`}
          footerLabel="Ver inventario"
          footerAction="/dashboard/inventario"
        >
          {loadingValor ? <Skeleton /> : valorArr.length === 0 ? <Empty msg="Sin datos de categorías" /> : (
            <div className="flex items-center gap-6">
              <DonutChart
                data={valorData.length ? valorData : [{ label: '—', value: 1, color: 'rgba(31,47,87,0.1)' }]}
                total={valorTotal}
                centerLabel="unidades"
              />
              <div className="flex flex-col gap-2 flex-1">
                {valorData.slice(0, 6).map((cat) => {
                  const pct = valorTotal > 0 ? Math.round((cat.value / valorTotal) * 100) : 0
                  return (
                    <div key={cat.label} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: cat.color }} />
                      <span className="text-xs flex-1 truncate" style={{ color: 'rgba(31,47,87,0.65)' }}>{cat.label}</span>
                      <span className="text-xs font-bold w-10 text-right" style={{ color: C.navy }}>
                        S/{(cat.monto / 1000).toFixed(1)}k
                      </span>
                      <span className="text-xs w-9 text-right" style={{ color: C.texto }}>{pct}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </Card>

        {/* ── 4. Movimientos semanales ─────────────────────────────────────── */}
        <Card
          title="Movimientos semanales"
          subtitle="Entradas y salidas de stock — últimas 8 semanas"
          actionLabel="Ver movimientos"
          actionHref="/dashboard/inventario/movimientos"
          footer="Verde = entradas · Azul = salidas"
          footerLabel="Ver historial"
          footerAction="/dashboard/inventario/movimientos"
        >
          {loadingMov ? <Skeleton /> : movArr.length === 0 ? <Empty msg="Sin movimientos registrados" /> : (
            <>
              <GroupedVBar items={movArr} />
              <div className="flex items-center gap-5 mt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: C.teal }} />
                  <span className="text-xs" style={{ color: C.texto }}>Entradas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: C.azul }} />
                  <span className="text-xs" style={{ color: C.texto }}>Salidas</span>
                </div>
              </div>
            </>
          )}
        </Card>

      </div>
    </div>
  )
}
