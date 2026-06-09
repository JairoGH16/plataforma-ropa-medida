import { Manufacturer } from '../types/manufacturer.types';

interface Props {
  manufacturer: Manufacturer;
}

export function ManufacturerCard({ manufacturer }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-2 hover:shadow-md transition-shadow">
      <h2 className="text-lg font-semibold text-gray-900">{manufacturer.name}</h2>
      <p className="text-sm text-gray-600">{manufacturer.email}</p>
      {manufacturer.phone && (
        <p className="text-sm text-gray-600">{manufacturer.phone}</p>
      )}
    </div>
  );
}
