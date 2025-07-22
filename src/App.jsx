import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AddMovieForm from "./components/movieform/AddMovieForm";
import EditMovieForm from "./components/movieform/EditMovieForm";
import MovieDetailsWrapper from "./components/moviedetails/MovieDetailsWrapper";
import MovieListPage from "./components/movielistpage/MovieListPage";
import SearchSection from "./components/searchform/SearchSection";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MovieListPage />,
    children: [
      {
        path: "",
        element: <SearchSection />,
        children: [
          {
            path: "new",
            element: <AddMovieForm />,
          },
          {
            path: ":movieId/edit",
            element: <EditMovieForm />,
          },
        ],
      },
      {
        path: ":movieId",
        element: <MovieDetailsWrapper />,
        errorElement: (
          <div>Something went wrong while loading movie details.</div>
        ),
      },
    ],
  },
  {
    future: {
      v7_startTransition: true,
    },
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
