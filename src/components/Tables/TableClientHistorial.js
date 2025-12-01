'use client';
import React, { useEffect } from 'react'

export default function TableClientHistorial({
    clientSelected=null
}) {
    useEffect(()=>{
        async function getDataByClient() {
            
        }
        getDataByClient();
    }, [clientSelected]);
  return (
    <div>
        <div>
            <h1 className='font-bold text-azulOscuro text-2xl'>Historial crediticio de {clientSelected?.nombre_cliente}</h1>
        </div>
    </div>
  )
}
