import L from "leaflet";
import { Cluster } from "./cluster";

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
  mergeStrategy?: (
    markers: Marker[],
    zoom: number,
    size: number,
    map: L.Map
  ) => Cluster[];
}
