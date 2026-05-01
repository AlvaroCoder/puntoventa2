'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getSession } from '@/lib/authentication'

const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    loading : false
})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadSession() {
            try {
                const session = await getSession();                
                setUser(session ?? null)
            } catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        loadSession()
    }, [])

    const isAuthenticated = !!user?.access_token

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth debe usarse dentro de <AuthProvider>')
    }
    return context
}