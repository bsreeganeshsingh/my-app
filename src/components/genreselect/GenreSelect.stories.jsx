import React from "react";
import GenreSelect from "./GenreSelect";
import { genres } from "../../utils/Constants"

export default {
  title: "Components/GenreSelect",
  component: GenreSelect,
  args: {
    genres: genres,
    selectedGenre: "ACTION",
    onSelect: (genre) => window.alert(`Genre selected: ${genre}`),
  },
};

export const Default = (args) => <GenreSelect {...args} />;
export const ComedySelected = () => (
  <GenreSelect
    genres={genres}
    selectedGenre="COMEDY"
    onSelect={(genre) => window.alert(`Genre selected: ${genre}`)}
  />
);
export const DramaSelected = () => (
  <GenreSelect
    genres={genres}
    selectedGenre="DRAMA"
    onSelect={(genre) => window.alert(`Genre selected: ${genre}`)}
  />
);
export const HorrorSelected = () => (
  <GenreSelect
    genres={genres}
    selectedGenre="HORROR"
    onSelect={(genre) => window.alert(`Genre selected: ${genre}`)}
  />
);
export const SciFiSelected = () => (
  <GenreSelect
    genres={genres}
    selectedGenre="SCI-FI"
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