import React from "react";
import SortControl from "./SortControl";

export default {
    title: "Components/SortControl",
    component: SortControl,
    args: {
        sortOptions: [
            { label: "Title (A-Z)", value: "title-ascending" },
            { label: "Title (Z-A)", value: "title-descending" },
            { label: "Year (Oldest First)", value: "year-ascending" },
            { label: "Year (Newest First)", value: "year-descending" },
        ],
    },
};

export const DefaultSortControlStory = (args) => <SortControl {...args} />;