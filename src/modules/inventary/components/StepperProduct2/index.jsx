"use client";

import React, { useState } from "react";
import {
  Calendar,
  Plus,
  RefreshCcw,
  Warehouse,
  FileText,
  Package,
  Tag,
  BarChart3,
  Layers3,
  ChevronDown,
  ShoppingBag,
} from "lucide-react";

import Field from "@/shared/components/Field";
import InputMoney from "@/shared/components/InputMoney";
import SearchableSelect from "@/shared/components/Selectables/SearchableSelect";
import SwitcherLoader from "@/shared/components/SwitcherLoader";
import Info from "@/shared/components/Info";
import { IconInput } from "@/shared/components/IconInput";

import { useStepper2 } from "./useStepper2";
import SeccionVariantes from "../SeccionVariantesProductos";
import ConfigAvanzada from "../ConfigAvanzada";
import PanelProductos from "../PanelProductos";
import ImageUpload from "../ImageUpload";
import FieldLegend from "../FieldLegend";
import Title2 from "@/shared/components/Title2";
import CustomSelect from "@/shared/components/Selectables/CustomSelect";

export default function StepperProduct2({
  almacenSeleccionado,
  handlePayload,
  onConfirmar,
}) {
  const [imagen, setImagen] = useState(null);

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
    confirmar,
    regenerarCodigo,
  } = useStepper2({
    almacenSeleccionado,
    handlePayload,
  });

  const ordinal = productos.length + 1;

  const fechaRegistro = new Date().toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <section
      className="
      mx-auto w-full max-w-[1600px]
      px-4 py-5
      sm:px-6 sm:py-6
      xl:px-8
    "
    >
      <div className="mb-6">
        <div
          className="
          flex flex-wrap items-center
          justify-between gap-3
        "
        >
          <div>
            <div
              className="
              mb-1 flex items-center gap-2
              text-[11px] font-semibold
              text-[#3960A9]
            "
            >
              <ShoppingBag size={13} />
              GESTIÓN DE INVENTARIO
            </div>

            <Title2>Registro de productos</Title2>

            <p
              className="
              mt-1 text-[12px]
              leading-relaxed
              text-[#1F2F57]/50
            "
            >
              Completa la información y agrega los productos a tu lote de
              registro.
            </p>
          </div>

          <div
            className="
            flex items-center gap-2
            rounded-[10px]
            border border-[#3960A9]/[0.12]
            bg-[#3960A9]/[0.05]
            px-3.5 py-2.5
          "
          >
            <Package size={17} strokeWidth={1.8} className="text-[#3960A9]" />

            <div className="flex flex-col">
              <span
                className="
                text-[10px] font-medium
                text-[#1F2F57]/50
              "
              >
                Productos en lote
              </span>

              <span
                className="
                text-[15px] font-extrabold
                leading-tight text-[#3960A9]
              "
              >
                {productos.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="
        mb-5 
         border-[#1F2F57]/[0.09]
        bg-white
        px-4 py-2
        shadow-[0_2px_10px_rgba(31,47,87,0.035)]
        sm:px-5
        rounded-lg

      "
      >
        <div
          className="
          flex flex-row items-center justify-between gap-4 
        "
        >
          <div className="flex-1 min-w-0">
            <Info
              icon={<Warehouse />}
              label="Almacén"
              value={almacenSeleccionado?.nombre ?? "-"}
              sub={almacenSeleccionado?.codigo}
            />
          </div>

          <div
            className="
            flex-1
            min-w-0
            sm:border-l
            sm:border-[#1F2F57]/[0.08]
            sm:pl-5
          "
          >
            <Info
              icon={<Calendar />}
              label="Fecha de registro"
              value={fechaRegistro}
            />
          </div>

          <div
            className="
            flex-1
            min-w-0
            sm:col-span-2
            xl:col-span-1
            xl:border-l
            xl:border-[#1F2F57]/[0.08]
            xl:pl-5
          "
          >
            <Info label="Referencia del lote" />
            <IconInput
              icon={FileText}
              value={reference}
              placeholder="LOTE 2026-001"
              onChange={(e) => setReference(e.target.value)}
              onBlur={() => {
                if (!reference.trim()) {
                  setReference("LOTE-20260922-001");
                }
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="grid w-full items-start gap-5"
        style={{ gridTemplateColumns: "minmax(0,1fr) 360px" }}
      >
        <div className="min-w-0">
          <div
            className="
            overflow-hidden rounded-[14px]
            border border-[#1F2F57]/[0.09]
            bg-white
            shadow-[0_2px_12px_rgba(31,47,87,0.04)]
          "
          >
            <div
              className="
              flex flex-wrap items-center
              justify-between gap-3
              border-b border-[#1F2F57]/[0.07]
              bg-[#FAFBFD]
              px-5 py-4
              sm:px-6
            "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-[11px]
                  border border-[#3960A9]/[0.08]
                  bg-[#3960A9]/[0.08]
                "
                >
                  <Package
                    size={19}
                    strokeWidth={1.8}
                    className="text-[#3960A9]"
                  />
                </div>

                <div>
                  <h2
                    className="
                    text-[15px] font-extrabold
                    text-[#1F2F57]
                  "
                  >
                    Nuevo producto
                  </h2>

                  <p
                    className="
                    mt-0.5 text-[11px]
                    text-[#1F2F57]/45
                  "
                  >
                    Producto N.º {ordinal} del lote
                  </p>
                </div>
              </div>

              {productos.length > 0 && (
                <span
                  className="
                  rounded-full
                  border border-[#3960A9]/[0.10]
                  bg-[#3960A9]/[0.06]
                  px-3 py-1.5
                  text-[11px] font-bold
                  text-[#3960A9]
                "
                >
                  {productos.length} agregados
                </span>
              )}
            </div>

            <div className="space-y-7 px-5 py-6 sm:px-6">
              <fieldset className="min-w-0">
                <FieldLegend
                  icon={<Tag />}
                  label="Información básica"
                  description="Datos principales del producto"
                />

                <div className="space-y-4">
                  <Field label={"Imagen del producto"}>
                    <ImageUpload
                      value={imagen}
                      onChange={(v) => {
                        setImagen(v);
                        change("imagen", v?.file ?? null);
                        change("imagen_preview", v?.preview ?? null);
                      }}
                    />
                  </Field>

                  <Field label="Nombre del producto *">
                    <IconInput
                      value={form.nombre}
                      onChange={(e) => change("nombre", e.target.value)}
                      placeholder="Ej. Zapatilla Nike Air Force"
                    />
                  </Field>

                  {/* Código */}
                  <div
                    className="
                    grid grid-cols-1 gap-3
                    sm:grid-cols-[minmax(0,1fr)_130px]
                  "
                  >
                    <Field label="Código *">
                      <IconInput
                        value={form.codigo}
                        onChange={(e) => change("codigo", e.target.value)}
                      />
                    </Field>

                    <button
                      type="button"
                      onClick={() => regenerarCodigo()}
                      className="
                        flex h-[42px] items-center
                        justify-center gap-2
                        py-2
                        self-end rounded-[10px]
                        border border-[#3960A9]/25
                        bg-[#3960A9]/[0.04]
                        px-3 text-[12px]
                        font-semibold text-[#3960A9]
                        transition-all duration-200
                        hover:border-[#3960A9]/50
                        hover:bg-[#3960A9]/[0.09]
                        focus-visible:outline-none
                        focus-visible:ring-[3px]
                        focus-visible:ring-[#3960A9]/15
                      "
                    >
                      <RefreshCcw size={14} strokeWidth={1.8} />
                      Regenerar
                    </button>
                  </div>

                  <Field label="Categoría *">
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

              <fieldset className="min-w-0 mt-5">
                <FieldLegend
                  icon={<BarChart3 />}
                  label="Stock y precio"
                  description="Cantidades y valores comerciales"
                />

                <div className="space-y-4">
                  <div
                    className="
                    grid grid-cols-1 gap-4
                    sm:grid-cols-2
                  "
                  >
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
                        value={
                          form.tiene_variantes ? stock : form.stock_inicial
                        }
                        onChange={(e) =>
                          change("stock_inicial", e.target.value)
                        }
                      />
                    </Field>

                    <Field label="Unidad de medida">
                      <div className="relative">
                        <CustomSelect
                          value={form.unidad}
                          onChange={(v) => change("unidad", v)}
                          options={["Unidad", "Par", "Kg", "Litro", "Docena", "Caja"]}
                        />
                        
                      </div>
                    </Field>
                  </div>

                  <div
                    className="
                    grid grid-cols-1 gap-4
                    sm:grid-cols-2
                  "
                  >
                    <Field label="Precio de venta *">
                      <div
                        ref={priceRef}
                        className={shake ? "animate-shake" : ""}
                      >
                        <InputMoney
                          value={form.precio_venta}
                          onChange={(v) => change("precio_venta", v)}
                          warning={missingPrice}
                        />

                        {missingPrice && (
                          <p
                            className="
                            mt-2 text-[11px]
                            font-medium leading-relaxed
                            text-[#C78B22]
                          "
                          >
                            El precio de venta es obligatorio cuando existe
                            stock inicial.
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
                </div>
              </fieldset>

              {/* TALLAS Y COLORES */}
              <fieldset className="min-w-0 mt-5">
                <FieldLegend
                  icon={<Layers3 />}
                  label="Tallas y colores"
                  description="Configura las variantes disponibles"
                />

                <SeccionVariantes
                  key={form.codigo}
                  setVariantes={(variantes) => {
                    change("variantes", variantes);

                    change("tiene_variantes", variantes.length > 0);
                  }}
                />
              </fieldset>

              {/* CONFIGURACIÓN AVANZADA */}
              <ConfigAvanzada form={form} change={change} />
            </div>

            {/* ACCIÓN PRINCIPAL */}
            <div
              className="
              border-t border-[#1F2F57]/[0.08]
              bg-[#FAFBFD]
              px-5 py-4
              sm:px-6
            "
            >
              <button
                type="button"
                onClick={() => {
                  const ok = submit();
                  if (ok) setImagen(null);
                }}
                disabled={!form.nombre.trim() || !form.codigo.trim()}
                title={
                  missingPrice ? "Completa el precio de venta primero" : ""
                }
                className="
                  flex h-[46px] w-full
                  items-center justify-center
                  gap-2.5
                  bg-azulMarino
                  px-4
                  py-2
                  rounded-lg
                  mb-2
                  text-[13px] font-bold
                  text-white
                  shadow-[0_3px_8px_rgba(31,47,87,0.12)]
                  transition-all duration-200
                  hover:bg-[#3960A9]
                  hover:shadow-[0_4px_12px_rgba(57,96,169,0.18)]
                  active:scale-[0.995]
                  focus-visible:outline-none
                  focus-visible:ring-[3px]
                  focus-visible:ring-[#3960A9]/20
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  disabled:shadow-none
                "
              >
                <Plus size={17} strokeWidth={2} />
                Agregar al lote
              </button>
            
              <p
                className="
                mt-2.5 text-center
                text-[11px]
                text-[#1F2F57]/40
              "
              >
                El producto se añadirá al lote actual.
              </p>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO */}
        <aside className="min-w-0">
          <div className="xl:sticky xl:top-5">
            <PanelProductos
              products={productos}
              onDelete={deleteProducto}
              onConfirmar={() => {
                confirmar();
                onConfirmar?.();
              }}
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
