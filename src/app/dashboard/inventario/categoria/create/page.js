"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import SearchableSelect from "@/app/dashboard/inventario/components/SearchableSelect";
import {
  createCategoriasProducto,
  getCategorias,
} from "@/Connections/productos";
import SwitcherLoader from "@/components/Navigation/SwitcherLoader";
import { useAuth } from "@/Context/AuthContext";
import { toast } from "react-toastify";
import InputFillable from "@/app/dashboard/inventario/productos/crear/components/InputFillable";
function Field({ label, required, hint, children }) {
  return (
    <div
      className="grid items-start gap-6"
      style={{ gridTemplateColumns: "160px 1fr" }}
    >
      <div className="pt-2.5">
        <p className="text-sm font-semibold" style={{ color: "#1F2F57" }}>
          {label}
          {required && (
            <span className="ml-0.5" style={{ color: "#C0392B" }}>
              *
            </span>
          )}
        </p>
        {hint && (
          <p
            className="text-[11px] mt-0.5"
            style={{ color: "rgba(31,47,87,0.4)" }}
          >
            {hint}
          </p>
        )}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="w-10 h-5 rounded-full relative transition-colors"
        style={{ background: value ? "#3960A9" : "rgba(31,47,87,0.2)" }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-150"
          style={{ left: value ? "22px" : "2px" }}
        />
      </button>
      <span
        className="text-sm"
        style={{ color: value ? "#3960A9" : "rgba(31,47,87,0.5)" }}
      >
        {value ? "Activa" : "Inactiva"}
      </span>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const { user } = useAuth();
  const [nombreFocused, setNombreFocused] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    codigo: "",
    categoria_padre_id: null,
    activa: true,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getCategorias();
        setCategorias(response?.data?.data || []);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const jsonToSend = {
        empresa_id: user?.empresa_id,
        ...form,
      };
      await createCategoriasProducto(jsonToSend);
      toast.success("Categoria creado correctamente");
      router.push("/dashboard/inventario/categoria");
    } catch (error) {
      console.log("ERROR : ", error);
      toast.error("No se pudo crear la categoria");
    } finally {
      setLoading(false);
    }
  };

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
            <button
              onClick={() => router.push("/dashboard/inventario")}
              className="hover:underline transition-colors hover:text-[#1F2F57]"
            >
              Inventario
            </button>
            <ChevronRight size={12} />
            <button
              onClick={() => router.push("/dashboard/inventario/categoria")}
              className="hover:underline transition-colors hover:text-[#1F2F57]"
            >
              Categorías de productos
            </button>
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
}
