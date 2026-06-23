import { Manufacturer } from '../types/manufacturer.types';
import { FilterState } from '../components/CatalogFilters';

export function filterManufacturers(manufacturers: Manufacturer[], filters: FilterState): Manufacturer[] {
  const query = filters.query.toLowerCase().trim();
  const minExp = filters.minExperience ? parseInt(filters.minExperience) : 0;

  return manufacturers.filter((m) => {
    const profile = m.manufacturerProfile;

    if (query) {
      const nameMatch = m.name.toLowerCase().includes(query);
      const specialtyMatch = profile?.specialty?.toLowerCase().includes(query) ?? false;
      if (!nameMatch && !specialtyMatch) return false;
    }

    if (filters.garmentType && profile?.garmentTypes) {
      const types = profile.garmentTypes.split(',').map((t) => t.trim().toLowerCase());
      if (!types.includes(filters.garmentType.toLowerCase())) return false;
    } else if (filters.garmentType) {
      return false;
    }

    if (filters.location && profile?.location !== filters.location) return false;

    if (minExp > 0 && (profile?.experience == null || profile.experience < minExp)) return false;

    return true;
  });
}

export function extractLocations(manufacturers: Manufacturer[]): string[] {
  const set = new Set<string>();
  manufacturers.forEach((m) => {
    if (m.manufacturerProfile?.location) set.add(m.manufacturerProfile.location);
  });
  return Array.from(set).sort();
}

export function extractGarmentTypes(manufacturers: Manufacturer[]): string[] {
  const set = new Set<string>();
  manufacturers.forEach((m) => {
    m.manufacturerProfile?.garmentTypes
      ?.split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((t) => set.add(t));
  });
  return Array.from(set).sort();
}
