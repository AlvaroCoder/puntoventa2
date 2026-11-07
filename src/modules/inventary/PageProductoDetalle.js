"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Pencil, ImageIcon, Info, ChevronDown } from "lucide-react";
import Switch from "@/modules/inventary/components/Switch";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const soles = (n) =>
  typeof n === "number"
    ? `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "—";

const solesCorto = (n) =>
  typeof n === "number"
    ? `S/ ${n.toLocaleString("es-PE", { maximumFractionDigits: 0 })}`
    : "—";

/** "Par" -> "pares", "Unidad" -> "unidades", "Kg" -> "kg" */
function unidadTexto(unidad, cantidad) {
  const u = (unidad || "unidad").toLowerCase();
  if (cantidad === 1 || u.length <= 2) return u;
  return /[aeiou]$/.test(u) ? `${u}s` : `${u}es`;
}

function calcMargen(precio, costo) {
  if (!precio || costo == null) return null;
  return Math.round(((precio - costo) / precio) * 100);
}

function estadoStock(p) {
  if (!p.stockTotal)
    return { label: "Agotado", cls: "bg-[#FEE2E2] text-[#B91C1C]" };
  if (p.enBajoStock)
    return { label: "Stock bajo", cls: "bg-[#FDE7CF] text-[#B45309]" };
  return { label: "En stock", cls: "bg-[#D1FAE5] text-[#047857]" };
}

function tiempoRelativo(fecha) {
  if (!fecha) return "";
  const d = new Date(fecha);
  if (isNaN(d)) return fecha;
  const dias = Math.round((d - new Date()) / 86400000);
  if (dias === 0)
    return `hoy ${d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}`;
  if (dias >= -6)
    return new Intl.RelativeTimeFormat("es", { numeric: "auto" }).format(
      dias,
      "day",
    );
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short" });
}

const COLORES_HEX = {
  negro: "#111827",
  blanco: "#FFFFFF",
  rojo: "#B91C1C",
  azul: "#1D4ED8",
  verde: "#15803D",
  gris: "#6B7280",
  marron: "#78350F",
  marrón: "#78350F",
  beige: "#D6C6A8",
  rosado: "#EC4899",
  amarillo: "#EAB308",
};

const ordenTalla = (a, b) => {
  const na = Number(a),
    nb = Number(b);
  if (!isNaN(na) && !isNaN(nb)) return na - nb;
  const orden = ["XS", "S", "M", "L", "XL", "XXL"];
  const ia = orden.indexOf(a),
    ib = orden.indexOf(b);
  if (ia !== -1 && ib !== -1) return ia - ib;
  return String(a).localeCompare(String(b));
};

/** Convierte variantes[] en tallas, colores y matriz[color][talla] */
function useMatrizVariantes(variantes = []) {
  return useMemo(() => {
    const tallas = [
      ...new Set(variantes.map((v) => v.talla).filter(Boolean)),
    ].sort(ordenTalla);
    const colores = [...new Set(variantes.map((v) => v.color).filter(Boolean))];
    const matriz = {};
    variantes.forEach((v) => {
      matriz[v.color] ??= {};
      matriz[v.color][v.talla] = v;
    });
    const totalColor = (c) =>
      tallas.reduce((s, t) => s + (matriz[c]?.[t]?.stock ?? 0), 0);
    return { tallas, colores, matriz, totalColor };
  }, [variantes]);
}

const MOV = {
  SALIDA: { label: "Salida", signo: -1, cls: "bg-[#FEE2E2] text-[#B91C1C]" },
  ENTRADA: { label: "Ingreso", signo: 1, cls: "bg-[#D1FAE5] text-[#047857]" },
  AJUSTE: { label: "Ajuste", signo: 0, cls: "bg-[#E1E7F0] text-[#1F2F57]" },
};

// ─────────────────────────────────────────────
// Bloques base
// ─────────────────────────────────────────────

function Card({ title, action, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(31,47,87,.04)] ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && (
            <h2 className="text-lg font-bold text-[#1F2F57]">{title}</h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function Dato({ label, children }) {
  return (
    <>
      <dt className="text-sm text-[#1F2F57]/60">{label}</dt>
      <dd className="text-sm font-medium text-[#1F2F57]">{children ?? "—"}</dd>
    </>
  );
}

// ─────────────────────────────────────────────
// Columna izquierda
// ─────────────────────────────────────────────

function CardInfoGeneral({ producto }) {
  const imagenes =
    producto.imagenes ?? (producto.imagenUrl ? [producto.imagenUrl] : []);
  const [activa, setActiva] = React.useState(0);

  return (
    <section className="flex flex-col gap-6 rounded-2xl bg-white p-6 md:flex-row">
      <div className="flex shrink-0 flex-col gap-3 md:w-[300px]">
        <div className="relative aspect-[300/260] w-full overflow-hidden rounded-xl bg-[#E1E7F0]/60">
          {imagenes[activa] ? (
            <Image
              src={imagenes[activa]}
              alt={producto.nombre}
              fill
              sizes="300px"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center">
              <ImageIcon
                size={48}
                strokeWidth={1.25}
                className="text-[#1F2F57]/30"
              />
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {(imagenes.length ? imagenes : [null, null]).map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiva(i)}
              className={`relative grid h-16 w-16 place-items-center overflow-hidden rounded-lg bg-[#E1E7F0]/60 transition ${
                i === activa
                  ? "ring-2 ring-[#1F2F57]"
                  : "hover:ring-1 hover:ring-[#1F2F57]/30"
              }`}
            >
              {src ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <ImageIcon
                  size={16}
                  strokeWidth={1.5}
                  className="text-[#1F2F57]/35"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="mb-4 text-lg font-bold text-[#1F2F57]">
          Información general
        </h2>
        <dl className="grid grid-cols-[140px_minmax(0,1fr)] gap-x-6 gap-y-3">
          <Dato label="Nombre">{producto.nombre}</Dato>
          <Dato label="Categoría">
            {producto.categoria?.nombre ?? producto.categoria}
          </Dato>
          <Dato label="Marca">{producto.marca}</Dato>
          <Dato label="Código de barras">{producto.codigoBarras}</Dato>
          <Dato label="Descripción">
            <span className="font-normal text-[#1F2F57]/75">
              {producto.descripcion ?? "—"}
            </span>
          </Dato>
          <Dato label="Unidad">{producto.unidadMedida ?? "Unidad"}</Dato>
          <Dato label="Almacén">
            {producto.almacen?.nombre}
            {producto.almacen?.codigo && (
              <span className="ml-1.5 font-normal text-[#1F2F57]/50">
                {producto.almacen.codigo}
              </span>
            )}
          </Dato>
        </dl>
      </div>
    </section>
  );
}

function Metrica({ label, children, sub, className = "" }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-semibold text-[#1F2F57]/80">{label}</span>
      <span
        className={`text-[26px] font-bold leading-tight text-[#1F2F57] ${className}`}
      >
        {children}
      </span>
      {sub && <span className="text-xs text-[#1F2F57]/60">{sub}</span>}
    </div>
  );
}

