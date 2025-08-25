import { Marker } from "../types";

/*
 get centroid of cluster
 */
export const getCentroid = (markers: Marker[]) => {
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
  map: any
): { x: number; y: number } => {
  const point = map.latLngToLayerPoint(map.latLng(lat, lng));
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
