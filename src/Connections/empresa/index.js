import { fetchWithAuth } from '@/lib/fetchwithAuth';

const BASE = '/api/empresas';

export async function getMyEmpresa() {
    return fetchWithAuth(`${BASE}/mi-empresa`);
};

