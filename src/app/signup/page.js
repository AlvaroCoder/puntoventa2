"use client";
import React, { useState } from "react";
import {
  User, Mail, Phone, CreditCard, Store,
  ArrowRight, ArrowLeft, Check, Building2, MapPin, Loader2,
  TrendingUp, Users, Star, Zap, Shield,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import InputField from "@/elements/InputField";
import SelectableCard from "@/elements/SelectableCard";
import InputPassword from "@/elements/InputPassword";
import { validateEmail } from "@/lib/validation";
import { getVerificarDocumento, getVerificarEmail } from "../../../API/user/getConnections";
import GridSelectCardRubro from "@/components/Cards/GridSelectCardRubro";
import { REGISTER_USER, CREATE_COMPANY } from "@/conexion/apiconexion";
import { login } from "@/lib/authentication";
import { useRouter } from "next/navigation";

/* ─── Constantes ──────────────────────────────────────────────────────── */

const URL_LOGO   = "https://res.cloudinary.com/dabyqnijl/image/upload/v1787111787/puntoVenta360/Logo_Punto_Venta_wrgis4.png"
const URL_BG     = "https://res.cloudinary.com/dabyqnijl/image/upload/v1787196703/image_dashboard_pv1_oeqemq.png"

const STEPS = [
  { id: 1, title: "Tu Cuenta",       subtitle: "Credenciales de acceso"   },
  { id: 2, title: "Datos Personales", subtitle: "Información del titular"  },
  { id: 3, title: "Tu Negocio",      subtitle: "Rubro e identificación"   },
  { id: 4, title: "Escala",          subtitle: "Dimensiones de la empresa" },
];

const STATS = [
  { Icon: Users,       value: "+1,000",  label: "negocios registrados"    },
  { Icon: TrendingUp,  value: "S/ 2M+",  label: "en ventas procesadas"    },
  { Icon: Star,        value: "4.9/5",   label: "satisfacción de usuarios" },
  { Icon: Zap,         value: "< 5 min", label: "para empezar a vender"   },
];

const FEATURES = [
  "Ventas, inventario y créditos en una sola app",
  "Sin instalaciones, funciona desde el navegador",
  "Reportes en tiempo real para tomar decisiones",
  "Soporte en español incluido sin costo adicional",
];

/* ─── Panel izquierdo (marketing) ────────────────────────────────────── */

function MarketingPanel() {
  return (
    <div className="relative hidden md:flex md:w-[42%] flex-col overflow-hidden">

      {/* Imagen de fondo con blur */}
      <div
        className="absolute inset-0 scale-105 blur-[3px]"
        style={{ backgroundImage: `url(${URL_BG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      {/* Overlay navy */}
      <div className="absolute inset-0 bg-[#1F4363]/90" />
      {/* Glow decorativo */}
      <div className="absolute -bottom-24 -right-16 w-72 h-72 bg-[#FE811F]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col h-full p-8">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <Image src={URL_LOGO} alt="PuntoVenta360" width={72} height={28} />
          <span className="text-white font-bold text-sm">
            Punto de Venta <span className="text-[#FE811F]">360</span>
          </span>
        </div>

        {/* Headline */}
        <div className="flex-1 flex flex-col justify-center gap-7">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-[#FE811F]/20 text-[#FE811F] text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FE811F]" />
              Plataforma #1 en Perú
            </span>
            <h2 className="text-white text-[22px] font-bold leading-snug mb-2">
              El sistema de punto de venta que tu negocio necesita
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Únete a miles de emprendedores y empresas que ya digitalizaron su operación con PuntoVenta360.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {STATS.map(({ Icon, value, label }) => (
              <div key={label} className="bg-white/8 rounded-2xl p-4 border border-white/10 flex flex-col gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FE811F]/20 flex items-center justify-center">
                  <Icon size={16} className="text-[#FE811F]" />
                </div>
                <p className="text-white font-bold text-xl leading-none">{value}</p>
                <p className="text-white/45 text-xs leading-tight">{label}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-3">
            {FEATURES.map(f => (
              <div key={f} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#1B8D7C]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={11} className="text-[#1B8D7C]" />
                </div>
                <p className="text-white/65 text-sm leading-snug">{f}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 mt-6">
          <Shield size={13} className="text-white/30" />
          <p className="text-white/25 text-xs">Datos protegidos · © 2026 PuntoVenta360</p>
        </div>

      </div>
    </div>
  );
}

/* ─── Stepper horizontal ─────────────────────────────────────────────── */

function HorizontalStepper({ currentStep }) {
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
  );
}

/* ─── Página principal ───────────────────────────────────────────────── */

export default function SignUpPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading,   setIsLoading]   = useState(false);
  const [formData, setFormData] = useState({
    email: "", password: "", confirmPassword: "",
    fullName: "", dni: "", phone: "",
    businessName: "", ruc: "", businessType: "", storeCount: "",
  });
  const [formDataEnterprise, setFormDataEnterprise] = useState({ rubro_id: 1 });
  const [errors,      setErrors]      = useState({});
  const [submitError, setSubmitError] = useState(null);

  /* ── Handlers (lógica sin cambios) ──────────────────────────────────── */

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
        case 1:
          if (!formData.email) {
            setErrors((p) => ({ ...p, email: "El correo es obligatorio" })); hasError = true;
          } else if (!validateEmail(formData.email)) {
            setErrors((p) => ({ ...p, email: "Formato de correo inválido" })); hasError = true;
          }
          if (!formData.password || formData.password.length < 8) {
            setErrors((p) => ({ ...p, password: "Mínimo 8 caracteres" })); hasError = true;
          }
          if (formData.password !== formData.confirmPassword) {
            setErrors((p) => ({ ...p, confirmPassword: "Las contraseñas no coinciden" })); hasError = true;
          }
          if (!hasError) {
            const emailStatus = await getVerificarEmail(formData.email);
            if (emailStatus === 404) {
              setErrors((p) => ({ ...p, email: "Este correo ya está registrado" })); hasError = true;
            }
          }
          break;

        case 2:
          if (!formData.fullName) { setErrors((p) => ({ ...p, fullName: "Nombre completo requerido" })); hasError = true; }
          if (!formData.dni)      { setErrors((p) => ({ ...p, dni:      "Documento requerido"       })); hasError = true; }
          if (!formData.phone)    { setErrors((p) => ({ ...p, phone:    "Teléfono requerido"         })); hasError = true; }
          if (!hasError) {
            const docStatus = await getVerificarDocumento(formData.dni);
            if (docStatus === 404) {
              setErrors((p) => ({ ...p, dni: "Documento inválido o ya registrado" })); hasError = true;
            }
          }
          break;

        case 3:
          if (!formData.businessName)       { setErrors((p) => ({ ...p, businessName: "Nombre del negocio requerido" })); hasError = true; }
          if (!formData.ruc)                { setErrors((p) => ({ ...p, ruc:          "RUC requerido"                })); hasError = true; }
          if (!formDataEnterprise.rubro_id) { setErrors((p) => ({ ...p, rubro:        "Selecciona un rubro"          })); hasError = true; }
          break;

        case 4:
          if (!formData.storeCount) { setErrors((p) => ({ ...p, storeCount: "Selecciona una escala" })); hasError = true; }
          break;
      }
    } catch (error) {
      console.error("Error en validación:", error);
      hasError = true;
    }

    setIsLoading(false);
    if (!hasError && currentStep < 4) setCurrentStep((p) => p + 1);
    return !hasError;
  };

  const handleSelect         = (field, value) => setFormData({ ...formData, [field]: value });
  const handleClickCategory  = (id)           => setFormDataEnterprise((p) => ({ ...p, rubro_id: id }));

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
        usuario_id: idUser, rubro_id: formDataEnterprise.rubro_id,
        plan_actual_id: 1, nombre_empresa: formData.businessName,
        nombre_comercial: formData.businessName, ruc: formData.ruc,
        direccion: "", telefono: formData.phone, email: formData.email,
        logo_url: "", moneda_base: "PEN",
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

      router.push("/dashboard/bd/home");
    } catch (error) {
      console.error("Error en registro:", error);
      setSubmitError("Error inesperado. Por favor intenta de nuevo.");
      setIsLoading(false);
    }
  };

  /* ── Contenido de cada paso (sin cambios) ───────────────────────────── */

  const renderStepContent = () => {
    if (isLoading) {
      return (
        <div className="h-40 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
          <Loader2 className="w-10 h-10 text-[#FE811F] animate-spin mb-3" />
          <p className="text-[#1F4363] font-medium text-sm">Procesando...</p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
            <div className="mb-2">
              <h2 className="text-xl font-bold text-[#1F4363]">Crea tu cuenta</h2>
              <p className="text-gray-500 text-sm">Comencemos con tus credenciales de acceso.</p>
            </div>
            <InputField label="Correo Electrónico" icon={Mail} name="email" type="email"
              placeholder="ejemplo@empresa.com" value={formData.email}
              onChange={handleInputChange} error={errors?.email} />
            <InputPassword label="Contraseña" name="password"
              placeholder="Mínimo 8 caracteres" value={formData.password}
              onChange={handleInputChange} error={errors?.password} />
            <InputPassword label="Confirmar Contraseña" name="confirmPassword"
              placeholder="Repite tu contraseña" value={formData.confirmPassword}
              onChange={handleInputChange} error={errors?.confirmPassword} />
          </div>
        );

      case 2:
        return (
          <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
            <div className="mb-2">
              <h2 className="text-xl font-bold text-[#1F4363]">¿Quién administra?</h2>
              <p className="text-gray-500 text-sm">Necesitamos saber quién es el responsable.</p>
            </div>
            <InputField label="Nombre Completo" icon={User} name="fullName" type="text"
              placeholder="Juan Pérez" value={formData.fullName}
              onChange={handleInputChange} error={errors?.fullName} />
            <InputField label="Documento (DNI / RUC)" icon={CreditCard} name="dni" type="text"
              placeholder="Número de documento" value={formData.dni}
              onChange={handleInputChange} error={errors?.dni} />
            <InputField label="Teléfono / Celular" icon={Phone} name="phone" type="tel"
              placeholder="+51 999 999 999" value={formData.phone}
              onChange={handleInputChange} error={errors?.phone} />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="mb-2">
              <h2 className="text-xl font-bold text-[#1F4363]">Tu Negocio</h2>
              <p className="text-gray-500 text-sm">Rubro e identificación de tu empresa.</p>
            </div>
            <InputField label="Nombre Comercial" icon={Store} name="businessName"
              placeholder="Ej: Bodega El Chino" value={formData.businessName}
              onChange={handleInputChange} error={errors?.businessName} />
            <InputField label="RUC Empresa" icon={Building2} name="ruc"
              placeholder="20123456789" value={formData.ruc}
              onChange={handleInputChange} error={errors?.ruc} />
            <div>
              <label className="text-xs font-bold text-[#333] block mb-2">Selecciona tu Rubro</label>
              {errors?.rubro && <p className="text-red-500 text-xs mb-2">{errors.rubro}</p>}
              <GridSelectCardRubro onClick={handleClickCategory} formData={formDataEnterprise} />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="mb-2">
              <h2 className="text-xl font-bold text-[#1F4363]">¿Qué tan grande eres?</h2>
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

  /* ── Render ─────────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6 font-sans">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100" style={{ minHeight: "680px" }}>

        {/* ── Panel izquierdo: marketing ─────────────────────────────── */}
        <MarketingPanel />

        {/* ── Panel derecho: formulario ──────────────────────────────── */}
        <div className="flex-1 flex flex-col">

          {/* Mobile: barra de progreso */}
          <div className="md:hidden px-6 pt-5 pb-0">
            <div className="flex items-center justify-between mb-1.5">
              <Image src={URL_LOGO} alt="PV360" width={60} height={24} />
              <span className="text-xs font-semibold text-gray-400">Paso {currentStep} de 4</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#FE811F] rounded-full transition-all duration-300" style={{ width: `${(currentStep / 4) * 100}%` }} />
            </div>
          </div>

          {/* Stepper horizontal (desktop) */}
          <div className="hidden md:block px-10 pt-8 pb-0">
            <HorizontalStepper currentStep={currentStep} />
          </div>

          {/* Contenido del paso */}
          <div className="flex-1 px-8 md:px-10 py-4 overflow-y-auto">
            {renderStepContent()}
          </div>

          {/* Términos + link de login */}
          <div className="px-8 md:px-10 pb-3 text-center">
            <p className="text-xs text-gray-400">
              Al registrarte aceptas nuestros{" "}
              <Link href="/terms" className="font-bold text-[#1F4363] hover:underline">Términos de Uso</Link>
              {" "}y{" "}
              <Link href="/privacy" className="font-bold text-[#1F4363] hover:underline">Privacidad</Link>.
              {" "}¿Ya tienes cuenta?{" "}
              <Link href="/login" className="font-bold text-[#FE811F] hover:underline">Iniciar Sesión</Link>
            </p>
          </div>

          {/* Botones de navegación */}
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