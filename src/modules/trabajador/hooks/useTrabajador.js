'use client';

import { useEffect, useState } from "react";
import { trabajadorService } from "../service/trabajador.service";

export default function useTrabajador() {
    const [trabajador, setTrabajador] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([trabajadorService.getTrabajadores()])
            .then(([trabajad]) => {
                setTrabajador(trabajad);
            })
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);
    return {trabajador, loading, error, setTrabajador}
}