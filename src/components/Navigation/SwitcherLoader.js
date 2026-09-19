import { Loader2 } from 'lucide-react'
import React from 'react'

export default function SwitcherLoader({loading, children}) {
    if (loading) { 
        return (
            <div>
                <Loader2 className="animate-spin" />
            </div>
        )
    }
    return children
}
