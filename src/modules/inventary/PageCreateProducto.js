import Stepper from '@/shared/components/Stepper';
import React from 'react'
import StepperProduct1 from './components/StepperProduct1';
import { Check, Loader2, Save } from 'lucide-react';
import StepperProduct2 from './components/StepperProduct2';

export default function PageCreateProducto({
    pasoActual,
    setPasoActual,
    filteredAlmacenes,
    handleConfirmar,
    loading,
    guardando,
    busqAlmacen,
    setBusqAlmacen,
    setAlmacenSel,
  almacenSeleccionado,
  almacenActual,
  setPayload,
    hayErrores
}) {
  return (
    <div className="min-h-screen bg-[#E1E7F0] pb-24">
      <div
        className="bg-white px-8 py-5"
        style={{ borderBottom: "0.5px solid rgba(31,47,87,0.1)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold" style={{ color: "#1F2F57" }}>
              Ingreso de productos en lote
            </h1>
            <p
              className="text-xs mt-0.5"
              style={{ color: "rgba(31,47,87,0.55)" }}
            >
              Registra varios productos a la vez para el almacén seleccionado.
            </p>
          </div>
          <Stepper paso={pasoActual} />
        </div>
      </div>

      {pasoActual === 1 && (
        <StepperProduct1
          busqAlmacen={busqAlmacen}
          setBusqAlmacen={setBusqAlmacen}
          setAlmacenSel={setAlmacenSel}
          filteredAlmacenes={filteredAlmacenes}
          loading={loading}
          almacenSeleccionado={almacenSeleccionado}
        />
      )}

      {pasoActual === 2 && (
        <StepperProduct2
          almacenSeleccionado={almacenActual}
          handlePayload={setPayload}
        />
      )}

      <div
        className="fixed bottom-0 left-0 right-0 z-30 bg-white"
        style={{
          borderTop: "0.5px solid rgba(31,47,87,0.12)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div className="max-w-6xl mx-auto px-8 py-3.5 flex items-center justify-between gap-3">
          {pasoActual === 1 ? (
            <>
              <button
                onClick={() =>
                  router.push("/dashboard/inventario/productos/crear")
                }
                className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
                style={{
                  color: "rgba(31,47,87,0.6)",
                  border: "0.5px solid rgba(31,47,87,0.18)",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => setPasoActual(2)}
                disabled={!almacenSeleccionado}
                className="flex items-center gap-1.5 text-xs font-bold px-5 py-2 rounded-lg text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "#1F2F57" }}
              >
                Continuar →
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setPasoActual(1)}
                className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
                style={{
                  color: "rgba(31,47,87,0.6)",
                  border: "0.5px solid rgba(31,47,87,0.18)",
                }}
              >
                ← Volver
              </button>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
                  style={{
                    color: "#3960A9",
                    border: "0.5px solid rgba(57,96,169,0.3)",
                  }}
                >
                  <Save size={14} />
                  Guardar borrador
                </button>
                <button
                  onClick={handleConfirmar}
                  disabled={guardando || hayErrores}
                  className="flex items-center gap-1.5 text-xs font-bold px-5 py-2 rounded-lg text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "#1F2F57" }}
                >
                  {guardando ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />{" "}
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Check size={14} /> Confirmar lote
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};