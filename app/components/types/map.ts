export interface Marker {
  name?: string;
  lat: number;
  lng: number;
  description?: string;
  category?: string;
}

export interface MapProps {
  width?: string;
  height?: string;
  center?: [number, number];
  zoom?: number;
}
