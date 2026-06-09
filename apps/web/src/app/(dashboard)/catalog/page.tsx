'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ManufacturerCard } from '@/features/manufacturers/components/ManufacturerCard';
import { getManufacturers } from '@/features/manufacturers/services/manufacturers.service';
import { Manufacturer } from '@/features/manufacturers/types/manufacturer.types';

export default function CatalogPage() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getManufacturers()
      .then(setManufacturers)
      .catch(() => setError('No se pudo cargar el catálogo.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Catálogo de fabricantes</h1>
            <p className="text-sm text-gray-500 mt-1">Encuentra el fabricante ideal para tu prenda</p>
          </div>
          <Link href="/profile" className="text-sm text-gray-500 hover:text-gray-900 hover:underline">
            ← Perfil
          </Link>
        </div>

        {loading && (
          <p className="text-gray-600 text-center py-20">Cargando fabricantes...</p>
        )}

        {error && (
          <p className="text-red-600 text-center py-20">{error}</p>
        )}

        {!loading && !error && manufacturers.length === 0 && (
          <p className="text-gray-500 text-center py-20">No hay fabricantes registrados aún.</p>
        )}

        {!loading && !error && manufacturers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {manufacturers.map((m) => (
              <ManufacturerCard key={m.id} manufacturer={m} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
