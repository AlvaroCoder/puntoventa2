'use client';
import { getHistorialCreditByIdClient } from '@/Connections/clientes';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'

export default function ListHistorialCreditClient({ idCliente }) {
    const [dataCredit, setDataCredit] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        async function getDataCreditByCliente() {
            try {
                const response = await getHistorialCreditByIdClient(idCliente);
                if (response.error) {
                    setLoading(false);
                    setError(response.error);
                    setDataCredit([]);
                    return;
                }
                setDataCredit(response.data?.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        getDataCreditByCliente();

    }, [idCliente]);
  return (
      <div>
          {loading && <Loader2 className='animate-spin'  />}
          <p>Historial de crediticio</p>
          <p>{ dataCredit}</p>
    </div>
  )
};