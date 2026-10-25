"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PageCreateProducto from "@/modules/inventary/PageCreateProducto";
import useAlmacen from "@/modules/inventary/hooks/useAlmacen";
import { inventarioService } from "@/modules/inventary/service/inventario.service";
import useTrabajador from "@/modules/trabajador/hooks/useTrabajador";

export default function LotePage() {
  const router = useRouter();
  const { almacen: almacenes, loading } = useAlmacen();
  const { trabajador, loading: loadingTrabajador } = useTrabajador();

  const [pasoActual, setPasoActual] = useState(1);
  const [almacenSeleccionado, setAlmacenSel] = useState(null);
  const [busqAlmacen, setBusqAlmacen] = useState("");
  const [filas, setFilas] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [payload, setPayload] = useState(null);

  const almacenActual =
    almacenes?.find((a) => a.id === almacenSeleccionado) ?? null;

  const filteredAlmacenes = useMemo(
    () =>
      (almacenes ?? []).filter(
        (a) =>
          a.nombre.toLowerCase().includes(busqAlmacen.toLowerCase()) ||
          a.tienda.toLowerCase().includes(busqAlmacen.toLowerCase()),
      ),
    [busqAlmacen, almacenes],
  );

  const hayErrores = filas.some(
    (f) => parseInt(f.stock) > 0 && !f.precio.trim(),
  );

  const handleConfirmar = async () => {
    if (hayErrores) return;

    const productos = payload?.productos;
    const almacenId = payload?.almacen_id ?? almacenActual?.id ?? null;

    if (!productos || productos.length === 0) {
      toast.error("Agrega al menos un producto antes de confirmar");
      return;
    }

    try {
      setGuardando(true);

      const resultados = await Promise.allSettled(
        productos.map((producto) => {
          const variantes = producto.variantes ?? [];
          const body = {
            nombre: producto.nombre,
            codigo: producto.codigo || null,
            categoriaId: producto.categoria || null,
            precioVenta: parseFloat(producto.precio_venta) || null,
            precioCompra: parseFloat(producto.precio_compra) || null,
            unidadMedida: producto.unidad || "UNIDAD",
            tieneVariantes: variantes.length > 0,
            trabajadorId: trabajador?.id,
            stockInicial: parseInt(producto.stock_inicial) || 0,
            stockMinimo: parseInt(producto.stock_minimo) || 0,
            almacenId:
              (parseInt(producto.stock_inicial) || 0) > 0 ? almacenId : null,
            variantes:
              variantes.length > 0
                ? variantes.map((v) => ({
                    talla: v.talla || null,
                    color: v.color || null,
                    codigoVariante: v.codigo || null,
                    codigoBarras: v.codigoBarras || null,
                    precioAdicional: parseFloat(v.precioAdicional) || 0,
                    stockInicial: parseInt(v.stock) || 0,
                    stockMinimo: parseInt(v.stockMin) || 0,
                  }))
                : null,
          };
          return inventarioService.createProducto(body);
        }),
      );

      const exitosos = resultados.filter(
        (r) => r.status === "fulfilled",
      ).length;
      const fallidos = resultados.filter((r) => r.status === "rejected").length;

      if (fallidos > 0) {
        toast.warning(
          `${exitosos} producto(s) creados, ${fallidos} no se pudieron registrar`,
        );
      } else {
        toast.success(
          `${exitosos} producto${exitosos > 1 ? "s" : ""} registrado${exitosos > 1 ? "s" : ""} correctamente`,
        );
        router.push("/dashboard/inventario/productos");
      }
    } catch (err) {
      console.error("Error al confirmar lote:", err);
      toast.error("Error al confirmar el lote");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <PageCreateProducto
      pasoActual={pasoActual}
      setPasoActual={setPasoActual}
      filteredAlmacenes={filteredAlmacenes}
      handleConfirmar={handleConfirmar}
      guardando={guardando}
      busqAlmacen={busqAlmacen}
      setBusqAlmacen={setBusqAlmacen}
      setAlmacenSel={setAlmacenSel}
      almacenSeleccionado={almacenSeleccionado}
      almacenActual={almacenActual}
      setPayload={setPayload}
      hayErrores={hayErrores}
      loading={loading || loadingTrabajador}
    />
  );
}
