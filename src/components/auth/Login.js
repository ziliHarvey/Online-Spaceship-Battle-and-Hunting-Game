import React, { Component } from "react";
import PropTypes from "prop-types";
import { firebaseConnect } from "react-redux-firebase";
import { Link } from "react-router-dom";
import "../../App.css";
class Login extends Component {
  state = {
    email: "",
    password: ""
  };

  onSubmit = e => {
    e.preventDefault();

    const { firebase } = this.props;
    const { email, password } = this.state;

    firebase
      .login({
        email,
        password
      })
      .catch(err => alert("Failed to log in!"));
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <div>
        <link rel="stylesheet" type="text/css" href="Auth.css" />

        <div className="container container-billboard">
          <div className="row">
            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
              <div className="card card-signin my-5">
                <div className="card-body">
                  <h5 className="card-title text-center">
                    <span style={{ color: "#851941" }}>
                      <i
                        className="fas fa-sign-in-alt"
                        style={{ color: "#851941" }}
                      />{" "}
                      Log in
                    </span>
                  </h5>

                  <form className="form-signin" onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <label htmlFor="email" style={{ color: "#851941" }}>
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        required
                        value={this.state.email}
                        onChange={this.onChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password" style={{ color: "#851941" }}>
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        required
                        value={this.state.password}
                        onChange={this.onChange}
                      />
                    </div>
                    <input
                      type="submit"
                      value="Login"
                      className="btn btn-lg btn-block text-uppercase"
                      style={{ backgroundColor: "#851941", color: "#fff" }}
                    />

                    <div style={{ color: "#851941" }}>
                      New here? Join us today!
                      <Link to="/register" style={{ color: "#851941" }}>
                        Register
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  firebase: PropTypes.object.isRequired
};

export default firebaseConnect()(Login);
