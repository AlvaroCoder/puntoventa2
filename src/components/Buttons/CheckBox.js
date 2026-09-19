import { Check } from 'lucide-react'
import React from 'react'

export default function CheckBox({ checked, indeterminate, onChange }) {
  return (
     <button
            onClick={onChange}
            className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
            style={{
                background: checked || indeterminate ? '#3960A9' : 'transparent',
                border:     `1.5px solid ${checked || indeterminate ? '#3960A9' : 'rgba(31,47,87,0.22)'}`,
            }}
        >
            {indeterminate
                ? <div className="w-2 h-0.5 bg-white rounded" />
                : checked
                    ? <Check size={10} color="white" strokeWidth={3} />
                    : null
            }
        </button>
  )
};