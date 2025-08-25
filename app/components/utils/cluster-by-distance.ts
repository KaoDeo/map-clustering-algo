import { Cluster, Marker } from "../types";
import { getCentroid } from "./utils";

export function clusterByDistance(
  markers: Marker[],
  zoom: number,
  distanceThreshold = 5,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map: any
): Cluster[] {
  const clusters: Cluster[] = [];

  const points = markers.map((m) => ({
    marker: m,
    point: map.project([m.lat, m.lng], zoom),
    clustered: false,
  }));

  for (let i = 0; i < points.length; i++) {
    if (points[i].clustered) continue;

    const cluster = {
      x: points[i].point.x,
      y: points[i].point.y,
      markers: [points[i].marker],
      centroid: { lat: 0, lng: 0 },
    };
    points[i].clustered = true;

    for (let j = i + 1; j < points.length; j++) {
      if (points[j].clustered) continue;

      const dx = points[i].point.x - points[j].point.x;
      const dy = points[i].point.y - points[j].point.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < distanceThreshold) {
        cluster.markers.push(points[j].marker);
        points[j].clustered = true;
      }
    }

    cluster.centroid = getCentroid(cluster.markers);
    clusters.push(cluster);
  }

  console.log(clusters);
  return clusters;
}
