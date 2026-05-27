import { useState, useEffect } from "react";

const useFetchPhotos = (url) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch photos");
        }
        const data = await response.json();
        setPhotos(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchPhotos();
    }
  }, [url]);

  return { photos, loading, error };
};

export default useFetchPhotos;
