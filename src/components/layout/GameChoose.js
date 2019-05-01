import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class GameChoose extends Component {
  render() {
    return (
      <div className="justify-content-center">
        <center>
          <Link to="/singlegame">
            <button
              className="col-3 btn btn-lg text-uppercase"
              style={{
                backgroundColor: "#851941",
                color: "#fff",
                fontFamily: "Numans"
              }}
            >
              <div style={{ marginTop: "20px", marginBottom: "-20px" }}>
                Hunt
              </div>
              <br />
              <br />
              <i
                className="fas fa-user-ninja fa-2x"
                style={{ marginTop: "-20px", marginBottom: "20px" }}
              />
            </button>
          </Link>
          <Link to="/waitingroom">
            <button
              className="col-3 btn btn-lg text-uppercase"
              style={{
                backgroundColor: "#851941",
                color: "#fff",
                fontFamily: "Numans"
              }}
            >
              <div style={{ marginTop: "20px", marginBottom: "-20px" }}>
                Battle!
              </div>
              <br />
              <br />
              <i
                className="fas fa-users fa-2x"
                style={{ marginTop: "-20px", marginBottom: "20px" }}
              />
            </button>
          </Link>
        </center>
      </div>
    );
  }
}
