'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ManufacturerProfileForm } from '@/features/manufacturers/components/ManufacturerProfileForm';
import { getMyManufacturerProfile, saveMyManufacturerProfile } from '@/features/manufacturers/services/manufacturers.service';
import { ManufacturerProfile, UpsertProfileDto } from '@/features/manufacturers/types/manufacturer.types';
import { Navbar } from '@/components/Navbar';

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-gray-400">Cargando...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-12">
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Fabricante</p>
          <h1 className="text-2xl font-semibold text-gray-900">Mi perfil</h1>
          <p className="text-sm text-gray-400 mt-1">Visible para los clientes en el catálogo.</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <ManufacturerProfileForm initial={profile} onSave={handleSave} />
        </div>
      </main>
    </div>
  );
}
