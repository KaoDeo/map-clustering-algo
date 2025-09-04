import { clusterByDistance, gridCluster, hierarchicalCluster } from "../utils";

export const mergeStrategies = {
  distance: clusterByDistance,
  grid: gridCluster,
  hierarchical: hierarchicalCluster,
};
