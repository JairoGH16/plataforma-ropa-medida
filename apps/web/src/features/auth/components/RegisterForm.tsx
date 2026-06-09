'use client';

import { useState, FormEvent } from 'react';
import { register } from '../services/auth.service';
import { AuthResponse } from '../types/auth.types';

interface Props {
  onSuccess: (data: AuthResponse) => void;
}

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition';
const labelClass = 'block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide';

export function RegisterForm({ onSuccess }: Props) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const data = await register({
        name: form.get('name') as string,
        email: form.get('email') as string,
        password: form.get('password') as string,
        phone: (form.get('phone') as string) || undefined,
      });
      onSuccess(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Nombre completo</label>
        <input name="name" type="text" required className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Correo electrónico</label>
        <input name="email" type="email" required className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Contraseña</label>
        <input name="password" type="password" required minLength={6} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Teléfono (opcional)</label>
        <input name="phone" type="tel" className={inputClass} />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors mt-1">
        {loading ? 'Registrando...' : 'Crear cuenta'}
      </button>
    </form>
  );
}
