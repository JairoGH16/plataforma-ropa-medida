'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { MeasurementsForm } from '@/features/measurements/components/MeasurementsForm';
import { getMyMeasurements, saveMeasurements } from '@/features/measurements/services/measurements.service';
import { Measurement, UpsertMeasurementDto } from '@/features/measurements/types/measurement.types';
import { Navbar } from '@/components/Navbar';

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
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Cuerpo</p>
          <h1 className="text-2xl font-semibold text-gray-900">Mis medidas</h1>
          <p className="text-sm text-gray-400 mt-1">Se usarán automáticamente en cada solicitud de confección.</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <MeasurementsForm initial={measurement} onSave={handleSave} />
        </div>
      </main>
    </div>
  );
}
