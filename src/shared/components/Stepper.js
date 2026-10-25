import { Check } from 'lucide-react';
import React from 'react'
import { PASOS } from '../constants/Inventary';

export default function Stepper({paso}) {
  return (
    <div className="flex items-center">
      {PASOS.map((label, i) => {
        const num = i + 1;
        const activo = paso === num;
        const completo = paso > num;
        return (
          <React.Fragment key={num}>
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
                style={{
                  background: activo || completo ? "#3960A9" : "transparent",
                  border:
                    activo || completo
                      ? "none"
                      : "1.5px solid rgba(31,47,87,0.25)",
                  color: activo || completo ? "#fff" : "rgba(31,47,87,0.4)",
                }}
              >
                {completo ? <Check size={13} /> : num}
              </div>
              <span
                className="text-xs font-medium whitespace-nowrap"
                style={{ color: activo ? "#1F2F57" : "rgba(31,47,87,0.4)" }}
              >
                {label}
              </span>
            </div>
            {i < PASOS.length - 1 && (
              <div
                className="w-10 h-px mx-3 shrink-0"
                style={{ background: "rgba(31,47,87,0.15)" }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};