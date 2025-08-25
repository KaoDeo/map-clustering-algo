import { Cluster, Marker } from "../types";
import { clusterByDistance } from "./cluster-by-distance";

// TODO: some items should be treated as clusters, some as markers
export function hierarchicalCluster(
  markers: Marker[],
  zoom: number,
  distanceThreshold: number,
  map: any
): Cluster[] {
  const clusters = clusterByDistance(markers, zoom, distanceThreshold, map);

  const centroids = clusters.map((c) => ({
    marker: { lat: c.centroid.lat, lng: c.centroid.lng },
  }));

  const nextClusters = clusterByDistance(
    centroids.map((c) => c.marker),
    zoom,
    distanceThreshold * 1.5,
    map
  );

  return clusters.length === nextClusters.length
    ? clusters
    : hierarchicalCluster(
        centroids.map((c) => c.marker),
        zoom,
        distanceThreshold * 1.5,
        map
      );
}
