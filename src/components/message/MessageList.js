import React, { Component } from "react";
import firebase from "firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect, firestoreConnect } from "react-redux-firebase";
import { Redirect, Link } from "react-router-dom";

// Components
class MessageList extends Component {
  componentDidMount() {
    var element = document.getElementById("messagelist_scrollbar");
    element.scrollTop = element.scrollHeight;
  }

  componentDidUpdate() {
    var element = document.getElementById("messagelist_scrollbar");
    element.scrollTop = element.scrollHeight;
  }

  updateScroll() {
    var element = document.getElementById("messagelist_scrollbar");
    element.scrollTop = element.scrollHeight;
  }

  displayMessages = e => {
    let a = [];
    if (this.props.messages) {
      var idx =
        this.props.messages.length - 10 > 0
          ? this.props.messages.length - 10
          : 0;
      while (this.props.messages[idx]) {
        const userId = this.props.messages[idx].authorId;
        const name = (
          <span className="font-weight-bold">
            {this.props.messages[idx].authorName}
          </span>
        );
        const text = (
          <span className="message__text">
            {this.props.messages[idx].content}
          </span>
        );
        const time = (
          <span style={{ fontSize: "0.75rem" }}>
            {this.props.messages[idx].createdTime
              .toDate()
              .toString()
              .slice(0, -29)}
          </span>
        );
        // console.log(time);
        a.push(
          <div
            key={this.props.messages[idx].id}
            className="message-with-status"
          >
            <p>
              {" "}
              <span>
                <Link to={"/otherprofile/" + userId}> {name} </Link>
              </span>
              <span>: {time}</span>
            </p>
            <p
              style={{
                marginLeft: "30px",
                marginTop: "-15px",
                marginBottom: "5px"
              }}
            >
              {text}
            </p>
          </div>
        );
        idx += 1;
      }
    }
    // console.log(a);
    return a;
  };

  render() {
    return (
      <div className="messages-box">
        <ul>{this.displayMessages()}</ul>
      </div>
    );
  }
}

export default compose(
  firebaseConnect(),
  firestoreConnect([
    {
      collection: "messages",
      orderBy: ["createdTime"]
    }
  ]),

  connect((state, props) => ({
    messages: state.firestore.ordered.messages
  }))
)(MessageList);
