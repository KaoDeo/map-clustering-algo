import L from "leaflet";
import { MarkerPosition } from "../types";

export const detectCollisions = (
  positions: MarkerPosition[],
  markerRadius = 20
): number[][] => {
  const collisions: number[][] = [];

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const pos1 = positions[i].offsetPosition || positions[i].pixelPosition;
      const pos2 = positions[j].offsetPosition || positions[j].pixelPosition;

      const distance = Math.sqrt(
        Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
      );

      // Check if markers overlap (distance less than combined radius)
      if (distance < markerRadius * 2) {
        collisions.push([i, j]);
      }
    }
  }

  return collisions;
};

export const resolveCollisions = (
  positions: MarkerPosition[],
  markerRadius = 20
): MarkerPosition[] => {
  const resolved = [...positions];
  const maxIterations = 10;
  let iteration = 0;

  while (iteration < maxIterations) {
    const collisions = detectCollisions(resolved, markerRadius);

    if (collisions.length === 0) break;

    // Resolve collisions by applying spiral offset
    collisions.forEach((collision) => {
      const [, j] = collision; // Only destructure j since we only need the second index
      const angle = Math.random() * 2 * Math.PI; // Random angle for natural distribution
      const offsetDistance = markerRadius * 1.5;

      // Apply offset to the second marker in collision pair
      const basePos = resolved[j].pixelPosition;
      resolved[j].offsetPosition = {
        x: basePos.x + Math.cos(angle) * offsetDistance,
        y: basePos.y + Math.sin(angle) * offsetDistance,
      };
    });

    iteration++;
  }

  return resolved;
};

// const convertPixelToLatLng = (
//   map: L.Map,
//   pixelPos: { x: number; y: number }
// ): [number, number] => {
//   const point = L.point(pixelPos.x, pixelPos.y);
//   const latlng = map.layerPointToLatLng(point);
//   return [latlng.lat, latlng.lng];
// };

// project lat/lng to screen coordinates
export const projectLatLngToScreenCoordinates = (
  lat: number,
  lng: number,
  map: L.Map
): { x: number; y: number } => {
  const point = map.latLngToLayerPoint(L.latLng(lat, lng));
  return { x: point.x, y: point.y };
};
