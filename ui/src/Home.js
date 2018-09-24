import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import moment from 'moment'
import ReactTable from "react-table"
import 'react-table/react-table.css'

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  getStatusLabelClass(item) {
    return item.finalStatus === 'SUCCEEDED' ? 'success' : 'info'
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

     return <div className="container">
      <h2 className="my-3">YOGA: YARN logs viewer</h2>
     <div className="card">
        <div className="card-body">
         <h5 className="card-title">Logs</h5>
         <ReactTable
            data={items}
            columns={[
              {
                Header: 'Kind',
                accessor: 'applicationType'
              },
              {
                Header: 'Title',
                accessor: 'name',
                Cell: row => (
                  <div>
                    <Link to={`/logs/${row.original.id}`}>{row.original.name} <br /><small>{row.original.id}</small></Link>
                  </div>
                )
              },
              {
                Header: 'Time',
                accessor: 'startedTime',
                Cell: row => (
                  <div>
                  <small>Started {moment(row.original.startedTime).fromNow()}
                  <br />
                  (took {moment.duration(row.original.elapsedTime).humanize()})</small>
                  </div>
                )
              },
              {
                Header: 'Status',
                Cell: row => (
                  <div>
                  <label className="badge ">{row.original.state}</label> {row.original.finalStatus !== "UNDEFINED" && (<label className={`badge badge-${this.getStatusLabelClass(row.original)}`}>{row.original.finalStatus}</label>) }
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
          </div>
      </div>
      <br />
      <br />
      <p className="text-center">
        Welcome to YOGA, a (simple & cute) YARN logs viewer.
      </p>
      <p className="text-center">
      Made by Thomas Decaux (t.decaux at qwant.com)
      </p>
     </div>
   }
 }
}

export default Home;
