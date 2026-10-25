'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { createAlmacen } from '@/Connections/almacen'
import { useAuth } from '@/Context/AuthContext'
import PageCreateTienda from '@/modules/inventary/PageCreateTienda'
import { generateCodigo } from '@/modules/inventary/components/StepperProduct2/stepper2.helpers'
import { inventarioService } from '@/modules/inventary/service/inventario.service'

const ALMACEN_INITIAL = () => ({
  _id: crypto.randomUUID(),
  nombre: "",
  codigo: "",
  tipo: "VITRINA",
  descripcion: "",
});

export default function CreateTiendaPage() {
    const router = useRouter()
    const { user } = useAuth();
    
    const [nombreFocused, setNombreFocused] = useState(false)
    const [loading, setLoading]             = useState(false)
    const [form, setForm] = useState({
        nombre: '',
        codigo: '',
        direccion: '',
        telefono: '',
        responsable: '',
        fecha_apertura: '',
    })
    const [almacenes, setAlmacenes] = useState([])

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

    const handleNombreBlur = () => {
        setNombreFocused(false)
        if (!form.codigo && form.nombre.trim())
            set('codigo', generateCodigo(form.nombre))
    }

    const addAlmacen = () => setAlmacenes(prev => [...prev, ALMACEN_INITIAL()])
    const onFocusInput = (e) => {
        e.target.style.borderColor = "#3960A9";
        e.target.style.boxShadow = "0 0 0 3px rgba(57,96,169,0.1)";
    };
    const onBlurInput = (e) => {
        e.target.style.borderColor = "rgba(31,47,87,0.18)";
        e.target.style.boxShadow = "none";
    };
        const removeAlmacen = (id) =>
          setAlmacenes((prev) => prev.filter((a) => a._id !== id));
        const updateAlmacen = (id, k, v) =>
          setAlmacenes((prev) =>
            prev.map((a) => (a._id === id ? { ...a, [k]: v } : a)),
          );
    const handleSubmit = async () => {
        try {
            setLoading(true);
           
            const payload = {
                empresa_id: user?.empresa_id,
                nombre: form.nombre,
                codigo: form.codigo,
                direccion: form.direccion,
                telefono: form.telefono,
                responsable: form.responsable,
                fecha_apertura: form.fecha_apertura,
            }
            const responseCreateTienda = await inventarioService.createTienda(payload);
            const jsonResponseCreateTienda = responseCreateTienda.data;
            
            if (almacenes.length > 0) {
                const tiendaId = jsonResponseCreateTienda?.id;
                await Promise.all(
                  almacenes.map(async ({ _id, ...rest }) => {
                    await createAlmacen({ tiendaId, ...rest });
                  }),
                );
            }
            toast.success("Se creo correctamente la tienda")
            router.push('/dashboard/inventario/tienda')
        } catch (error) {
            console.log("ERROR. : ", error)
            toast.error('No se pudo guardar la tienda')
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageCreateTienda
            loading={loading}
            form={form}
            handleNombreBlur={handleNombreBlur}
            setNombreFocused={setNombreFocused}
            set={set}
            handleSubmit={handleSubmit}
            nombreFocused={nombreFocused}
            almacenes={almacenes}
            addAlmacen={addAlmacen}
            onFocusInput={onFocusInput}
            onBlurInput={onBlurInput}
            updateAlmacen={updateAlmacen}
            removeAlmacen={removeAlmacen}
        />
    )
}