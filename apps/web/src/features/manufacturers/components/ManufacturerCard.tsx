import Link from 'next/link';
import { Manufacturer } from '../types/manufacturer.types';

interface Props {
  manufacturer: Manufacturer;
}

export function ManufacturerCard({ manufacturer }: Props) {
  const profile = manufacturer.manufacturerProfile;

  return (
    <Link
      href={`/catalog/${manufacturer.id}`}
      className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 hover:border-gray-400 hover:shadow-sm transition-all"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h2 className="text-sm font-semibold text-gray-900">{manufacturer.name}</h2>
          {profile?.experience != null && (
            <span className="text-xs text-gray-400 whitespace-nowrap">{profile.experience} años</span>
          )}
        </div>
        {profile?.specialty && (
          <p className="text-xs text-gray-400">{profile.specialty}</p>
        )}
      </div>

      {profile?.description && (
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{profile.description}</p>
      )}

      {profile?.garmentTypes && (
        <div className="flex flex-wrap gap-1">
          {profile.garmentTypes.split(',').map((t) => (
            <span key={t.trim()} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5">
              {t.trim()}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-1 pt-2 border-t border-gray-100">
        {profile?.location && (
          <span className="text-xs text-gray-400">{profile.location}</span>
        )}
        {manufacturer.phone && (
          <span className="text-xs text-gray-400">{manufacturer.phone}</span>
        )}
        <span className="text-xs text-gray-400">{manufacturer.email}</span>
      </div>
    </Link>
  );
}
