import React from 'react'
import AlmacenCard from './components/AlmacenCard';
import Field from '@/shared/components/Field';
import { ChevronRight, Plus, RefreshCcw, Warehouse } from 'lucide-react';
import InputFillable from '@/shared/components/InputFillable';
import SwitcherLoader from '@/components/Navigation/SwitcherLoader';
import ButtonLinkSimple from '@/shared/components/ButtonLinkSimple';
import { generateCodigo } from './components/StepperProduct2/stepper2.helpers';
import { BASE_INPUT_STYLE } from '@/shared/constants/Inventary';
import AlmacenCardEditable from './components/AlmacenCardEditable';

export default function PageCreateTienda({
    loading,
    form,
    handleNombreBlur,
    setNombreFocused,
    set,
    handleSubmit,
    nombreFocused,
    almacenes,
    addAlmacen,
    onFocusInput,
    onBlurInput,
    updateAlmacen,
    removeAlmacen
}) {
  return (
    <div className="min-h-screen bg-[#E1E7F0]">
      <div
        className="bg-white px-8 py-4"
        style={{ borderBottom: "0.5px solid rgba(31,47,87,0.1)" }}
      >
        <div className="flex items-center justify-between gap-4">
          <nav
            className="flex items-center gap-1.5 text-xs"
            style={{ color: "rgba(31,47,87,0.45)" }}
          >
            <ButtonLinkSimple href={"/dashboard/inventario"}>
              Inventario
            </ButtonLinkSimple>
            <ChevronRight size={12} />
            <ButtonLinkSimple href={"/dashboard/inventario/tienda"}>
              Tiendas
            </ButtonLinkSimple>
            <ChevronRight size={12} />
            <span className="font-semibold" style={{ color: "#1F2F57" }}>
              {form.nombre || "Nueva tienda"}
            </span>
          </nav>

          <SwitcherLoader loading={loading}>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.push("/dashboard/inventario/tienda")}
                className="px-4 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-gray-50"
                style={{
                  border: "0.5px solid rgba(31,47,87,0.2)",
                  color: "#1F2F57",
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "#1F2F57" }}
              >
                Guardar
              </button>
            </div>
          </SwitcherLoader>
        </div>
      </div>

      <div className="px-8 py-6 max-w-4xl mx-auto w-full flex flex-col gap-4">
        <div
          className="bg-white rounded-xl overflow-visible"
          style={{ border: "0.5px solid rgba(31,47,87,0.12)" }}
        >
          <div className="px-8 py-7 flex flex-col gap-7">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "rgba(31,47,87,0.4)" }}
              >
                Tienda
              </p>
              <InputFillable
                value={form.nombre}
                keyValue="nombre"
                set={set}
                onFocus={() => setNombreFocused(true)}
                onBlur={handleNombreBlur}
                placeholder="Nombre de la tienda"
                nombreFocused={nombreFocused}
              />
            </div>

            <div className="flex flex-col gap-6">
              <Field
                label="Código"
                required
                hint="Identificador único de la tienda"
              >
                <div className="flex items-center gap-2">
                  <input
                    value={form.codigo}
                    onChange={(e) =>
                      set("codigo", e.target.value.toUpperCase())
                    }
                    placeholder="Ej: TDA-0001"
                    className="h-10 px-3.5 rounded-xl text-sm outline-none transition-all"
                    style={{ ...BASE_INPUT_STYLE, width: "220px" }}
                    onFocus={onFocusInput}
                    onBlur={onBlurInput}
                  />
                  <button
                    type="button"
                    onClick={() => set("codigo", generateCodigo(form.nombre))}
                    title="Generar código automáticamente"
                    className="h-10 w-10 rounded-xl flex items-center justify-center transition-colors hover:bg-[#E1E7F0]"
                    style={{ border: "1px solid rgba(31,47,87,0.18)" }}
                  >
                    <RefreshCcw
                      size={13}
                      style={{ color: "rgba(31,47,87,0.45)" }}
                    />
                  </button>
                </div>
              </Field>

              <Field
                label="Responsable"
                required
                hint="Persona encargada de la tienda"
              >
                <input
                  value={form.responsable}
                  onChange={(e) => set("responsable", e.target.value)}
                  placeholder="Nombre del encargado"
                  className="h-10 px-3.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    ...BASE_INPUT_STYLE,
                    width: "100%",
                    maxWidth: "380px",
                  }}
                  onFocus={onFocusInput}
                  onBlur={onBlurInput}
                />
              </Field>

              <Field label="Teléfono" hint="Número de contacto de la tienda">
                <input
                  value={form.telefono}
                  onChange={(e) => set("telefono", e.target.value)}
                  placeholder="Ej: 987 654 321"
                  className="h-10 px-3.5 rounded-xl text-sm outline-none transition-all"
                  style={{ ...BASE_INPUT_STYLE, width: "220px" }}
                  onFocus={onFocusInput}
                  onBlur={onBlurInput}
                />
              </Field>

              <Field label="Dirección" hint="Ubicación física de la tienda">
                <input
                  value={form.direccion}
                  onChange={(e) => set("direccion", e.target.value)}
                  placeholder="Ej: Av. Ejemplo 123, Lima"
                  className="h-10 px-3.5 rounded-xl text-sm outline-none transition-all w-full"
                  style={BASE_INPUT_STYLE}
                  onFocus={onFocusInput}
                  onBlur={onBlurInput}
                />
              </Field>

              <Field
                label="Fecha de apertura"
                hint="Fecha en que inició operaciones"
              >
                <input
                  type="date"
                  value={form.fecha_apertura}
                  onChange={(e) => set("fecha_apertura", e.target.value)}
                  className="h-10 px-3.5 rounded-xl text-sm outline-none transition-all"
                  style={{ ...BASE_INPUT_STYLE, width: "200px" }}
                  onFocus={onFocusInput}
                  onBlur={onBlurInput}
                />
              </Field>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-xl overflow-visible"
          style={{ border: "0.5px solid rgba(31,47,87,0.12)" }}
        >
          <div className="px-8 py-7 flex flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#1F2F57" }}
                >
                  Almacenes
                  <span
                    className="ml-2 text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(31,47,87,0.07)",
                      color: "rgba(31,47,87,0.5)",
                    }}
                  >
                    Opcional
                  </span>
                </p>
                <p
                  className="text-[11px] mt-0.5"
                  style={{ color: "rgba(31,47,87,0.4)" }}
                >
                  Agrega los almacenes o espacios de esta tienda. Podrás añadir
                  más después.
                </p>
              </div>
              <button
                type="button"
                onClick={addAlmacen}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors hover:opacity-80 shrink-0"
                style={{ background: "rgba(57,96,169,0.1)", color: "#3960A9" }}
              >
                <Plus size={13} />
                Agregar almacén
              </button>
            </div>

            {almacenes.length === 0 && (
              <div
                className="rounded-xl flex flex-col items-center gap-2 py-8 text-center"
                style={{
                  border: "1px dashed rgba(31,47,87,0.15)",
                  background: "rgba(31,47,87,0.02)",
                }}
              >
                <Warehouse size={24} style={{ color: "rgba(31,47,87,0.2)" }} />
                <p
                  className="text-xs font-medium"
                  style={{ color: "rgba(31,47,87,0.35)" }}
                >
                  Sin almacenes añadidos
                </p>
                <button
                  type="button"
                  onClick={addAlmacen}
                  className="text-xs font-semibold mt-1 transition-opacity hover:opacity-70"
                  style={{ color: "#3960A9" }}
                >
                  + Agregar el primero
                </button>
              </div>
            )}

            {almacenes.map((almacen, i) => (
              <AlmacenCardEditable
                key={almacen._id}
                almacen={almacen}
                index={i}
                onChange={updateAlmacen}
                    onDelete={removeAlmacen}
                    onBlurInput={onBlurInput}
                    onFocusInput={onFocusInput}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};