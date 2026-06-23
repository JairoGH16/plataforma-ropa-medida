'use client';

import { ChangeEvent } from 'react';

export interface FilterState {
  query: string;
  location: string;
  garmentType: string;
  minExperience: string;
}

interface Props {
  filters: FilterState;
  locations: string[];
  garmentTypes: string[];
  onChange: (filters: FilterState) => void;
}

const inputClass =
  'w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 bg-white';

export function CatalogFilters({ filters, locations, garmentTypes, onChange }: Props) {
  function handle(field: keyof FilterState) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange({ ...filters, [field]: e.target.value });
  }

  function reset() {
    onChange({ query: '', location: '', garmentType: '', minExperience: '' });
  }

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre o especialidad..."
          value={filters.query}
          onChange={handle('query')}
          className={inputClass}
        />

        <select value={filters.garmentType} onChange={handle('garmentType')} className={inputClass}>
          <option value="">Todos los tipos de prenda</option>
          {garmentTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select value={filters.location} onChange={handle('location')} className={inputClass}>
          <option value="">Todas las ubicaciones</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="0"
          placeholder="Experiencia mínima (años)"
          value={filters.minExperience}
          onChange={handle('minExperience')}
          className={inputClass}
        />
      </div>

      {hasFilters && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={reset}
            className="text-xs text-gray-400 hover:text-gray-900 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
