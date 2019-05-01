import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect, firebaseConnect } from "react-redux-firebase";
import Spinner from "../layout/Spinner";
import { Redirect } from "react-router-dom";
import defaultImage from "./default.png";
import PropTypes from "prop-types";

class OtherProfile extends Component {
  render() {
    const { user, otherRecord } = this.props;
    let numOfRecords = 0;
    if (user && otherRecord) {
      let spaceShip;
      switch (user.spaceShip) {
        case "0":
          spaceShip = <i className="fas fa-space-shuttle fa-10x text-dark" />;
          break;
        case "1":
          spaceShip = <i className="fas fa-space-shuttle fa-10x text-danger" />;
          break;
        case "2":
          spaceShip = (
            <i className="fas fa-space-shuttle fa-10x text-warning" />
          );
      }
      return (
        <div className="container">
          <div
            className="jumbotron jumbotron-billboard"
            style={{ marginTop: "100px", marginBottom: "50px" }}
          >
            <div className="row">
              <div className="col-4">
                <center style={{ marginTop: "-125px" }}>
                  <img
                    src={user.url || defaultImage}
                    height="200"
                    width="200"
                  />
                </center>
                <center style={{ marginTop: "50px", marginLeft: "0px" }}>
                  <h4 style={{ color: "#851941" }}>Spaceship:</h4>
                  {spaceShip}
                </center>
              </div>

              <div className="col-6">
                <h5
                  style={{
                    color: "#851941",
                    marginTop: "-50px",
                    marginLeft: "-60px"
                  }}
                >
                  <div style={{ fontSize: "2.5rem", color: "#851941" }}>
                    {user.username}
                  </div>
                  <br />
                  <div style={{ marginTop: "-20px" }}>
                    <span style={{ color: "#851941", marginRight: "10px" }}>
                      Email:
                    </span>{" "}
                    <span style={{ color: "#2D060F" }}>{user.email}</span>
                  </div>
                  <div>
                    <span style={{ color: "#851941", marginRight: "10px" }}>
                      Introduction:
                    </span>
                    <span style={{ color: "#2D060F" }}>
                      {user.bioText
                        ? user.bioText
                        : "This user has no self introduction..."}{" "}
                    </span>
                  </div>
                </h5>
                <center style={{ color: "#851941" }}>
                  <br />
                  <i className="fas fa-clipboard fa-2x" />
                  <span
                    className="col font-weight-bold text-uppercase"
                    style={{ fontSize: "1.5rem", color: "#851941" }}
                  >
                    Historical record
                  </span>
                  <div className="card">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item text-left">
                        <span
                          className="mr-3"
                          style={{ color: "#851941", marginRight: "150px" }}
                        >
                          Date
                        </span>
                        <span
                          className="mr-3"
                          style={{ color: "#851941", marginLeft: "80px" }}
                        >
                          Score
                        </span>
                      </li>
                      {otherRecord.slice(0).reverse().map(record => {
                        if (record.id === this.props.user.id && numOfRecords < 4 ) {
                          numOfRecords++;
                          return (<li className="list-group-item text-left" key={record.id + record.time.toString()}>
                          <span
                            style={{ color: "#2D060F", marginRight: "50px" }}
                          >
                            {record.time
                              .toDate()
                              .toString()
                              .slice(0, -32)}
                          </span>
                          <span style={{ color: "#2D060F", textIndent: "3em" }}>
                            {record.score}
                          </span>
                        </li>)
                        }
                        
                      })}
                    </ul>
                  </div>
                </center>

                <center>
                    <button
                      className="btn"
                      onClick = {() => this.props.history.goBack()}
                      style={{
                        backgroundColor: "#851941",
                        color: "#fff",
                        fontFamily: "Numans"
                      }}
                    >
                      Back
                    </button>
                </center>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}

OtherProfile.propTypes = {
  firestore: PropTypes.object.isRequired,
  otherRecord: PropTypes.array,
  user: PropTypes.array
};
export default compose(
  firebaseConnect(),
  firestoreConnect(props => [
    { collection: "users", storeAs: "user", doc: props.match.params.id },
    {
      collection: "gameRecord",
      orderBy: ["time"],
      storeAs: "otherRecord"
    }
  ]),
  connect(({ firestore: { ordered } }, props) => ({
    user: ordered.user && ordered.user[0],
    otherRecord: ordered.otherRecord
  }))
)(OtherProfile);
