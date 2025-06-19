import { sortOptions } from '../../utils/Constants';
import SortControl from './SortControl';

const meta = {
  component: SortControl,
};

export default meta;

export const Default = {
  args: {
    sortOptions: [
      { label: "Title (A-Z)", value: "title-ascending" },
      { label: "Title (Z-A)", value: "title-descending" },
      { label: "Year (Oldest First)", value: "year-ascending" },
      { label: "Year (Newest First)", value: "year-descending" },
    ],
    selected: "title-ascending",
    onSortChange: () => { }
  }
};

export const SortByReleaseDateAscending = {
  args: {
    sortOptions: [{
      "label": "Title (A-Z)",
      "value": "title-ascending"
    }, {
      "label": "Title (Z-A)",
      "value": "title-descending"
    }, {
      "label": "Year (Oldest First)",
      "value": "year-ascending"
    }, {
      "label": "Year (Newest First)",
      "value": "year-descending"
    }],

    selected: "year-ascending"
  }
};