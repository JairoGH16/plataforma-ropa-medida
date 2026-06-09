'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { updateMe } from '@/features/auth/services/auth.service';
import { User } from '@/features/auth/types/auth.types';

const inputClass = 'w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, saveSession, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !token) router.push('/login');
  }, [mounted, token, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setSuccess(false);
    setError('');
    const form = new FormData(e.currentTarget);
    try {
      const updated = await updateMe(token, {
        name: form.get('name') as string,
        phone: (form.get('phone') as string) || undefined,
      });
      saveSession(token, updated as User);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setSaving(false);
    }
  }

  if (!mounted || !user) return null;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>
          <button
            onClick={() => { logout(); router.push('/login'); }}
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
          >
            Cerrar sesión
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Rol: <span className="font-medium text-gray-900">{user.role}</span>
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Nombre completo</label>
            <input name="name" type="text" defaultValue={user.name} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Correo electrónico</label>
            <input type="email" value={user.email} disabled className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-100 text-gray-500" />
          </div>
          <div>
            <label className={labelClass}>Teléfono</label>
            <input name="phone" type="tel" defaultValue={user.phone ?? ''} className={inputClass} />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">Perfil actualizado correctamente.</p>}
          <button type="submit" disabled={saving} className="bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
        <div className="mt-6 pt-6 border-t border-gray-100">
          <Link href="/measurements" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
            → Mis medidas corporales
          </Link>
        </div>
      </div>
    </main>
  );
}
