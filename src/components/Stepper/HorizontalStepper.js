import { Check } from 'lucide-react';
import React from 'react'
const STEPS = [
  { id: 1, title: "Tu Cuenta",       subtitle: "Credenciales de acceso"   },
  { id: 2, title: "Datos Personales", subtitle: "Información del titular"  },
  { id: 3, title: "Tu Negocio",      subtitle: "Rubro e identificación"   },
  { id: 4, title: "Escala",          subtitle: "Dimensiones de la empresa" },
];

export default function HorizontalStepper({currentStep}) {
  return (
    <div className="flex items-start gap-1.5 mb-6">
      {STEPS.map((step, index) => {
        const isActive    = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1.5 min-w-0">
              <div className={`
                w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 transition-all duration-300
                ${isActive    ? "bg-[#FE811F] border-[#FE811F] text-white shadow-md shadow-orange-500/25" : ""}
                ${isCompleted ? "bg-[#1B8D7C] border-[#1B8D7C] text-white" : ""}
                ${!isActive && !isCompleted ? "border-gray-200 text-gray-300" : ""}
              `}>
                {isCompleted ? <Check size={12} /> : step.id}
              </div>
              <span className={`text-[10px] font-semibold text-center leading-tight whitespace-nowrap ${isActive ? "text-[#1F4363]" : "text-gray-400"}`}>
                {step.title}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mt-3.5 rounded-full transition-colors duration-500 ${isCompleted ? "bg-[#1B8D7C]" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  )
}
