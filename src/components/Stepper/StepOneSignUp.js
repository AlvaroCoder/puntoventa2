import { VALIDATE_EMAIL } from '@/conexion/login'
import InputField from '@/elements/InputField'
import InputPassword from '@/elements/InputPassword'
import { CheckCircle2, Circle, XCircle, Mail } from 'lucide-react'
import React, { useState } from 'react'

const REQUIREMENTS = [
    { key: 'length',  label: 'Mínimo 8 caracteres',          test: (p) => p.length >= 8 },
    { key: 'upper',   label: 'Al menos una letra mayúscula',  test: (p) => /[A-Z]/.test(p) },
    { key: 'lower',   label: 'Al menos una letra minúscula',  test: (p) => /[a-z]/.test(p) },
    { key: 'number',  label: 'Al menos un número',            test: (p) => /\d/.test(p) },
    { key: 'special', label: 'Al menos un carácter especial', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

function strengthLabel(passed) {
    if (passed <= 1) return { label: 'Muy débil', color: 'bg-red-400',    width: 'w-1/5'  }
    if (passed === 2) return { label: 'Débil',    color: 'bg-orange-400',  width: 'w-2/5'  }
    if (passed === 3) return { label: 'Regular',  color: 'bg-yellow-400',  width: 'w-3/5'  }
    if (passed === 4) return { label: 'Buena',    color: 'bg-[#1B8D7C]',  width: 'w-4/5'  }
    return                   { label: 'Fuerte',   color: 'bg-[#1B8D7C]',  width: 'w-full' }
}

export default function StepOneSignUp({ formData, handleInputChange, errors }) {
    const [showConfirm, setShowConfirm] = useState(false)
    const [loadingValidation, setLoadingValidation] = useState(false);
    const [checkEmail, setCheckEmail] = useState(false);
    const [checkPassword, setCheckPassword] = useState(false);
    const password = formData.password ?? ''
    const confirmPassword = formData.confirmPassword ?? ''

    const results     = REQUIREMENTS.map(r => ({ ...r, passed: r.test(password) }))
    const passedCount = results.filter(r => r.passed).length
    const strength    = password.length > 0 ? strengthLabel(passedCount) : null

    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

    const handlePasswordChange = (e) => {
        handleInputChange(e)
        const allMet = REQUIREMENTS.every(r => r.test(e.target.value));
        setCheckPassword(allMet)

        setShowConfirm(allMet)
    }

    const handleBlurEmailChange =async (e) => {
        const emailToSend = formData?.email;
        if (emailToSend.length > 0 && emailToSend?.includes('@')) {
           try {
            setLoadingValidation(true)
            const objectValidation = await VALIDATE_EMAIL(emailToSend);
            if (!objectValidation.status) setCheckEmail(true);
            
               const response = await objectValidation.json();
               const disponible = response?.data?.disponible;
               console.log("DISPONIBLE : "+disponible)
               setCheckEmail(disponible);
            
        } catch (error) {
            console.log('ERROR = '+error)
        } finally {
            setLoadingValidation(false)
        }
        }
        
    }

    return (
        <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">

            <div className="mb-2">
                <h2 className="text-xl font-bold text-[#1F4363]">Crea tu cuenta</h2>
                <p className="text-gray-500 text-sm">Comencemos con tus credenciales</p>
            </div>

            <InputField
                label="Correo Electrónico"
                icon={Mail}
                name="email"
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={formData.email}
                onChange={handleInputChange}
                error={errors?.email}
                checkValue={checkEmail}
                loading={loadingValidation}
                onBlur={handleBlurEmailChange}
                obligatory={true}
            />

            <InputPassword
                label="Contraseña"
                name="password"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={handlePasswordChange}
                error={errors?.password}
                checkValue={checkPassword}
                obligatory={true}
            />

            {password.length > 0 && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">

                    <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`} />
                        </div>
                        <span className={`text-xs font-semibold shrink-0 transition-colors ${
                            passedCount <= 2 ? 'text-red-400' : passedCount <= 3 ? 'text-yellow-500' : 'text-[#1B8D7C]'
                        }`}>
                            {strength.label}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5">
                        {results.map(({ key, label, passed }) => (
                            <div key={key} className="flex items-center gap-2">
                                {passed
                                    ? <CheckCircle2 size={13} className="text-[#1B8D7C] shrink-0" />
                                    : <Circle       size={13} className="text-gray-300 shrink-0" />
                                }
                                <span className={`text-xs transition-colors duration-200 ${
                                    passed ? 'text-[#1B8D7C] font-medium' : 'text-gray-400'
                                }`}>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showConfirm && (
                <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                    <InputPassword
                        label="Confirmar Contraseña"
                        name="confirmPassword"
                        placeholder="Repite tu contraseña"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        error={errors?.confirmPassword}
                    />

                    {confirmPassword.length > 0 && (
                        <div className={`flex items-center gap-1.5 text-xs font-medium px-1 transition-all duration-200 ${
                            passwordsMatch ? 'text-[#1B8D7C]' : 'text-red-400'
                        }`}>
                            {passwordsMatch
                                ? <><CheckCircle2 size={13} /> Las contraseñas coinciden</>
                                : <><XCircle      size={13} /> Las contraseñas no coinciden</>
                            }
                        </div>
                    )}
                </div>
            )}

        </div>
    )
}