import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect, firestoreConnect } from "react-redux-firebase";
import "../../App.css";
import Spinner from "../layout/Spinner";
import ImageUpload from "../layout/ImageUpload";
import { Link } from "react-router-dom";

class Profile extends Component {
  state = {
    bioText: "Say something......",
    spaceShip: "0"
  };
  onSubmitBio = e => {
    e.preventDefault();

    const { firebase, firestore, history } = this.props;
    const { bioText } = this.state;
    const updatedText = bioText;
    firebase.updateProfile({ bioText: bioText });
    firestore
      .add({ collection: "bioModel" }, { updatedText })
      .then(() => history.push("/profile"));
  };

  onSubmitShip = (e, type) => {
    e.preventDefault();
    this.setState({ spaceShip: type });
    const { firebase } = this.props;
    firebase.updateProfile({ spaceShip: type });
  };
  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    let spaceShip;
    switch (this.props.profile.spaceShip) {
      case "0":
        spaceShip = <i className="fas fa-space-shuttle fa-10x text-dark" />;
        break;
      case "1":
        spaceShip = <i className="fas fa-space-shuttle fa-10x text-danger" />;
        break;
      case "2":
        spaceShip = <i className="fas fa-space-shuttle fa-10x text-warning" />;
        break;
    }

    if (this.props.gameRecord) {
      const { firestore } = this.props;
      let uploader = <ImageUpload />;
      const id1 = this.props.gameRecord[this.props.gameRecord.length - 1].id;
      const id2 = this.props.gameRecord[this.props.gameRecord.length - 2].id;
      const id3 = this.props.gameRecord[this.props.gameRecord.length - 3].id;
      return (
        <div className="container">
          <div
            className="jumbotron jumbotron-billboard"
            style={{ marginTop: "100px", marginBottom: "50px" }}
          >
            <div className="row">
              <div className="col-4">
                <center style={{ marginTop: "-150px" }}>{uploader}</center>
                <center style={{ marginTop: "50px", marginLeft: "0px" }}>
                  <h4 style={{ color: "#851941" }}>Spaceship</h4>
                  {spaceShip}
                  <form onSubmit={this.onSubmitShip}>
                    <label className="text-dark col-lg-2">
                      <input
                        type="radio"
                        name="spaceShip1"
                        onClick={e => this.onSubmitShip(e, "0")}
                      />
                      <br />
                      <span>Black</span>
                    </label>
                    <label className="text-danger col-lg-2">
                      <input
                        type="radio"
                        name="spaceShip2"
                        onClick={e => this.onSubmitShip(e, "1")}
                      />
                      <br />
                      <span>Red</span>
                    </label>
                    <label className=" text-warning col-lg-2">
                      <input
                        type="radio"
                        name="spaceShip3"
                        onClick={e => this.onSubmitShip(e, "2")}
                      />
                      <br />
                      <span>Yellow</span>
                    </label>
                  </form>
                  <br />
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
                    {this.props.profile.username}
                  </div>
                  <br />
                  <div style={{ marginTop: "-20px" }}>
                    <span style={{ color: "#851941", marginRight: "10px" }}>
                      Email:
                    </span>{" "}
                    <span style={{ color: "#2D060F" }}>
                      {this.props.profile.email}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#851941", marginRight: "10px" }}>
                      Introduction:
                    </span>
                    <span>
                      <form onSubmit={this.onSubmitBio}>
                        <textarea
                          className="form-control"
                          style={{ color: "#2D060F", height: "100px" }}
                          rows="6"
                          type="text"
                          required
                          name="bioText"
                          value={
                            this.state.bioText === "Say something......"
                              ? this.props.profile.bioText
                              : this.state.bioText
                          }
                          onChange={this.onChange}
                        />
                        <center>
                          <input
                            type="submit"
                            value="Edit Profile"
                            className="btn"
                            style={{
                              backgroundColor: "#851941",
                              color: "#fff"
                            }}
                          />
                        </center>
                      </form>
                    </span>
                  </div>
                </h5>
                {/* <center style={{ marginTop: "-20px", marginLeft: "200px" }}>

                </center> */}
                <center>
                  <div
                    className="col font-weight-bold"
                    style={{ color: "#851941", marginTop: "-30px" }}
                  >
                    <br />
                    <br />
                    <i className="fas fa-trophy fa-4x" />
                    <span
                      className="col font-weight-bold text-uppercase"
                      style={{ fontSize: "1.5rem", color: "#851941" }}
                    >
                      Global Scorebroad
                    </span>
                    <br />
                    <br />
                    <div className="card">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item text-left">
                          <i className="fas fa-medal mr-3">1</i>
                          <span
                            className="mr-3"
                            style={{ fontSize: "1.25rem" }}
                          >
                            {
                              this.props.gameRecord[
                                this.props.gameRecord.length - 1
                              ].username
                            }
                          </span>
                          <span className="mr-3">
                            {
                              this.props.gameRecord[
                                this.props.gameRecord.length - 1
                              ].score
                            }
                          </span>
                          <span className="mr-3">
                            {this.props.gameRecord[
                              this.props.gameRecord.length - 1
                            ].time
                              .toDate()
                              .toString()
                              .slice(0, -29)}
                          </span>
                          <Link
                            style={{ color: "#851941" }}
                            to={"/otherprofile/" + id1}
                          >
                            <i className="fas fa-eye" />{" "}
                          </Link>
                        </li>
                        <li className="list-group-item text-left">
                          <i className="fas fa-award mr-3">2</i>
                          <span
                            className="mr-3"
                            style={{ fontSize: "1.25rem" }}
                          >
                            {
                              this.props.gameRecord[
                                this.props.gameRecord.length - 2
                              ].username
                            }
                          </span>
                          <span className="mr-3">
                            {
                              this.props.gameRecord[
                                this.props.gameRecord.length - 2
                              ].score
                            }
                          </span>
                          <span className="mr-3">
                            {this.props.gameRecord[
                              this.props.gameRecord.length - 2
                            ].time
                              .toDate()
                              .toString()
                              .slice(0, -29)}
                          </span>
                          <Link
                            style={{ color: "#851941" }}
                            to={"/otherprofile/" + id2}
                          >
                            <i className="fas fa-eye" />{" "}
                          </Link>
                        </li>
                        <li className="list-group-item text-left">
                          <i className="fas fa-award mr-3">3</i>
                          <span
                            className="mr-3"
                            style={{ fontSize: "1.25rem" }}
                          >
                            {
                              this.props.gameRecord[
                                this.props.gameRecord.length - 3
                              ].username
                            }
                          </span>
                          <span className="mr-3">
                            {
                              this.props.gameRecord[
                                this.props.gameRecord.length - 3
                              ].score
                            }
                          </span>
                          <span className="mr-3">
                            {this.props.gameRecord[
                              this.props.gameRecord.length - 3
                            ].time
                              .toDate()
                              .toString()
                              .slice(0, -29)}
                          </span>
                          <Link
                            style={{ color: "#851941" }}
                            to={"/otherprofile/" + id3}
                          >
                            <i className="fas fa-eye" />{" "}
                          </Link>
                        </li>
                        <li
                          className="list-group-item text-left"
                          style={{ fontSize: "1.25rem" }}
                        >
                          My highest scores: {"  "}
                          {parseInt(this.props.profile.score)}
                        </li>
                      </ul>
                    </div>
                  </div>
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

Profile.propTypes = {
  firebase: PropTypes.object.isRequired,
  firestore: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

export default compose(
  firebaseConnect(),
  firestoreConnect([{ collection: "gameRecord", orderBy: ["score"] }]),
  connect((state, props) => ({
    profile: state.firebase.profile,
    gameRecord: state.firestore.ordered.gameRecord
  }))
)(Profile);
