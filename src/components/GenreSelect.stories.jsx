import React from "react";
import GenreSelect from "./GenreSelect";

const genres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi"];

export default {
  title: "Components/GenreSelect",
  component: GenreSelect,
  args: {
    genres: genres,
    selectedGenre: "Action",
    onSelect: (genre) => window.alert(`Genre selected: ${genre}`),
  },
};

export const Default = (args) => <GenreSelect {...args} />;
export const ComedySelected = () => (
  <GenreSelect
    genres={genres}
    selectedGenre="Comedy"
    onSelect={(genre) => window.alert(`Genre selected: ${genre}`)}
  />
);
export const DramaSelected = () => (
  <GenreSelect
    genres={genres}
    selectedGenre="Drama"
    onSelect={(genre) => window.alert(`Genre selected: ${genre}`)}
  />
);
export const HorrorSelected = () => (
  <GenreSelect
    genres={genres}
    selectedGenre="Horror"
    onSelect={(genre) => window.alert(`Genre selected: ${genre}`)}
  />
);
export const SciFiSelected = () => (
  <GenreSelect
    genres={genres}
    selectedGenre="Sci-Fi"
    onSelect={(genre) => window.alert(`Genre selected: ${genre}`)}
  />
);
export const NoSelection = () => (
  <GenreSelect
    genres={genres}
    selectedGenre=""
    onSelect={(genre) => window.alert(`Genre selected: ${genre}`)}
  />
);