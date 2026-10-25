import { useEffect, useRef, useState } from "react";
import { generateCodigo, initial } from "./stepper2.helpers";
import { inventarioService } from "../../service/inventario.service";

export function useStepper2({almacenSeleccionado, handlePayload}) {
    const [reference, setReference] = useState("LOTE-20260922-001");
    const [form, setForm] = useState(initial(generateCodigo()));
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shake, setShake] = useState(false);
    const priceRef = useRef(null);
    
        useEffect(() => {
          inventarioService
            .getCategorias()
            .then(setCategorias)
            .catch(console.error)
            .finally(() => setLoading(false));
        }, []);

        const stock = form.tiene_variantes
          ? form.variantes.reduce((a, v) => a + (Number(v.stock) || 0), 0)
          : Number(form.stock_inicial) || 0;

        const missingPrice = stock > 0 && !form.precio_venta;

        const change = (k, v) => setForm((f) => ({ ...f, [k]: v }));
        const set = (k, v) => setForm((p) => ({ ...p, [k]: v })); 
        const deleteProducto = (id) =>
          setProductos((prev) => prev.filter((p) => p.id !== id));

        const regenerarCodigo = () => change("codigo", generateCodigo());

        const submit = () => {
          const producto = { ...form, id: Date.now(), stock_inicial: stock };
          const nuevosProductos = [...productos, producto];
          setProductos(nuevosProductos);

          handlePayload({
            referencia_lote: reference,
            almacen_id: almacenSeleccionado?.id,
            almacen_nombre: almacenSeleccionado?.nombre,
            fecha_registro: new Date().toISOString(),
            productos: nuevosProductos,
          });

            setForm(initial(generateCodigo()));
            
        };
       return {
         reference,
         setReference,
         form,
         change,
         set,
         productos,
         deleteProducto,
         categorias,
         loading,
         shake,
         priceRef,
         stock,
         missingPrice,
         submit,
         regenerarCodigo,
       };
}