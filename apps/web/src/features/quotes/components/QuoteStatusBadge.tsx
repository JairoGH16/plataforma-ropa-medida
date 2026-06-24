import { QuoteStatus } from '../types/quote.types';

const LABELS: Record<QuoteStatus, string> = {
  PENDING: 'Pendiente',
  REVIEWED: 'Revisada',
  ACCEPTED: 'Aceptada',
  REJECTED: 'Rechazada',
};

const STYLES: Record<QuoteStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  REVIEWED: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
