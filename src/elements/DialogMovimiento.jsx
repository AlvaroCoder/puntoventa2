'use client';
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {
  createMovimiento,
} from "@/Connections/caja";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
export default function DialogMovimiento({ open, onClose, cajaId, onSuccess }) {
    const [form, setForm] = useState({ tipo: 'entrada', monto: '', descripcion: '' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (open) setForm({ tipo: 'entrada', monto: '', descripcion: '' })
    }, [open])
    
    const handleRegistrar = async () => {
        if (!form.monto || parseFloat(form.monto) <= 0)
            return toast.error('Ingresa un monto válido')
        if (!form.descripcion.trim())
            return toast.error('La descripción es requerida')
        setSaving(true)
        try {
            const res = await createMovimiento(cajaId, {
                ...form,
                monto: parseFloat(form.monto),
            })
            if (res.ok) {
                toast.success('Movimiento registrado')
                onSuccess()
                onClose()
            } else {
                toast.error(res.message || 'Error al registrar el movimiento')
            }
        } finally {
            setSaving(false)
        }
    }

    const isEntrada = form.tipo === 'entrada'

    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Movimiento</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                Tipo
              </label>
              <div className="flex gap-2">
                {[
                  { key: "entrada", label: "↑ Entrada" },
                  { key: "salida", label: "↓ Salida" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setForm((p) => ({ ...p, tipo: key }))}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
                      form.tipo === key
                        ? key === "entrada"
                          ? "bg-green-50 border-green-500 text-green-700"
                          : "bg-red-50 border-red-400 text-red-600"
                        : "bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                Monto (S/) *
              </label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={form.monto}
                onChange={(e) =>
                  setForm((p) => ({ ...p, monto: e.target.value }))
                }
                placeholder="0.00"
                className={`${
                  isEntrada
                    ? "focus-visible:ring-green-500/30 focus-visible:border-green-500"
                    : "focus-visible:ring-red-400/30 focus-visible:border-red-400"
                }`}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                Descripción *
              </label>
              <Input
                value={form.descripcion}
                onChange={(e) =>
                  setForm((p) => ({ ...p, descripcion: e.target.value }))
                }
                placeholder="Ej: Pago proveedor"
                className={`${
                  isEntrada
                    ? "focus-visible:ring-green-500/30 focus-visible:border-green-500"
                    : "focus-visible:ring-red-400/30 focus-visible:border-red-400"
                }`}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button
              onClick={handleRegistrar}
              disabled={saving}
              className={`text-white font-bold ${
                isEntrada
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {saving ? "Registrando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
};