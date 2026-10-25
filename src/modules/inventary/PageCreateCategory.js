import ButtonLinkSimple from '@/shared/components/ButtonLinkSimple';
import Field from '@/shared/components/Field';
import InputFillable from '@/shared/components/InputFillable';
import SearchableSelect from '@/shared/components/SearchableSelect';
import SwitcherLoader from '@/shared/components/SwitcherLoader';
import Toggle from '@/shared/components/Toggle';
import { ChevronRight } from 'lucide-react';
import React from 'react'

export default function PageCreateCategory({
    loading,
    handleSubmit,
    form,
    setNombreFocused,
    nombreFocused,
    set,
    categorias,
    
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
            <ButtonLinkSimple href={"/dashboard/inventario/categoria"}>
              Categorías de productos
            </ButtonLinkSimple>
            <ChevronRight size={12} />
            <span className="font-semibold" style={{ color: "#1F2F57" }}>
              {form.nombre || "Nueva categoría"}
            </span>
          </nav>

          <SwitcherLoader loading={loading}>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.push("/dashboard/inventario/categoria")}
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
                className="px-5 py-2 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "#1F2F57" }}
                onClick={handleSubmit}
              >
                Guardar
              </button>
            </div>
          </SwitcherLoader>
        </div>
      </div>

      <div className="px-8 py-6 max-w-4xl mx-auto w-full">
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
                Categoría
              </p>
              <InputFillable
                value={form.nombre}
                keyValue={"nombre"}
                set={set}
                onFocus={() => setNombreFocused(true)}
                onBlur={() => setNombreFocused(false)}
                placeholder="Nombre de la categoria"
                nombreFocused={nombreFocused}
              />
            </div>

            <div className="flex flex-col gap-6">
              <Field
                label="Código"
                required
                hint="Identificador único de la categoría"
              >
                <input
                  value={form.codigo}
                  onChange={(e) => set("codigo", e.target.value.toUpperCase())}
                  placeholder="Ej: CDEP01"
                  className="h-10 px-3.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    border: "1px solid rgba(31,47,87,0.18)",
                    color: "#1F2F57",
                    background: "#fff",
                    width: "240px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3960A9";
                    e.target.style.boxShadow = "0 0 0 3px rgba(57,96,169,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(31,47,87,0.18)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </Field>

              <SwitcherLoader>
                <Field
                  label="Categoría padre"
                  hint="Organiza en jerarquías jerárquicas"
                >
                  <div style={{ maxWidth: "420px" }}>
                    <SearchableSelect
                      value={form.categoria_padre_id}
                      onChange={(v) => set("categoria_padre_id", v)}
                      options={categorias}
                    />
                  </div>
                </Field>
              </SwitcherLoader>

              <Field label="Descripción">
                <div>
                  <textarea
                    value={form.descripcion}
                    onChange={(e) =>
                      set("descripcion", e.target.value.slice(0, 300))
                    }
                    placeholder="Descripción breve de esta categoría..."
                    rows={3}
                    className="w-full px-3.5 py-3 rounded-xl text-sm outline-none resize-none transition-all"
                    style={{
                      border: "1px solid rgba(31,47,87,0.18)",
                      color: "#1F2F57",
                      background: "#fff",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3960A9";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(57,96,169,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(31,47,87,0.18)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <div
                    className="text-right text-[11px] mt-1"
                    style={{ color: "rgba(31,47,87,0.35)" }}
                  >
                    {form.descripcion.length}/300
                  </div>
                </div>
              </Field>

              <Field label="Estado">
                <Toggle
                  value={form.activa}
                  onChange={(v) => set("activa", v)}
                />
              </Field>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};