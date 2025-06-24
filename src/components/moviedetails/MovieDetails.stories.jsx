import React from 'react';
import MovieDetails from './MovieDetails';

export default {
    title: 'Components/MovieDetails',
    component: MovieDetails,
    args: {
        movie: {
            title: 'Inception',
            rating: 8.8,
            duration: '2h 28m',
            releaseDate: 2010,
            genres: ['ACTION', 'SCI-FI', 'ADVENTURE'],
            description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO. When he is offered a chance to have his criminal history erased, he takes on one last job that requires him to do the impossible: "inception".',
            imageUrl: 'https://filmartgallery.com/cdn/shop/files/Inception-Vintage-Movie-Poster-Original.jpg?v=1738912645',
        },
    },
};

export const DefaultMovieDetailsStory = (args) => <MovieDetails {...args} />;

export const InterstellarMovieDetailsStory = () => (
    <MovieDetails
        movie={{
            title: 'Interstellar',
            rating: 8.6,
            duration: '2h 49m',
            releaseDate: 2014,
            genres: ['ADVENTURE', 'DRAMA', 'SCI-FI'],
            description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival. They must find a new home for humanity as Earth is becoming uninhabitable. The journey takes them to the farthest reaches of the universe, where they encounter strange new worlds and face unimaginable challenges.',
            imageUrl: "https://images-cdn.ubuy.co.in/6352289f38bb253c44612d53-interstellar-movie-poster-24-x-36-inches.jpg",
        }}
    />
);

export const TheDarkKnightMovieDetailsStory = () => (
    <MovieDetails
        movie={{
            title: 'The Dark Knight',
            rating: 9.0,
            duration: '2h 32m',
            releaseDate: 2008,
            genres: ['ACTION', 'CRIME', 'DRAMA'],
            description: 'When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham. The Dark Knight must accept one of the greatest psychological and physical tests of his ability to fight injustice. Batman sets out to dismantle the remaining criminal organizations that plague the streets, but soon finds himself prey to a reign of chaos unleashed by a rising criminal mastermind known as the Joker.',
            imageUrl: "https://filmartgallery.com/cdn/shop/files/The-Dark-Knight-Vintage-Movie-Poster-Original_51aa2163.jpg?v=1741715850",
        }}
    />
);