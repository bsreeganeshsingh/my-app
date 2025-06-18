import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./SortControl.module.scss";

const SortControl = ({ sortOptions, selected: initialSelected, onSortChange }) => {
    const [selected, setSelected] = useState(initialSelected);

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSelected(value);
        if (onSortChange) {
            onSortChange(value);
        }
        console.log(`Sort option changed to: ${value}`);
    };

    return (
        <div className={styles.sortControl}>
            <label htmlFor="sortSelected">Sort by:</label>
            <select
                data-testid="sortSelected"
                id="sortSelect"
                value={selected}
                onChange={handleSortChange}
            >
                {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

SortControl.propTypes = {
    selected: PropTypes.string.isRequired,
    onSortChange: PropTypes.func.isRequired,
};

export default SortControl;