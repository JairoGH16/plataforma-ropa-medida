'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ManufacturerProfileForm } from '@/features/manufacturers/components/ManufacturerProfileForm';
import { getMyManufacturerProfile, saveMyManufacturerProfile } from '@/features/manufacturers/services/manufacturers.service';
import { ManufacturerProfile, UpsertProfileDto } from '@/features/manufacturers/types/manufacturer.types';

export default function ManufacturerProfilePage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [profile, setProfile] = useState<ManufacturerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    if (user?.role !== 'MANUFACTURER') { router.push('/'); return; }
    getMyManufacturerProfile(token)
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, user, router]);

  async function handleSave(dto: UpsertProfileDto) {
    if (!token) return;
    const updated = await saveMyManufacturerProfile(token, dto);
    setProfile(updated);
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-gray-700">Cargando...</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mi perfil de fabricante</h1>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 hover:underline">← Inicio</Link>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Esta información será visible para los clientes en el catálogo de fabricantes.
        </p>
        <ManufacturerProfileForm initial={profile} onSave={handleSave} />
      </div>
    </main>
  );
}
