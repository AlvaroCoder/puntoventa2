"use client";

import React, { useState, useCallback } from "react";
import { Plus, X, Check, Layers3, Package } from "lucide-react";

const TALLAS_BASE = ["35", "36", "37", "38", "39", "40", "41", "42", "43"];

const COLORES_BASE = ["Negro", "Blanco", "Marrón", "Azul", "Rojo", "Gris"];

const COLOR_HEX = {
  Negro: "#1F2F57",
  Blanco: "#E5E7EB",
  Marrón: "#92400E",
  Azul: "#2563EB",
  Rojo: "#DC2626",
  Gris: "#6B7280",
  Verde: "#059669",
  Amarillo: "#F59E0B",
};

const inputBase = `
  rounded-[9px]
  border border-[#1F2F57]/[0.14]
  bg-white
  text-[12px] font-medium text-[#1F2F57]
  placeholder:text-[#1F2F57]/35
  outline-none
  transition-all duration-200
  hover:border-[#3960A9]/35
  focus:border-[#3960A9]/70
  focus:ring-[3px] focus:ring-[#3960A9]/[0.09]
`;

const matrixKey = (color, talla) => `${color}||${talla}`;

function buildVariantes(tallas, colores, matrix) {
  const tallasList = tallas.length ? tallas : [""];
  const coloresList = colores.length ? colores : [""];

  return coloresList.flatMap((color) =>
    tallasList.map((talla) => {
      const key = matrixKey(color, talla);

      return {
        id: key,
        talla,
        color,
        stock_inicial: matrix[key] ?? "",
        precio_adicional: "",
        codigo_barras: "",
      };
    }),
  );
}

