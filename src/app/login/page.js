'use client'
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { InputUsername } from '@/components/Inputs';
import InputPassword from '@/elements/InputPassword';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login data:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1F4363] relative overflow-hidden font-sans pt-14">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#FF821E] rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.08] animate-blob"></div>
        <div className="absolute top-[30%] -right-[10%] w-[50%] h-[50%] bg-[#198E7B] rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.08] animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-md p-6 relative z-10">
        
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 md:p-10 border border-white/10">
            
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FF821E] text-white font-extrabold text-2xl shadow-lg shadow-orange-500/30 mb-6 transform hover:scale-105 transition-transform duration-300">
                    360
                </div>
                <h2 className="text-3xl font-bold text-[#333333] tracking-tight">Bienvenido</h2>
                <p className="text-gray-500 text-sm mt-3 font-medium">Ingresa a tu punto de venta inteligente</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                    <InputUsername 
                        valuesData={formData.username} 
                        handleChange={handleChange} 
                        placeholder="Nombre de usuario"
                    />
                    <InputPassword 
                        valuesData={formData.password} 
                        handleChange={handleChange} 
                        placeholder="Contraseña segura"
                    />
                </div>

                <div className="flex items-center justify-between text-sm pt-2">
                    <label className="flex items-center gap-2 cursor-pointer group select-none">
                        <div className="relative flex items-center">
                          <input type="checkbox" className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:border-[#FF821E] checked:bg-[#FF821E]" />
                          <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-500 group-hover:text-[#333333] transition-colors font-medium">Recordarme</span>
                    </label>
                    <a href="#" className="font-bold text-[#1F4363] hover:text-[#FF821E] transition-colors">
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>

                <button 
                    type="submit"
                    className="
                      w-full 
                      bg-[#FF821E] 
                      text-white 
                      font-bold 
                      py-4 
                      rounded-xl 
                      shadow-xl shadow-orange-500/20 
                      hover:bg-[#e5700f] hover:shadow-orange-500/30 hover:-translate-y-0.5
                      active:translate-y-0 active:shadow-md
                      transition-all duration-200 
                      flex items-center justify-center gap-2
                      text-base
                    "
                >
                    Iniciar Sesión
                    <ArrowRight size={20} strokeWidth={2.5} />
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
                ¿Aún no tienes una cuenta?{' '}
                <Link href="/signup" className="font-bold text-[#1F4363] hover:text-[#FF821E] transition-colors">
                    Solicitar acceso
                </Link>
            </div>
        </div>
        
      </div>
    </div>
  );
}