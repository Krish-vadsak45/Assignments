# Celebrare Photo Gallery 📸

A sleek and responsive image gallery application built with React, Vite, and Tailwind CSS. This project demonstrates modern React patterns including custom hooks, state management with `useReducer`, and performance optimizations.

## 🚀 Features

- **Dynamic Photo Fetching**: Real-time image retrieval from the Picsum Photos API.
- **Search Functionality**: Instantly filter photos by author name.
- **Favorites System**: Bookmark your favorite photos with a heart icon (persisted via `localStorage`).
- **Responsive Grid**: Fluid layout optimized for desktop, tablet, and mobile views.
- **Performance Optimized**: Uses `useMemo` and `useCallback` to minimize unnecessary re-renders.
- **Custom Hook**: Encapsulated data fetching logic in `useFetchPhotos`.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **API**: [Picsum Photos](https://picsum.photos/)

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Celebrare-photo-gallery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `src/components/`: UI components like `PhotoCard`.
- `src/hooks/`: Custom hooks for logic reuse (`useFetchPhotos`).
- `src/reducers/`: State management logic for favorites.
- `src/App.jsx`: Main application container and logic.

## 📝 License

Distributed under the ISC License. See `LICENSE` for more information.

---
Built as a technical assignment for **Celebrare**.
