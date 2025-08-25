import { Cluster, Marker } from "../types";

export function gridCluster(
  markers: Marker[],
  zoom: number,
  size = 60,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map: any
): Cluster[] {
  const cellMap = new Map<string, Cluster>();

  for (const m of markers) {
    const point = map.project([m.lat, m.lng], zoom);

    const cellX = Math.floor(point.x / size);
    const cellY = Math.floor(point.y / size);
    const key = `${cellX}_${cellY}`;

    if (!cellMap.has(key)) {
      cellMap.set(key, {
        x: cellX,
        y: cellY,
        markers: [],
        centroid: { lat: 0, lng: 0 },
      });
    }

    cellMap.get(key)!.markers.push(m);
  }

  return Array.from(cellMap.values());
}
