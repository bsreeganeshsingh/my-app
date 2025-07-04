import React from "react";
import MovieTile from "./MovieTile";

export default {
    title: "Components/MovieTile",
    component: MovieTile,
    args: {
        movie: {
            title: "Inception",
            release_date: "2010-10-20",
            poster_path: "https://filmartgallery.com/cdn/shop/files/Inception-Vintage-Movie-Poster-Original.jpg?v=1738912645",
            genres: ["SCI-FI", "ACTION", "ADVENTURE"],
        },
    },
};
export const DefaultMovieTileStory = (args) => <MovieTile {...args} />;
export const InterstellarMovieTileStory = () => (
    <MovieTile
        movie={{
            title: "Interstellar",
            release_date: "2014-12-12",
            poster_path: "https://images-cdn.ubuy.co.in/6352289f38bb253c44612d53-interstellar-movie-poster-24-x-36-inches.jpg",
            genres: ["SCI-FI", "ADVENTURE", "DRAMA"],
        }}
    />
);
export const TheDarkKnightMovieTileStory = () => (
    <MovieTile
        movie={{
            title: "The Dark Knight",
            release_date: "2008-10-15",
            poster_path: "https://filmartgallery.com/cdn/shop/files/The-Dark-Knight-Vintage-Movie-Poster-Original_51aa2163.jpg?v=1741715850",
            genres: ["ACTION", "CRIME", "DRAMA"],
        }}
    />
);