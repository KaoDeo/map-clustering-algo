"use client";

import dynamic from "next/dynamic";

const MyAwesomeMap = dynamic(() => import("./components/Map"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg"
      style={{ width: "100%", height: "500px" }}
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading map...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Leaflet Map Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Interactive map powered by Leaflet and Next.js
          </p>
        </header>

        <main className="space-y-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Basic Map View
            </h2>
            <MyAwesomeMap
              height="500px"
              center={[40.7128, -74.006]}
              zoom={12}
              showFavorites={true}
              enableCollisionDetection={true}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Features
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Interactive pan and zoom</li>
                <li>• OpenStreetMap tile layer</li>
                <li>• ⭐ Favorite NYC locations</li>
                <li>• Custom star markers and popups</li>
                <li>• 🎯 Smart collision detection algorithm</li>
                <li>• Automatic marker positioning</li>
                <li>• Responsive design</li>
                <li>• TypeScript support</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quick Start
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                This Leaflet map showcases popular NYC attractions with ⭐ star
                markers and smart collision detection. The custom algorithm
                automatically adjusts marker positions to prevent overlapping
                while maintaining readability. Check your browser console to see
                collision detection results!
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
