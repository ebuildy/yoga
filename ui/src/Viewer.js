import React, { Component } from 'react';
import { LazyLog } from  'react-lazylog/es5';
import 'react-lazylog/es5/index.css';

class Viewer extends Component {

 render() {
     return <LazyLog url={`/api/logs/${this.props.match.params.id}`} />
   }
}

export default Viewer;
