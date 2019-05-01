import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import SingleGame from "./components/singlePlayer/SingleGame";
// import MultipleGame from "./components/multiplePlayers/MultipleGame";
import MultipleGame from "./components/multipleGame/MultipleGame";

import GameChoose from "./components/layout/GameChoose";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import NavBar from "./components/layout/NavBar";
import Profile from "./components/layout/Profile";
import WaitingRoom from "./components/layout/WaitingRoom";
import OtherProfile from "./components/layout/OtherProfile";
import NotFound from "./components/layout/NotFound";

import { UserIsAuthenticated, UserIsNotAuthenticated } from "./helpers/auth";
import SockJS from "sockjs-client";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <NavBar />
          <Switch>
            <Route exact path="/" component={UserIsAuthenticated(GameChoose)} />
            <Route
              exact
              path="/singlegame"
              component={UserIsAuthenticated(SingleGame)}
            />
            <Route
              exact
              path="/multiplegame"
              component={UserIsAuthenticated(MultipleGame)}
              {...this.state}
            />
            <Route
              exact
              path="/login"
              component={UserIsNotAuthenticated(Login)}
            />
            <Route
              exact
              path="/register"
              component={UserIsNotAuthenticated(Register)}
            />
            <Route
              exact
              path="/profile"
              component={UserIsAuthenticated(Profile)}
            />
            <Route
              exact
              path="/waitingroom"
              component={UserIsAuthenticated(WaitingRoom)}
            />
            <Route
              exact
              path="/otherprofile/:id"
              component={UserIsAuthenticated(OtherProfile)}
            />
            <Route component={UserIsAuthenticated(NotFound)} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
