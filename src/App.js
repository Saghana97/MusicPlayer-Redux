import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Album from './components/Album/Album';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">MUSICA</header>
        <Album />
      </div>
    );
  }
}

export default App;
