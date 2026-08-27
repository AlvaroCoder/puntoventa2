"use client";
import React, { useState } from "react";
import {
  Store, ArrowRight, ArrowLeft, Check, Building2, MapPin, Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SelectableCard from "@/elements/SelectableCard";
import { validateEmail } from "@/lib/validation";
import { getVerificarDocumento, getVerificarEmail } from "../../../API/user/getConnections";
import { REGISTER_USER, CREATE_COMPANY } from "@/conexion/apiconexion";
import { login } from "@/lib/authentication";
import { useRouter } from "next/navigation";
import MarketingPanel from "@/components/Panel/MarketingPanel";
import HorizontalStepper from "@/components/Stepper/HorizontalStepper";
import StepOneSignUp from "@/components/Stepper/StepOneSignUp";
import StepTwoSignUp from "@/components/Stepper/StepTwoSignUp";
import StepThreSignUp from "@/components/Stepper/StepThreSignUp";


const URL_LOGO = "https://res.cloudinary.com/dabyqnijl/image/upload/v1787111787/puntoVenta360/Logo_Punto_Venta_wrgis4.png"

const PASSWORD_REQS = [
  (p) => p.length >= 8,
  (p) => /[A-Z]/.test(p),
  (p) => /[a-z]/.test(p),
  (p) => /\d/.test(p),
  (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
]

export default function SignUpPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading,   setIsLoading]   = useState(false);
  const [formData, setFormData] = useState({
    email: "", password: "", confirmPassword: "",
    fullName: "", dni: "", phone: "",
    businessName: "", ruc: "", businessType: "", storeCount: "",
  });
  const [haveContinue, setHaveContinue] = useState(false);
  const [formDataEnterprise, setFormDataEnterprise] = useState({ rubro_id: 1 });
  const [errors,      setErrors]      = useState({});
  const [submitError, setSubmitError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const changeStep = async (direction) => {
    if (direction === "prev") { setCurrentStep((p) => p - 1); return; }

    setIsLoading(true);
    let hasError = false;
    setErrors({});

    try {
      switch (currentStep) {

        case 1: {
          if (!formData.email) {
            setErrors((p) => ({ ...p, email: "El correo es obligatorio" })); hasError = true;
          } else if (!validateEmail(formData.email)) {
            setErrors((p) => ({ ...p, email: "Formato de correo inválido" })); hasError = true;
          }
          if (!formData.password) {
            setErrors((p) => ({ ...p, password: "La contraseña es obligatoria" })); hasError = true;
          } else if (!PASSWORD_REQS.every(r => r(formData.password))) {
            setErrors((p) => ({ ...p, password: "La contraseña no cumple todos los requisitos" })); hasError = true;
          }
          if (!formData.confirmPassword) {
            setErrors((p) => ({ ...p, confirmPassword: "Confirma tu contraseña" })); hasError = true;
          } else if (formData.password !== formData.confirmPassword) {
            setErrors((p) => ({ ...p, confirmPassword: "Las contraseñas no coinciden" })); hasError = true;
          }
          if (!hasError) {
            const emailStatus = await getVerificarEmail(formData.email);
            if (emailStatus === 404) {
              setErrors((p) => ({ ...p, email: "Este correo ya está registrado" })); hasError = true;
            }
          }
          break;
        }

        case 2: {
          if (!formData.fullName.trim()) {
            setErrors((p) => ({ ...p, fullName: "Nombre completo requerido" })); hasError = true;
          }
          const dniClean = formData.dni.trim();
          if (!dniClean) {
            setErrors((p) => ({ ...p, dni: "Documento requerido" })); hasError = true;
          } else if (!/^\d+$/.test(dniClean)) {
            setErrors((p) => ({ ...p, dni: "Solo se permiten dígitos" })); hasError = true;
          } else if (dniClean.length !== 8 && dniClean.length !== 11) {
            setErrors((p) => ({ ...p, dni: "DNI debe tener 8 dígitos o RUC 11 dígitos" })); hasError = true;
          }
          const phoneClean = formData.phone.replace(/\s+/g, "");
          if (!phoneClean) {
            setErrors((p) => ({ ...p, phone: "Teléfono requerido" })); hasError = true;
          } else if (!/^9\d{8}$/.test(phoneClean)) {
            setErrors((p) => ({ ...p, phone: "Ingresa un celular peruano válido (9XXXXXXXX)" })); hasError = true;
          }
          if (!hasError) {
            const docStatus = await getVerificarDocumento(dniClean);
            if (docStatus === 404) {
              setErrors((p) => ({ ...p, dni: "Documento inválido o ya registrado" })); hasError = true;
            }
          }
          break;
        }

        case 3: {
          if (!formData.businessName.trim()) {
            setErrors((p) => ({ ...p, businessName: "Nombre del negocio requerido" })); hasError = true;
          }
          const rucClean = formData.ruc.trim();
          if (!rucClean) {
            setErrors((p) => ({ ...p, ruc: "RUC requerido" })); hasError = true;
          } else if (!/^\d{11}$/.test(rucClean)) {
            setErrors((p) => ({ ...p, ruc: "El RUC debe tener exactamente 11 dígitos" })); hasError = true;
          } else if (!/^(10|20)/.test(rucClean)) {
            setErrors((p) => ({ ...p, ruc: "RUC inválido (debe iniciar con 10 o 20)" })); hasError = true;
          }
          if (!formDataEnterprise.rubro_id) {
            setErrors((p) => ({ ...p, rubro: "Selecciona un rubro" })); hasError = true;
          }
          break;
        }

        case 4: {
          if (!formData.storeCount) {
            setErrors((p) => ({ ...p, storeCount: "Selecciona una escala" })); hasError = true;
          }
          break;
        }
      }
    } catch (error) {
      console.error("Error en validación:", error);
      hasError = true;
    }

    setIsLoading(false);
    if (!hasError && currentStep < 4) setCurrentStep((p) => p + 1);
    return !hasError;
  };

  const handleSelect = (field, value) => setFormData({ ...formData, [field]: value });
  const handleClickCategory = (id)=> setFormDataEnterprise((p) => ({ ...p, rubro_id: id }));

  const handleClickSubmit = async () => {
    if (currentStep < 4) { await changeStep("next"); return; }
    const isValid = await changeStep("next");
    if (!isValid) return;

    setIsLoading(true);
    setSubmitError(null);

    try {
      const dataToSendUser = {
        email: formData.email, password: formData.password,
        nombre_completo: formData.fullName, ruc_dni: formData.dni, telefono: formData.phone,
      };

      const responseRegister     = await REGISTER_USER(dataToSendUser);
      const responseRegisterJSON = await responseRegister.json();

      if (!responseRegister.ok) {
        setSubmitError(responseRegisterJSON?.message || "Error al registrar usuario");
        setIsLoading(false);
        return;
      }

      const token  = responseRegisterJSON?.data?.token;
      const idUser = responseRegisterJSON?.data?.usuario?.id;

      const dataToSendEnterprise = {
        usuario_id: idUser,
        rubro_id: formDataEnterprise.rubro_id,
        plan_actual_id: 1,
        nombre_empresa: formData.businessName,
        nombre_comercial: formData.businessName,
        ruc: formData.ruc,
        direccion: "",
        telefono: formData.phone,
        email: formData.email,
        logo_url: "",
        moneda_base: "PEN",
      };
      

      const responseCreateEnterprise = await CREATE_COMPANY(dataToSendEnterprise, token);
      if (!responseCreateEnterprise.ok) {
        console.log("Error:", await responseCreateEnterprise.json());
        setSubmitError("Usuario creado, pero error al crear empresa. Intenta iniciar sesión.");
        setIsLoading(false);
        return;
      }

      const loginResult = await login({ email: formData.email, password: formData.password });
      if (loginResult.error) {
        setSubmitError("Registro exitoso. Por favor inicia sesión.");
        setIsLoading(false);
        router.push("/login");
        return;
      }

      router.push("/dashboard/home");
    } catch (error) {
      setSubmitError("Error inesperado. Por favor intenta de nuevo.");
      setIsLoading(false);
    }
  };


  const renderStepContent = () => {
    if (isLoading) {
      return (
        <div className="h-40 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
          <Loader2 className="w-10 h-10 text-[#FE811F] animate-spin mb-3" />
          <p className="text-[#1F4363] font-medium text-sm">Procesando...</p>
        </div>
      );
    }

    const handleBlurInputDocumento = (e) => {
      const documento = e.target.value;
      if (documento?.length != 8 || documento?.length != 11) {
        setErrors((p) => ({ ...p, dni: 'Documento inválido.' }));  
      } 
    }

    switch (currentStep) {
      case 1:
        return (
          <StepOneSignUp
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
          />
        );

      case 2:
        return (
          <StepTwoSignUp
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            handleBlurInputDocumento={handleBlurInputDocumento}
          />
        );

      case 3:
        return (
          <StepThreSignUp
            formData={formData}
            formDataEnterprise={formDataEnterprise}
            errors={errors}
            handleClickCategory={handleClickCategory}
            handleInputChange={handleInputChange}
          />
        );

      case 4:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="mb-2">
              <h2 className="text-xl font-bold text-[#1F4363]">¿Qué tan grande es tu primer negocio?</h2>
              <p className="text-gray-500 text-sm">Esto nos ayuda a preparar tu infraestructura.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectableCard title="Solo 1"  desc="Estoy empezando"     icon={MapPin}    selected={formData.storeCount === "1"}   onClick={() => handleSelect("storeCount", "1")}   />
              <SelectableCard title="2 a 5"   desc="En crecimiento"      icon={Building2} selected={formData.storeCount === "2-5"} onClick={() => handleSelect("storeCount", "2-5")} />
              <SelectableCard title="+ de 5"  desc="Cadena / Franquicia" icon={Store}     selected={formData.storeCount === "5+"}  onClick={() => handleSelect("storeCount", "5+")}  />
            </div>
            {errors?.storeCount && <p className="text-red-500 text-xs text-center">{errors.storeCount}</p>}
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{submitError}</div>
            )}
            <div className="bg-[#1B8D7C]/10 p-4 rounded-xl flex gap-3 items-start">
              <Check className="text-[#1B8D7C] mt-0.5 shrink-0" size={18} />
              <div>
                <h4 className="font-bold text-[#1B8D7C] text-sm">Configuración Automática</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Crearemos {formData.storeCount === "1" ? "tu tienda principal" : "tu panel multi-sede"} inmediatamente al terminar.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };


  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6 font-sans">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100" style={{ minHeight: "680px" }}>

        <MarketingPanel />

        <div className="flex-1 flex flex-col">

          <div className="md:hidden px-6 pt-5 pb-0">
            <div className="flex items-center justify-between mb-1.5">
              <Image src={URL_LOGO} alt="PV360" width={60} height={24} />
              <span className="text-xs font-semibold text-gray-400">Paso {currentStep} de 4</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#FE811F] rounded-full transition-all duration-300" style={{ width: `${(currentStep / 4) * 100}%` }} />
            </div>
          </div>

          <div className="hidden md:block px-10 pt-8 pb-0">
            <HorizontalStepper currentStep={currentStep} />
          </div>

          <div className="flex-1 px-8 md:px-10 py-4 overflow-y-auto">
            {renderStepContent()}
          </div>

          <div className="px-8 md:px-10 pb-3 text-center">
            <p className="text-xs text-gray-400">
              Al registrarte aceptas nuestros{" "}
              <Link href="/terms" className="font-bold text-[#1F4363] hover:underline">Términos de Uso</Link>
              {" "}y{" "}
              <Link href="/privacy" className="font-bold text-[#1F4363] hover:underline">Privacidad</Link>. <br />
              {" "}¿Ya tienes cuenta?{" "}
              <Link href="/login" className="font-bold text-[#FE811F] hover:underline">Iniciar Sesión</Link>
            </p>
          </div>

          <div className="px-8 md:px-10 py-4 border-t border-gray-100 flex justify-between items-center">
            <button
              onClick={() => changeStep("prev")}
              disabled={currentStep === 1 || isLoading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors
                ${currentStep === 1 ? "text-gray-300 cursor-not-allowed" : "text-[#1F4363] hover:bg-gray-50"}`}
            >
              <ArrowLeft size={16} />
              Atrás
            </button>

            <button
              onClick={handleClickSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-bold text-sm bg-[#FE811F] text-white hover:bg-[#e5731a] shadow-md shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-wait"
            >
              {currentStep === 4 ? "Finalizar" : "Continuar"}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}