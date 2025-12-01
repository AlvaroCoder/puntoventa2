'use client'
import React, { useState } from 'react';
import { 
  Check, 
  X, 
  HelpCircle, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Zap
} from 'lucide-react';


const Button = ({ children, variant = "primary", className = "", fullWidth = false }) => {
  const baseStyle = "px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md";
  const widthStyle = fullWidth ? "w-full" : "";
  
  const variants = {
    primary: "bg-[#FF821E] text-white hover:bg-[#e5700f] shadow-orange-500/20",
    secondary: "bg-[#1F4363] text-white hover:bg-[#16324a] shadow-blue-900/20",
    outline: "border-2 border-[#1F4363] text-[#1F4363] hover:bg-[#1F4363] hover:text-white bg-transparent",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${widthStyle} ${className}`}>
      {children}
    </button>
  );
};

const Badge = ({ text }) => (
  <span className="bg-[#198E7B]/10 text-[#198E7B] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
    {text}
  </span>
);


const METRICS = [
  { 
    icon: <TrendingUp size={32} />, 
    value: "30%", 
    label: "Incremento en Ventas", 
    desc: "Nuestros clientes reportan un aumento en sus ventas en los primeros 3 meses."
  },
  { 
    icon: <Clock size={32} />, 
    value: "15hrs", 
    label: "Ahorro Semanal", 
    desc: "Automatiza inventarios y cierres de caja para recuperar tu tiempo libre."
  },
  { 
    icon: <ShieldCheck size={32} />, 
    value: "99.9%", 
    label: "Uptime Garantizado", 
    desc: "Tu negocio nunca se detiene. Nuestra infraestructura es sólida y segura."
  }
];

const FAQS = [
  {
    question: "¿Puedo cambiar de plan en cualquier momento?",
    answer: "Sí, puedes mejorar tu plan (upgrade) en cualquier momento y se ajustará el cobro prorrateado. Para bajar de plan, el cambio se aplicará al finalizar tu ciclo de facturación actual."
  },
  {
    question: "¿Necesito instalar algún software?",
    answer: "No. PuntoVenta360 es una aplicación 100% en la nube. Puedes acceder desde cualquier navegador web, tablet o celular sin instalaciones complejas."
  },
  {
    question: "¿Mis datos están seguros?",
    answer: "Absolutamente. Utilizamos encriptación de grado bancario (SSL) y realizamos copias de seguridad automáticas diarias de toda tu información."
  },
  {
    question: "¿Qué pasa si tengo más de una tienda?",
    answer: "Nuestros planes 'Negocio Pro' y 'Corporativo' soportan múltiples sucursales. Puedes gestionar inventarios centralizados y ver reportes consolidados fácilmente."
  }
];


export default function PreciosPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const PLANS = [
    {
      name: "Emprendedor",
      desc: "Ideal para pequeños negocios que recién inician.",
      price: isAnnual ? 49 : 59,
      features: [
        "1 Usuario Administrador",
        "Hasta 500 Productos",
        "Control de Inventario Básico",
        "Reportes de Ventas Diarias",
        "Soporte por Email"
      ],
      notIncluded: ["Facturación Electrónica", "Multi-tienda", "API Access"],
      highlight: false,
      btnVariant: "outline"
    },
    {
      name: "Negocio Pro",
      desc: "Potencia tu crecimiento con herramientas avanzadas.",
      price: isAnnual ? 99 : 119,
      features: [
        "3 Usuarios",
        "Productos Ilimitados",
        "Gestión de Caja Chica",
        "Alertas de Stock Bajo",
        "Facturación Electrónica (SUNAT)",
        "Soporte Prioritario WhatsApp"
      ],
      notIncluded: ["API Access"],
      highlight: true,
      btnVariant: "primary"
    },
    {
      name: "Corporativo",
      desc: "Gestión integral para cadenas y franquicias.",
      price: isAnnual ? 199 : 229,
      features: [
        "Usuarios Ilimitados",
        "Multi-Sede (Hasta 5 Tiendas)",
        "Roles y Permisos Avanzados",
        "Business Intelligence Dashboard",
        "API para Integraciones",
        "Gerente de Cuenta Dedicado"
      ],
      notIncluded: [],
      highlight: false,
      btnVariant: "secondary"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-[#333333] py-20">
      
      <div className="container mx-auto px-6 text-center mb-16 mt-10">
        <h2 className="text-[#FF821E] font-bold tracking-wider uppercase text-sm mb-3">Planes Flexibles</h2>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F4363] mb-6">
          Invierte en el crecimiento <br /> de tu negocio
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto mb-10 text-lg">
          Prueba gratis por 14 días. No requerimos tarjeta de crédito para empezar.
        </p>

        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm font-bold ${!isAnnual ? 'text-[#1F4363]' : 'text-gray-400'}`}>Mensual</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-16 h-8 bg-[#1F4363] rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF821E] focus:ring-offset-2"
          >
            <div 
              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isAnnual ? 'translate-x-8' : 'translate-x-0'}`}
            ></div>
          </button>
          <span className={`text-sm font-bold ${isAnnual ? 'text-[#1F4363]' : 'text-gray-400'}`}>
            Anual <span className="text-[#FF821E] text-xs ml-1">(-20%)</span>
          </span>
        </div>
      </div>

      <div className="container mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {PLANS.map((plan, idx) => (
            <div 
              key={idx}
              className={`
                relative bg-white rounded-2xl p-8 border transition-all duration-300
                ${plan.highlight 
                  ? 'border-[#FF821E] shadow-2xl shadow-orange-500/10 scale-105 z-10' 
                  : 'border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1'
                }
              `}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-[#FF821E] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
                    Más Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-[#1F4363] mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-sm h-10">{plan.desc}</p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-end justify-center gap-1">
                  <span className="text-gray-400 font-bold text-lg mb-4">S/</span>
                  <span className="text-5xl font-extrabold text-[#333333]">{plan.price}</span>
                  <span className="text-gray-400 mb-4">/mes</span>
                </div>
                {isAnnual && (
                  <p className="text-xs text-[#198E7B] font-bold mt-2">Facturado anualmente S/ {plan.price * 12}</p>
                )}
              </div>

              <Button variant={plan.btnVariant} fullWidth>
                Elegir Plan
              </Button>

              <div className="mt-8 space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Incluye:</p>
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3 text-sm text-gray-600">
                    <Check size={18} className="text-[#198E7B] flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
                
                {plan.notIncluded.length > 0 && (
                   <div className="pt-4 space-y-4 opacity-50">
                      {plan.notIncluded.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-3 text-sm text-gray-400">
                          <X size={18} className="flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="bg-white py-20 border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1F4363]">¿Por qué vale la pena?</h2>
            <p className="text-gray-500 mt-2">No es un gasto, es la mejor inversión para tu tienda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {METRICS.map((metric, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#F5F5F5] border border-transparent hover:border-[#198E7B]/30 transition-colors">
                <div className="w-16 h-16 bg-[#1F4363] rounded-2xl flex items-center justify-center text-[#FF821E] mb-6 shadow-lg shadow-blue-900/10">
                  {metric.icon}
                </div>
                <h3 className="text-4xl font-extrabold text-[#333333] mb-2">{metric.value}</h3>
                <h4 className="text-lg font-bold text-[#198E7B] mb-3">{metric.label}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {metric.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 max-w-3xl">
        <div className="text-center mb-12">
           <div className="inline-flex items-center justify-center p-3 bg-orange-100 text-[#FF821E] rounded-full mb-4">
             <HelpCircle size={24} />
           </div>
           <h2 className="text-3xl font-bold text-[#1F4363]">Preguntas Frecuentes</h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all hover:border-[#1F4363]/30"
            >
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="font-bold text-[#333333] text-lg">{faq.question}</span>
                {openFaq === idx ? (
                  <ChevronUp className="text-[#FF821E]" />
                ) : (
                  <ChevronDown className="text-gray-400" />
                )}
              </button>
              
              <div 
                className={`
                  overflow-hidden transition-all duration-300 ease-in-out
                  ${openFaq === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                <p className="p-6 pt-0 text-gray-500 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
           <p className="text-gray-500">¿Tienes más preguntas?</p>
           <a href="#" className="text-[#FF821E] font-bold hover:underline">Contacta a nuestro equipo de ventas</a>
        </div>
      </section>

    </div>
  );
};