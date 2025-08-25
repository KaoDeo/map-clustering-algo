import { clusterByDistance, gridCluster } from "../utils";

export const mergeStrategies = {
  distance: clusterByDistance,
  grid: gridCluster,
  // hierarchical: hierarchicalCluster,
};
