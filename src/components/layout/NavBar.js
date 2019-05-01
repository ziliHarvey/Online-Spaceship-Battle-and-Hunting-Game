import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";

class NavBar extends Component {
  state = {
    isAuthenticated: false
  };

  static getDerivedStateFromProps(props, state) {
    const { auth } = props;
    return auth.uid ? { isAuthenticated: true } : { isAuthenticated: false };
  }

  onLogoutCLick = e => {
    e.preventDefault();

    const { firebase } = this.props;
    firebase.logout();
  };

  render() {
    const { isAuthenticated } = this.state;
    const { auth } = this.props;
    return (
      <div>
        {isAuthenticated ? (
          <nav
            className="navbar navbar-expand-md navbar-dark mb-4"
            style={{ backgroundColor: "#851941" }}
          >
            <div className="container">
              <Link to="/" className="navbar-brand">
                Asteroid Game
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarMain"
              >
                <span className="navbar-toggler-icon" />
              </button>
              <div className="collapse navbar-collapse" id="navbarMain">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                    <Link to="/" className="nav-link">
                      <i className="fas fa-globe" />
                    </Link>
                  </li>
                </ul>

                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link to="/profile" className="nav-link">
                      <i className="fas fa-id-card" />
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a
                      href="#!"
                      className="nav-link"
                      onClick={this.onLogoutCLick}
                    >
                      <i className="fas fa-sign-in-alt" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        ) : null}
      </div>
    );
  }
}

NavBar.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

export default compose(
  firebaseConnect(),
  connect((state, props) => ({
    auth: state.firebase.auth
  }))
)(NavBar);
