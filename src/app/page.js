'use client'
import React from "react";
import { 
  Boxes, 
  Users, 
  Store, 
  CreditCard, 
  BarChart3, 
  Wallet, 
  CheckCircle2, 
  ArrowRight, 
  Menu, 
  X,
  Play
} from "lucide-react";
import Button from "@/elements/Button";
import Title1 from "@/elements/Title1";


export default function LandingPage() {
  const features = [
    { 
      icon: <Boxes className="w-8 h-8 text-white" />, 
      title: "Gestiona Inventario", 
      desc: "Control total de tu stock en tiempo real con alertas automáticas."
    },
    { 
      icon: <Users className="w-8 h-8 text-white" />, 
      title: "Gestiona Clientes", 
      desc: "Base de datos detallada para fidelizar y conocer a tu público."
    },
    { 
      icon: <Store className="w-8 h-8 text-white" />, 
      title: "Gestiona Tiendas", 
      desc: "Administra múltiples sucursales desde un solo panel centralizado."
    },
    { 
      icon: <CreditCard className="w-8 h-8 text-white" />, 
      title: "Gestiona Créditos", 
      desc: "Seguimiento de cuentas por cobrar y líneas de crédito."
    },
    { 
      icon: <BarChart3 className="w-8 h-8 text-white" />, 
      title: "Reportes Avanzados", 
      desc: "Toma decisiones basadas en datos con analíticas precisas."
    },
    { 
      icon: <Wallet className="w-8 h-8 text-white" />, 
      title: "Gestión de Caja", 
      desc: "Cierres de caja, arqueos y control de flujo de efectivo seguro."
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans selection:bg-[#FF821E] selection:text-white">
      <section className="pt-32 pb-20 px-6 md:px-12 container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#198E7B]/10 rounded-full text-[#198E7B] font-bold text-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-[#198E7B] animate-pulse"></span>
              Nuevo Sistema V 2.0 Disponible
            </div>
            
            <Title1>
              La solución <span className="text-[#FF821E] relative">
                inteligente
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#FF821E] opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span> <br />
              para tu negocio.
            </Title1>
            
            <p className="text-xl text-gray-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Simplifica tus operaciones, controla tu inventario y aumenta tus ventas con la plataforma todo en uno diseñada para empresas en crecimiento.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button variant="primary" icon={ArrowRight} className="text-lg px-8">
                Comenzar Ahora
              </Button>
              <Button variant="outline" icon={Play} className="text-lg px-8">
                Ver Demo
              </Button>
            </div>

            <div className="pt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-400 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#198E7B]" /> Sin tarjeta de crédito
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#198E7B]" /> 14 días de prueba
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#198E7B]" /> Soporte 24/7
              </div>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-xl lg:max-w-full">
            <div className="absolute top-10 -left-10 w-72 h-72 bg-[#FF821E] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-10 -right-10 w-72 h-72 bg-[#1F4363] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            
            <div className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 md:p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="h-2 w-20 bg-gray-100 rounded-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="bg-[#F5F5F5] p-4 rounded-xl h-24 animate-pulse"></div>
                 <div className="bg-[#F5F5F5] p-4 rounded-xl h-24 animate-pulse"></div>
              </div>
              <div className="bg-[#1F4363] h-40 rounded-xl w-full flex items-center justify-center text-white/20">
                <BarChart3 size={64} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50 skew-x-12 opacity-50 pointer-events-none"></div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[#FF821E] font-bold tracking-wider uppercase text-sm mb-2">Características Principales</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-[#1F4363] mb-4">Todo lo que necesitas para crecer</h3>
            <p className="text-gray-500">
              Hemos integrado las herramientas más potentes en una interfaz simple e intuitiva para que te concentres en vender.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-[#FF821E]/30 shadow-sm hover:shadow-xl hover:shadow-[#FF821E]/10 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-[#1F4363] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#FF821E] transition-colors duration-300 shadow-md">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#333333] mb-3 group-hover:text-[#FF821E] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1F4363] py-20 px-6">
        <div className="container mx-auto text-center">
           <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
             ¿Listo para digitalizar tu negocio?
           </h2>
           <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">
             Únete a más de 500 empresas que ya gestionan sus ventas con PuntoVenta360.
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Button variant="primary" className="text-lg px-10 py-4">
               Crear cuenta gratis
             </Button>
             <Button variant="ghost" className="text-lg px-10 py-4 border border-white/20">
               Contactar Ventas
             </Button>
           </div>
        </div>
      </section>
    </div>
  );
}