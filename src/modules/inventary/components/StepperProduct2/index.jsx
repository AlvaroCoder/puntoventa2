import Title2 from '@/components/Titles/Title2';
import Field from '@/shared/components/Field';
import InputMoney from '@/shared/components/InputMoney';
import SearchableSelect from '@/shared/components/SearchableSelect';
import SwitcherLoader from '@/shared/components/SwitcherLoader';
import { Calendar, Plus, RefreshCcw, Warehouse, File } from 'lucide-react';
import React from 'react'
import { useStepper2 } from './useStepper2';
import Info from '@/shared/components/Info';
import { IconInput } from '@/shared/components/IconInput';
import SeccionVariantes from '../SeccionVariantesProductos';
import ConfigAvanzada from '../ConfigAvanzada';
import PanelProductos from '../PanelProductos';
import Switch from '../Switch';

export default function StepperProduct2({
    almacenSeleccionado,
    handlePayload
}) {
    const {
      reference,
      setReference,
      form,
      change,
      set,
      productos,
      deleteProducto,
      categorias,
      loading,
      shake,
      priceRef,
      stock,
      missingPrice,
      submit,
      regenerarCodigo,
    } = useStepper2({ almacenSeleccionado, handlePayload });
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
                    regenerarCodigo()
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
                    <InputMoney
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
                  <InputMoney
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
