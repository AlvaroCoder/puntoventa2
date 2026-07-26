import { fetchWithAuth } from '@/lib/fetchwithAuth';
import { EMPRESA_ENDPOINTS } from '@/Connections/EndpointRouterExpress';
const ENDPOINTS = EMPRESA_ENDPOINTS;

export async function getMyEmpresa() {
    return fetchWithAuth(ENDPOINTS.getMyEmpresa());
};

