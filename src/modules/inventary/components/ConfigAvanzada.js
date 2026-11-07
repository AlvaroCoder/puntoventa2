"use client";

import React, { useId, useState } from "react";
import { ChevronDown, Settings2, Barcode } from "lucide-react";
import Field from "@/shared/components/Field";
import Switch from "./Switch";
import FieldLegend from "./FieldLegend";

const TEMPORADAS = ["Todo el año", "Verano", "Invierno", "Escolar", "Navidad"];

const GENEROS = ["Masculino", "Femenino", "Unisex", "Niño", "Niña"];

const controlBase = `
  w-full min-w-0 h-[42px]
  rounded-[10px]
  border border-[#1F2F57]/[0.13]
  bg-white
  px-3.5
  text-[13px] font-medium text-[#1F2F57]
  placeholder:text-[#1F2F57]/35
  outline-none
  transition-all duration-200 ease-out
  hover:border-[#3960A9]/35
  focus:border-[#3960A9]/70
  focus:ring-[3px] focus:ring-[#3960A9]/[0.09]
  disabled:cursor-not-allowed
  disabled:bg-slate-50
  disabled:text-slate-400
`;

const selectBase = `
  ${controlBase}
  appearance-none
  cursor-pointer
  pr-10
`;

export default function ConfigAvanzada({ form, change }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="mt-6 border-t border-[#1F2F57]/10 pt-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          group flex w-full items-center
          justify-between gap-2
          rounded-lg px-1 py-3
          transition-colors duration-200
          hover:bg-[#3960A9]/[0.025]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#3960A9]/20
        "
      >
        <FieldLegend
          label={"Configuración avanzada"}
          description={"Configura el restante de la información del producto"} icon={<Settings2 />} />

        <ChevronDown
          size={16}
          strokeWidth={1.8}
          className={`
            text-[#3960A9]
            transition-transform duration-300
            ${open ? "rotate-180" : "rotate-0"}
          `}
        />
      </button>

      <div
        id={panelId}
        className={`
          grid transition-[grid-template-rows,opacity]
          duration-300 ease-out h-fit
          ${open ? "block" : "hidden"}
        `}
      >
        <div className="overflow-hidden">
          <div
            className={`
              space-y-4 rounded-xl
              border border-[#1F2F57]/[0.08]
              bg-[#F8FAFD]/70
              p-4 sm:p-5
              transition-transform duration-300 ease-out
              ${open ? "translate-y-0" : "-translate-y-2"}
            `}
          >
            <Field label="Código de barras">
              <div className="relative">
                <Barcode
                  size={17}
                  strokeWidth={1.7}
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute left-3.5 top-1/2
                    -translate-y-1/2
                    text-[#3960A9]/55
                  "
                />

                <input
                  type="text"
                  className={`${controlBase} pl-10 py-2`}
                  placeholder="Escanea o ingresa el código"
                  value={form.barras ?? ""}
                  onChange={(e) => change("barras", e.target.value)}
                />
              </div>
            </Field>

            {/* Descripción */}
            <Field label="Descripción">
              <textarea
                rows={3}
                className={`
                  ${controlBase}
                  !h-auto min-h-[92px]
                  resize-y
                  py-3
                  leading-relaxed
                `}
                placeholder="Añade detalles adicionales del producto..."
                value={form.descripcion ?? ""}
                onChange={(e) => change("descripcion", e.target.value)}
              />
            </Field>

            {/* Temporada y género */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Temporada">
                <div className="relative">
                  <select
                    className={selectBase}
                    value={form.temporada ?? "Todo el año"}
                    onChange={(e) => change("temporada", e.target.value)}
                  >
                    {TEMPORADAS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={15}
                    strokeWidth={1.8}
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute right-3.5 top-1/2
                      -translate-y-1/2
                      text-[#3960A9]/65
                    "
                  />
                </div>
              </Field>

              <Field label="Género">
                <div className="relative">
                  <select
                    className={selectBase}
                    value={form.genero ?? "Unisex"}
                    onChange={(e) => change("genero", e.target.value)}
                  >
                    {GENEROS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={15}
                    strokeWidth={1.8}
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute right-3.5 top-1/2
                      -translate-y-1/2
                      text-[#3960A9]/65
                    "
                  />
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Stock mínimo">
                <input
                  type="number"
                  min="0"
                  step="1"
                  className={controlBase}
                  placeholder="Ej. 5"
                  value={form.stock_minimo ?? ""}
                  onChange={(e) => change("stock_minimo", e.target.value)}
                />
              </Field>

              <Field label="Aplica IGV">
                <div
                  className="
                  flex h-[42px] items-center
                  rounded-[10px]
                  border border-[#1F2F57]/[0.10]
                  bg-white px-3.5
                "
                >
                  <Switch
                    on={Boolean(form.igv)}
                    toggle={() => change("igv", !form.igv)}
                  />

                  <span
                    className="
                    ml-3 text-[12px]
                    font-medium text-[#1F2F57]/60
                  "
                  >
                    {form.igv ? "Activado" : "Desactivado"}
                  </span>
                </div>
              </Field>
            </div>

            {/* Nota inferior */}
            <div
              className="
              border-t border-[#1F2F57]/[0.07]
              pt-3
            "
            >
              <p
                className="
                text-[11px] leading-relaxed
                text-[#1F2F57]/45
              "
              >
                Puedes completar o modificar estos datos desde la ficha del
                producto en cualquier momento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
