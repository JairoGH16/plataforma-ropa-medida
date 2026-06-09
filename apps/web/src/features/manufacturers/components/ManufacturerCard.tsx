import { Manufacturer } from '../types/manufacturer.types';

interface Props {
  manufacturer: Manufacturer;
}

export function ManufacturerCard({ manufacturer }: Props) {
  const profile = manufacturer.manufacturerProfile;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{manufacturer.name}</h2>
        {profile?.specialty && (
          <p className="text-sm text-gray-500">{profile.specialty}</p>
        )}
      </div>

      {profile?.description && (
        <p className="text-sm text-gray-600 line-clamp-2">{profile.description}</p>
      )}

      {profile?.garmentTypes && (
        <div className="flex flex-wrap gap-1">
          {profile.garmentTypes.split(',').map((t) => (
            <span key={t.trim()} className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">
              {t.trim()}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-1 text-xs text-gray-500 mt-1">
        {profile?.location && <span>📍 {profile.location}</span>}
        {profile?.experience != null && <span>⏱ {profile.experience} años de experiencia</span>}
        {manufacturer.phone && <span>📞 {manufacturer.phone}</span>}
        <span>✉ {manufacturer.email}</span>
      </div>
    </div>
  );
}
