"use client";
import React, { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { validateEmail } from "@/lib/validation";
import { REGISTER_USER } from "@/conexion/apiconexion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PageLoader from "@/components/Loading/PageLoader";

// Stepper components
import StepSelectMode       from "@/components/Stepper/StepSelectMode";
import HorizontalStepper    from "@/components/Stepper/HorizontalStepper";
import StepOneSignUp        from "@/components/Stepper/StepOneSignUp";
import StepTwoSignUp        from "@/components/Stepper/StepTwoSignUp";
import StepThreSignUp       from "@/components/Stepper/StepThreSignUp";
import StepEmpleadoUsuario  from "@/components/Stepper/StepEmpleadoUsuario";
import StepEmpleadoCodigo   from "@/components/Stepper/StepEmpleadoCodigo";

const URL_LOGO     = "https://res.cloudinary.com/dabyqnijl/image/upload/v1787804947/LOGO/positivo_co0kxc.png";
const URL_LOGO_FULL = "https://res.cloudinary.com/dabyqnijl/image/upload/v1788581897/01_bl0vpw.png";
const CACHE_KEY    = "pv360_signup_progress";

const PASSWORD_REQS = [
  (p) => p.length >= 8,
  (p) => /[A-Z]/.test(p),
  (p) => /[a-z]/.test(p),
  (p) => /\d/.test(p),
  (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
];

function EmpleadoStepper({ step }) {
  const steps = [
    { n: 1, label: 'Tu usuario' },
    { n: 2, label: 'Unirte a una tienda' },
  ];
  return (
    <div className="flex items-start gap-0 w-full mb-2">
      {steps.map(({ n, label }, i) => {
        const active  = step === n;
        const done    = step > n;
        return (
          <React.Fragment key={n}>
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold transition-all"
                style={{
                  background: active || done ? '#198E7B' : 'transparent',
                  border:     active || done ? 'none'    : '2px solid rgba(31,47,87,0.25)',
                  color:      active || done ? '#fff'    : 'rgba(31,47,87,0.4)',
                }}
              >
                {n}
              </div>
              <span
                className="text-xs font-semibold whitespace-nowrap"
                style={{ color: active ? '#1F2F57' : 'rgba(31,47,87,0.4)' }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px mt-4.5 mx-2" style={{ background: step > 1 ? '#198E7B' : 'rgba(31,47,87,0.15)' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function SignUpPage() {
  const router = useRouter();

  // ── Shared state ──────────────────────────────────────────────────────────
  const [modo,        setModo]        = useState(null);   // null | 'negocio' | 'empleado'
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading,   setIsLoading]   = useState(false);
  const [errors,      setErrors]      = useState({});
  const [hydrated,    setHydrated]    = useState(false);

  // ── Negocio form ─────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    email: "", password: "", confirmPassword: "",
    nombre_completo: "", tipo_documento: "DNI", numero_documento: "", telefono: "",
    businessName: "", nombre_empresa: "", ruc: "",
  });
  const [formDataEnterprise, setFormDataEnterprise] = useState({ rubro_id: 1 });

  // ── Empleado form ─────────────────────────────────────────────────────────
  const [empleadoData, setEmpleadoData] = useState({ email: "", password: "" });

  // ── Restaurar progreso desde caché ────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
      if (saved.modo) {
        setModo(saved.modo);
        setCurrentStep(saved.step ?? 1);
      }
    } catch {}
    setHydrated(true);
  }, []);

  // ── Guardar progreso en caché ─────────────────────────────────────────────
  useEffect(() => {
    if (!hydrated || !modo) return;
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ modo, step: currentStep }));
    } catch {}
  }, [modo, currentStep, hydrated]);

  const clearCache = () => {
    try { localStorage.removeItem(CACHE_KEY); } catch {}
  };

  // ── Handlers comunes ──────────────────────────────────────────────────────
  const handleSelectModo = (m) => {
    setModo(m);
    setCurrentStep(1);
    setErrors({});
  };

  const handleBack = () => {
    setErrors({});
    if (currentStep <= 1) {
      setModo(null);
      setCurrentStep(0);
      clearCache();
    } else {
      setCurrentStep((p) => p - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  };

  const handleEmpleadoChange = (e) => {
    const { name, value } = e.target;
    setEmpleadoData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  };

  const handleClickCategory = (id) => setFormDataEnterprise((p) => ({ ...p, rubro_id: id }));

  // ── Validación por paso (negocio) ─────────────────────────────────────────
  const validateNegocioStep = () => {
    let hasError = false;
    setErrors({});
    switch (currentStep) {
      case 1:
        if (!formData.email) { setErrors((p) => ({ ...p, email: "El correo es obligatorio" })); hasError = true; }
        else if (!validateEmail(formData.email)) { setErrors((p) => ({ ...p, email: "Formato inválido" })); hasError = true; }
        if (!PASSWORD_REQS.every(r => r(formData.password))) { setErrors((p) => ({ ...p, password: "La contraseña no cumple los requisitos" })); hasError = true; }
        if (formData.password !== formData.confirmPassword) { setErrors((p) => ({ ...p, confirmPassword: "Las contraseñas no coinciden" })); hasError = true; }
        break;
      case 2:
        if (!formData.nombre_completo.trim()) { setErrors((p) => ({ ...p, nombre_completo: "Obligatorio" })); hasError = true; }
        if (!formData.numero_documento.trim()) { setErrors((p) => ({ ...p, numero_documento: "Obligatorio" })); hasError = true; }
        if (!formData.telefono.trim()) { setErrors((p) => ({ ...p, telefono: "Obligatorio" })); hasError = true; }
        break;
      case 3:
        if (!formData.businessName.trim()) { setErrors((p) => ({ ...p, businessName: "Obligatorio" })); hasError = true; }
        if (!formData.nombre_empresa.trim()) { setErrors((p) => ({ ...p, nombre_empresa: "Obligatorio" })); hasError = true; }
        if (!formData.ruc.trim()) { setErrors((p) => ({ ...p, ruc: "Obligatorio" })); hasError = true; }
        break;
    }
    return !hasError;
  };

  // ── Validación por paso (empleado) ────────────────────────────────────────
  const validateEmpleadoStep = () => {
    let hasError = false;
    setErrors({});
    if (currentStep === 1) {
      if (!empleadoData.email) { setErrors((p) => ({ ...p, email: "El correo es obligatorio" })); hasError = true; }
      else if (!validateEmail(empleadoData.email)) { setErrors((p) => ({ ...p, email: "Formato inválido" })); hasError = true; }
      if (!PASSWORD_REQS.every(r => r(empleadoData.password))) { setErrors((p) => ({ ...p, password: "La contraseña no cumple los requisitos" })); hasError = true; }
    }
    return !hasError;
  };

  // ── Continuar ─────────────────────────────────────────────────────────────
  const handleContinue = async () => {
    if (modo === 'negocio') {
      const totalSteps = 3;
      if (!validateNegocioStep()) return;
      if (currentStep < totalSteps) { setCurrentStep((p) => p + 1); return; }

      // Submit negocio
      setIsLoading(true);
      try {
        const payload = {
          email:            formData.email,
          password:         formData.password,
          nombre_completo:  formData.nombre_completo,
          tipo_documento:   formData.tipo_documento,
          numero_documento: formData.numero_documento,
          telefono:         formData.telefono,
          empresa: {
            nombre_comercial: formData.businessName,
            nombre_empresa:   formData.nombre_empresa,
            ruc:              formData.ruc,
            rubro_id:         formDataEnterprise.rubro_id,
            plan_id:          4,
          },
        };
        await REGISTER_USER(payload);
        clearCache();
        toast.success("¡Cuenta creada exitosamente!");
        router.push("/dashboard");
      } catch {
        toast.error("Error inesperado. Por favor intenta de nuevo.");
        setIsLoading(false);
      }
    }

    if (modo === 'empleado') {
      if (currentStep === 1) {
        if (!validateEmpleadoStep()) return;
        setCurrentStep(2);
        return;
      }
      // Step 2: QR/code — mockup, aún sin backend
      toast.info("Funcionalidad de QR en desarrollo.");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (!hydrated) return null;
  if (isLoading) return <PageLoader />;

  // Shared card container
  const CardShell = ({ children, wide = false }) => (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 font-sans">
      <div
        className={`bg-white w-full rounded-3xl shadow-2xl overflow-hidden border border-gray-100 ${wide ? 'max-w-2xl' : 'max-w-lg'}`}
        style={{ minHeight: 580 }}
      >
        {children}
      </div>
    </div>
  );

  // ── Selection screen ───────────────────────────────────────────────────────
  if (!modo) {
    return (
      <CardShell wide>
        <StepSelectMode onSelect={handleSelectModo} />
      </CardShell>
    );
  }

  // ── Empleado flow ──────────────────────────────────────────────────────────
  if (modo === 'empleado') {
    const isLastStep = currentStep === 2;
    return (
      <CardShell>
        <div className="flex flex-col h-full px-8 pt-7 pb-6 gap-6" style={{ minHeight: 580 }}>

          {/* Step indicator */}
          <EmpleadoStepper step={currentStep} />

          {/* Logo */}
          <Image src={URL_LOGO_FULL} width={160} height={48} alt="PuntoVenta360" />

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {currentStep === 1 && (
              <StepEmpleadoUsuario
                formData={empleadoData}
                onChange={handleEmpleadoChange}
                errors={errors}
              />
            )}
            {currentStep === 2 && (
              <StepEmpleadoCodigo errors={errors} />
            )}
          </div>

          {/* Footer buttons */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors hover:bg-gray-50"
              style={{ color: '#1F2F57' }}
            >
              <ArrowLeft size={16} /> Atrás
            </button>
            <button
              onClick={handleContinue}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-bold text-sm text-white transition-all active:scale-95"
              style={{ background: '#198E7B' }}
            >
              {isLastStep ? 'Unirme' : 'Continuar'} <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </CardShell>
    );
  }

  // ── Negocio flow ───────────────────────────────────────────────────────────
  const negocioTotalSteps = 3;
  const isLastNegocioStep = currentStep === negocioTotalSteps;

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6 font-sans">
      <div
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100"
        style={{ minHeight: "680px" }}
      >
        <div className="flex-1 flex flex-col">

          {/* Mobile header */}
          <div className="md:hidden px-6 pt-5 pb-0">
            <div className="flex items-center justify-between mb-1.5">
              <Image src={URL_LOGO} alt="PV360" width={60} height={24} />
              <span className="text-xs font-semibold text-gray-400">Paso {currentStep} de {negocioTotalSteps}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FE811F] rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / negocioTotalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden md:block px-10 pt-8 pb-0">
            <HorizontalStepper currentStep={currentStep} />
            <Image src={URL_LOGO_FULL} width={200} height={80} alt="PuntoVenta360" />
          </div>

          {/* Step content */}
          <div className="flex-1 px-8 md:px-10 py-4 overflow-y-auto">
            {currentStep === 1 && (
              <StepOneSignUp formData={formData} handleInputChange={handleInputChange} errors={errors} />
            )}
            {currentStep === 2 && (
              <StepTwoSignUp formData={formData} handleInputChange={handleInputChange} errors={errors} />
            )}
            {currentStep === 3 && (
              <StepThreSignUp
                formData={formData}
                formDataEnterprise={formDataEnterprise}
                errors={errors}
                handleClickCategory={handleClickCategory}
                handleInputChange={handleInputChange}
              />
            )}
          </div>

          {/* Footer */}
          <div className="px-8 md:px-10 py-4 border-t border-gray-100 flex justify-between items-center">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors hover:bg-gray-50"
              style={{ color: currentStep === 1 ? '#ccc' : '#1F4363' }}
            >
              <ArrowLeft size={16} /> Atrás
            </button>
            <button
              onClick={handleContinue}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-bold text-sm bg-verdeAgua text-white hover:bg-verdeAgua/90 shadow-md shadow-orange-500/20 active:scale-95 transition-all"
            >
              {isLastNegocioStep ? "Finalizar" : "Continuar"}
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
