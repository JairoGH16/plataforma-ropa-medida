'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { updateMe } from '@/features/auth/services/auth.service';
import { User } from '@/features/auth/types/auth.types';
import { Navbar } from '@/components/Navbar';

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition';
const labelClass = 'block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide';

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, saveSession } = useAuth();
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.resolve()
      .then(() => { if (!token) router.push('/login'); })
      .finally(() => setReady(true));
  }, [token, router]);

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

  if (!ready || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-12">
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Cuenta</p>
          <h1 className="text-2xl font-semibold text-gray-900">Mi perfil</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">{user.name[0].toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-400">{user.role === 'MANUFACTURER' ? 'Fabricante' : 'Cliente'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className={labelClass}>Nombre completo</label>
              <input name="name" type="text" defaultValue={user.name} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Correo electrónico</label>
              <input type="email" value={user.email} disabled className="w-full border border-gray-100 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
            </div>
            <div>
              <label className={labelClass}>Teléfono</label>
              <input name="phone" type="tel" defaultValue={user.phone ?? ''} className={inputClass} placeholder="Sin teléfono" />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}
            {success && <p className="text-xs text-green-600">Perfil actualizado correctamente.</p>}

            <button type="submit" disabled={saving} className="w-full bg-gray-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors mt-2">
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
