'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Directorio</p>
          <h1 className="text-2xl font-semibold text-gray-900">Catálogo de fabricantes</h1>
          <p className="text-sm text-gray-400 mt-1">Encuentra el fabricante ideal para tu prenda</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <p className="text-sm text-gray-400">Cargando fabricantes...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-24">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && manufacturers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-2">
            <p className="text-sm text-gray-400">No hay fabricantes registrados aún.</p>
          </div>
        )}

        {!loading && !error && manufacturers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {manufacturers.map((m) => (
              <ManufacturerCard key={m.id} manufacturer={m} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
