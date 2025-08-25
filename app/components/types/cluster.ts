import { Marker } from "./map";

export interface Cluster {
  x: number;
  y: number;
  markers: Marker[];
  centroid: { lat: number; lng: number };
}
