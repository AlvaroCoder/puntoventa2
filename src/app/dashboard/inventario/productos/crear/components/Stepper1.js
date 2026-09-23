import SwitcherLoader from '@/components/Navigation/SwitcherLoader'
import { Search, Warehouse, X } from 'lucide-react'
import React from 'react'
import AlmacenCard from './AlmacenCard'

export default function Stepper1({
    busqAlmacen,
    setBusqAlmacen = () => { },
    setAlmacenSel = ()=>{},
    filteredAlmacenes,
    loading=false,
    almacenSeleccionado
}) {
  return (
      <div className='px-8 py-6 flex flex-col gap-5 max-w-6xl mx-auto w-full'>
          <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4'>                
            <div>
                <h2 className="text-base font-semibold" style={{ color: '#1F2F57' }}>
                    ¿A qué almacén ingresarán los productos?
                </h2>
                <p className="text-xs mt-1" style={{ color: 'rgba(31,47,87,0.55)' }}>
                    Selecciona el almacén de destino para este lote.
                </p>
              </div>
                <div
                    className="flex items-center gap-2 px-3 rounded-lg h-9 min-w-[220px]"
                    style={{ background: '#fff', border: '0.5px solid rgba(31,47,87,0.18)' }}
                >
                    <Search size={14} color="rgba(31,47,87,0.4)" />
                    <input
                        value={busqAlmacen}
                        onChange={e => setBusqAlmacen(e.target.value)}
                        placeholder="Buscar almacén o tienda..."
                        className="bg-transparent outline-none text-xs flex-1 placeholder:text-[rgba(31,47,87,0.35)]"
                        style={{ color: '#1F2F57' }}
                    />
                    {busqAlmacen && (
                        <button onClick={() => setBusqAlmacen('')}>
                            <X size={13} color="rgba(31,47,87,0.4)" />
                        </button>
                    )}
                </div>
          </div>

          <SwitcherLoader>
            <p className="text-xs -mt-1" style={{ color: 'rgba(31,47,87,0.45)' }}>
                {filteredAlmacenes.length} almacén{filteredAlmacenes.length !== 1 ? 'es' : ''} disponible{filteredAlmacenes.length !== 1 ? 's' : ''}
            </p>
          </SwitcherLoader>
            <SwitcherLoader loading={loading}>
                {filteredAlmacenes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredAlmacenes.map(alm => (
                        <AlmacenCard
                            key={alm.id}
                            almacen={alm}
                            selected={almacenSeleccionado === alm.id}
                            onSelect={() => setAlmacenSel(alm.id)}
                        />
                    ))}
                </div>
            ) : (
                <div
                    className="flex flex-col items-center justify-center py-16 bg-white rounded-xl"
                    style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}
                >
                    <Warehouse size={32} color="rgba(31,47,87,0.2)" />
                    <p className="text-sm mt-3" style={{ color: 'rgba(31,47,87,0.5)' }}>
                        No se encontraron almacenes para <strong>&quot;{busqAlmacen}&quot;</strong>
                    </p>
                </div>
                )}
            </SwitcherLoader> 
    </div>
  )
}
