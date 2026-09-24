"use client";
import React, { useState } from "react";
import {ArrowRight, ArrowLeft, Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { validateEmail } from "@/lib/validation";
import { getVerificarDocumento, getVerificarEmail } from "../../../API/user/getConnections";
import { REGISTER_USER, CREATE_COMPANY } from "@/conexion/apiconexion";
import { login } from "@/lib/authentication";
import { useRouter } from "next/navigation";
import HorizontalStepper from "@/components/Stepper/HorizontalStepper";
import StepOneSignUp from "@/components/Stepper/StepOneSignUp";
import StepThreSignUp from "@/components/Stepper/StepThreSignUp";
import { createTrabajador } from "@/Connections/trabajadores";


const URL_LOGO = "https://res.cloudinary.com/dabyqnijl/image/upload/v1787804947/LOGO/positivo_co0kxc.png";
const URL_LOGO_FULL =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1788581897/01_bl0vpw.png";
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
      }
    } catch (error) {
      console.error("Error en validación:", error);
      hasError = true;
    }

    setIsLoading(false);
    if (!hasError && currentStep < 4) setCurrentStep((p) => p + 1);
    return !hasError;
  };

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

      const responseCreateTrabajador = await createTrabajador()

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
          <StepThreSignUp
            formData={formData}
            formDataEnterprise={formDataEnterprise}
            errors={errors}
            handleClickCategory={handleClickCategory}
            handleInputChange={handleInputChange}
          />
        );

      default:
        return null;
    }
  };


  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6 font-sans">
      <div
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100"
        style={{ minHeight: "680px" }}
      >
        <div className="flex-1 flex flex-col">
          <div className="md:hidden px-6 pt-5 pb-0">
            <div className="flex items-center justify-between mb-1.5">
              <Image src={URL_LOGO} alt="PV360" width={60} height={24} />
              <span className="text-xs font-semibold text-gray-400">
                Paso {currentStep} de 4
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FE811F] rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>

          <div className="hidden md:block px-10 pt-8 pb-0">
            <HorizontalStepper currentStep={currentStep} />
            <Image
              src={URL_LOGO_FULL}
              width={200}
              height={80}
              alt="Imagen del logo FULL"
            />
          </div>

          <div className="flex-1 px-8 md:px-10 py-4 overflow-y-auto">
            {renderStepContent()}
          </div>

          <div className="px-8 md:px-10 pb-3 text-center">
            <p className="text-xs text-gray-400">
              Al registrarte aceptas nuestros{" "}
              <Link
                href="/terms"
                className="font-bold text-[#1F4363] hover:underline"
              >
                Términos de Uso
              </Link>{" "}
              y{" "}
              <Link
                href="/privacy"
                className="font-bold text-[#1F4363] hover:underline"
              >
                Privacidad
              </Link>
              . <br /> ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="font-bold text-[#FE811F] hover:underline"
              >
                Iniciar Sesión
              </Link>
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
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-bold text-sm bg-verdeAgua text-white hover:bg-verdeAgua/90 shadow-md shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-wait"
            >
              {currentStep === 2 ? "Finalizar" : "Continuar"}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}