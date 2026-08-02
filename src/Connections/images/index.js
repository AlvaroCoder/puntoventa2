import { fetchWithAuthFormData } from '@/lib/fetchwithAuth';
import { IMAGES_ENDPOINTS } from '@/Connections/EndpointsRouter';

export async function uploadImage(data) {
    return fetchWithAuthFormData(IMAGES_ENDPOINTS.uploadImage(), {
        method: 'POST',
        body: data
    });
}