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
export default function DialogMovimiento({ open,trabajadorId=1, onClose,cajaId, cajaSesionId, onSuccess }) {
  
  const [form, setForm] = useState({
      trabajadorId ,
      tipoMovimiento: "ingreso",
      cajaSesionId,
      monto: "",
      concepto: "",
    });
    const [saving, setSaving] = useState(false)

    useEffect(() => {
      if (open) setForm({
          trabajadorId,
          tipoMovimiento: "ingreso",
          cajaSesionId,
          monto: "",
          concepto: "",
        });
    }, [open])
    
    const handleRegistrar = async () => {
        if (!form.monto || parseFloat(form.monto) <= 0)
            return toast.error('Ingresa un monto válido')
        if (!form.concepto.trim())
            return toast.error('El concepto es requerido')
        setSaving(true)
      try {
          const objToSend = {
            ...form,
            monto: parseFloat(form.monto),
            tipoMovimiento: form?.tipoMovimiento?.toUpperCase(),
          };
        
            const res = await createMovimiento(cajaId, objToSend);
          
            if (res.ok) {
                toast.success('Movimiento registrado')
                onSuccess()
                onClose()
            } else {
                toast.error(res.message || 'Error al registrar el movimiento')
            }
        }
        catch (error) {
            console.error(error)
            toast.error('Error al registrar el movimiento')
        }
        finally {
            setSaving(false)
        }
    }

    const isEntrada = form.tipoMovimiento === "ingreso";

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
                  { key: "ingreso", label: "↑ Entrada" },
                  { key: "egreso", label: "↓ Salida" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() =>
                      setForm((p) => ({ ...p, tipoMovimiento: key }))
                    }
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
                      form.tipoMovimiento === key
                        ? key === "ingreso"
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
                value={form.concepto}
                onChange={(e) =>
                  setForm((p) => ({ ...p, concepto: e.target.value }))
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