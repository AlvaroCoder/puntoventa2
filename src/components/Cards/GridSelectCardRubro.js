import SelectableCard from '@/elements/SelectableCard';
import { useFetch } from '@/hooks/useHooks'
import React from 'react'

const URL_FETCH_RUBROS = "http://localhost:3030/api/rubro/"

export default function GridSelectCardRubro({onClick}) {
    const {data : dataRubros, loading : loadingDataRubros } = useFetch(URL_FETCH_RUBROS);
    
    if (loadingDataRubros) {
        return (<div>Cargando rubros...</div>)
    }

    else {
        return (
            <div className='grid grid-cols-2 gap-3'>
                {dataRubros?.rubros?.map((rubro, index) => (
                    <SelectableCard
                        key={index}
                        title={rubro?.nombre}
                        icon={rubro?.icono}
                        onClick={onClick}
                    />
                ))}
            </div>
        )
    }
};