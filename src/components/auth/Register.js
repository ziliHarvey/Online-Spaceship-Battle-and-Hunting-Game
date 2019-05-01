import React, { Component } from "react";
import PropTypes from "prop-types";
import { firebaseConnect } from "react-redux-firebase";
import { Link } from "react-router-dom";

class Register extends Component {
  state = {
    email: "",
    password: "",
    passwordConfirm: "",
    username: "",
    score: "0",
    bioText: "",
    spaceShip: "0",
    url: ""
  };
  onSubmit = e => {
    e.preventDefault();

    const { firebase } = this.props;
    const {
      email,
      password,
      passwordConfirm,
      username,
      score,
      bioText,
      spaceShip,
      url
    } = this.state;

    if (password === passwordConfirm) {
      firebase
        .createUser(
          { email, password },
          { email, username, score, bioText, spaceShip, url }
        )
        .catch(err => alert("User already existed!"));
    } else {
      alert("Password doesn't match! Please input again!");
    }
  };
  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
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
                    Register
                  </span>
                </h5>

                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <label style={{ color: "#851941" }}>Username</label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      required
                      value={this.state.username}
                      onChange={this.onChange}
                    />
                  </div>
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
                      minlength="6"
                      required
                      value={this.state.password}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="Confirm password"
                      style={{ color: "#851941" }}
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="passwordConfirm"
                      required
                      value={this.state.passwordConfirm}
                      onChange={this.onChange}
                    />
                  </div>
                  <input
                    type="submit"
                    value="Register"
                    className="btn btn-lg btn-block text-uppercase"
                    style={{ backgroundColor: "#851941", color: "#fff" }}
                  />

                  <div style={{ color: "#851941" }}>
                    Have an account?
                    <Link to="/login" style={{ color: "#851941" }}>
                      Log In
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  firebase: PropTypes.object.isRequired
};

export default firebaseConnect()(Register);
