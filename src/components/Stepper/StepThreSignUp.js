import InputField from '@/elements/InputField'
import { Building2, Store } from 'lucide-react'
import React from 'react'
import GridSelectCardRubro from '../Cards/GridSelectCardRubro'

export default function StepThreSignUp({
    formData,
    handleInputChange,
    errors,
    handleClickCategory,
    formDataEnterprise
}) {
  return (
      <div className='space-y-4 animate-in slide-in-from-right-4 duration-300'>
          <div className='mb-2'>
              <h2 className='text-xl font-bold text-[#1F4363]'>Tu primer Negocio</h2>
              <p className='text-gray-500 text-sm'>Rubro e identificación de tu primera empresa.</p>
          </div>
          <InputField
              label={"Nombre Comercial"}
              icon={Store}
              name={"businessName"}
              placeholder={"Ej: Bodega El Chino"}
              value={formData?.businessName}
              onChange={handleInputChange}
              error={errors?.businessName}
          />
          <InputField
              label={"RUC Empresa"}
              icon={Building2}
              name="ruc"
              placeholder="2012346789"
              error={errors?.ruc}
            onChange={handleInputChange}  
          />
          <div>
              <label className='text-xs font-bold text-[#333] block mb-2'>Selecciona tu Rubro</label>
              {errors?.rubro && <p className='text-red-500 text-xs mb-2'>{errors?.rubro}</p>}
              <GridSelectCardRubro
                  onClick={handleClickCategory}
                  formData={formDataEnterprise}
              />
          </div>
    </div>
  )
};