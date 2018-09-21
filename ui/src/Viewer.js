import React, { Component } from 'react';
import { LazyLog } from  'react-lazylog/es5';
import 'react-lazylog/es5/index.css';

import Menu from './Menu';

class Viewer extends Component {

 render() {
     return <div className="layout-viewer">
         <div className="layout-menu">
           <Menu />
         </div>
         <div className="layout-content">
          <LazyLog url={`/api/logs/${this.props.match.params.id}`} />
         </div>
     </div>
   }
}

export default Viewer;
