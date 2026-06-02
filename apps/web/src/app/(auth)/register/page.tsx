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
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Crear cuenta</h1>
        <RegisterForm
          onSuccess={({ token, user }) => {
            saveSession(token, user);
            router.push('/profile');
          }}
        />
        <p className="mt-4 text-sm text-center text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="underline font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
