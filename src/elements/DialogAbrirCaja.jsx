'use client';
import React, { useState, useEffect } from 'react'
import { toast } from "react-toastify";
import {

  abrirCaja,
} from "@/Connections/caja";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DialogAbrirCaja({ tiendaId, open, onClose, cajaId, onSuccess }) {
    const [form, setForm] = useState({ tiendaId, montoApertura: "", observaciones: "" });
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        if (open) setForm({ tiendaId, montoApertura: '', observaciones: '' })
    }, [open]);

    const handleAbrir = async () => {
        if (!form.montoApertura) return toast.error('El monto de apertura es requerido')
        setSaving(true)
      try {
          console.log("CAJA ID : "+cajaId);
          
            const res = await abrirCaja(cajaId, {
              ...form,
              montoApertura: parseFloat(form.montoApertura),
            });
            if (res.ok) {
                toast.success('Caja abierta correctamente')
                onSuccess()
                onClose()
            } else {
                toast.error(res.message || 'Error al abrir la caja')
            }
        } finally {
            setSaving(false)
        }
    }
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Abrir Caja</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                Monto de apertura (S/) *
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.montoApertura}
                onChange={(e) =>
                  setForm((p) => ({ ...p, montoApertura: e.target.value }))
                }
                placeholder="0.00"
                className="focus-visible:ring-green-500/30 focus-visible:border-green-500"
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
                className="focus-visible:ring-green-500/30 focus-visible:border-green-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button
              onClick={handleAbrir}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white font-bold"
            >
              {saving ? "Abriendo..." : "Abrir Caja"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
};