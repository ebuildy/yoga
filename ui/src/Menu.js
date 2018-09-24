import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import ReactTooltip from 'react-tooltip'
import Loader from 'react-loader-spinner'
import ReactTable from "react-table"
import 'react-table/react-table.css'

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
           <ReactTable
              data={items}
              columns={[
                {
                  Header: 'Title',
                  accessor: 'name',
                  Cell: row => (
                    <div>
                      <Link to={`/logs/${row.original.id}`} data-tip={`<ul><li>${row.original.name}</li><li>ID: ${row.original.id}</li></ul>`} data-place="right" data-effect="solid" data-html={true}>{row.original.name} <br /><small>{row.original.id}</small></Link>
                    </div>
                  )
                }
              ]}
              defaultSorted={[
              {
                id: "startedTime",
                desc: true
              }
            ]}
            defaultPageSize={20}
            className="-striped -highlight"
            />
           <ReactTooltip />
         </Scrollbars>
       );
     }
   }
}

export default Menu;
