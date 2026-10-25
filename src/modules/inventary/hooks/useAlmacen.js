import { useEffect, useState } from "react";
import { inventarioService } from "../service/inventario.service";

export default function useAlmacen() {
    const [almacen, setAlmacen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([inventarioService.getAlmacenes()])
            .then(([almac]) => {
                setAlmacen(almac)
            }).catch(setError)
            .finally(() => setLoading(false));
    }, []);

    return {almacen, loading, error, setAlmacen}
}