'use client';

import { useState, FormEvent } from 'react';
import { register } from '../services/auth.service';
import { AuthResponse } from '../types/auth.types';

interface Props {
  onSuccess: (data: AuthResponse) => void;
}

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
        phone: form.get('phone') as string || undefined,
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
        <label className="block text-sm font-medium mb-1">Nombre completo</label>
        <input name="name" type="text" required className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Correo electrónico</label>
        <input name="email" type="email" required className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Contraseña</label>
        <input name="password" type="password" required minLength={6} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Teléfono (opcional)</label>
        <input name="phone" type="tel" className="w-full border rounded px-3 py-2" />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50">
        {loading ? 'Registrando...' : 'Crear cuenta'}
      </button>
    </form>
  );
}
