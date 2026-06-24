'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getMyQuotes, getReceivedQuotes, updateQuoteStatus } from '@/features/quotes/services/quotes.service';
import { QuoteStatusBadge } from '@/features/quotes/components/QuoteStatusBadge';
import { QuoteRequest, QuoteStatus } from '@/features/quotes/types/quote.types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function QuotesPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isManufacturer = user?.role === 'MANUFACTURER';

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    const fetch = isManufacturer ? getReceivedQuotes : getMyQuotes;
    fetch(token)
      .then(setQuotes)
      .catch(() => setError('No se pudieron cargar las solicitudes.'))
      .finally(() => setLoading(false));
  }, [token, router, isManufacturer]);

  async function handleStatusChange(id: string, status: QuoteStatus) {
    if (!token) return;
    try {
      const updated = await updateQuoteStatus(token, id, status);
      setQuotes((prev) => prev.map((q) => (q.id === id ? updated : q)));
    } catch {
      alert('No se pudo actualizar el estado.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            {isManufacturer ? 'Fabricante' : 'Cliente'}
          </p>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isManufacturer ? 'Solicitudes recibidas' : 'Mis solicitudes'}
          </h1>
        </div>

        {loading && <p className="text-sm text-gray-400 text-center py-16">Cargando...</p>}
        {error && <p className="text-sm text-red-500 text-center py-16">{error}</p>}

        {!loading && !error && quotes.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-gray-500">No hay solicitudes aún.</p>
          </div>
        )}

        {!loading && !error && quotes.length > 0 && (
          <div className="flex flex-col gap-4">
            {quotes.map((q) => (
              <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{q.garmentType}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {isManufacturer
                        ? `De: ${q.client.name} — ${q.client.email}`
                        : `Para: ${q.manufacturer.name}`}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <QuoteStatusBadge status={q.status} />
                    <span className="text-xs text-gray-400">{formatDate(q.createdAt)}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {q.description}
                </p>

                {isManufacturer && q.status === 'PENDING' && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleStatusChange(q.id, 'ACCEPTED')}
                      className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded hover:bg-green-100 transition-colors"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => handleStatusChange(q.id, 'REVIEWED')}
                      className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors"
                    >
                      Marcar revisada
                    </button>
                    <button
                      onClick={() => handleStatusChange(q.id, 'REJECTED')}
                      className="text-xs bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded hover:bg-red-100 transition-colors"
                    >
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
