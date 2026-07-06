'use client';
import React, { useState, useEffect } from 'react'
import { toast } from "react-toastify";
import {
  createCaja,
  updateCaja,
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

export default function DialogCaja({
    open,
    onClose,
    caja,
    tiendaId,
    onSuccess
}) {
    const isEdit = !!caja;
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    codigo: '',
    moneda : 'PEN'
  });
    const [saving, setSaving] = useState(false);
    
    useEffect(() => {
      if (open) setForm({
        nombre: caja?.nombre ?? '',
        descripcion: caja?.descripcion ?? '',
        codigo: caja?.codigo ?? '',
        moneda: caja?.moneda ?? 'PEN'
      })
    }, [open, caja]);
    
    const handleSave = async () => {
        if (!form.nombre.trim()) return toast.error('El nombre es requerido')
        setSaving(true)
        try {
            const body = isEdit ? form : { ...form, tienda_id: tiendaId }
            const res = isEdit ? await updateCaja(caja.id, body) : await createCaja(body)
            if (res.ok) {
                toast.success(isEdit ? 'Caja actualizada' : 'Caja creada')
                onSuccess()
                onClose()
            } else {
                toast.error(res.message || 'Error al guardar la caja')
            }
        } finally {
            setSaving(false)
        }
    }
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Caja" : "Nueva Caja"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Nombre *
            </label>
            <Input
              value={form.nombre}
              onChange={(e) =>
                setForm((p) => ({ ...p, nombre: e.target.value }))
              }
              placeholder="Ej: Caja Principal"
              className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Codigo *
            </label>
            <Input
              value={form.codigo}
              onChange={(e) =>
                setForm((p) => ({ ...p, codigo: e.target.value }))
              }
              placeholder="Ej: Caja Principal"
              className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
            />
          </div>

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold"
          >
            {saving ? "Guardando..." : isEdit ? "Actualizar" : "Crear Caja"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};