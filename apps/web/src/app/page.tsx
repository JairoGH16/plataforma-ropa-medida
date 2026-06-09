'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';

const CLIENT_ITEMS = [
  { href: '/catalog', label: 'Catálogo de fabricantes', description: 'Explora los fabricantes disponibles' },
  { href: '/measurements', label: 'Mis medidas', description: 'Administra tus medidas corporales' },
  { href: '/profile', label: 'Mi perfil', description: 'Actualiza tu información personal' },
];

const MANUFACTURER_ITEMS = [
  { href: '/manufacturer', label: 'Mi perfil de fabricante', description: 'Gestiona tu especialidad y tipos de prenda' },
  { href: '/catalog', label: 'Catálogo de fabricantes', description: 'Explora otros fabricantes' },
  { href: '/profile', label: 'Mi cuenta', description: 'Actualiza tu información personal' },
];

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.resolve()
      .then(() => { if (!isAuthenticated) router.replace('/login'); })
      .finally(() => setReady(true));
  }, [isAuthenticated, router]);

  if (!ready || !isAuthenticated) return null;

  const navItems = user?.role === 'MANUFACTURER' ? MANUFACTURER_ITEMS : CLIENT_ITEMS;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bienvenido, {user?.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
          </div>
          <button
            onClick={() => { logout(); router.push('/login'); }}
            className="text-sm text-gray-500 hover:text-gray-900 hover:underline"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {navItems.map(({ href, label, description }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:border-gray-300 transition-all"
            >
              <h2 className="text-base font-semibold text-gray-900 mb-1">{label}</h2>
              <p className="text-sm text-gray-500">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
