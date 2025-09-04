"use client";

import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useRef } from "react";
import { FAVORITE_LOCATIONS } from "./favourite-locations";
import { MapProps } from "./types";
import { clusterByDistance, hierarchicalCluster } from "./utils";

delete (
  L.Icon.Default.prototype as typeof L.Icon.Default.prototype & {
    _getIconUrl?: () => void;
  }
)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Map({
  width = "100%",
  height = "400px",
  center = [40.7128, -74.006], // NYC coordinates as default
  zoom = 13,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const createIcon = useCallback((count: number) => {
    const isCluster = count > 1;
    const size = isCluster ? Math.min(40 + Math.log(count) * 5, 60) : 30;

    return L.divIcon({
      html: `
        <div style="
          background-color: ${isCluster ? "#3b82f6" : "#ef4444"};
          border: 2px solid white;
          border-radius: 50%;
          width: ${size}px;
          height: ${size}px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          <span style="
            color: white;
            font-size: ${isCluster ? Math.min(14 + Math.log(count), 16) : 16}px;
            font-weight: bold;
          ">${isCluster ? count : "⭐"}</span>
        </div>
      `,
      className: isCluster ? "custom-cluster-icon" : "custom-favorite-icon",
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
    });
  }, []);

  const updateMarkers = useCallback(() => {
    if (!leafletMapRef.current || !markersLayerRef.current) return;

    const currentZoom = leafletMapRef.current.getZoom();

    markersLayerRef.current.clearLayers();

    const cellSize = currentZoom <= 10 ? 100 : currentZoom <= 12 ? 60 : 30;

    const clusters = hierarchicalCluster(
      FAVORITE_LOCATIONS,
      currentZoom,
      cellSize,
      leafletMapRef.current
    );

    clusters.forEach((cluster) => {
      const markerCount = cluster.markers.length;
      const icon = createIcon(markerCount);

      let representative = cluster.markers[0];

      let popupContent;
      if (markerCount === 1) {
        popupContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
              ${representative.name}
            </h3>
            <p style="margin: 0; font-size: 14px; color: #4b5563;">
              ${representative.description}
            </p>
            <div style="margin-top: 8px; padding: 4px 8px; background-color: #f3f4f6; border-radius: 4px; font-size: 12px; color: #6b7280;">
              Category: ${representative.category}
            </div>
          </div>
        `;
      } else {
        const locationsList = cluster.markers
          .map(
            (loc) =>
              `<li style="margin: 4px 0;"><strong>${loc.name}</strong> - ${loc.category}</li>`
          )
          .join("");

        popupContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
              ${markerCount} Locations in This Area
            </h3>
            <ul style="margin: 8px 0; padding-left: 16px; font-size: 14px; color: #4b5563;">
              ${locationsList}
            </ul>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af; font-style: italic;">
              Zoom in to see individual markers
            </p>
          </div>
        `;

        representative = cluster.centroid;
      }

      L.marker([representative.lat, representative.lng], { icon })
        .addTo(markersLayerRef.current!)
        .bindPopup(popupContent);
    });
  }, [createIcon]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mapRef || !mapRef.current) return;

    leafletMapRef.current = L.map(mapRef.current).setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMapRef.current);

    markersLayerRef.current = L.layerGroup().addTo(leafletMapRef.current);

    // L.marker(center)
    //   .addTo(leafletMapRef.current)
    //   .bindPopup(
    //     `
    //     <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    //       <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
    //         🗽 Welcome to NYC!
    //       </h3>
    //       <p style="margin: 0; font-size: 14px; color: #4b5563;">
    //         Click the markers to explore favorite places around the city!
    //       </p>
    //       <p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af;">
    //         Zoom in and out to see clustering in action
    //       </p>
    //     </div>
    //   `
    //   )
    //   .openPopup();

    updateMarkers();

    leafletMapRef.current.on("zoomend", updateMarkers);

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.off("zoomend");
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
      if (markersLayerRef.current) {
        markersLayerRef.current = null;
      }
    };
  }, [center, zoom, width, height, updateMarkers]);

  return (
    <div
      ref={mapRef}
      style={{ width, height }}
      className="rounded-lg border border-gray-300 shadow-lg"
    />
  );
}
