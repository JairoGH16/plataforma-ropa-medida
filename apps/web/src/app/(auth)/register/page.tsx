'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { saveSession } = useAuth();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-xs font-bold tracking-widest uppercase text-gray-900">Ropa a la Medida</h1>
          <p className="text-xs text-gray-400 mt-1">Plataforma digital de confección</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Crear cuenta</h2>
          <RegisterForm
            onSuccess={({ token, user }) => {
              saveSession(token, user);
              router.push('/');
            }}
          />
          <p className="mt-5 text-sm text-center text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-gray-900 font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
