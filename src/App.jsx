import React from 'react';
import Counter from './components/counter/Counter';
import Home from './components/home/Home';
import './App.css';

function App() {
  return (
    <div className="App">
      <Home />
      <Counter initialValue={10} />
    </div>
  );
}

export default App;