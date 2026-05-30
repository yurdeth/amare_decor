'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoadingLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);

    if (success) {
      router.push('/');
    } else {
      setError('Email o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#8E977D]/10 via-background to-accent/10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/logo-new.png"
            alt="Amaré Decor"
            className="h-20 mx-auto mb-4 object-contain"
          />
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            Amaré Decor
          </h1>
          <p className="text-primary/60">Inicia sesión en tu cuenta</p>
        </div>

        {/* Login Card */}
        <div className="bg-secondary/20 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#8E977D]/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#8E977D]/30 bg-white/50 focus:border-[#8E977D] focus:ring-2 focus:ring-[#8E977D]/20 outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-[#8E977D]/30 bg-white/50 focus:border-[#8E977D] focus:ring-2 focus:ring-[#8E977D]/20 outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoadingLogin}
              className="w-full bg-[#8E977D] text-white py-3 rounded-xl font-medium hover:bg-[#8E977D]/90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoadingLogin ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
          </form>

          {/* Credentials Info */}
          <div className="mt-6 pt-6 border-t border-[#8E977D]/20">
            <p className="text-xs text-center text-primary/60 mb-2">
              Usuarios registrados:
            </p>
            <div className="space-y-1 text-xs text-primary/70">
              <p>• <strong>Admin:</strong> amare.2520mp@gmail.com / AllyMeli</p>
              <p>• <strong>Editor:</strong> ampr0707@gmail.com / 12345678</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-primary/50 mt-6">
          © 2024 Amaré Decor. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
