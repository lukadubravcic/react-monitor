import React, { Component } from 'react';
import DataController from './components/data/DataController';

class App extends Component {
  render() {
    return (
      <div>
        <h1>NODE server monitor</h1>
        <DataController />
      </div>
    );
  }
}

export default App;
