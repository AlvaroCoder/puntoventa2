'use client'
import Title2 from '@/components/Titles/Title2'
import { AlertTriangle, Box, Calendar, ChevronDown, File, Plus, RefreshCcw, Warehouse, X } from 'lucide-react';
import React, {useEffect, useRef, useState} from 'react'
import CardProducto from './CardProducto';
function Info({ icon, label, value, sub }) {
    
  return (
    <div>
      <span className="text-[10px] uppercase tracking-wide" style={{ color: 'rgba(31,47,87,0.45)' }}>{label}</span>
      <div className="flex min-h-11 items-center gap-3 rounded-lg bg-[#E1E7F0]/55 px-3">
        <span className="text-azulClaro [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
        <div>
          <div className="text-[15px] font-bold">{value}</div>
          {sub && <div className="text-xs text-[#1F2F57]/55">{sub}</div>}
        </div>
      </div>
    </div>
  );
}
const initial = (code) => ({
  nombre: "",
  codigo: code,
  categoria: "",
  stock_inicial: 0,
  unidad: "Unidad",
  precio_venta: "",
  precio_compra: "",
  tiene_variantes: false,
  variantes: [],
  barras: "",
  descripcion: "",
  igv: true,
  temporada: "Todo el año",
  genero: "Unisex",
  stock_minimo: 0,
});
export default function Stepper2({
    almacenSeleccionado
}) {
    const [reference, setReference] = useState("LOTE-20260922-001");
    const [form, setForm] = useState(initial(`PROD-${String(Math.floor(Math.random() * 999999) + 1).padStart(6, "0")}`));
    const [productos, setProductos] = useState([]);
    const [shake, setShake] = useState(false);

    const priceRef = useRef(null);

  const stock = form.tiene_variantes
    ? form.variantes.reduce((a, v) => a + (Number(v.stock) || 0), 0)
    : Number(form.stock_inicial) || 0;
  const missingPrice = stock > 0 && !form.precio_venta;
  const change = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function deleteProducto(id) {
    setProductos(prev => prev.filter(p => p.id !== id));
  }

  function submit() {
    const producto = { ...form, id: Date.now(), stock_inicial: stock };
    const nuevosProductos = [...productos, producto];
    setProductos(nuevosProductos);

    const payload = {
      referencia_lote: reference,
      almacen_id: almacenSeleccionado?.id,
      almacen_nombre: almacenSeleccionado?.nombre,
      fecha_registro: new Date().toISOString(),
      productos: nuevosProductos,
    };
    console.log("JSON a enviar:", JSON.stringify(payload, null, 2));

    setForm(initial(`PROD-${String(Math.floor(Math.random() * 999999) + 1).padStart(6, "0")}`));
  }
  return (
    <section className='mx-auto max-w-[1440px] px-5 py-6 lg:px-8'>
          <div className='grid items-start gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(360px,2fr)]'>
              <div className='space-y-5'>
                  <section className='rounded-xl border border-azulMarino/10 bg-white p-5 shadow-[0_2px_8px_rgba(31,47,87,.05)]'>
                      <Title2>Datos del lote</Title2>
                      <div className="grid gap-4 md:grid-cols-[1.15fr_.8fr_1fr]">
                            <Info
                              icon={<Warehouse />}
                              label="Almacén"
                              value={almacenSeleccionado?.nombre ?? '-'}
                              sub={ almacenSeleccionado?.codigo}
                          />
                          <Info
                              icon={<Calendar />}
                              label={"Fecha de Registro"}
                              value={new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                          />
                    <label className="block">
                        <span className="mb-1.5 block text-sm font-bold">
                            Referencia del lote
                        </span>
                        <div className="relative">
                        <File
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3960A9]"
                        />
                        <input
                            className="focus-ring h-11 w-full rounded-lg border border-[#1F2F57]/20 pl-10 pr-3 text-[15px]"
                            value={reference}
                            placeholder="LOTE-2024-001"
                            onChange={(e) => setReference(e.target.value)}
                            onBlur={() =>
                                !reference.trim() && setReference("LOTE-20260922-001")
                            }
                        />
                        </div>
                    </label>
                    </div>

                  </section>
                <section className="rounded-xl border border-[#1F2F57]/10 bg-white p-5 shadow-[0_2px_8px_rgba(31,47,87,.05)]">
      <h2 className="text-lg font-extrabold">Agregar producto</h2>
      <fieldset className="mt-5">
        <legend className="mb-4 w-full border-b border-[#1F2F57]/10 pb-2 text-sm font-extrabold uppercase tracking-wide text-[#3960A9]">
          Información básica
        </legend>
        <Field label="Nombre del producto *">
          <input
            className="input"
            value={form.nombre}
            onChange={(e) => change("nombre", e.target.value)}
            placeholder="Ej: Zapatilla Nike Air Force"
          />
        </Field>
        <div className="mt-4 grid grid-cols-[minmax(0,7fr)_minmax(130px,3fr)] gap-3">
          <Field label="Código *">
            <input
              className="input"
              value={form.codigo}
              onChange={(e) => change("codigo", e.target.value)}
            />
          </Field>
          <button
            type="button"
            className="mt-[26px] flex h-11 items-center justify-center gap-2 rounded-lg border border-[#3960A9] font-bold text-[#3960A9] hover:bg-[#3960A9] hover:text-white"
            onClick={() =>
              change(
                "codigo",
                `PROD-${String(Math.floor(Math.random() * 999999) + 1).padStart(6, "0")}`,
              )
            }
          >
            <RefreshCcw size={18} />
            Regenerar
          </button>
        </div>
        <div className="mt-4">
          <Field label="Categoría *">
            <select
              className="input"
              value={form.categoria}
              onChange={(e) => change("categoria", e.target.value)}
            >
              <option value="">Selecciona una categoría</option>
              <optgroup label="Calzado">
                <option>Calzado / Zapatillas Deportivas</option>
                <option>Calzado / Zapatos de Vestir</option>
              </optgroup>
              <optgroup label="Ropa">
                <option>Ropa / Polos y Camisetas</option>
                <option>Ropa / Pantalones y Jeans</option>
              </optgroup>
              <option value="nueva">+ Nueva categoría</option>
            </select>
          </Field>
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="mb-4 w-full border-b border-[#1F2F57]/10 pb-2 text-sm font-extrabold uppercase tracking-wide text-[#3960A9]">
          Stock y precio
        </legend>
        <div className="grid gap-4 md:grid-cols-[2fr_3fr]">
          <Field
            label="Stock inicial"
            hint={
              form.tiene_variantes
                ? "El stock se distribuye entre las variantes"
                : undefined
            }
          >
            <input
              type="number"
              min="0"
              className="input disabled:cursor-not-allowed disabled:bg-[#E1E7F0]"
              disabled={form.tiene_variantes}
              value={form.tiene_variantes ? stock : form.stock_inicial}
              onChange={(e) => change("stock_inicial", e.target.value)}
            />
          </Field>
          <Field label="Unidad de medida">
            <select
              className="input"
              value={form.unidad}
              onChange={(e) => change("unidad", e.target.value)}
            >
              {["Unidad", "Par", "Kg", "Litro", "Docena", "Caja"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Precio de venta *">
            <div ref={priceRef} className={shake ? "animate-shake" : ""}>
              <MoneyInput
                value={form.precio_venta}
                onChange={(v) => change("precio_venta", v)}
                warning={missingPrice}
              />
              {missingPrice && (
                <p className="mt-1.5 text-sm font-semibold text-[#E8A020]">
                  ⚠ Requerido cuando el stock inicial es mayor a 0
                </p>
              )}
            </div>
          </Field>
          <Field label="Precio de compra (opcional)">
            <MoneyInput
              value={form.precio_compra}
              onChange={(v) => change("precio_compra", v)}
            />
          </Field>
        </div>
      </fieldset>
      <div className="mt-6 flex items-center justify-between gap-4 rounded-lg bg-[#E1E7F0]/55 p-4">
        <div>
          <div className="font-bold">
            ¿Este producto tiene tallas o colores?
          </div>
          <div className="text-sm text-[#1F2F57]/60">
            Actívalo para distribuir el stock por variante.
          </div>
        </div>
        <Switch
          on={form.tiene_variantes}
          toggle={() => change("tiene_variantes", !form.tiene_variantes)}
        />
      </div>
      {form.tiene_variantes && (
        <SeccionVariantes
          variantes={form.variantes}
          setVariantes={(v) => change("variantes", v)}
        />
      )}
      <ConfigAvanzada form={form} change={change} />
      <button
        onClick={submit}
        disabled={!form.nombre.trim() || !form.codigo.trim()}
        title={missingPrice ? "Completa el precio de venta primero" : ""}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1F2F57] text-base font-bold text-white transition hover:bg-[#3960A9] disabled:cursor-not-allowed disabled:opacity-45"
      >
        <Plus size={20} />
        Agregar al lote
      </button>
                  </section>
                  
              </div>
              <PanelProductos products={productos} onDelete={deleteProducto} />
          </div>
    </section>
  )
};

function PanelProductos({ products, onDelete }) {
  const units = products.reduce(
    (a, p) => a + (Number(p.stock_inicial) || 0),
    0,
  );
  const zeros = products.filter((p) => Number(p.stock_inicial) === 0).length;
  return (
    <aside className="sticky top-4 flex max-h-[calc(100vh-32px)] min-h-[620px] flex-col overflow-hidden rounded-xl border border-[#1F2F57]/10 bg-white shadow-[0_3px_12px_rgba(31,47,87,.07)]">
      <div className="border-b border-[#1F2F57]/10 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">Productos del lote</h2>
          <span className="rounded-full bg-[#3960A9]/10 px-3 py-1 text-sm font-bold text-[#3960A9]">
            {products.length} productos
          </span>
        </div>
        <p className="mt-1 text-sm text-[#1F2F57]/60">
          {units} unidades en total
        </p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto bg-[#E1E7F0]/32 p-4">
        {products.length ? (
          products.map((p) => (
            <CardProducto key={p.id} product={p} onDelete={onDelete} />
          ))
        ) : (
          <div className="grid h-full min-h-80 place-items-center text-center">
            <div>
              <Box
                size={58}
                stroke={1.2}
                className="mx-auto text-[#3960A9]/55"
              />
              <h3 className="mt-3 font-extrabold">
                Aún no has agregado productos
              </h3>
              <p className="mx-auto mt-1 max-w-xs text-sm text-[#1F2F57]/55">
                Completa el formulario y haz clic en Agregar al lote.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-[#1F2F57]/10 bg-white p-4">
        <div className="flex items-center justify-between font-bold">
          <span>{products.length} productos</span>
          <span>{units} unidades</span>
        </div>
        {zeros > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#E8A020]/12 px-3 py-2 text-sm font-bold text-[#E8A020]">
            <AlertTriangle size={18} />
            {zeros} {zeros === 1 ? "producto" : "productos"} sin stock asignado
          </div>
        )}
      </div>
    </aside>
  );
}


function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-sm font-bold">
        {label}
        {hint && (
          <span
            title={hint}
            className="rounded-full bg-[#E1E7F0] px-2 py-0.5 text-xs font-normal"
          >
            ?
          </span>
        )}
      </span>
      {children}
    </label>
  );
}
function MoneyInput({ value, onChange, warning }) {
  return (
    <div
      className={`flex h-11 overflow-hidden rounded-lg border bg-white ${warning ? "border-2 border-[#E8A020]" : "border-[#1F2F57]/20"}`}
    >
      <span className="grid w-11 place-items-center bg-[#E1E7F0]/65 font-bold">
        S/
      </span>
      <input
        type="number"
        min="0"
        step="0.01"
        className="min-w-0 flex-1 px-3 outline-none"
        placeholder="0.00"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
export function Switch({ on, toggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={toggle}
      className={`relative h-7 w-12 rounded-full transition-colors ${on ? "bg-[#1EB3B2]" : "bg-[#1F2F57]/25"}`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${on ? "translate-x-1" : "-translate-x-5"}`}
      />
    </button>
  );
}
function SeccionVariantes({ variantes, setVariantes }) {
  const update = (i, k, v) =>
    setVariantes(variantes.map((x, n) => (n === i ? { ...x, [k]: v } : x)));
  const total = variantes.reduce((a, v) => a + (Number(v.stock) || 0), 0);
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-[#1F2F57]/15">
      <div className="flex items-center justify-between bg-[#E1E7F0]/60 px-4 py-3">
        <div className="font-bold">Variantes</div>
        <div className="text-sm font-semibold text-[#3960A9]">
          Stock total: {total}
        </div>
      </div>
      {variantes.length > 0 && (
        <div className="grid grid-cols-[1fr_1.3fr_.8fr_38px] gap-2 border-b border-[#1F2F57]/10 px-3 py-2 text-xs font-bold uppercase text-[#1F2F57]/55">
          <span>Talla</span>
          <span>Color</span>
          <span>Stock</span>
          <span />
        </div>
      )}
      <div className="space-y-2 p-3">
        {variantes.map((v, i) => (
          <div key={i} className="grid grid-cols-[1fr_1.3fr_.8fr_38px] gap-2">
            <input
              className="input"
              value={v.talla}
              placeholder="38"
              onChange={(e) => update(i, "talla", e.target.value)}
            />
            <input
              className="input"
              value={v.color}
              placeholder="Negro"
              onChange={(e) => update(i, "color", e.target.value)}
            />
            <input
              className="input"
              type="number"
              min="0"
              value={v.stock}
              onChange={(e) => update(i, "stock", e.target.value)}
            />
            <button
              aria-label="Eliminar variante"
              className="grid h-11 place-items-center rounded-lg text-[#C0392B] hover:bg-[#C0392B]/10"
              onClick={() => setVariantes(variantes.filter((_, n) => n !== i))}
            >
              <X size={18} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="flex items-center gap-2 py-2 text-sm font-bold text-[#3960A9]"
          onClick={() =>
            setVariantes([...variantes, { talla: "", color: "", stock: 0 }])
          }
        >
          <Plus size={17} />
          Agregar variante
        </button>
        <p className="text-xs text-[#1F2F57]/55">
          El stock total debe coincidir con el stock inicial.
        </p>
      </div>
    </div>
  );
}

function ConfigAvanzada({ form, change }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-5 border-t border-[#1F2F57]/10 pt-2">
      <button
        type="button"
        className="flex w-full items-center justify-between py-3 font-bold text-[#3960A9]"
        onClick={() => setOpen(!open)}
      >
        <span>+ Configuración avanzada</span>
        <ChevronDown
          size={19}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="grid gap-4 rounded-lg bg-[#E1E7F0]/40 p-4 md:grid-cols-2">
          <Field label="Código de barras">
            <input
              className="input"
              placeholder="Se completará después con app móvil"
              value={form.barras}
              onChange={(e) => change("barras", e.target.value)}
            />
          </Field>
          <Field label="Descripción">
            <textarea
              rows="2"
              className="min-h-20 w-full rounded-lg border border-[#1F2F57]/20 bg-white p-3 outline-none focus:border-[#3960A9]"
              value={form.descripcion}
              onChange={(e) => change("descripcion", e.target.value)}
            />
          </Field>
          <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
            <span className="text-sm font-bold">Aplica IGV</span>
            <Switch on={form.igv} toggle={() => change("igv", !form.igv)} />
          </div>
          <Field label="Temporada">
            <select
              className="input"
              value={form.temporada}
              onChange={(e) => change("temporada", e.target.value)}
            >
              {["Todo el año", "Verano", "Invierno", "Escolar", "Navidad"].map(
                (x) => (
                  <option key={x}>{x}</option>
                ),
              )}
            </select>
          </Field>
          <Field label="Género">
            <select
              className="input"
              value={form.genero}
              onChange={(e) => change("genero", e.target.value)}
            >
              {["Masculino", "Femenino", "Unisex", "Niño", "Niña"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
          <Field label="Stock mínimo">
            <input
              className="input"
              type="number"
              min="0"
              value={form.stock_minimo}
              onChange={(e) => change("stock_minimo", e.target.value)}
            />
          </Field>
          <p className="md:col-span-2 text-sm text-[#1F2F57]/60">
            Puedes completar estos campos desde la ficha del producto en
            cualquier momento.
          </p>
        </div>
      )}
    </div>
  );
}

