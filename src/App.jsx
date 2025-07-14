import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MovieDetailsWrapper from './components/moviedetails/MovieDetailsWrapper';
import MovieListPage from './components/movielistpage/MovieListPage';
import SearchSection from './components/searchform/SearchSection';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MovieListPage />,
    children: [
      {
        index: true,
        element: <SearchSection />
      },
      {
        path: ':movieId',
        element: <MovieDetailsWrapper />,
        errorElement: <div>Something went wrong while loading movie details.</div>
      }
    ]
  },
  {
    future: {
      v7_startTransition: true
    },
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;