import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LightbulbIcon, StoreIcon } from 'lucide-react';

export default function WelcomPanel({
    itemVariants,
    setTutorialStep = () => { },
    setShowTutorial = () => { },
    loading = false,
    user = {},
    tiendaLoading = false,
    tiendas=[]
}) {
    function getInitials(name = '') {
        return name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'U'
    }
  return (
    <motion.div variants={itemVariants}>
        <div className="bg-gradient-to-br from-[#1F4363] to-[#163250] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-4">
                <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1,   opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-14 h-14 rounded-2xl bg-[#FF821E] flex items-center justify-center text-white font-extrabold text-lg shadow-lg shrink-0"
                >
                    {loading ? '·' : getInitials(user?.nombre_completo)}
                </motion.div>
                <div>
                    <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Bienvenido de vuelta</p>
                    <h1 className="text-white font-bold text-xl leading-tight">
                        {loading ? 'Cargando...' : (user?.nombre_completo ?? user?.email ?? 'Usuario')}
                    </h1>
                    <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                        {user?.esAdmin ? 'Administrador' : 'Trabajador'}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 shrink-0">
                    <StoreIcon style={{ fontSize: 22, color: '#FF821E' }} />
                    <div>
                        <p className="text-white/50 text-xs">Tu tienda</p>
                        {tiendaLoading ? (
                            <p className="text-white font-semibold text-sm">Cargando...</p>
                        ) : tiendas.length > 0 ? (
                            <>
                                <p className="text-white font-semibold text-sm">{tiendas[0]?.nombre}</p>
                                {tiendas.length > 1 && (
            <p className="text-white/40 text-xs">{tiendas.length} tiendas</p>
                                )}
                            </>
                        ) : (
                            <p className="text-white/50 font-semibold text-sm">Sin tienda</p>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => { setTutorialStep(0); setShowTutorial(true) }}
                    className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3 py-2 rounded-xl transition-colors shrink-0"
                >
                    <LightbulbIcon style={{ fontSize: 16, color: '#FF821E' }} />
                    <span className="hidden sm:inline">Tutorial</span>
                </button>
            </div>
                    </div>
   </motion.div>
  )
};