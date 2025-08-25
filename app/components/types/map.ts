export interface FavoriteLocation {
  name?: string;
  lat: number;
  lng: number;
  description?: string;
  category?: string;
}

export interface MarkerPosition {
  location: FavoriteLocation;
  pixelPosition: { x: number; y: number };
  offsetPosition?: { x: number; y: number };
  marker?: L.Marker;
  centroid?: { x: number; y: number };
}

export interface MapProps {
  width?: string;
  height?: string;
  center?: [number, number];
  zoom?: number;
}
