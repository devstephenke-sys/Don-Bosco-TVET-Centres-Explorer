export interface TVETCoordinate {
  lat: number;
  lon: number;
}

export interface TVETCentre {
  centre: string;
  location: string;
  coordinates: TVETCoordinate;
  country: string; // We'll enrich the data with its country name for easier processing
}

export interface TVETStats {
  totalCentres: number;
  totalCountries: number;
  centresPerCountry: { country: string; count: number }[];
  byRegion: { region: string; count: number }[];
}

export type ActiveTab = 'map' | 'directory' | 'analytics' | 'compare';
