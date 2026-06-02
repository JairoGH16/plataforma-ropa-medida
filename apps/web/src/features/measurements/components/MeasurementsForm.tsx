'use client';

import { useState, FormEvent } from 'react';
import { Measurement, UpsertMeasurementDto } from '../types/measurement.types';

interface Props {
  initial: Measurement | null;
  onSave: (dto: UpsertMeasurementDto) => Promise<void>;
}

const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const FIELDS: { key: keyof UpsertMeasurementDto; label: string; unit: string }[] = [
  { key: 'cuello', label: 'Cuello', unit: 'cm' },
  { key: 'pecho', label: 'Pecho', unit: 'cm' },
  { key: 'cintura', label: 'Cintura', unit: 'cm' },
  { key: 'cadera', label: 'Cadera', unit: 'cm' },
  { key: 'largoManga', label: 'Largo de manga', unit: 'cm' },
  { key: 'largoPierna', label: 'Largo de pierna', unit: 'cm' },
];

export function MeasurementsForm({ initial, onSave }: Props) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');
    const form = new FormData(e.currentTarget);

    const parseField = (name: string) => {
      const val = form.get(name);
      return val ? parseFloat(val as string) : undefined;
    };

    const dto: UpsertMeasurementDto = {
      talla: (form.get('talla') as string) || undefined,
      cuello: parseField('cuello'),
      pecho: parseField('pecho'),
      cintura: parseField('cintura'),
      cadera: parseField('cadera'),
      largoManga: parseField('largoManga'),
      largoPierna: parseField('largoPierna'),
    };

    try {
      await onSave(dto);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Talla estándar</label>
        <select name="talla" defaultValue={initial?.talla ?? ''} className="w-full border rounded px-3 py-2">
          <option value="">Seleccionar talla</option>
          {TALLAS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {FIELDS.map(({ key, label, unit }) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">{label} ({unit})</label>
            <input
              name={key}
              type="number"
              step="0.1"
              min="0"
              defaultValue={initial?.[key] ?? ''}
              className="w-full border rounded px-3 py-2"
              placeholder="0.0"
            />
          </div>
        ))}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">Medidas guardadas correctamente.</p>}

      <button type="submit" disabled={saving} className="bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50">
        {saving ? 'Guardando...' : 'Guardar medidas'}
      </button>
    </form>
  );
}
