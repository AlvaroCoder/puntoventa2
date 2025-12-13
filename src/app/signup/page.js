'use client'
import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Store, 
  ArrowRight, 
  ArrowLeft,
  Check,
  Building2,
  MapPin,
  Loader2
} from 'lucide-react';
import InputField from '@/elements/InputField';
import SelectableCard from '@/elements/SelectableCard';
import InputPassword from '@/elements/InputPassword';
import { validateEmail } from '@/lib/validation';
import { getVerificarDocumento, getVerificarEmail } from '../../../API/user/getConnections';
import GridSelectCardRubro from '@/components/Cards/GridSelectCardRubro';

const STEPS = [
  { id: 1, title: "Tu Cuenta", subtitle: "Credenciales de acceso" },
  { id: 2, title: "Datos Personales", subtitle: "Información del titular" },
  { id: 3, title: "Tu Negocio", subtitle: "Rubro e identificación" },
  { id: 4, title: "Escala", subtitle: "Dimensiones de la empresa" }
];

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    fullName: '', dni: '', phone: '',
    businessName: '', ruc: '', businessType: '',
    storeCount: ''
  });
  const [errors, setErrors] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors(prev => {
        const newErr = { ...prev };
        delete newErr[name];
        return newErr;
      });
    }
  };

  const changeStep = async (direction) => {
   if (direction === 'prev') {
      setCurrentStep(prev => prev - 1);
      return;
    }

    setIsLoading(true);
    let hasError = false;
    setErrors({}); 

    try {
      switch (currentStep) {
        case 1:
          if (!formData.email) {
             setErrors(prev => ({ ...prev, email: "El correo es obligatorio" }));
             hasError = true;
          } else if (!validateEmail(formData.email)) {
             setErrors(prev => ({ ...prev, email: "Formato de correo inválido" }));
             hasError = true;
          }

          if (!formData.password || formData.password.length < 8) {
             setErrors(prev => ({ ...prev, password: "Mínimo 8 caracteres" }));
             hasError = true;
          }

          if (formData.password !== formData.confirmPassword) {
             alert("Las contraseñas no coinciden"); 
             hasError = true;
          }

          if (!hasError) {
            const emailStatus = await getVerificarEmail(formData.email);
            if (emailStatus === 404) {
              setErrors(prev => ({ ...prev, email: "Este correo ya está registrado" }));
              hasError = true;
            }
          }
          break;

        case 2: 
          if (!formData.fullName) {
            setErrors(prev => ({ ...prev, fullName: "Nombre completo requerido" }));
            hasError = true;
          }
          if (!formData.dni) {
            setErrors(prev => ({ ...prev, dni: "Documento requerido" }));
            hasError = true;
          }
          if (!formData.phone) {
             setErrors(prev => ({ ...prev, phone: "Teléfono requerido" }));
             hasError = true;
          }

          if (!hasError) {
             const docStatus = await getVerificarDocumento(formData.dni);
             if (docStatus === 404) {
               setErrors(prev => ({...prev, dni : "Documento inválido o ya registrado"}));
               hasError = true;
             }
          }
          break;

        case 3: 
           if (!formData.businessName) { setErrors(prev => ({...prev, businessName: "Nombre del negocio requerido"})); hasError = true; }
           if (!formData.ruc) { setErrors(prev => ({...prev, ruc: "RUC requerido"})); hasError = true; }
           if (!formData.businessType) { alert("Por favor selecciona un rubro para continuar"); hasError = true; }
           break;
        
        case 4: 
           if (!formData.storeCount) { alert("Selecciona una escala"); hasError = true; }
           break;
      }
    } catch (error) {
      console.error("Error en validación:", error);
      hasError = true;
    }

    setIsLoading(false);

    if (!hasError) {
       if (currentStep < 4) {
          setCurrentStep(prev => prev + 1);
       } else {
          alert("¡Registro Exitoso! Redirigiendo...");
       }
    }
  };

  const handleSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const renderStepContent = () => {
    if (isLoading) {
      return (
        <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
          <Loader2 className="w-12 h-12 text-[#FF821E] animate-spin mb-4" />
          <p className="text-[#1F4363] font-medium">Procesando...</p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#1F4363]">Crea tu cuenta</h2>
              <p className="text-gray-500 text-sm">Comencemos con tus credenciales de acceso.</p>
            </div>
            <InputField
              label="Correo Electrónico"
              icon={Mail}
              name="email"
              type="email"
              placeholder="ejemplo@empresa.com"
              value={formData.email}
              onChange={handleInputChange}
              error={errors?.email}
            />
            <InputPassword 
              label="Contraseña" 
              name="password" 
              placeholder="Mínimo 8 caracteres" 
              value={formData.password} 
              onChange={handleInputChange} 
              error={errors?.password}
            />
            <InputPassword 
              label="Confirmar Contraseña" 
              name="confirmPassword" 
              placeholder="Repite tu contraseña" 
              value={formData.confirmPassword} 
              onChange={handleInputChange} 
            />
          </div>
        );

      case 2: 
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#1F4363]">¿Quién administra?</h2>
              <p className="text-gray-500 text-sm">Necesitamos saber quién es el responsable.</p>
            </div>
            <InputField
              label="Nombre Completo"
              icon={User}
              name="fullName"
              type="text"
              placeholder="Juan Pérez"
              value={formData.fullName}
              onChange={handleInputChange}
            />
            <InputField
              label="Documento (DNI / RUC)"
              icon={CreditCard}
              name="dni"
              type="text"
              placeholder="Número de documento"
              value={formData.dni}
              onChange={handleInputChange} />
            <InputField label="Teléfono / Celular" icon={Phone} name="phone" type="tel" placeholder="+51 999 999 999" value={formData.phone} onChange={handleInputChange} />
          </div>
        );

      case 3:
        return (
          <div className="h-full flex flex-col md:flex-row gap-6 animate-in slide-in-from-right-4 duration-300">
            <div className="w-full space-y-4">
              <div className="space-y-4 mb-6">
                <InputField label="Nombre Comercial" icon={Store} name="businessName" placeholder="Ej: Bodega El Chino" value={formData.businessName} onChange={handleInputChange} />
                <InputField label="RUC Empresa" icon={Building2} name="ruc" placeholder="20123456789" value={formData.ruc} onChange={handleInputChange} />
              </div>
              
              <label className="text-sm font-bold text-[#333333] ml-1 block mb-2">Selecciona tu Rubro</label>
              <GridSelectCardRubro/>
            </div>
          </div>
        );

      case 4: 
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#1F4363]">¿Qué tan grande eres?</h2>
              <p className="text-gray-500 text-sm">Esto nos ayuda a preparar tu infraestructura.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <SelectableCard 
                  title="Solo 1" 
                  desc="Estoy empezando"
                  icon={MapPin} 
                  selected={formData.storeCount === '1'} 
                  onClick={() => handleSelect('storeCount', '1')} 
                />
                <SelectableCard 
                  title="2 a 5" 
                  desc="En crecimiento"
                  icon={Building2} 
                  selected={formData.storeCount === '2-5'} 
                  onClick={() => handleSelect('storeCount', '2-5')} 
                />
                <SelectableCard 
                  title="+ de 5" 
                  desc="Cadena / Franquicia"
                  icon={Store} 
                  selected={formData.storeCount === '5+'} 
                  onClick={() => handleSelect('storeCount', '5+')} 
                />
            </div>

            <div className="bg-[#198E7B]/10 p-4 rounded-xl flex gap-3 items-start">
               <Check className="text-[#198E7B] mt-1 flex-shrink-0" size={20} />
               <div>
                 <h4 className="font-bold text-[#198E7B] text-sm">Configuración Automática</h4>
                 <p className="text-xs text-gray-600 mt-1">
                   Crearemos {formData.storeCount === '1' ? 'tu tienda principal' : 'tu panel multi-sede'} inmediatamente al terminar.
                 </p>
               </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center   md:p-8 font-sans">
      
      <div className="bg-white w-full max-w-5xl h-[650px] rounded-3xl shadow-2xl overflow-hidden mt-14 flex flex-col md:flex-row border border-gray-100">
        
        <div className="w-full md:w-80 bg-[#1F4363] p-8 flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-[#FF821E] rounded-full blur-3xl"></div>
           </div>

           <div className="relative z-10">
             <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 bg-[#FF821E] rounded-xl flex items-center justify-center text-white font-extrabold shadow-lg">360</div>
                <span className="text-white font-bold text-xl tracking-tight">Registro</span>
             </div>

             <div className="space-y-8">
                {STEPS.map((step, index) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = step.id < currentStep;

                  return (
                    <div key={step.id} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                          ${isActive ? 'bg-[#FF821E] border-[#FF821E] text-white scale-110 shadow-lg shadow-orange-500/30' : ''}
                          ${isCompleted ? 'bg-[#198E7B] border-[#198E7B] text-white' : ''}
                          ${!isActive && !isCompleted ? 'border-white/20 text-white/40' : ''}
                        `}>
                          {isCompleted ? <Check size={16} /> : step.id}
                        </div>
                        {index !== STEPS.length - 1 && (
                          <div className={`w-0.5 h-full mt-2 rounded-full transition-colors duration-500 ${isCompleted ? 'bg-[#198E7B]' : 'bg-white/10'}`}></div>
                        )}
                      </div>
                      <div className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                        <h4 className="text-white font-bold text-sm">{step.title}</h4>
                        <p className="text-gray-400 text-xs">{step.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
             </div>
           </div>

        </div>

        <div className="flex-1 flex flex-col relative">
          
          <div className="md:hidden p-4 border-b bg-gray-50 flex justify-between items-center">
             <span className="font-bold text-[#1F4363]">Paso {currentStep} de 4</span>
             <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
               <div className="h-full bg-[#FF821E] transition-all duration-300" style={{ width: `${(currentStep/4)*100}%` }}></div>
             </div>
          </div>

          <div className="flex-1 p-8 md:p-12 overflow-y-auto">
             {renderStepContent()}
          </div>

          <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center">
             <button 
                onClick={() => changeStep('prev')}
                disabled={currentStep === 1 || isLoading}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors
                  ${currentStep === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#1F4363] hover:bg-gray-50'}
                `}
             >
               <ArrowLeft size={18} />
               Atrás
             </button>

             <button 
                onClick={() => currentStep === 4 ? alert('Registro completado!') : changeStep('next')}
                disabled={isLoading}
                className="
                  flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-[#FF821E] text-white 
                  hover:bg-[#e5700f] shadow-lg shadow-orange-500/20 active:scale-95 transition-all
                  disabled:opacity-70 disabled:cursor-wait
                "
             >
               {currentStep === 4 ? 'Finalizar' : 'Continuar'}
               {!isLoading && <ArrowRight size={18} />}
             </button>
          </div>
        </div>

      </div>
    </div>
  )
};