export default function SeccionVariantes({ setVariantes }) {
  const [tallasSeleccionadas, setTallas] = useState([]);
  const [coloresSeleccionados, setColores] = useState([]);
  const [stockMatrix, setMatrix] = useState({});

  const [showCustomTalla, setShowCT] = useState(false);
  const [customTalla, setCT] = useState("");
  const [colorInput, setCI] = useState("");

  const emit = useCallback(
    (tallas, colores, matrix) => {
      setVariantes(buildVariantes(tallas, colores, matrix));
    },
    [setVariantes],
  );

  const toggleTalla = (talla) => {
    const next = tallasSeleccionadas.includes(talla)
      ? tallasSeleccionadas.filter((x) => x !== talla)
      : [...tallasSeleccionadas, talla];

    setTallas(next);
    emit(next, coloresSeleccionados, stockMatrix);
  };

  const addCustomTalla = () => {
    const talla = customTalla.trim();

    if (talla && !tallasSeleccionadas.includes(talla)) {
      const next = [...tallasSeleccionadas, talla];

      setTallas(next);
      emit(next, coloresSeleccionados, stockMatrix);
    }

    setCT("");
    setShowCT(false);
  };

  const toggleColor = (color) => {
    const next = coloresSeleccionados.includes(color)
      ? coloresSeleccionados.filter((x) => x !== color)
      : [...coloresSeleccionados, color];

    setColores(next);
    emit(tallasSeleccionadas, next, stockMatrix);
  };

  const addCustomColor = () => {
    const color = colorInput.trim();

    if (
      color &&
      !coloresSeleccionados.some((x) => x.toLowerCase() === color.toLowerCase())
    ) {
      const next = [...coloresSeleccionados, color];

      setColores(next);
      emit(tallasSeleccionadas, next, stockMatrix);
    }

    setCI("");
  };

  const updateStock = (key, value) => {
    const next = {
      ...stockMatrix,
      [key]: value,
    };

    setMatrix(next);

    emit(tallasSeleccionadas, coloresSeleccionados, next);
  };

  const hasTallas = tallasSeleccionadas.length > 0;
  const hasColores = coloresSeleccionados.length > 0;
  const showMatrix = hasTallas || hasColores;

  const variantes = showMatrix
    ? buildVariantes(tallasSeleccionadas, coloresSeleccionados, stockMatrix)
    : [];

  const totalStock = variantes.reduce(
    (total, variante) => total + (Number(variante.stock_inicial) || 0),
    0,
  );

  const totalCombinaciones = variantes.length;

  const customTallas = tallasSeleccionadas.filter(
    (t) => !TALLAS_BASE.includes(t),
  );

  const customColors = coloresSeleccionados.filter(
    (c) => !COLORES_BASE.includes(c),
  );

  return (
    <div
      className="
        space-y-5 rounded-xl
        border border-[#1F2F57]/[0.08]
        bg-[#F8FAFD]/70
        p-4 sm:p-5
      "
    >
      {/* TALLAS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <label
            className="
            text-[11px] font-bold
            uppercase tracking-[0.10em]
            text-[#1F2F57]/55
          "
          >
            Tallas
          </label>

          {hasTallas && (
            <span
              className="
              rounded-md bg-[#3960A9]/[0.07]
              px-2 py-0.5
              text-[10px] font-semibold
              text-[#3960A9]
            "
            >
              {tallasSeleccionadas.length} seleccionadas
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {TALLAS_BASE.map((talla) => {
            const selected = tallasSeleccionadas.includes(talla);

            return (
              <button
                key={talla}
                type="button"
                onClick={() => toggleTalla(talla)}
                className={`
                  flex h-9 min-w-[43px]
                  items-center justify-center
                  rounded-[9px] px-3
                  text-[12px] font-semibold
                  transition-all duration-200
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#3960A9]/25
                  ${
                    selected
                      ? `
                        border border-[#3960A9]
                        bg-azulMarino
                        text-white
                        shadow-[0_2px_5px_rgba(57,96,169,0.14)]
                      `
                      : `
                        border border-[#1F2F57]/[0.12]
                        bg-white text-[#1F2F57]/70
                        hover:border-[#3960A9]/45
                        hover:bg-[#3960A9]/[0.03]
                      `
                  }
                `}
              >
                {talla}
              </button>
            );
          })}

          {customTallas.map((talla) => (
            <button
              key={talla}
              type="button"
              onClick={() => toggleTalla(talla)}
              aria-label={`Quitar talla ${talla}`}
              className="
                flex h-9 items-center gap-2
                rounded-[9px]
                border border-[#3960A9]
                bg-[#3960A9]
                px-3 text-[12px]
                font-semibold text-white
                transition-all
                hover:bg-[#315393]
              "
            >
              {talla}
              <X size={12} />
            </button>
          ))}

          {!showCustomTalla ? (
            <button
              type="button"
              onClick={() => setShowCT(true)}
              className="
                flex h-9 items-center gap-1.5
                rounded-[9px]
                border border-dashed
                border-[#3960A9]/35
                bg-white px-3
                text-[12px] font-semibold
                text-[#3960A9]
                transition-all duration-200
                hover:border-[#3960A9]/65
                hover:bg-[#3960A9]/[0.04]
              "
            >
              <Plus size={13} />
              Otra
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <input
                autoFocus
                value={customTalla}
                onChange={(e) => setCT(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomTalla();
                  }
                  if (e.key === "Escape") {
                    setShowCT(false);
                    setCT("");
                  }
                }}
                placeholder="Ej. 44"
                aria-label="Nueva talla"
                className={`
                  ${inputBase}
                  h-9 w-[75px] px-2
                  text-center
                `}
              />

              <button
                type="button"
                onClick={addCustomTalla}
                className="
                  flex h-9 w-9 items-center
                  justify-center rounded-[9px]
                  bg-[#3960A9] text-white
                  transition-colors
                  hover:bg-[#315393]
                "
                aria-label="Agregar talla"
              >
                <Check size={15} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowCT(false);
                  setCT("");
                }}
                className="
                  flex h-9 w-9 items-center
                  justify-center rounded-[9px]
                  text-[#1F2F57]/45
                  transition-colors
                  hover:bg-[#1F2F57]/[0.05]
                "
                aria-label="Cancelar"
              >
                <X size={15} />
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="h-px bg-[#1F2F57]/[0.07]" />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <label
            className="
            text-[11px] font-bold
            uppercase tracking-[0.10em]
            text-[#1F2F57]/55
          "
          >
            Colores
          </label>

          {hasColores && (
            <span
              className="
              rounded-md bg-[#3960A9]/[0.07]
              px-2 py-0.5
              text-[10px] font-semibold
              text-[#3960A9]
            "
            >
              {coloresSeleccionados.length} seleccionados
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {COLORES_BASE.map((color) => {
            const selected = coloresSeleccionados.includes(color);

            return (
              <button
                key={color}
                type="button"
                onClick={() => toggleColor(color)}
                className={`
                  flex h-9 items-center gap-2
                  rounded-full px-3
                  text-[12px] font-semibold
                  transition-all duration-200
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#3960A9]/25
                  ${
                    selected
                      ? `
                        border border-[#3960A9]
                        bg-azulClaro text-white
                        shadow-[0_2px_5px_rgba(57,96,169,0.14)]
                      `
                      : `
                        border border-[#1F2F57]/[0.12]
                        bg-white text-[#1F2F57]/70
                        hover:border-[#3960A9]/45
                        hover:bg-[#3960A9]/[0.03]
                      `
                  }
                `}
              >
                <span
                  className="
                    h-3.5 w-3.5 shrink-0
                    rounded-full border
                  "
                  style={{
                    background: COLOR_HEX[color] ?? "#94A3B8",
                    borderColor: selected
                      ? "rgba(255,255,255,0.45)"
                      : "rgba(31,47,87,0.12)",
                  }}
                />

                {color}

                {selected && <Check size={12} strokeWidth={2.5} />}
              </button>
            );
          })}

          {customColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => toggleColor(color)}
              aria-label={`Quitar color ${color}`}
              className="
                flex h-9 items-center gap-2
                rounded-full
                border border-[#3960A9]
                bg-[#3960A9] px-3
                text-[12px] font-semibold
                text-white
                transition-colors
                hover:bg-[#315393]
              "
            >
              <span
                className="
                h-3.5 w-3.5 rounded-full
                border border-white/40
                bg-[#94A3B8]
              "
              />

              {color}
              <X size={12} />
            </button>
          ))}

          <div className="flex items-center gap-1.5">
            <input
              value={colorInput}
              onChange={(e) => setCI(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomColor();
                }
              }}
              placeholder="+ Agregar color"
              aria-label="Nuevo color"
              className={`
                ${inputBase}
                h-9 w-36 rounded-full
                border-dashed px-3
              `}
            />

            {colorInput.trim() && (
              <button
                type="button"
                onClick={addCustomColor}
                aria-label="Agregar color"
                className="
                  flex h-9 w-9 items-center
                  justify-center rounded-full
                  bg-[#3960A9] text-white
                  transition-colors
                  hover:bg-[#315393]
                "
              >
                <Plus size={15} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* MATRIZ DE STOCK */}
      {showMatrix && (
        <>
          <div className="h-px bg-[#1F2F57]/[0.07]" />

          <section className="space-y-3">
            <div
              className="
              flex flex-wrap items-center
              justify-between gap-3
            "
            >
              <div className="flex items-center gap-2">
                <Layers3
                  size={15}
                  strokeWidth={1.8}
                  className="text-[#3960A9]"
                />

                <h3
                  className="
                  text-[11px] font-bold
                  uppercase tracking-[0.10em]
                  text-[#1F2F57]/65
                "
                >
                  Stock por combinación
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="
                  rounded-md
                  border border-[#3960A9]/[0.10]
                  bg-[#3960A9]/[0.05]
                  px-2.5 py-1
                  text-[11px] font-semibold
                  text-[#3960A9]
                "
                >
                  {totalCombinaciones} variantes
                </span>

                <span
                  className="
                  flex items-center gap-1.5
                  rounded-md
                  border border-[#1EB3B2]/[0.15]
                  bg-[#1EB3B2]/[0.07]
                  px-2.5 py-1
                  text-[11px] font-bold
                  text-[#168B89]
                "
                >
                  <Package size={12} />
                  {totalStock} unid.
                </span>
              </div>
            </div>

            <div
              className="
              overflow-x-auto rounded-xl
              border border-[#1F2F57]/[0.10]
              bg-white
            "
            >
              <table
                className="
                w-full border-collapse
                text-[12px]
              "
              >
                <thead>
                  <tr
                    className="
                    border-b border-[#1F2F57]/[0.08]
                    bg-[#F3F6FB]
                  "
                  >
                    <th
                      className="
                      min-w-[110px]
                      px-3 py-3 text-left
                      text-[11px] font-bold
                      text-[#1F2F57]/60
                    "
                    >
                      {hasColores && hasTallas
                        ? "Color / Talla"
                        : hasColores
                          ? "Color"
                          : "Variante"}
                    </th>

                    {(hasTallas ? tallasSeleccionadas : [""]).map((talla) => (
                      <th
                        key={talla || "__notalla"}
                        className="
                          min-w-[68px]
                          px-2 py-3 text-center
                          text-[11px] font-bold
                          text-[#1F2F57]
                        "
                      >
                        {talla || "Cant."}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {(hasColores ? coloresSeleccionados : [""]).map(
                    (color, index) => (
                      <tr
                        key={color || "__nocolor"}
                        className={`
                        transition-colors
                        hover:bg-[#3960A9]/[0.025]
                        ${index > 0 ? "border-t border-[#1F2F57]/[0.06]" : ""}
                      `}
                      >
                        <td
                          className="
                        px-3 py-2.5
                        font-semibold
                        text-[#1F2F57]
                      "
                        >
                          {color ? (
                            <div
                              className="
                            flex items-center gap-2
                            whitespace-nowrap
                          "
                            >
                              <span
                                className="
                                h-3 w-3 shrink-0
                                rounded-full border
                                border-[#1F2F57]/10
                              "
                                style={{
                                  background: COLOR_HEX[color] ?? "#94A3B8",
                                }}
                              />

                              {color}
                            </div>
                          ) : (
                            <span className="text-[#1F2F57]/35">—</span>
                          )}
                        </td>

                        {(hasTallas ? tallasSeleccionadas : [""]).map(
                          (talla) => {
                            const key = matrixKey(color, talla);

                            return (
                              <td
                                key={talla || "__notalla"}
                                className="px-2 py-2 text-center"
                              >
                                <input
                                  type="number"
                                  min="0"
                                  step="1"
                                  inputMode="numeric"
                                  aria-label={`Stock ${color || "sin color"} ${talla || "sin talla"}`}
                                  value={stockMatrix[key] ?? ""}
                                  onChange={(e) =>
                                    updateStock(key, e.target.value)
                                  }
                                  placeholder="0"
                                  className={`
                                ${inputBase}
                                h-9 w-[58px]
                                px-1 text-center
                                [appearance:textfield]
                                [&::-webkit-inner-spin-button]:appearance-none
                                [&::-webkit-outer-spin-button]:appearance-none
                              `}
                                />
                              </td>
                            );
                          },
                        )}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            <p
              className="
              text-[11px] leading-relaxed
              text-[#1F2F57]/45
            "
            >
              Ingresa las unidades disponibles para cada combinación. Puedes
              dejar el stock en cero y actualizarlo después.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
