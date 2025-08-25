"use client";

import dynamic from "next/dynamic";
import { mergeStrategies } from "./components/types";

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
        <header className="mb-8 text-center relative">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Map Clustering Algorithm
          </h1>

          <div className="mt-6">
            <a
              href="https://github.com/KaoDeo/map-clustering-algo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              View on GitHub
            </a>
          </div>
        </header>

        <main className="space-y-8">
          {/* Supported Algorithms Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Supported Clustering Algorithms
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  Distance-Based
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Groups markers based on proximity using configurable distance
                  thresholds
                </p>
                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• Euclidean distance calculation</li>
                  <li>• Adjustable threshold parameter</li>
                  <li>• Works with projected coordinates</li>
                </ul>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Grid-Based
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Divides the map into uniform grid cells and groups markers
                  within each cell
                </p>
                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• Fixed grid cell size</li>
                  <li>• Consistent clustering results</li>
                  <li>• Efficient for large datasets</li>
                </ul>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg opacity-60">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                  Hierarchical
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Multi-level clustering using recursive distance-based grouping
                </p>
                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• Recursive clustering approach</li>
                  <li>• Variable distance thresholds</li>
                  <li>
                    • <span className="italic">In development</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <MyAwesomeMap
              height="500px"
              center={[40.7128, -74.006]}
              zoom={12}
              mergeStrategy={mergeStrategies.distance}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
