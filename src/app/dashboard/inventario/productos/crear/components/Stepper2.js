"use client";
import Title2 from "@/components/Titles/Title2";
import { Calendar, File, Icon, Plus, RefreshCcw, Warehouse } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import SeccionVariantes from "./SeccionVariantes";
import PanelProductos from "@/elements/PanelProductos";
import Field from "@/elements/Field";
import ConfigAvanzada from "@/elements/ConfigAvanzada";
import Switch from "@/elements/Switch";
import { getCategorias } from "@/Connections/productos";
import SearchableSelect from "../../../components/SearchableSelect";
import { IconInput } from "@/components/Inputs/IconInput";
import SwitcherLoader from "@/components/Navigation/SwitcherLoader";
function Info({ icon, label, value, sub }) {
  return (
    <div>
      <span
        className="text-[10px] uppercase tracking-wide"
        style={{ color: "rgba(31,47,87,0.45)" }}
      >
        {label}
      </span>
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
export default function Stepper2({ almacenSeleccionado }) {
  const [reference, setReference] = useState("LOTE-20260922-001");
  const [form, setForm] = useState(
    initial(
      `PROD-${String(Math.floor(Math.random() * 999999) + 1).padStart(6, "0")}`,
    ),
  );
  const [productos, setProductos] = useState([]);
  const [shake, setShake] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getCategorias();
        setCategorias(response?.data?.data || []);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const priceRef = useRef(null);

  const stock = form.tiene_variantes
    ? form.variantes.reduce((a, v) => a + (Number(v.stock) || 0), 0)
    : Number(form.stock_inicial) || 0;
  const missingPrice = stock > 0 && !form.precio_venta;
  const change = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function deleteProducto(id) {
    setProductos((prev) => prev.filter((p) => p.id !== id));
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

    setForm(
      initial(
        `PROD-${String(Math.floor(Math.random() * 999999) + 1).padStart(6, "0")}`,
      ),
    );
  }

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-6 lg:px-8">
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(360px,2fr)]">
        <div className="space-y-5">
          <section className="rounded-xl border border-azulMarino/10 bg-white p-5 shadow-[0_2px_8px_rgba(31,47,87,.05)]">
            <Title2>Datos del lote</Title2>
            <div className="grid gap-4 md:grid-cols-[1.15fr_.8fr_1fr]">
              <Info
                icon={<Warehouse />}
                label="Almacén"
                value={almacenSeleccionado?.nombre ?? "-"}
                sub={almacenSeleccionado?.codigo}
              />
              <Info
                icon={<Calendar />}
                label={"Fecha de Registro"}
                value={new Date().toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              />
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold">
                  Referencia del lote
                </span>
                <IconInput
                  icon={File}
                  value={reference}
                  placeholder={"LOTE 2026-001"}
                  onChange={(e) => setReference(e.target.value)}
                  onBlur={() =>
                    !reference.trim() && setReference("LOTE-20260922-001")
                  }
                />
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
                <IconInput
                  value={form.nombre}
                  onChange={(e) => change("nombre", e.target.value)}
                  placeholder="Ej: Zapatilla Nike Air Force"
                />
              </Field>
              <div className="mt-4 grid grid-cols-[minmax(0,7fr)_minmax(130px,3fr)] gap-3">
                <Field label="Código *">
                  <IconInput
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
                <Field label={"Categoria *"}>
                  <SwitcherLoader loading={loading}>
                    <SearchableSelect
                      value={form?.categoria}
                      onChange={(v) => set("categoria", v)}
                      options={categorias}
                    />
                  </SwitcherLoader>
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
                  <IconInput
                    type="number"
                    min="0"
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
                    {["Unidad", "Par", "Kg", "Litro", "Docena", "Caja"].map(
                      (x) => (
                        <option key={x}>{x}</option>
                      ),
                    )}
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
