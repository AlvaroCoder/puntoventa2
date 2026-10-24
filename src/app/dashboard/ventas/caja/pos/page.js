'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PosRigthPanel from '@/components/Panel/PosRigthPanel'
import PosPanelClients from '@/components/Panel/PosPanelClients'
import PosLeftPanel from '@/components/Panel/PosLeftPanel'
import PosPaymentPanel from '@/components/Panel/PosPaymentPanel'
import { useAuth } from '@/Context/AuthContext'
import { getSesionActual } from '@/Connections/caja'
import SwitcherLoader from '@/components/Navigation/SwitcherLoader'

function POSContent() {
  const searchParams = useSearchParams();
  const cajaId = Number(searchParams.get('cajaId'));
  const { user } = useAuth();
  const [cajaSesion, setCajaSesion] = useState(null);
  const [carrito, setCarrito] = useState([])
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [modo, setModo] = useState('CANT')
  const [buffer, setBuffer] = useState('')
  const [cliente, setCliente] = useState(null)
  const [showClienteModal, setShowClienteModal] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSesionActual() {
      
      try {
        setLoading(true);
        const response = await getSesionActual(cajaId);
        if (response.ok) {
          const data = response.data;
          setCajaSesion(data);
        } else {
          console.error('Error fetching current session:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching current session:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSesionActual();
  }, [cajaId]);

    const addProducto = (producto) => {
        setCarrito(prev => {
            const idx = prev.findIndex(l => l.id === producto.id)
            if (idx >= 0) {
                const next = [...prev]
                next[idx] = { ...next[idx], qty: next[idx].qty + 1 }
                setSelectedIdx(idx)
                setBuffer(String(next[idx].qty))
                return next
            }
            const newIdx = prev.length
            setSelectedIdx(newIdx)
            setBuffer('1');
            console.log(producto);
            
            return [
              ...prev,
              {
                id: producto.id,
                nombre: producto.nombre,
                codigo: producto.codigo,
                precio: producto.precioVenta,
                qty: 1,
                descuento: 0,
              },
            ];
        })
        setModo('CANT')
    }

    const removeLine = (idx) => {
        setCarrito(prev => prev.filter((_, i) => i !== idx))
        setSelectedIdx(null)
        setBuffer('')
    }
  console.log('cajaSesion', cajaSesion);
    return (
      <div
        className="flex h-[calc(100vh-4rem)] overflow-hidden"
        style={{ background: "#F0F4FA" }}
      >
        <SwitcherLoader loading={loading}>
          {!showPayment && (
            <PosLeftPanel
              carrito={carrito}
              setSelectedIdx={setSelectedIdx}
              setBuffer={setBuffer}
              setModo={setModo}
              removeLine={removeLine}
              cliente={cliente}
              modo={modo}
              selectedIdx={selectedIdx}
              setCarrito={setCarrito}
              buffer={buffer}
              setCliente={setCliente}
              setShowClienteModal={setShowClienteModal}
              onCobrar={() => setShowPayment(true)}
            />
          )}

          {showPayment ? (
            <PosPaymentPanel
              carrito={carrito}
              onVolver={() => setShowPayment(false)}
              cajaId={cajaId}
              cajaSesionId={cajaSesion?.id}
              trabajadorId={user?.trabajador_id}
              empresaId={user?.empresa_id}
              tiendaId={cajaSesion?.tienda_id}
              cliente={cliente}
            />
          ) : (
              <PosRigthPanel
                addProducto={addProducto}
                tiendaId={cajaSesion?.tienda_id}
              />
          )}

          {showClienteModal && (
            <PosPanelClients
              setCliente={setCliente}
              setShowClienteModal={setShowClienteModal}
            />
          )}
        </SwitcherLoader>
      </div>
    );
}

export default function PagePOS() {
    return (
        <Suspense>
            <POSContent />
        </Suspense>
    )
}