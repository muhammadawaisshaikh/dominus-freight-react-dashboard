import React, { Component } from "react";
import firebase from '../core/firebase/firebase';
import { Link } from "react-router-dom";
import { Grid, Row, Col, Table } from "react-bootstrap";

class Loads extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loads: [],
      itemsToUse: []
    }
  }

  componentDidMount() {
    this.getLoads();
  }

  getLoads = () => {
    let tempLloads = [];
    const loadRef = firebase.database().ref('loads');

    loadRef.on('value', (snapshot) => {
      const loads = snapshot.val();

      for (let id in loads) {
        tempLloads.push({ id, ...loads[id] });
      }
      this.setState({ loads: tempLloads });
      this.setState({ itemsToUse: tempLloads });

      console.log(this.state.loads);
    });
  };

  searchChange = (event) => {
    console.log(event.target.value);
  }

  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>

            <Col md={12} className="pb-5">
              <Row>
                <Col md={4} className="pt-1">
                  <label>Search</label>
                  <input type="search" name="search" className="form-control" placeholder="search any thing .." onChange={(e) => {this.searchChange(e)} } />
                </Col>
                <Col md={2} className="pt-2">
                  <label> Start Date</label>
                  <input type="date" className="form-control"/>
                </Col>
                <Col md={2} className="pt-2">
                  <label> End Date</label>
                  <input type="date" className="form-control"/>
                </Col>
                <Col md={4} className="text-right">
                    <button type="button" className="btn btn-success btn-fill">Active Loads</button>
                    <button type="button" className="btn btn-primary mx-4 btn-fill">Upcoming Loads</button>
                    <button type="button" className="btn btn-info btn-fill">Past Loads</button>
                </Col>
              </Row>
            </Col>

            <Col md={12}>
              {
                this.state.loads.length > 0 ?
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Shipper</th>
                      <th>Carrier</th>
                      <th>Driver</th>
                      <th>Pickup Location</th>
                      <th>Delivery Location</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.itemsToUse.map((item, key) => {
                        return (
                          <tr key={key} >
                            <td>{item.id}</td>
                            <td className="text-capitalize">{JSON.parse(item.shipper).company_name}</td>
                            <td className="text-capitalize">{JSON.parse(item.carrier).company_name}</td>
                            <td className="text-capitalize">{JSON.parse(item.driver).company_name}</td>
                            <td className="text-capitalize">{item.pickup_location}</td>
                            <td className="text-capitalize">{item.delivery_location}</td>
                            <td className="text-capitalize">{item.status}</td>
                            <td>
                              <Link className="mr-3 btn btn-primary btn-fill px-3 py-2" to={{ pathname: "/admin/load-details", data: item }}>
                                View
                              </Link>
                              <Link className="btn btn-success btn-fill px-3 py-2" to={{ pathname: "/admin/load-edit", data: item }}>
                                Edit
                              </Link>
                            </td>
                          </tr>
                        )
                    })
                    }
                  </tbody>
                </Table>
                :
                <Grid fluid>
                  <Row>
                    <Col md={12}>
                      <p>Loading ...</p>
                    </Col>
                  </Row>
                </Grid>
              }
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Loads;


// {this.state.loads.map((value, key) => {
//   return <td key={key}>{value.id}</td>;
// })}