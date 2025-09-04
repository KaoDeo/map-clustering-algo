"use client";

import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useRef } from "react";
import { FAVORITE_LOCATIONS } from "./favourite-locations";
import { MapProps } from "./types";
import { hierarchicalCluster } from "./utils";

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
    const size = isCluster ? Math.min(40 + Math.log(count) * 5, 60) : 35;

    return L.divIcon({
      html: `
        <div style="
          background: ${
            isCluster
              ? `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
              : `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`
          };
          border: 3px solid rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          width: ${size}px;
          height: ${size}px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2);
          backdrop-filter: blur(4px);
          position: relative;
          overflow: hidden;
        ">
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 60%);
          "></div>
          <span style="
            color: white;
            font-size: ${isCluster ? Math.min(14 + Math.log(count), 16) : 18}px;
            font-weight: bold;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            position: relative;
            z-index: 1;
          ">${isCluster ? count : "✨"}</span>
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
  }, [createIcon]);

  useEffect(() => {
    if (!mapRef || !mapRef.current) return;

    leafletMapRef.current = L.map(mapRef.current).setView(center, zoom);

    // Beautiful watercolor map style
    L.tileLayer(
      "https://watercolormaps.collection.cooperhewitt.org/tile/watercolor/{z}/{x}/{y}.jpg",
      {
        attribution:
          'Map tiles by <a href="http://maps.stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
        maxZoom: 18,
      }
    ).addTo(leafletMapRef.current);

    // Add a subtle overlay for enhanced aesthetics
    L.tileLayer(
      "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png",
      {
        attribution:
          '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="http://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 18,
        opacity: 0.7,
      }
    ).addTo(leafletMapRef.current);

    markersLayerRef.current = L.layerGroup().addTo(leafletMapRef.current);

    // Beautiful NYC welcome popup
    const welcomeIcon = L.divIcon({
      html: `
        <div style="
          background: linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%);
          border: 3px solid rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4), 0 3px 10px rgba(0,0,0,0.3);
          backdrop-filter: blur(4px);
          position: relative;
          overflow: hidden;
        ">
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 60%);
          "></div>
          <span style="
            color: white;
            font-size: 20px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.6);
            position: relative;
            z-index: 1;
          ">🗽</span>
        </div>
      `,
      className: "nyc-welcome-icon",
      iconSize: [45, 45],
      iconAnchor: [22.5, 22.5],
      popupAnchor: [0, -22.5],
    });

    L.marker(center, { icon: welcomeIcon })
      .addTo(leafletMapRef.current)
      .bindPopup(
        `
        <div style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
          border-radius: 12px;
          padding: 20px;
          max-width: 280px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        ">
          <h3 style="
            margin: 0 0 12px 0; 
            font-size: 18px; 
            font-weight: 700; 
            color: #1e293b;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          ">
            🗽 Welcome to NYC!
          </h3>
          <p style="
            margin: 0 0 12px 0; 
            font-size: 14px; 
            color: #475569;
            line-height: 1.5;
          ">
            Explore beautiful clustering in action! Click the ✨ markers to discover favorite places around the city.
          </p>
          <div style="
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            border-radius: 8px;
            padding: 10px;
            margin-top: 12px;
          ">
            <p style="
              margin: 0; 
              font-size: 12px; 
              color: #64748b;
              font-weight: 500;
            ">
              💡 Try zooming in and out to see hierarchical clustering at work!
            </p>
          </div>
        </div>
        `,
        {
          closeButton: true,
          autoClose: false,
          closeOnClick: false,
          className: "custom-popup",
        }
      )
      .openPopup();

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
      className="rounded-xl border border-gray-200 shadow-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50"
    />
  );
}
