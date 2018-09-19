import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import Menu from './Menu';
import Home from './Home';
import Viewer from './Viewer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="layout-menu">
          <Menu />
        </div>
        <div className="layout-content">
          <Switch className="layout-content">
            <Route exact path="/" component={Home} />
            <Route path='/logs/:id' component={Viewer}/>
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
