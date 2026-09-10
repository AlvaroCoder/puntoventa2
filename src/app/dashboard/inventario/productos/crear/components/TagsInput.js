'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'

/**
 * TagsInput — chips editables con Enter para agregar y X para quitar.
 * Props:
 *   value: string[]
 *   onChange: (tags: string[]) => void
 *   placeholder?: string
 */
export default function TagsInput({ value = [], onChange, placeholder = 'Escribe y presiona Enter...' }) {
    const [inputVal, setInputVal] = useState('')

    const handleKeyDown = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && inputVal.trim()) {
            e.preventDefault()
            const nuevo = inputVal.trim().toLowerCase()
            if (!value.includes(nuevo)) {
                onChange([...value, nuevo])
            }
            setInputVal('')
        }
        if (e.key === 'Backspace' && !inputVal && value.length > 0) {
            onChange(value.slice(0, -1))
        }
    }

    const removeTag = (tag) => {
        onChange(value.filter(t => t !== tag))
    }

    return (
        <div className="flex flex-wrap gap-1.5 items-center min-h-[38px] px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white focus-within:border-[#FF821E] focus-within:ring-2 focus-within:ring-[#FF821E]/20 transition-all">
            {value.map(tag => (
                <span
                    key={tag}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1F4363]/10 text-[#1F4363] text-xs font-medium"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500 transition-colors"
                    >
                        <X size={11} />
                    </button>
                </span>
            ))}
            <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={value.length === 0 ? placeholder : ''}
                className="flex-1 min-w-[120px] text-sm outline-none bg-transparent placeholder-gray-300 py-0.5"
            />
        </div>
    )
}
