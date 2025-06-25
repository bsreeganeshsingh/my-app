import { sortOptions } from '../../utils/Constants';
import SortControl from './SortControl';

const meta = {
  component: SortControl,
};

export default meta;

export const Default = {
  args: {
    sortOptions: [
      { label: "TITLE (A-Z)", value: "title-ascending" },
      { label: "TITLE (Z-A)", value: "title-descending" },
      { label: "YEAR (Oldest First)", value: "year-ascending" },
      { label: "YEAR (Newest First)", value: "year-descending" },
    ],
    selected: "title-ascending",
    onSortChange: () => { }
  }
};

export const SortByReleaseDateAscending = {
  args: {
    sortOptions: [{
      "label": "TITLE (A-Z)",
      "value": "title-ascending"
    }, {
      "label": "TITLE (Z-A)",
      "value": "title-descending"
    }, {
      "label": "YEAR (Oldest First)",
      "value": "year-ascending"
    }, {
      "label": "YEAR (Newest First)",
      "value": "year-descending"
    }],

    selected: "year-ascending"
  }
};