import React, { memo } from "react";

const PhotoCard = memo(({ photo, isFavorite, onToggleFavorite }) => {
  // Use a smaller version of the image for performance
  const thumbnailUrl = `${photo.download_url.split("/id/")[0]}/id/${photo.id}/400/300`;

  return (
    <div className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <img
        src={thumbnailUrl}
        alt={`By ${photo.author}`}
        className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="p-4 bg-white flex justify-between items-center">
        <div>
          <p className="text-gray-700 font-medium truncate w-40">
            By: {photo.author}
          </p>
        </div>
        <button
          onClick={() => onToggleFavorite(photo)}
          className={`focus:outline-none transition-colors cursor-pointer duration-200 ${
            isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-400"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill={isFavorite ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
});

export default PhotoCard;
