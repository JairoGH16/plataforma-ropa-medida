'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function LoginPage() {
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
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Iniciar sesión</h2>
          <LoginForm
            onSuccess={({ token, user }) => {
              saveSession(token, user);
              router.push('/');
            }}
          />
          <p className="mt-5 text-sm text-center text-gray-400">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-gray-900 font-medium hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
