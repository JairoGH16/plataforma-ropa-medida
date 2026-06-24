'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { getManufacturerById } from '@/features/manufacturers/services/manufacturers.service';
import { Manufacturer } from '@/features/manufacturers/types/manufacturer.types';
import { QuoteRequestForm } from '@/features/quotes/components/QuoteRequestForm';
import { createQuote } from '@/features/quotes/services/quotes.service';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function ManufacturerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, token } = useAuth();
  const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    getManufacturerById(id)
      .then(setManufacturer)
      .catch(() => setError('No se encontró el fabricante.'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <Link
          href="/catalog"
          className="text-xs text-gray-400 hover:text-gray-900 transition-colors mb-8 inline-block"
        >
          ← Volver al catálogo
        </Link>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <p className="text-sm text-gray-400">Cargando fabricante...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={() => router.push('/catalog')}
              className="text-xs text-gray-400 hover:text-gray-900 transition-colors"
            >
              Volver al catálogo
            </button>
          </div>
        )}

        {!loading && manufacturer && (
          <>
            <ManufacturerDetail manufacturer={manufacturer} />

            {user?.role === 'CLIENT' && token && !sent && (
              <>
                {!showForm ? (
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-6 w-full bg-gray-900 text-white text-sm py-3 rounded-xl hover:bg-gray-700 transition-colors"
                  >
                    Solicitar cotización
                  </button>
                ) : (
                  <QuoteRequestForm
                    manufacturerId={id}
                    manufacturerName={manufacturer.name}
                    token={token}
                    onSubmit={async (dto) => {
                      await createQuote(token, { ...dto, manufacturerId: id });
                    }}
                    onSent={() => { setShowForm(false); setSent(true); }}
                    onCancel={() => setShowForm(false)}
                  />
                )}
              </>
            )}

            {sent && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-sm text-green-700 font-medium">Solicitud enviada correctamente.</p>
                <Link href="/quotes" className="text-xs text-green-600 hover:underline mt-1 inline-block">
                  Ver mis solicitudes →
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function ManufacturerDetail({ manufacturer }: { manufacturer: Manufacturer }) {
  const profile = manufacturer.manufacturerProfile;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Fabricante</p>
          <h1 className="text-2xl font-semibold text-gray-900">{manufacturer.name}</h1>
          {profile?.specialty && (
            <p className="text-sm text-gray-500 mt-1">{profile.specialty}</p>
          )}
        </div>
        {profile?.experience != null && (
          <div className="text-right shrink-0">
            <p className="text-2xl font-semibold text-gray-900">{profile.experience}</p>
            <p className="text-xs text-gray-400">años de exp.</p>
          </div>
        )}
      </div>

      {profile?.description && (
        <div className="border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Sobre el fabricante</p>
          <p className="text-sm text-gray-700 leading-relaxed">{profile.description}</p>
        </div>
      )}

      {profile?.garmentTypes && (
        <div className="border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Tipos de prenda</p>
          <div className="flex flex-wrap gap-2">
            {profile.garmentTypes.split(',').map((t) => (
              <span key={t.trim()} className="text-xs bg-gray-100 text-gray-700 rounded-full px-3 py-1">
                {t.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-100 pt-6">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Contacto</p>
        <div className="flex flex-col gap-2">
          {profile?.location && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-20">Ubicación</span>
              <span className="text-sm text-gray-700">{profile.location}</span>
            </div>
          )}
          {manufacturer.phone && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-20">Teléfono</span>
              <span className="text-sm text-gray-700">{manufacturer.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-20">Correo</span>
            <a
              href={`mailto:${manufacturer.email}`}
              className="text-sm text-gray-700 hover:text-gray-900 underline underline-offset-2 transition-colors"
            >
              {manufacturer.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
