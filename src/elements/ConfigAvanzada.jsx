'use client'
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react'
import Field from './Field';
import Switch from './Switch';

export default function ConfigAvanzada({ form, change }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-5 border-t border-[#1F2F57]/10 pt-2">
      <button
        type="button"
        className="flex w-full items-center justify-between py-3 font-bold text-[#3960A9]"
        onClick={() => setOpen(!open)}
      >
        <span>+ Configuración avanzada</span>
        <ChevronDown
          size={19}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="grid gap-4 rounded-lg bg-[#E1E7F0]/40 p-4 md:grid-cols-2">
          <Field label="Código de barras">
            <input
              className="input"
              placeholder="Se completará después con app móvil"
              value={form.barras}
              onChange={(e) => change("barras", e.target.value)}
            />
          </Field>
          <Field label="Descripción">
            <textarea
              rows="2"
              className="min-h-20 w-full rounded-lg border border-[#1F2F57]/20 bg-white p-3 outline-none focus:border-[#3960A9]"
              value={form.descripcion}
              onChange={(e) => change("descripcion", e.target.value)}
            />
          </Field>
          <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
            <span className="text-sm font-bold">Aplica IGV</span>
            <Switch on={form.igv} toggle={() => change("igv", !form.igv)} />
          </div>
          <Field label="Temporada">
            <select
              className="input"
              value={form.temporada}
              onChange={(e) => change("temporada", e.target.value)}
            >
              {["Todo el año", "Verano", "Invierno", "Escolar", "Navidad"].map(
                (x) => (
                  <option key={x}>{x}</option>
                ),
              )}
            </select>
          </Field>
          <Field label="Género">
            <select
              className="input"
              value={form.genero}
              onChange={(e) => change("genero", e.target.value)}
            >
              {["Masculino", "Femenino", "Unisex", "Niño", "Niña"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
          <Field label="Stock mínimo">
            <input
              className="input"
              type="number"
              min="0"
              value={form.stock_minimo}
              onChange={(e) => change("stock_minimo", e.target.value)}
            />
          </Field>
          <p className="md:col-span-2 text-sm text-[#1F2F57]/60">
            Puedes completar estos campos desde la ficha del producto en
            cualquier momento.
          </p>
        </div>
      )}
    </div>
  );
}

