import React from 'react'

export default function SeccionVariantes({ variantes, setVariantes }) {
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