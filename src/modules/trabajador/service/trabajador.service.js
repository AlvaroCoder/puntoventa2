export const trabajadorService = {
    async getTrabajadores() {
        const response = await fetch('/api/almacenes', { method: 'GET' });
        if (!response.ok) throw new Error("Error al obtener las tiendas");
        const data = await response.json();
        return data;
    }
}