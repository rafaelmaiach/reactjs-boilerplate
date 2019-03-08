import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';

class App extends Component {
  render() {
    return (
      <div className="app">
        <h1>
          Welcome to React.js!
        </h1>
      </div>
    );
  }
}

const isDevEnv = process.env.NODE_ENV === 'development';
const AppWrapper = isDevEnv ? hot(App) : App;

export default AppWrapper;
