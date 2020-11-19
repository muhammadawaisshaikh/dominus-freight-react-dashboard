import React, { Component } from "react";
import firebase from '../core/firebase/firebase';

import {
  Grid,
  Row,
  Col,
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";

class Login extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          email: '',
          password: '',
          customer: ''
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        console.log(this.state);
    }

    login = async() => {
        await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(res => {
            if (res.user.uid) {
                localStorage.setItem('user', JSON.stringify(res.user));

                const customerRef = firebase.database().ref('customers');

                customerRef.orderByChild("company_email").equalTo(res.user.email).on("child_added", (snap) => {
                  this.setState({ customer: snap.val() });
                  localStorage.setItem('customer', JSON.stringify(this.state.customer));
                  window.location.href = '/admin/home';
                });
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    getProfile = () => {
      let profileRef = firebase.database().ref('customers/' + this.state.customerDetails.id);

      profileRef.on('value', (snapshot) => {
          const profile = snapshot.val();
          console.log("profile", profile);

          this.setState({
              name: profile.company_name,
              email: profile.company_email,
              contact: profile.company_contact,
              account_type: profile.account_type,
          });
      })
  }

  render() {
    return (
      <div className="content login-form">
        <Grid fluid>
          <Row>
            <Col md={4}></Col>
            <Col md={4}>
              <Card
                title="Login"
                content={
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-12 px-2">
                                <label>Email</label>
                                <input type="email" name="email"  className="form-control" value={this.state.email} onChange={(event) => this.handleChange(event)}></input>
                            </div>

                            <div className="form-group col-md-12">
                                <label>Password</label>
                                <input type="password" name="password"  className="form-control" value={this.state.password} onChange={(event) => this.handleChange(event)}></input>
                            </div>
                        </div>

                        <div className="form-row px-4">
                          <a className="btn btn-success btn-fill mr-3" onClick={ () => {this.login()} }>Login</a>
                        </div>
                  </form>
                }
              />
            </Col>
            <Col md={4}></Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Login;
