import { IMAGES_ENDPOINTS } from '@/Connections/EndpointsRouter';
import { fetchServer } from '@/lib/fetchServer';

export async function uploadImage(data) {
    return fetchServer(IMAGES_ENDPOINTS.uploadImage(), {
        method: 'POST',
        body: data
    });
};

