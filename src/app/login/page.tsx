'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/src/context/AuthContext';
import { Button } from '@/src/components';

// Schema de validação com Zod
const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Página de Login - FreteMais
 * Design inspirado na identidade visual da empresa
 */
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      await login(data.email, data.senha);
      router.push('/motoristas');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
        'Erro ao fazer login. Verifique suas credenciais.';
      setError(errorMessage);
      return false;
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 flex-col items-center justify-center p-12">
        <div className="max-w-md">
          <div className="mb-12">
            <svg viewBox="0 0 400 300" className="w-full max-w-sm mx-auto">
              {/* Monitor */}
              <rect x="80" y="100" width="240" height="160" rx="10" fill="#FDB913" stroke="#2D3748" strokeWidth="3"/>
              <rect x="95" y="115" width="210" height="120" rx="5" fill="#F97316"/>
              
        
              {/* Clipboard */}
              <rect x="220" y="140" width="60" height="80" rx="3" fill="#FEF3C7" stroke="#2D3748" strokeWidth="2"/>
              <rect x="225" y="155" width="30" height="3" fill="#2D3748"/>
              <rect x="225" y="170" width="30" height="3" fill="#2D3748"/>
              <rect x="225" y="185" width="20" height="3" fill="#2D3748"/>
              
              {/* Base do monitor */}
              <path d="M 150 260 L 170 280 L 230 280 L 250 260 Z" fill="#60A5FA" stroke="#2D3748" strokeWidth="3"/>
              <rect x="130" y="280" width="140" height="8" rx="4" fill="#2563EB" stroke="#2D3748" strokeWidth="2"/>
            </svg>
          </div>

          {/* Texto */}
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Fácil, seguro<br/>e rápido
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Nosso sistema conecta transportadoras, empresas e caminhoneiros de uma maneira inteligente e eficiente.
          </p>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 bg-[#FDB913] flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Título */}
          <h2 className="text-5xl font-semibold text-gray-900 mb-8 text-center">
            Login
          </h2>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Digite o seu email"
                {...register('email')}
                className="w-full px-4 py-3 rounded-lg bg-white border-0 text-gray-900 placeholder-amber-950 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-700">{errors.email.message}</p>
              )}
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-900 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  {...register('senha')}
                  className="w-full px-4 py-3 rounded-lg bg-white border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.senha && (
                <p className="mt-1 text-sm text-red-700">{errors.senha.message}</p>
              )}
            </div>

            {/* Erro de Login */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Botão Entrar */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
            >
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
