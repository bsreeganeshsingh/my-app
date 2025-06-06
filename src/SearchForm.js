import React from "react";

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.initialQuery || ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSearchClick  = this.handleSearchClick.bind(this);
  }

  handleChange(event) {
    this.setState({ query: event.target.value });
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.triggerSearch();
    }
  }

  handleSearchClick (event) {
      this.triggerSearch();
  }

  triggerSearch() {
    if (this.props.onSearch) {
      this.props.onSearch(this.state.query);
    }
  }

  render() {
    return React.createElement('div', { style: { textAlign: 'center', marginTop: '20px' } },
      React.createElement('input', {
        type: 'text',
        value: this.state.query,
        onChange: this.handleChange,
        onKeyDown: this.handleKeyPress,
        placeholder: 'Enter search query',
        style: { padding: '8px', width: '200px', marginRight: '10px' }
      }),
      React.createElement('button', {
        onClick: this.handleSearchClick,
        style: { padding: '8px 12px' }
      }, 'Search')
    );
  }
}

export default SearchForm;
