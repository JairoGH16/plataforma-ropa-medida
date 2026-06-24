'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ManufacturerCard } from '@/features/manufacturers/components/ManufacturerCard';
import { getManufacturerSuggestions } from '@/features/manufacturers/services/manufacturers.service';
import { Manufacturer } from '@/features/manufacturers/types/manufacturer.types';

const COMMON_TYPES = [
  'Camisas', 'Pantalones', 'Trajes', 'Vestidos', 'Faldas',
  'Chaquetas', 'Uniformes', 'Ropa deportiva',
];

export default function SuggestionsPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Manufacturer[] | null>(null);
  const [searched, setSearched] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(garmentType: string) {
    if (!garmentType.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);
    setSearched(garmentType.trim());
    try {
      const data = await getManufacturerSuggestions(garmentType.trim());
      setResults(data);
    } catch {
      setError('No se pudieron cargar las sugerencias.');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    handleSearch(query);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Motor de sugerencia</p>
          <h1 className="text-2xl font-semibold text-gray-900">Fabricantes sugeridos</h1>
          <p className="text-sm text-gray-400 mt-1">
            Ingresa el tipo de prenda que necesitas y te sugerimos los mejores fabricantes.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: Camisas, Trajes, Vestidos..."
              className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-gray-900 text-white text-sm px-5 py-2 rounded hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>

          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-2">Tipos comunes:</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => { setQuery(t); handleSearch(t); }}
                  className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1 hover:bg-gray-900 hover:text-white transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center py-8">{error}</p>
        )}

        {results !== null && !loading && (
          <>
            <p className="text-xs text-gray-400 mb-4">
              {results.length === 0
                ? `Sin resultados para "${searched}"`
                : `${results.length} fabricante${results.length !== 1 ? 's' : ''} sugerido${results.length !== 1 ? 's' : ''} para "${searched}"`}
            </p>

            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <p className="text-sm text-gray-500">
                  No encontramos fabricantes especializados en ese tipo de prenda.
                </p>
                <Link href="/catalog" className="text-xs text-gray-400 hover:text-gray-900 underline transition-colors">
                  Ver catálogo completo
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((m, i) => (
                  <div key={m.id} className="relative">
                    {i === 0 && (
                      <span className="absolute -top-2 -left-2 z-10 bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
                        Mejor opción
                      </span>
                    )}
                    <ManufacturerCard manufacturer={m} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
