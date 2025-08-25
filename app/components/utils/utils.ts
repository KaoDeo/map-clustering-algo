import { FavoriteLocation } from "../types";
import L from "leaflet";

/*
 get centroid of cluster
 */
export const getCentroid = (markers: FavoriteLocation[]) => {
  const lat = markers.reduce((sum, m) => sum + m.lat, 0) / markers.length;
  const lng = markers.reduce((sum, m) => sum + m.lng, 0) / markers.length;
  return { lat, lng };
};

/*
 project lat/lng to pixel positions
 */
export const projectLatLngToPixelPositions = (
  lat: number,
  lng: number,
  map: L.Map
): { x: number; y: number } => {
  const point = map.latLngToLayerPoint(L.latLng(lat, lng));
  return { x: point.x, y: point.y };
};

/*
 project pixel position to offset positions
 */
export const projectPixelPositionToOffsetPositions = (
  pixelPosition: { x: number; y: number },
  offset = 3
): { x: number; y: number } => {
  return {
    x: pixelPosition.x + offset,
    y: pixelPosition.y + offset,
  };
};
