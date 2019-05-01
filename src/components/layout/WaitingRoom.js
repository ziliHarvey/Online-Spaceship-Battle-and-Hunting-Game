import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect, firestoreConnect } from "react-redux-firebase";
import { Redirect, Link } from "react-router-dom";
import firebase from "firebase";

import MessageList from "../message/MessageList";
import CreateMessage from "../message/CreateMessage";
import Spinner from "../layout/Spinner";

class WaitingRoom extends Component {
  state = {
    gameIsOn: false,
    messageContent: ""
  };

  onSubmitGame = e => {
    const { firebase, firestore, waitingRoom } = this.props;
    e.preventDefault();
    if (waitingRoom[0].player1 !== "" && waitingRoom[0].player2 !== "") {
      const roomId = waitingRoom[0].id;
      console.log(roomId);
      firestore.update(
        { collection: "waitingRoom", doc: roomId },
        { gameIsOn: true }
      );
      this.setState({ gameIsOn: true });
    } else {
      alert("Please start the game until two players joined!");
    }
  };

  onSubmitSeat1 = e => {
    if (
      this.props.waitingRoom[0].player1 !== this.props.profile.username &&
      this.props.waitingRoom[0].player2 !== this.props.profile.username
    ) {
      const { firebase, firestore, waitingRoom, profile } = this.props;
      e.preventDefault();
      const playerName = profile.username;
      const roomId = waitingRoom[0].id;
      console.log(roomId);
      if (waitingRoom[0].player1 === "") {
        firestore.update(
          { collection: "waitingRoom", doc: roomId },
          { player1: playerName, id1: this.props.auth.uid }
        );
        this.setState({ joinGame: true });
      } else {
        alert("This seat is alreay taken, please find another one!");
      }
    } else {
      alert("Already joined, please wait for other player");
    }
  };

  onSubmitSeat2 = e => {
    if (
      this.props.waitingRoom[0].player1 !== this.props.profile.username &&
      this.props.waitingRoom[0].player2 !== this.props.profile.username
    ) {
      const { firebase, firestore, waitingRoom, profile } = this.props;
      e.preventDefault();
      const playerName = profile.username;
      const roomId = waitingRoom[0].id;
      console.log(roomId);
      if (waitingRoom[0].player2 === "") {
        firestore.update(
          { collection: "waitingRoom", doc: roomId },
          { player2: playerName, id2: this.props.auth.uid }
        );
        this.setState({ joinGame: true });
      } else {
        alert("This seat is alreay taken, please find another one!");
      }
    } else {
      alert("Already joined, please wait for other player");
    }
  };

  onQuitSeat1 = e => {
    e.preventDefault();
    const { firestore, waitingRoom } = this.props;
    const roomId = waitingRoom[0].id;
    firestore.update(
      { collection: "waitingRoom", doc: roomId },
      { player1: "", id1: "" }
    );
  };

  onQuitSeat2 = e => {
    e.preventDefault();
    const { firestore, waitingRoom } = this.props;
    const roomId = waitingRoom[0].id;
    firestore.update(
      { collection: "waitingRoom", doc: roomId },
      { player2: "", id2: "" }
    );
  };

  onChange = data => {
    this.setState({
      messageContent: data
    });
  };

  onSubmit = () => {
    const authorname = this.props.profile.username;
    const authorId = this.props.auth.uid;
    console.log(authorId);
    const db = firebase.firestore();
    db.collection("messages").add({
      authorName: authorname,
      authorId: authorId,
      content: this.state.messageContent,
      createdTime: firebase.firestore.Timestamp.fromDate(new Date())
    });

    this.setState({
      messageContent: ""
    });
  };

