'use client';

import { FormEvent, useState } from 'react';
import { CreateQuoteDto } from '../types/quote.types';
import { Measurement } from '@/features/measurements/types/measurement.types';

interface Props {
  manufacturerId: string;
  manufacturerName: string;
  measurement: Measurement | null;
  onSent: () => void;
  onCancel: () => void;
  token: string;
  onSubmit: (dto: CreateQuoteDto) => Promise<void>;
}

const inputClass =
  'w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900';

const FIELDS: { key: keyof Omit<Measurement, 'id' | 'userId' | 'createdAt' | 'updatedAt'>; label: string; unit?: string }[] = [
  { key: 'talla', label: 'Talla' },
  { key: 'cuello', label: 'Cuello', unit: 'cm' },
  { key: 'pecho', label: 'Pecho', unit: 'cm' },
  { key: 'cintura', label: 'Cintura', unit: 'cm' },
  { key: 'cadera', label: 'Cadera', unit: 'cm' },
  { key: 'largoManga', label: 'Largo manga', unit: 'cm' },
  { key: 'largoPierna', label: 'Largo pierna', unit: 'cm' },
];

export function QuoteRequestForm({ manufacturerName, measurement, onSent, onCancel, onSubmit }: Props) {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError('');
    const form = new FormData(e.currentTarget);
    try {
      await onSubmit({
        manufacturerId: '',
        garmentType: form.get('garmentType') as string,
        description: form.get('description') as string,
      });
      onSent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar');
    } finally {
      setSending(false);
    }
  }

  const hasMeasurements = measurement && FIELDS.some((f) => measurement[f.key] != null);

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 mt-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Solicitar cotización a {manufacturerName}
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            Tipo de prenda
          </label>
          <input
            name="garmentType"
            type="text"
            required
            placeholder="Ej: Camisa formal, Vestido de noche..."
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            Descripción de la prenda
          </label>
          <textarea
            name="description"
            rows={4}
            required
            placeholder="Describe los detalles: tela, colores, fecha de entrega esperada..."
            className={inputClass}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Medidas incluidas en la solicitud
          </p>
          {hasMeasurements ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              {FIELDS.map(({ key, label, unit }) => {
                const val = measurement[key];
                if (val == null) return null;
                return (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-gray-400">{label}</span>
                    <span className="text-gray-700 font-medium">
                      {val}{unit ? ` ${unit}` : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-amber-600">
              No tienes medidas registradas. El fabricante recibirá la solicitud sin medidas.{' '}
              <a href="/measurements" className="underline">Registrar medidas</a>
            </p>
          )}
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={sending}
            className="flex-1 bg-gray-900 text-white text-sm py-2 rounded hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {sending ? 'Enviando...' : 'Enviar solicitud'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 rounded hover:border-gray-400 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
