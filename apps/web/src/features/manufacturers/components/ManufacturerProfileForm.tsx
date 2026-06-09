'use client';

import { useState, FormEvent } from 'react';
import { ManufacturerProfile, UpsertProfileDto } from '../types/manufacturer.types';

interface Props {
  initial: ManufacturerProfile | null;
  onSave: (dto: UpsertProfileDto) => Promise<void>;
}

const inputClass = 'w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

export function ManufacturerProfileForm({ initial, onSave }: Props) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');
    const form = new FormData(e.currentTarget);

    const dto: UpsertProfileDto = {
      specialty: (form.get('specialty') as string) || undefined,
      garmentTypes: (form.get('garmentTypes') as string) || undefined,
      description: (form.get('description') as string) || undefined,
      location: (form.get('location') as string) || undefined,
      experience: form.get('experience') ? parseInt(form.get('experience') as string) : undefined,
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
        <label className={labelClass}>Especialidad</label>
        <input name="specialty" type="text" defaultValue={initial?.specialty ?? ''} className={inputClass} placeholder="Ej: Sastrería formal" />
      </div>
      <div>
        <label className={labelClass}>Tipos de prenda</label>
        <input name="garmentTypes" type="text" defaultValue={initial?.garmentTypes ?? ''} className={inputClass} placeholder="Ej: Camisas, Pantalones, Trajes" />
        <p className="text-xs text-gray-400 mt-1">Separa los tipos con comas</p>
      </div>
      <div>
        <label className={labelClass}>Descripción</label>
        <textarea name="description" rows={3} defaultValue={initial?.description ?? ''} className={inputClass} placeholder="Cuéntale a los clientes sobre tu trabajo..." />
      </div>
      <div>
        <label className={labelClass}>Ubicación</label>
        <input name="location" type="text" defaultValue={initial?.location ?? ''} className={inputClass} placeholder="Ej: San José, Costa Rica" />
      </div>
      <div>
        <label className={labelClass}>Años de experiencia</label>
        <input name="experience" type="number" min="0" defaultValue={initial?.experience ?? ''} className={inputClass} placeholder="0" />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">Perfil actualizado correctamente.</p>}

      <button type="submit" disabled={saving} className="bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50">
        {saving ? 'Guardando...' : 'Guardar perfil'}
      </button>
    </form>
  );
}
