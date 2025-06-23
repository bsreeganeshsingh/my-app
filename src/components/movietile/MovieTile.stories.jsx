import React from "react";
import MovieTile from "./MovieTile";

export default {
    title: "Components/MovieTile",
    component: MovieTile,
    args: {
        movie: {
            title: "Inception",
            year: 2010,
            imageUrl: "https://filmartgallery.com/cdn/shop/files/Inception-Vintage-Movie-Poster-Original.jpg?v=1738912645",
            genres: ["SCI-FI", "ACTION", "ADVENTURE"],
        },
    },
};
export const DefaultMovieTileStory = (args) => <MovieTile {...args} />;
export const InterstellarMovieTileStory = () => (
    <MovieTile
        movie={{
            title: "Interstellar",
            year: 2014,
            imageUrl: "https://images-cdn.ubuy.co.in/6352289f38bb253c44612d53-interstellar-movie-poster-24-x-36-inches.jpg",
            genres: ["SCI-FI", "ADVENTURE", "DRAMA"],
        }}
    />
);
export const TheDarkKnightMovieTileStory = () => (
    <MovieTile
        movie={{
            title: "The Dark Knight",
            year: 2008,
            imageUrl: "https://filmartgallery.com/cdn/shop/files/The-Dark-Knight-Vintage-Movie-Poster-Original_51aa2163.jpg?v=1741715850",
            genres: ["ACTION", "CRIME", "DRAMA"],
        }}
    />
);