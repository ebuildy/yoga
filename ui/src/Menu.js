import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import ReactTooltip from 'react-tooltip'
import Loader from 'react-loader-spinner'

import './Menu.css';

class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
   fetch("/api/logs")
     .then(res => res.json())
     .then(
       (result) => {
         this.setState({
           isLoaded: true,
           items: result.apps.app
         });
       },
       // Note: it's important to handle errors here
       // instead of a catch() block so that we don't swallow
       // exceptions from actual bugs in components.
       (error) => {
         this.setState({
           isLoaded: true,
           error
         });
       }
     )
 }

 render() {
     const { error, isLoaded, items } = this.state;
     if (error) {
       return <div>Error: {error.message}</div>;
     } else if (!isLoaded) {
       return <Loader
         type="Puff"
         color="#00BFFF"
         height="100"
         width="100"
      />;
     } else {
       return (
         <Scrollbars>
           <ul className="menu_list">
             {items.map(item => (
               <li className="menu_list_item" key={item.id}>
                  <Link to={`/logs/${item.id}`} data-tip={`<ul><li>${item.name}</li><li>ID: ${item.id}</li></ul>`} data-place="right" data-effect="solid" data-html={true}>
                   <h3>{item.name}: {item.id}</h3>
                   <p>
                    <label>State: {item.state} - {item.finalStatus}</label>
                   </p>
                 </Link>
               </li>
             ))}
           </ul>
           <ReactTooltip />
         </Scrollbars>
       );
     }
   }
}

export default Menu;
