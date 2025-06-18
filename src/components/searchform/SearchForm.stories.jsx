import React from "react";
import SearchForm from "./SearchForm";

export default {
    title: "Components/SearchForm",
    component: SearchForm,
    args: {
        initialQuery: "Tare Zameen Par",
        onSearch: (query) => window.alert(`Search triggered for: ${query}`),
        selectedGenre: "Tare Zameen Par",
    },
};

export const Default = (args) => <SearchForm {...args} />;
export const InterstellarQuery = () => (
    <SearchForm
        initialQuery="Interstellar"
        onSearch={(query) => window.alert(`Search triggered for: ${query}`)}
        selectedGenre="Interstellar"
    />
);
export const WithEmptyQuery = () => (
    <SearchForm
        initialQuery=""
        onSearch={(query) => window.alert(`Search triggered for: ${query}`)}
        selectedGenre=""
    />
);