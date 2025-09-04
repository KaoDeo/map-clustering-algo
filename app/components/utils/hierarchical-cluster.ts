import { Cluster, Marker } from "../types";
import { getCentroid } from "./utils";

export function hierarchicalCluster(
  markers: Marker[],
  zoom: number,
  distanceThreshold: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map: any
) {
  const clusters: Cluster[] = [];

  const points = markers.map((m) => ({
    marker: m,
    point: map.project([m.lat, m.lng], zoom),
    clustered: false,
  }));

  for (let i = 0; i < points.length; i++) {
    if (points[i].clustered) continue;

    const cluster: Cluster = {
      x: points[i].point.x,
      y: points[i].point.y,
      markers: [points[i].marker],
      centroid: { lat: points[i].marker.lat, lng: points[i].marker.lng },
    };
    points[i].clustered = true;

    for (let j = i + 1; j < points.length; j++) {
      if (points[j].clustered) continue;

      const dx = cluster.x - points[j].point.x;
      const dy = cluster.y - points[j].point.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < distanceThreshold) {
        cluster.markers.push(points[j].marker);
        points[j].clustered = true;
        const centroid = getCentroid(cluster.markers);
        const centroidPoint = map.project([centroid.lat, centroid.lng], zoom);
        cluster.x = centroidPoint.x;
        cluster.y = centroidPoint.y;
      }
    }

    cluster.centroid = getCentroid(cluster.markers);
    clusters.push(cluster);
  }

  console.log(clusters);
  return clusters;
}
