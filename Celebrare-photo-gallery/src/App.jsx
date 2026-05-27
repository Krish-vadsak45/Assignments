import { useReducer, useState, useMemo, useCallback } from "react";
import useFetchPhotos from "./hooks/useFetchPhotos";
import { favoritesReducer, initialState } from "./reducers/favoritesReducer";
import PhotoCard from "./components/PhotoCard";
import "./index.css";

const API_URL = "https://picsum.photos/v2/list?limit=30";

function App() {
  const { photos, loading, error } = useFetchPhotos(API_URL);
  const [favorites, dispatch] = useReducer(favoritesReducer, initialState);
  const [searchQuery, setSearchQuery] = useState("");

  // Search input change handler wrapped in useCallback for performance as per requirements
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Filtered photos based on search query using useMemo for optimization
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [photos, searchQuery]);

  // Toggle favorite status using useReducer
  const toggleFavorite = useCallback((photo) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: photo });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Celebrare Photo Gallery
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Explore breathtaking images from talented authors.
          </p>

          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search by author..."
              className="w-full px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </header>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mb-4"></div>
            <p className="text-indigo-600 font-medium">
              Fetching beautiful gallery photos...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 max-w-lg mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">Error: {error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredPhotos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredPhotos.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    isFavorite={favorites.some((fav) => fav.id === photo.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500 font-medium">
                  No matching authors found for "{searchQuery}"
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
