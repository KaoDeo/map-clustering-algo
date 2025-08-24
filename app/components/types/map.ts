export interface FavoriteLocation {
  name: string;
  coordinates: [number, number];
  description: string;
  category: string;
}

export interface MarkerPosition {
  location: FavoriteLocation;
  pixelPosition: { x: number; y: number };
  offsetPosition?: { x: number; y: number };
  marker?: L.Marker;
}

export interface MapProps {
  width?: string;
  height?: string;
  center?: [number, number];
  zoom?: number;
  showFavorites?: boolean;
  enableCollisionDetection?: boolean;
}
