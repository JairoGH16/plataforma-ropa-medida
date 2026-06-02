'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { MeasurementsForm } from '@/features/measurements/components/MeasurementsForm';
import { getMyMeasurements, saveMeasurements } from '@/features/measurements/services/measurements.service';
import { Measurement, UpsertMeasurementDto } from '@/features/measurements/types/measurement.types';

export default function MeasurementsPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    getMyMeasurements(token)
      .then(setMeasurement)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, router]);

  async function handleSave(dto: UpsertMeasurementDto) {
    if (!token) return;
    const updated = await saveMeasurements(token, dto);
    setMeasurement(updated);
  }

  if (loading) return <main className="min-h-screen flex items-center justify-center"><p>Cargando...</p></main>;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mis medidas</h1>
          <Link href="/profile" className="text-sm text-gray-500 hover:underline">← Perfil</Link>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Tus medidas se guardarán en tu perfil y se usarán automáticamente en cada solicitud de confección.
        </p>
        <MeasurementsForm initial={measurement} onSave={handleSave} />
      </div>
    </main>
  );
}
