'use client'
import { TableClientes } from '@/components/Tables'
import TableClientHistorial from '@/components/Tables/TableClientHistorial'
import { getSession } from '@/lib/authentication'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function Page() {
  const URL_GET_CLIENTS = process.env.NEXT_PUBLIC_URL_GET_CLIENTS;
  const [dataClient, setDataClient] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clientSelected, setClientSelected] = useState(null);

  useEffect(()=>{
    async function getData() {
      try {
        setLoading(true);
        const session = await getSession();
        const response = await fetch(URL_GET_CLIENTS,{
          method : 'GET',
          headers : {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${session?.access_token}`
          },
          mode : 'cors'
        });
        const jsonResponse = await response.json();
        setDataClient(jsonResponse);
        toast("Clientes cargados correctamente", {
          type: "success",
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false});
      } catch (error) {
        toast("Error al cargar los clientes", {
          type: "error",
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false})
      } finally{
        setLoading(false);
      }
    }
    getData();
  },[URL_GET_CLIENTS]);
  
  const handleChangeClientSelected=(client)=>{
    setClientSelected(client)
  }

  return (
    <div className='w-full py-4 px-8 overflow-x-auto '>
      <div>
        <h1 className='font-bold text-azulOscuro text-2xl'>Clientes</h1>
        <p className='text-sm text-gray-400'>Gestion de los clientes de PIPO</p>
      </div>
        {
          loading ? 
          <p>Cargando ... </p> :
          <TableClientes
          data={dataClient}
          handleClientSelected={handleChangeClientSelected}
        />
        }
        {
          clientSelected && 
          <TableClientHistorial
            clientSelected={clientSelected}
          />
        }
    </div>
  )
}
