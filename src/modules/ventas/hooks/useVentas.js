import { useState } from "react";
import { ventasService } from "../service/ventas.service";
import {useLoading} from "@/Context/LoadingContext"
export default function useVentas() {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {withLoading} = useLoading();
    useEffect(() => {
        withLoading(Promise.all([ventasService.getVentas()]))
            .then(([ventas]) => {
                setVentas(ventas)
            }).catch(setError)
            .finally(() => setLoading(false));
    }, []);

    return {ventas, loading, error, setVentas}
}