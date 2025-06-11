import React from "react";

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        count: props.initialValue || 0
    };
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
  }

  increment() {
    this.setState((prevState) => ({
      count: prevState.count + 1
    }));
  }

  decrement() {
    this.setState((prevState) => ({
      count: Math.max(prevState.count - 1, 0) // Prevent decrementing below zero
    }));
  }

  render() {
    return React.createElement('div', { className: 'container' },
      React.createElement('h2', { className: 'value' }, `Count: ${this.state.count}`),
      React.createElement('button', { onClick: this.decrement, className: 'button' }, '-'),
      React.createElement('button', { onClick: this.increment, className: 'button' }, '+')
    );
  }
}

export default Counter;