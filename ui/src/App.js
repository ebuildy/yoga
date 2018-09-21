import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './Home';
import Viewer from './Viewer';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path='/logs/:id' component={Viewer} />
          </Switch>
      </div>
    );
  }
}

export default App;
