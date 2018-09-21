import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner'

class Home extends Component {

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
     return <div className="container">
      <h2 className="my-3">YOGA: YARN logs viewer</h2>
     <div className="card">
        <div className="card-body">
         <h5 className="card-title">Logs</h5>
          <table className="table">
            <thead>
              <tr>
                <th>Kind</th>
                <th>Title</th>
                <th>ID</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {items.map(item => (
                <tr className="menu_list_item" key={item.id}>
                  <td>YARN / {item.applicationType}</td>
                  <td>
                    <Link to={`/logs/${item.id}`}>{item.name}</Link>
                  </td>
                  <td>
                    <Link to={`/logs/${item.id}`}>{item.id}</Link>
                  </td>
                  <td>
                  <label className="badge ">{item.state}</label> <label className="badge ">{item.finalStatus}</label>
                  </td>
                </tr>
              ))}
              </tbody>
          </table>
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