function CardPrecio({ producto, unidad }) {
  const ganancia =
    producto.ganancia ?? producto.precioVenta - producto.precioCompra;
  const margen = calcMargen(producto.precioVenta, producto.precioCompra);
  const aplicaIgv = (producto.impuestoPorcentaje ?? 0) > 0;

  return (
    <Card title="Precio y ganancia">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <Metrica label="Precio de venta">{soles(producto.precioVenta)}</Metrica>
        <Metrica label="Costo">{soles(producto.precioCompra)}</Metrica>
        <Metrica
          label={`Ganancia por ${unidadTexto(unidad, 1)}`}
          className="text-[#1F7A4D]"
          sub={
            margen !== null ? `Margen ${margen}% · se calcula solo` : undefined
          }
        >
          {soles(ganancia)}
        </Metrica>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-[#1F2F57]/80">IGV</span>
          <span className="text-base font-bold text-[#1F2F57]">
            {aplicaIgv ? "Incluido en el precio" : "No aplica"}
          </span>
          {aplicaIgv && (
            <span className="text-xs text-[#1F2F57]/60">
              Gravado {producto.impuestoPorcentaje}%
            </span>
          )}
        </div>
      </div>

      {producto.notaPrecioVariante && (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#E1E7F0]/55 px-4 py-3 text-sm text-[#1F2F57]/80">
          <Info size={15} className="shrink-0" />
          {producto.notaPrecioVariante}
        </div>
      )}
    </Card>
  );
}

function celdaCls(variante, minimo) {
  const stock = variante?.stock ?? 0;
  if (!variante || stock === 0) return "bg-[#FDE2E2] text-[#B91C1C]";
  if (variante.enBajoStock || stock <= minimo)
    return "bg-[#FDEBD3] text-[#B45309]";
  return "bg-transparent text-[#1F2F57]";
}

function CardStock({ producto, unidad, onAjustar }) {
  const { tallas, colores, matriz, totalColor } = useMatrizVariantes(
    producto.variantes,
  );
  const total = producto.stockTotal ?? 0;
  const sinVariantes = colores.length === 0;

  return (
    <Card>
      <h2 className="text-lg font-bold text-[#1F2F57]">
        {sinVariantes ? "Stock" : "Stock por talla y color"}
      </h2>
      <p className="mt-1 text-sm text-[#1F2F57]/65">
        Total {total} {unidadTexto(unidad, total)} en{" "}
        {producto.almacen?.nombre ?? "el almacén"}. El stock cambia con
        ingresos, ventas o ajustes, no se escribe a mano.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <div className="relative">
          <select className="h-11 appearance-none rounded-lg border border-[#1F2F57]/20 bg-white pl-4 pr-10 text-sm text-[#1F2F57] outline-none focus:border-[#3960A9]">
            <option>Todos los almacenes</option>
            {producto.almacen && <option>{producto.almacen.nombre}</option>}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#1F2F57]/55"
          />
        </div>
        <button
          type="button"
          onClick={onAjustar}
          className="h-11 rounded-lg border border-[#1F2F57]/20 bg-white px-4 text-sm font-bold text-[#1F2F57] transition hover:bg-[#E1E7F0]/50"
        >
          Ajustar stock
        </button>
      </div>

      {sinVariantes ? (
        <div className="mt-5 rounded-xl bg-[#E1E7F0]/45 p-4 text-sm text-[#1F2F57]">
          <span className="text-2xl font-bold">{total}</span>{" "}
          {unidadTexto(unidad, total)} disponibles
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-[#1F2F57]/10 text-[#1F2F57]/70">
                <th className="py-2.5 pr-3 text-left text-xs font-semibold">
                  Color \ Talla
                </th>
                {tallas.map((t) => (
                  <th
                    key={t}
                    className="px-2 py-2.5 text-center text-xs font-semibold"
                  >
                    {t}
                  </th>
                ))}
                <th className="py-2.5 pl-2 text-center text-xs font-semibold">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {colores.map((color) => (
                <tr
                  key={color}
                  className="border-b border-[#1F2F57]/10 last:border-0"
                >
                  <td className="py-3 pr-3">
                    <span className="flex items-center gap-2 font-bold text-[#1F2F57]">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full border border-[#1F2F57]/40"
                        style={{
                          background:
                            COLORES_HEX[color.toLowerCase()] ?? "#CBD5E1",
                        }}
                      />
                      {color}
                    </span>
                  </td>
                  {tallas.map((t) => {
                    const v = matriz[color]?.[t];
                    return (
                      <td key={t} className="px-2 py-3 text-center">
                        <span
                          title={
                            v ? `${color} ${t}: ${v.stock}` : "Sin variante"
                          }
                          className={`inline-grid h-8 min-w-10 place-items-center rounded-md px-2 font-semibold tabular-nums ${celdaCls(v, producto.stockMinimo ?? 0)}`}
                        >
                          {v ? v.stock : "–"}
                        </span>
                      </td>
                    );
                  })}
                  <td className="py-3 pl-2 text-center font-bold tabular-nums text-[#1F2F57]">
                    {totalColor(color)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex items-center gap-5 text-xs text-[#1F2F57]/65">
            <span className="flex items-center gap-2">
              <span className="h-3 w-5 rounded bg-[#FDE2E2]" /> Agotado
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-5 rounded bg-[#FDEBD3]" /> Bajo el mínimo
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────
// Columna derecha
// ─────────────────────────────────────────────

function CardUltimos30({ producto, unidad }) {
  const vendidos = producto.stats?.unidadesVendidasUltimos30Dias ?? 0;
  const entradas = producto.stats?.unidadesEntradasUltimos30Dias ?? 0;
  const porDia = vendidos / 30;
  const diasRestantes =
    porDia > 0 ? Math.round((producto.stockTotal ?? 0) / porDia) : null;
  const ingresos = vendidos * (producto.precioVenta ?? 0);

  return (
    <Card title="Últimos 30 días">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#E1E7F0]/55 p-3.5">
          <span className="text-xs text-[#1F2F57]/65">Vendidos</span>
          <p className="text-xl font-bold text-[#1F2F57]">
            {vendidos} {unidadTexto(unidad, vendidos)}
          </p>
        </div>
        <div className="rounded-xl bg-[#E1E7F0]/55 p-3.5">
          <span className="text-xs text-[#1F2F57]/65">Ventas aprox.</span>
          <p className="text-xl font-bold text-[#1F2F57]">
            {solesCorto(ingresos)}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm text-[#1F2F57]/65">
        Entraron {entradas} {unidadTexto(unidad, entradas)} en este periodo.
      </p>
      {diasRestantes !== null && (
        <p
          className={`mt-1 text-sm ${diasRestantes <= 14 ? "text-[#B45309]" : "text-[#1F2F57]/65"}`}
        >
          A este ritmo, el stock alcanza para ~{diasRestantes} días.
        </p>
      )}
    </Card>
  );
}

function CardAlertas({
  alertaMinimo,
  setAlertaMinimo,
  visibleEnCaja,
  setVisibleEnCaja,
  unidad,
  porTalla,
}) {
  return (
    <Card title="Alertas y venta">
      <p className="text-sm font-semibold text-[#1F2F57]/80">
        Avisarme cuando queden menos de
      </p>
      <div className="mt-1.5 flex items-center gap-2">
        <input
          type="number"
          min={0}
          value={alertaMinimo ?? ""}
          onChange={(e) => setAlertaMinimo(Number(e.target.value))}
          className="h-9 w-16 rounded-lg border border-[#1F2F57]/20 text-center text-sm font-bold text-[#1F2F57] outline-none focus:border-[#3960A9] focus:ring-1 focus:ring-[#3960A9] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-sm font-bold text-[#1F2F57]">
          {unidadTexto(unidad, alertaMinimo)}
          {porTalla ? " por talla" : ""}
        </span>
      </div>

      <div className="my-4 border-t border-[#1F2F57]/10" />

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[#1F2F57]">Visible en caja</p>
          <p className="text-xs text-[#1F2F57]/60">
            Apagado = no aparece al vender
          </p>
        </div>
        <Switch on={visibleEnCaja} toggle={() => setVisibleEnCaja((v) => !v)} />
      </div>
    </Card>
  );
}

function CardMovimientos({ movimientos = [], verTodosHref }) {
  return (
    <Card
      title="Movimientos"
      action={
        verTodosHref && (
          <Link
            href={verTodosHref}
            className="text-sm font-semibold text-[#3960A9] underline-offset-2 hover:underline"
          >
            Ver todos
          </Link>
        )
      }
    >
      {movimientos.length === 0 ? (
        <p className="py-4 text-center text-sm text-[#1F2F57]/55">
          Sin movimientos todavía.
        </p>
      ) : (
        <ul className="divide-y divide-[#1F2F57]/10">
          {movimientos.map((m, i) => {
            const cfg = MOV[m.tipoMovimiento] ?? MOV.AJUSTE;
            const cantidad =
              cfg.signo === 0 ? m.cantidad : Math.abs(m.cantidad) * cfg.signo;
            const cls =
              cfg.signo === 0
                ? cfg.cls
                : cantidad < 0
                  ? MOV.SALIDA.cls
                  : MOV.ENTRADA.cls;
            return (
              <li key={m.id ?? i} className="flex items-center gap-3 py-3">
                <span
                  className={`inline-grid h-7 min-w-12 place-items-center rounded-full px-2 text-xs font-bold tabular-nums ${cls}`}
                >
                  {cantidad > 0 ? `+${cantidad}` : cantidad}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm text-[#1F2F57]">
                    {cfg.label}
                    {m.concepto ? ` · ${m.concepto}` : ""}
                  </p>
                  <p className="truncate text-xs text-[#1F2F57]/55">
                    {tiempoRelativo(m.fechaMovimiento)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────

function Skeleton() {
  const b = "animate-pulse rounded-2xl bg-[#1F2F57]/[.07]";
  return (
    <div className="mx-auto flex w-full max-w-[1312px] flex-col gap-5 px-6 py-6">
      <div className={`${b} h-4 w-24 rounded-md`} />
      <div className={`${b} h-8 w-80 rounded-lg`} />
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <div className={`${b} h-80`} />
          <div className={`${b} h-52`} />
          <div className={`${b} h-72`} />
        </div>
        <div className="flex flex-col gap-5">
          <div className={`${b} h-44`} />
          <div className={`${b} h-44`} />
          <div className={`${b} h-72`} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Página
// ─────────────────────────────────────────────

export default function PageProductoDetalle({
  producto,
  loading,
  alertaMinimo,
  setAlertaMinimo,
  visibleEnCaja,
  setVisibleEnCaja,
  handleReponer,
  handleEditar,
  handleAjustar,
}) {
  if (loading)
    return (
      <div className="min-h-full bg-[#E1E7F0]">
        <Skeleton />
      </div>
    );
  if (!producto) return null;

  const unidad = producto.unidadMedida ?? "Unidad";
  const estado = estadoStock(producto);
  const tieneVariantes = (producto.variantes?.length ?? 0) > 0;

  return (
    <div className="min-h-full bg-[#E1E7F0]">
      <div className="mx-auto flex w-full max-w-[1312px] flex-col gap-5 px-6 py-6">
        {/* Encabezado */}
        <div className="flex flex-col gap-4">
          <Link
            href="/dashboard/inventario/productos"
            className="flex w-fit items-center gap-1 text-sm font-semibold text-[#1F2F57] underline underline-offset-2 hover:text-[#3960A9]"
          >
            <ArrowLeft size={14} strokeWidth={2.25} />
            Productos
          </Link>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-[#1F2F57]">
                  {producto.nombre}
                </h1>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${estado.cls}`}
                >
                  {estado.label}
                </span>
                {visibleEnCaja && (
                  <span className="rounded-full bg-[#1F2F57]/[.06] px-2.5 py-1 text-xs font-bold text-[#1F2F57]/80">
                    Activo en venta
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm text-[#1F2F57]/65">
                {[
                  producto.codigo,
                  producto.categoria?.nombre ?? producto.categoria,
                  producto.almacen?.nombre,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handleReponer}
                className="h-11 rounded-lg border border-[#1F2F57]/15 bg-white px-5 text-sm font-bold text-[#1F2F57] transition hover:bg-[#F5F7FB]"
              >
                Reponer stock
              </button>
              <button
                type="button"
                onClick={handleEditar}
                className="flex h-11 items-center gap-2 rounded-lg bg-[#1F2F57] px-5 text-sm font-bold text-white transition hover:bg-[#3960A9]"
              >
                <Pencil size={15} strokeWidth={2.25} />
                Editar producto
              </button>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="grid items-start gap-5 lg:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-5 lg:col-span-2">
            <CardInfoGeneral producto={producto} />
            <CardPrecio producto={producto} unidad={unidad} />
            <CardStock
              producto={producto}
              unidad={unidad}
              onAjustar={handleAjustar}
            />
          </div>

          <div className="flex flex-col gap-5 lg:sticky lg:top-6">
            <CardUltimos30 producto={producto} unidad={unidad} />
            <CardAlertas
              alertaMinimo={alertaMinimo ?? producto.stockMinimo}
              setAlertaMinimo={setAlertaMinimo}
              visibleEnCaja={visibleEnCaja}
              setVisibleEnCaja={setVisibleEnCaja}
              unidad={unidad}
              porTalla={tieneVariantes}
            />
            <CardMovimientos
              movimientos={producto.ultimosMovimientos}
              verTodosHref={`/dashboard/inventario/productos/${producto.id}/movimientos`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
