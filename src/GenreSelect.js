import React from "react";

class GenreSelect extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(genre) {
    if (this.props.onSelect) {
      this.props.onSelect(genre);
    }
  }

  render() {
    const { genres, selectedGenre } = this.props;

    const buttons = genres.map((genre) => {
      const isSelected = genre === selectedGenre;

      const buttonStyle = {
        padding: '10px 20px',
        margin: '5px',
        backgroundColor: isSelected ? '#4CAF50' : '#f0f0f0',
        color: isSelected ? 'white' : 'black',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      };

      return React.createElement('button', {
        key: genre,
        onClick: () => this.handleChange(genre),
        style: buttonStyle
      }, genre);
    });

    return React.createElement('div', {
        style: { textAlign: 'center', marginTop: '20px' }
    }, buttons
    );
  }
}

export default GenreSelect;