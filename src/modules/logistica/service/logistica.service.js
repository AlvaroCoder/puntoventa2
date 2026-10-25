
import { getOrdenesByEmpresa } from "@/Connections/logistica";
import { getSession } from "@/lib/authentication";

export const logisticaService = {
    

    async getOrdenesByEmpresa() { 
        try {
            const session = await getSession();
            if (!session) {
                throw new Error("No autorizado");
            }
            const empresaId = session.empresa_id;
            const response = await getOrdenesByEmpresa(empresaId);
            if (!response.ok) {
                throw new Error(`Error fetching ordenes: ${response.statusText}`);
            }
            return response?.data || [];
        } catch (error) {
            console.error("Error in getOrdenesByEmpresa:", error);
            throw error;
        }
    }
}