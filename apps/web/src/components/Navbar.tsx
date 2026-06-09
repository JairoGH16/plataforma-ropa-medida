'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';

const CLIENT_NAV = [
  { href: '/catalog', label: 'Catálogo' },
  { href: '/measurements', label: 'Mis medidas' },
  { href: '/profile', label: 'Perfil' },
];

const MANUFACTURER_NAV = [
  { href: '/catalog', label: 'Catálogo' },
  { href: '/manufacturer', label: 'Mi perfil' },
  { href: '/profile', label: 'Cuenta' },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = user?.role === 'MANUFACTURER' ? MANUFACTURER_NAV : CLIENT_NAV;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-gray-900 text-sm tracking-widest uppercase">
            Ropa a la Medida
          </Link>
          <div className="hidden sm:flex items-center gap-6">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm transition-colors ${
                  pathname === href
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 hidden sm:block truncate max-w-36">{user?.name}</span>
          <button
            onClick={() => { logout(); router.push('/login'); }}
            className="text-xs text-gray-400 hover:text-gray-900 transition-colors border border-gray-200 rounded px-3 py-1.5 hover:border-gray-400"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
