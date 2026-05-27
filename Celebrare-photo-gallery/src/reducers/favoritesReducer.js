export const initialState = JSON.parse(localStorage.getItem("favorites")) || [];

export const favoritesReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_FAVORITE": {
      const isAlreadyFavorite = state.some(
        (photo) => photo.id === action.payload.id,
      );
      let newState;

      if (isAlreadyFavorite) {
        // Remove if existing
        newState = state.filter((photo) => photo.id !== action.payload.id);
      } else {
        // Add if not existing
        newState = [...state, action.payload];
      }

      // Update localStorage synchronously
      localStorage.setItem("favorites", JSON.stringify(newState));
      return newState;
    }

    default:
      return state;
  }
};
