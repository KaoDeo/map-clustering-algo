## Problem:

On the map, zoomChange markers aren't merged, creating visual clutter.

## Used algorithms for clustering

- Distance-based clustering - time complexity O(n^2), space complexity O(n)
- Grid-based clustering - time complexity O(n), space complexity O(n)
- Hierarchical clustering (in development)

## Summery

Distance-based clustering gives the most intuitive UX. However, on every zoom change, the distance is recalculated, creating more clusters when the cluster merge seems to be expected. For that, hierarchical clustering seems to be a solution
