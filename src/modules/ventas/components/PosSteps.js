'use client'
import { Check } from 'lucide-react'

const STEPS = [
  { label: 'Productos' },
  { label: 'Cobrar' },
  { label: 'Comprobante' },
]

export default function PosSteps({ paso = 1 }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const num = i + 1
        const isCompleted = num < paso
        const isActive = num === paso

        return (
          <div key={num} className="flex items-center">
            {/* Circle */}
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                style={{
                  background: isCompleted
                    ? '#198E7B'
                    : isActive
                    ? '#1F2F57'
                    : 'rgba(31,47,87,0.12)',
                }}
              >
                {isCompleted ? (
                  <Check size={13} color="#fff" strokeWidth={2.5} />
                ) : (
                  <span
                    className="text-xs font-bold"
                    style={{ color: isActive ? '#fff' : 'rgba(31,47,87,0.4)' }}
                  >
                    {num}
                  </span>
                )}
              </div>
              <span
                className="text-xs font-medium hidden sm:block"
                style={{
                  color: isCompleted
                    ? '#198E7B'
                    : isActive
                    ? '#1F2F57'
                    : 'rgba(31,47,87,0.4)',
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line (not after last) */}
            {i < STEPS.length - 1 && (
              <div
                className="mx-3 flex-shrink-0 transition-colors"
                style={{
                  width: 40,
                  height: 1.5,
                  background: isCompleted ? '#198E7B' : 'rgba(31,47,87,0.12)',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
