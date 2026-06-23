'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ManufacturerCard } from '@/features/manufacturers/components/ManufacturerCard';
import { CatalogFilters, FilterState } from '@/features/manufacturers/components/CatalogFilters';
import { getManufacturers } from '@/features/manufacturers/services/manufacturers.service';
import { Manufacturer } from '@/features/manufacturers/types/manufacturer.types';
import {
  filterManufacturers,
  extractLocations,
  extractGarmentTypes,
} from '@/features/manufacturers/utils/filterManufacturers';

const INITIAL_FILTERS: FilterState = {
  query: '',
  location: '',
  garmentType: '',
  minExperience: '',
};

export default function CatalogPage() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getManufacturers()
      .then(setManufacturers)
      .catch(() => setError('No se pudo cargar el catálogo.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterManufacturers(manufacturers, filters);
  const locations = extractLocations(manufacturers);
  const garmentTypes = extractGarmentTypes(manufacturers);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Directorio</p>
          <h1 className="text-2xl font-semibold text-gray-900">Catálogo de fabricantes</h1>
          <p className="text-sm text-gray-400 mt-1">Encuentra el fabricante ideal para tu prenda</p>
        </div>

        {!loading && !error && (
          <CatalogFilters
            filters={filters}
            locations={locations}
            garmentTypes={garmentTypes}
            onChange={setFilters}
          />
        )}

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

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-2">
            <p className="text-sm text-gray-500">No se encontraron fabricantes con esos criterios.</p>
            <p className="text-xs text-gray-400">Intenta ajustar los filtros de búsqueda.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="text-xs text-gray-400 mb-4">
              {filtered.length === manufacturers.length
                ? `${manufacturers.length} fabricantes`
                : `${filtered.length} de ${manufacturers.length} fabricantes`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((m) => (
                <ManufacturerCard key={m.id} manufacturer={m} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
