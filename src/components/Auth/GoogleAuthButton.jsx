'use client'
import { GoogleLogin } from '@react-oauth/google'
import { loginWithGoogle } from '@/lib/authentication'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function GoogleAuthButton() {
    const router = useRouter()

    const handleSuccess = async (credentialResponse) => {
        const result = await loginWithGoogle(credentialResponse.credential)
        if (result.error) {
            toast.error(result.message || 'Error al iniciar sesión con Google')
            return
        }
        if (result.isNewUser) {
            router.push('/signup?step=complete')
        } else {
            router.push('/dashboard')
        }
    }

    const handleError = () => {
        toast.error('No se pudo iniciar sesión con Google')
    }

    return (
        <div className="flex justify-center">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                theme="outline"
                shape="rectangular"
                text="signin_with"
                locale="es"
            />
        </div>
    )
}
