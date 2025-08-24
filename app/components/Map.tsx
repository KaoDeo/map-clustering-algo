"use client";

import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { FavoriteLocation, MapProps } from "./types";
import { projectLatLngToScreenCoordinates } from "./utils";

// Fix for default markers in Leaflet with Next.js
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

const favoriteLocations: FavoriteLocation[] = [
  {
    name: "Central Park",
    coordinates: [40.7829, -73.9654],
    description: "843-acre park in Manhattan, perfect for walks and picnics",
    category: "Park",
  },
  {
    name: "Statue of Liberty",
    coordinates: [40.6892, -74.0445],
    description: "Iconic symbol of freedom and democracy",
    category: "Monument",
  },
  {
    name: "Times Square",
    coordinates: [40.758, -73.9855],
    description:
      "The bustling heart of NYC with bright lights and Broadway shows",
    category: "Entertainment",
  },
  {
    name: "Brooklyn Bridge",
    coordinates: [40.7061, -73.9969],
    description: "Historic suspension bridge connecting Manhattan and Brooklyn",
    category: "Bridge",
  },
  {
    name: "Empire State Building",
    coordinates: [40.7484, -73.9857],
    description: "Iconic Art Deco skyscraper with stunning city views",
    category: "Architecture",
  },
  {
    name: "9/11 Memorial",
    coordinates: [40.7115, -74.0134],
    description: "Moving tribute to those lost in the September 11 attacks",
    category: "Memorial",
  },
  {
    name: "High Line",
    coordinates: [40.748, -74.0048],
    description: "Elevated linear park built on former railway tracks",
    category: "Park",
  },
  {
    name: "One World Observatory",
    coordinates: [40.7127, -74.0134],
    description: "Breathtaking views from the tallest building in NYC",
    category: "Observatory",
  },
];

export default function Map({
  width = "100%",
  height = "400px",
  center = [40.7128, -74.006], // NYC coordinates as default
  zoom = 13,
  showFavorites = true,
  enableCollisionDetection = true,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize the map
    leafletMapRef.current = L.map(mapRef.current).setView(center, zoom);

    // Add tile layer (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMapRef.current);

    const favoriteIcon = L.divIcon({
      html: `
        <div style="
          background-color: #ef4444;
          border: 2px solid white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          <span style="
            color: white;
            font-size: 16px;
            font-weight: bold;
          ">⭐</span>
        </div>
      `,
      className: "custom-favorite-icon",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
    });

    // Add a welcome marker at the center
    L.marker(center)
      .addTo(leafletMapRef.current)
      .bindPopup(
        `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
            🗽 Welcome to NYC!
          </h3>
          <p style="margin: 0; font-size: 14px; color: #4b5563;">
            Click the ⭐ markers to explore favorite places around the city!
          </p>
        </div>
      `
      )
      .openPopup();

    // Add event listeners for map events
    leafletMapRef.current.on("zoomlevelschange", (e) => {
      const point = projectLatLngToScreenCoordinates(
        favoriteLocations[0].coordinates[0],
        favoriteLocations[0].coordinates[1],
        leafletMapRef.current!
      );
      console.log(point);
    });

    // Cleanup function
    return () => {
      if (leafletMapRef.current) {
        // Remove event listeners
        leafletMapRef.current.off("zoomlevelschange");
        leafletMapRef.current.off("zoomend");
        leafletMapRef.current.off("moveend");

        // Remove the map
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [center, zoom, showFavorites, enableCollisionDetection]);

  return (
    <div
      ref={mapRef}
      style={{ width, height }}
      className="rounded-lg border border-gray-300 shadow-lg"
    />
  );
}
