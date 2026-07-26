'use client';
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  cerrarCaja,
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
import { arrayToDate } from "@/lib/utils";
export default function DialogCerrarCaja({ open, onClose, sesion, onSuccess }) {
  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleString("es-PE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";
  const fmt = (v) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(v ?? 0);
  
  const [form, setForm] = useState({
      trabajadorId : 1,
      montoCierreReal: "",
      observaciones: "",
    });
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        if (open) setForm({ trabajadorId: 1, montoCierreReal: "", observaciones: "" });
    }, [open])

    const handleCerrar = async () => {
        if (!form.montoCierreReal) return toast.error('El monto de cierre es requerido')
        setSaving(true)
        try {
            const res = await cerrarCaja(sesion?.id, {
              ...form,
              montoCierreReal: parseFloat(form.montoCierreReal),
            });
            if (res.ok) {
                toast.success('Caja cerrada correctamente')
                onSuccess()
                onClose()
            } else {
                toast.error(res.message || 'Error al cerrar la caja')
            }
        } finally {
            setSaving(false)
        }
    }
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cerrar Caja</DialogTitle>
          </DialogHeader>
          {sesion && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm">
              <p className="text-amber-700 font-semibold">
                Sesión abierta desde: {fmtDate(arrayToDate(sesion.fechaApertura))}
              </p>
              <p className="text-amber-600 mt-0.5">
                Monto apertura: {fmt(sesion.montoApertura)}
              </p>
            </div>
          )}
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                Monto de cierre (S/) *
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.montoCierreReal}
                onChange={(e) =>
                  setForm((p) => ({ ...p, montoCierreReal: e.target.value }))
                }
                placeholder="0.00"
                className="focus-visible:ring-red-400/30 focus-visible:border-red-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                Observación
              </label>
              <Input
                value={form.observaciones}
                onChange={(e) =>
                  setForm((p) => ({ ...p, observaciones: e.target.value }))
                }
                placeholder="Opcional"
                className="focus-visible:ring-red-400/30 focus-visible:border-red-400"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button
              onClick={handleCerrar}
              disabled={saving}
              className="bg-red-500 hover:bg-red-600 text-white font-bold"
            >
              {saving ? "Cerrando..." : "Cerrar Caja"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
};