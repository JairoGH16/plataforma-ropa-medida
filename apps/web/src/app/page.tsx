'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Navbar } from '@/components/Navbar';

const CLIENT_ITEMS = [
  { href: '/catalog', label: 'Catálogo de fabricantes', description: 'Explora los fabricantes disponibles en la plataforma', icon: '🧵' },
  { href: '/suggestions', label: 'Sugerencias', description: 'Recibe recomendaciones según el tipo de prenda que necesitas', icon: '✨' },
  { href: '/measurements', label: 'Mis medidas', description: 'Administra tus medidas corporales', icon: '📏' },
  { href: '/profile', label: 'Mi perfil', description: 'Actualiza tu información personal', icon: '👤' },
];

const MANUFACTURER_ITEMS = [
  { href: '/manufacturer', label: 'Mi perfil de fabricante', description: 'Gestiona tu especialidad y tipos de prenda', icon: '🧵' },
  { href: '/catalog', label: 'Catálogo', description: 'Explora otros fabricantes en la plataforma', icon: '📋' },
  { href: '/profile', label: 'Mi cuenta', description: 'Actualiza tu información personal', icon: '👤' },
];

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.resolve()
      .then(() => { if (!isAuthenticated) router.replace('/login'); })
      .finally(() => setReady(true));
  }, [isAuthenticated, router]);

  if (!ready || !isAuthenticated) return null;

  const navItems = user?.role === 'MANUFACTURER' ? MANUFACTURER_ITEMS : CLIENT_ITEMS;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            {user?.role === 'MANUFACTURER' ? 'Fabricante' : 'Cliente'}
          </p>
          <h1 className="text-2xl font-semibold text-gray-900">Bienvenido, {user?.name}</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {navItems.map(({ href, label, description, icon }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-400 hover:shadow-sm transition-all group"
            >
              <div className="text-2xl mb-3">{icon}</div>
              <h2 className="text-sm font-semibold text-gray-900 mb-1 group-hover:underline">{label}</h2>
              <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
