"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/Context/AuthContext";
import { toast } from "react-toastify";
import PageCreateCategory from "@/modules/inventary/PageCreateCategory";
import useInventario from "@/modules/inventary/hooks/useInventario";
import { inventarioService } from "@/modules/inventary/service/inventario.service";

export default function Page() {
  const router = useRouter();
  const { categorias, loading: loadingCategorias } = useInventario();
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const [nombreFocused, setNombreFocused] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    codigo: "",
    categoria_padre_id: null,
    activa: true,
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await inventarioService.createCategoria({
        empresa_id: user?.empresa_id,
        ...form,
      });
      toast.success("Categoría creada correctamente");
      router.push("/dashboard/inventario/categoria");
    } catch (error) {
      toast.error(error.message || "No se pudo crear la categoría");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageCreateCategory
      loading={loadingCategorias || submitting}
      handleSubmit={handleSubmit}
      form={form}
      setNombreFocused={setNombreFocused}
      nombreFocused={nombreFocused}
      set={set}
      categorias={categorias}
    />
  );
}
