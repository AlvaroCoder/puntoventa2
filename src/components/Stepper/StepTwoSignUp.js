import InputField from '@/elements/InputField'
import { CreditCard, Phone, User } from 'lucide-react'
import React from 'react'

export default function StepTwoSignUp({
    formData,
    handleInputChange,
    errors
}) {

  return (
    <div className='space-y-5 animate-in slide-in-from-right-4 duration-300'>
        <div className='mb-2'>
              <h2 className="text-xl font-bold text-[#1F4363]">¿Quién administra?</h2>
               <p className="text-gray-500 text-sm">Necesitamos saber quién es el responsable.</p>
        </div>
          <InputField
              label="Nombre Completo"
              icon={User}
              name="fullName"
              type="text"
              placeholder="Ingresa tu nombre"
              value={formData?.fullName}
              onChange={handleInputChange}
              error={errors?.fullName}
          />  
          <InputField
              label={"Ingresa tu (DNI/RUC)"}
              icon={CreditCard}
              name="dni"
              type="text"
              placeholder="DNI"
              value={formData?.dni}
              onChange={handleInputChange}
              error={errors?.dni || errors?.ruc}
              onBlur={handleBlurDniRuc}
          />
          <InputField
              label={"Teléfono / Celular"}
              icon={Phone}
              name="phone"
              type="tel"
              placeholder="+51 999 999 999 "
              value={formData?.phone}
              onChange={handleInputChange}
              error={errors?.phone}
          />
    </div>  
  )
};