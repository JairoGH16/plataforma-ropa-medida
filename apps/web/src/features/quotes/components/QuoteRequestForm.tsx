'use client';

import { FormEvent, useState } from 'react';
import { CreateQuoteDto } from '../types/quote.types';

interface Props {
  manufacturerId: string;
  manufacturerName: string;
  onSent: () => void;
  onCancel: () => void;
  token: string;
  onSubmit: (dto: CreateQuoteDto) => Promise<void>;
}

const inputClass =
  'w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900';

export function QuoteRequestForm({ manufacturerName, onSent, onCancel, onSubmit }: Props) {
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
            placeholder="Describe los detalles: tela, colores, talla, fecha de entrega esperada..."
            className={inputClass}
          />
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