  render() {
    const db = firebase.firestore();

    let seat1;
    let seat2;
    let messageFor3rdPlayer;

    if (this.props.waitingRoom) {
      if (this.props.waitingRoom[0].gameIsOn) {
        messageFor3rdPlayer = (
          <div className="font-weight-bold">
            Please wait until {this.props.waitingRoom[0].player1} and {this.props.waitingRoom[0].player2} finish
          </div>
        )
      }
      //seat1 display
      if (this.props.waitingRoom[0].player1 === "") {
        seat1 = (
          <button
            className="col-2 btn btn-lg"
            style={{
              backgroundColor: "#851941",
              color: "#fff",
              fontFamily: "Numans"
            }}
            onClick={this.onSubmitSeat1}
          >
            <i className="fas fa-user-plus" /> <br />
            Click to join!
            <br />
          </button>
        );
      } else {
        if (this.props.profile.username === this.props.waitingRoom[0].player1) {
          seat1 = (
            <button
              className="col-2 btn btn-lg"
              style={{
                backgroundColor: "#851941",
                color: "#fff",
                fontFamily: "Numans"
              }}
              onClick={this.onQuitSeat1}
            >
              <i className="fas fa-user-slash" />
              <br />
              {this.props.profile.username}
            </button>
          );
        } else {
          seat1 = (
            <Link to={"/otherprofile/" + this.props.waitingRoom[0].id1}>
              <button
                className="col-2 btn btn-lg"
                style={{
                  backgroundColor: "#851941",
                  color: "#fff",
                  fontFamily: "Numans"
                }}
              >
                <i className="fas fa-user-check" />
                <br />
                {this.props.waitingRoom[0].player1}
                <br />
              </button>
            </Link>
          );
        }
      }
      // seat2 display
      if (this.props.waitingRoom[0].player2 === "") {
        seat2 = (
          <button
            className="col-2 btn btn-lg"
            style={{
              backgroundColor: "#851941",
              color: "#fff",
              fontFamily: "Numans"
            }}
            onClick={this.onSubmitSeat2}
          >
            <i className="fas fa-user-plus" /> <br />
            Click to join!
            <br />
          </button>
        );
      } else {
        if (this.props.profile.username === this.props.waitingRoom[0].player2) {
          seat2 = (
            <button
              className="col-2 btn btn-lg"
              style={{
                backgroundColor: "#851941",
                color: "#fff",
                fontFamily: "Numans"
              }}
              onClick={this.onQuitSeat2}
            >
              <i className="fas fa-user-slash" />
              <br />
              {this.props.profile.username}
            </button>
          );
        } else {
          seat2 = (
            <Link to={"/otherprofile/" + this.props.waitingRoom[0].id2}>
              <button
                className="col-2 btn btn-lg"
                style={{
                  backgroundColor: "#851941",
                  color: "#fff",
                  fontFamily: "Numans"
                }}
              >
                <i className="fas fa-user-check" />
                <br />
                {this.props.waitingRoom[0].player2}
                <br />
              </button>
            </Link>
          );
        }
      }

      if (this.props.waitingRoom[0].gameIsOn == true && (this.props.waitingRoom[0].player1 === this.props.profile.username 
        || this.props.waitingRoom[0].player2 === this.props.profile.username)) {
        return <Redirect to="/multiplegame" />;
      } else {
        return (
          <div>
            <center>
              <div className="row-md">
                {seat1}
                {seat2}
              </div>
              <div className="row-md">
                {this.props.profile.username ==
                  this.props.waitingRoom[0].player1 ||
                this.props.profile.username ==
                  this.props.waitingRoom[0].player2 ? (
                  <button
                    className="col-2 btn btn-lg btn-block"
                    style={{
                      backgroundColor: "#851941",
                      color: "#fff",
                      fontFamily: "Numans",
                    }}
                    onClick={this.onSubmitGame}
                  >
                    <i className="fas fa-play">Start</i>
                  </button>
                ) : (
                  <button
                    className="col-2 btn btn-lg btn-block"
                    style={{
                      backgroundColor: "#851941",
                      color: "#fff",
                      fontFamily: "Numans",
                      height: "60px",
                      marginBottom: "-20px"
                    }}
                  >
                    <i className="fas fa-play">Start</i>
                  </button>
                )}
              </div>
              <br />
              {messageFor3rdPlayer}
              <div
                className="jumbotron jumbotron-billboard rounded-lg w-75 m-5"
                style={{ height: "320px", marginTop: "-4700px" }}
              >
                <div style={{ marginTop: "-45px", marginBottom: "40px" }}>
                  <i
                    className="far fa-comments fa-2x"
                    style={{ color: "#851941" }}
                  >
                    Chatting room
                  </i>
                </div>

                <div
                  className="text-dark text-left"
                  style={{
                    height: "200px",
                    overflowY: "scroll",
                    overflowX: "hidden",
                    marginTop: "-30px",
                    wordWrap: "break-word"
                  }}
                  id="messagelist_scrollbar"
                >
                  <MessageList messages={this.props.messages} />
                </div>
                <div style={{ marginBottom: "-40px" }}>
                  <CreateMessage
                    message={this.state.messageContent}
                    onChange={this.onChange}
                    onSubmit={this.onSubmit}
                  />
                </div>
              </div>
            </center>
          </div>
        );
      }
    } else {
      return <Spinner />;
    }
  }
}

//
WaitingRoom.propTypes = {
  firebase: PropTypes.object.isRequired,
  firestore: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

export default compose(
  firebaseConnect(),
  firestoreConnect(props => [{ collection: "waitingRoom" }, "gameRecord"]),
  connect((state, props) => ({
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    waitingRoom: state.firestore.ordered.waitingRoom,
    messages: state.messages,
    gameRecord: state.firestore.ordered.gameRecord
  }))
)(WaitingRoom);
