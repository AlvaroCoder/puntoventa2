import { BASE_INPUT_STYLE, TIPOS_ALMACEN } from "@/shared/constants/Inventary";
import { RefreshCcw, Trash2, Warehouse } from "lucide-react";
import { generarCodigoTienda } from "./StepperProduct2/stepper2.helpers";

export default function AlmacenCardEditable({ almacen, index, onChange, onDelete,
    onFocusInput,
    onBlurInput
 }) {
  const set = (k, v) => onChange(almacen._id, k, v);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(31,47,87,0.12)" }}
    >
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{
          background: "rgba(31,47,87,0.04)",
          borderBottom: "0.5px solid rgba(31,47,87,0.1)",
        }}
      >
        <div className="flex items-center gap-2">
          <Warehouse size={14} style={{ color: "rgba(31,47,87,0.45)" }} />
          <span className="text-xs font-semibold" style={{ color: "#1F2F57" }}>
            Almacén {index + 1}
            {almacen.nombre && (
              <span
                className="ml-1.5 font-normal"
                style={{ color: "rgba(31,47,87,0.45)" }}
              >
                · {almacen.nombre}
              </span>
            )}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onDelete(almacen._id)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors hover:bg-red-50"
          style={{ color: "#C0392B" }}
        >
          <Trash2 size={12} />
          Eliminar
        </button>
      </div>

      <div className="px-5 py-5 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: "rgba(31,47,87,0.45)" }}
            >
              Nombre <span style={{ color: "#C0392B" }}>*</span>
            </label>
            <input
              value={almacen.nombre}
              onChange={(e) => {
                set("nombre", e.target.value);
                if (!almacen.codigo)
                  set("codigo", generarCodigoTienda(e.target.value));
              }}
              placeholder="Ej: Vitrina principal"
              className="h-9 px-3 rounded-lg text-sm outline-none transition-all"
              style={BASE_INPUT_STYLE}
              onFocus={onFocusInput}
              onBlur={onBlurInput}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: "rgba(31,47,87,0.45)" }}
            >
              Código
            </label>
            <div className="flex gap-1.5">
              <input
                value={almacen.codigo}
                onChange={(e) => set("codigo", e.target.value.toUpperCase())}
                placeholder="Ej: VIT-001"
                className="flex-1 h-9 px-3 rounded-lg text-sm outline-none transition-all min-w-0"
                style={BASE_INPUT_STYLE}
                onFocus={onFocusInput}
                onBlur={onBlurInput}
              />
              <button
                type="button"
                onClick={() =>
                  set("codigo", generarCodigoTienda(almacen.nombre))
                }
                title="Generar código"
                className="h-9 w-9 rounded-lg flex items-center justify-center transition-colors hover:bg-[#E1E7F0] shrink-0"
                style={{ border: "1px solid rgba(31,47,87,0.18)" }}
              >
                <RefreshCcw size={12} style={{ color: "rgba(31,47,87,0.45)" }} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: "rgba(31,47,87,0.45)" }}
            >
              Tipo
            </label>
            <select
              value={almacen.tipo}
              onChange={(e) => set("tipo", e.target.value)}
              className="h-9 px-3 rounded-lg text-sm outline-none appearance-none transition-all"
              style={BASE_INPUT_STYLE}
              onFocus={onFocusInput}
              onBlur={onBlurInput}
            >
              {TIPOS_ALMACEN.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: "rgba(31,47,87,0.45)" }}
            >
              Descripción
            </label>
            <input
              value={almacen.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
              placeholder="Breve descripción (opcional)"
              className="h-9 px-3 rounded-lg text-sm outline-none transition-all"
              style={BASE_INPUT_STYLE}
              onFocus={onFocusInput}
              onBlur={onBlurInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
