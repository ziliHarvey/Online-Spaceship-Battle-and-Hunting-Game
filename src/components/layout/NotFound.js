import React, { Component } from 'react'

export default class NotFound extends Component {
  render() {
    return (
      <div>
        <center>
        <i className="fas fa-exclamation-triangle fa-10x" style={{ color: "#851941" }}></i><br /><br />
            <h1 style={{ color: "#851941" }} className="font-weight-bold">404 Not Found</h1>
        </center>
      </div>
    )
  }
}
