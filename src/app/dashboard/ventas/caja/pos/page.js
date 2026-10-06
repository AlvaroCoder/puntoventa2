'use client'
import React, { useState, Suspense } from 'react'
import PosRigthPanel from '@/components/Panel/PosRigthPanel'
import PosPanelClients from '@/components/Panel/PosPanelClients'
import PosLeftPanel from '@/components/Panel/PosLeftPanel'

function POSContent() {

    const [carrito, setCarrito] = useState([])
    const [selectedIdx, setSelectedIdx] = useState(null)
    const [modo, setModo] = useState('CANT')
    const [buffer, setBuffer] = useState('')
    const [cliente, setCliente] = useState(null)
    const [showClienteModal, setShowClienteModal] = useState(false)

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

    return (
      <div
        className="flex h-[calc(100vh-4rem)] overflow-hidden"
        style={{ background: "#F0F4FA" }}
      >
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
            />
        
            <PosRigthPanel addProducto={addProducto} />

        {showClienteModal && (
          <PosPanelClients setCliente={setCliente} setShowClienteModal={setShowClienteModal} />
        )}
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