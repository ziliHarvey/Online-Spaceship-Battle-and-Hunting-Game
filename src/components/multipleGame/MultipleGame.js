import React, { Component } from "react";
import Ship from "./Ship";
import "./style.css";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect, firestoreConnect } from "react-redux-firebase";
import SockJS from "sockjs-client";
import Bullet from "./Bullet";

const KEY = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  A: 65,
  D: 68,
  W: 87,
  SPACE: 32,
  ENTER: 13
};

class MultipleGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1
      },
      context: null,
      keys: {
        left: 0,
        right: 0,
        up: 0,
        down: 0,
        space: 0,
        enter: 0
      },
      asteroidCount: 3,
      fuelCount: 5,
      currentScore: 10,
      otherScore: 10,
      inGame: false,
      time: 3600,
      actions: null,
    };
    this.ship = [];
    this.ship2 = [];
    this.asteroids = [];
    this.bullets = [];
    this.bullets2 = [];
    this.fuels = [];
    this.updateTime = 0;
  }

  handleResize(value, e) {
    this.setState({
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1
      }
    });
  }

  handleKeys(value, e) {
    let keys = this.state.keys;
    if (e.keyCode === KEY.LEFT || e.keyCode === KEY.A) keys.left = value;
    if (e.keyCode === KEY.RIGHT || e.keyCode === KEY.D) keys.right = value;
    if (e.keyCode === KEY.UP || e.keyCode === KEY.W) keys.up = value;
    if (e.keyCode === KEY.SPACE) keys.space = value;
    if (e.keyCode === KEY.ENTER) keys.enter = value;
    this.setState({
      keys: keys
    });
  }

  componentDidMount() {
    window.addEventListener("keyup", this.handleKeys.bind(this, false));
    window.addEventListener("keydown", this.handleKeys.bind(this, true));
    window.addEventListener("resize", this.handleResize.bind(this, false));
    const context = this.refs.canvas.getContext("2d");
    this.setState({ context: context });

    var sock = new SockJS("http://localhost:9999/echo");

    sock.onopen = () => {
      console.log("open");
      this.setState({ actions: sock, messages: [] });
      this.startGame();
      requestAnimationFrame(() => {
        this.update();
      });
    };

    sock.onmessage = e => {
      var socketData = JSON.parse(e.data);
      switch (socketData.topic) {
        case "ship":
          if (socketData.user != this.props.profile.username) {
            this.ship2 = socketData.data;
              this.drawShip(
                this.ship2.position.x,
                this.ship2.position.y,
                this.ship2.rotation,
                this.ship2.spaceShip,
                socketData.user
              );
              this.drawShip(
                this.ship[0].position.x,
                this.ship[0].position.y,
                this.ship[0].rotation,
                this.ship[0].spaceShip,
                this.props.profile.username
              );
            }
          break;
        case "bullets":
          const bulletInfo = socketData.data;
          const bulletRec = new Bullet({ ship: bulletInfo });
          this.createObject(bulletRec, "bullets");
          break;
        case "score":
          if (socketData.user === this.props.profile.username) {
            const scoreInfo = socketData;
            this.setState({currentScore: scoreInfo.myscore});
            this.setState({otherScore: scoreInfo.otherscore})
          } 
          else 
          {
            const scoreInfo = socketData;
            this.setState({otherScore: scoreInfo.myscore});
            this.setState({currentScore: scoreInfo.otherscore})
          }    
      }
    };

    sock.onclose = function() {
      console.log("close");
    };
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleKeys);
    window.removeEventListener("keydown", this.handleKeys);
    window.removeEventListener("resize", this.handleResize);
  }

  update() {
    if (this.state.time >= 0 && this.state.inGame) {
      var curTime = this.state.time - 1;
    }
    this.setState({ time: curTime });
    if (this.state.inGame) {
      const context = this.state.context;
      context.save();
      context.scale(this.state.screen.ratio, this.state.screen.ratio);
      context.fillStyle = "#000";
      context.globalAlpha = 0.4;
      context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
      context.globalAlpha = 1;

      // // Check for colisions
      this.checkCollisionsWith(this.ship, this.bullets);
      this.checkCollisionsWith2(this.bullets);

      this.updateObjects(this.ship, "ship");
      var shipData = {
        topic: "ship",
        user: this.props.profile.username,
        data: this.ship[0]
      };
      this.state.actions.send(JSON.stringify(shipData));

      this.updateObjects(this.bullets, "bullets");
      this.drawBullets(this.bullets);
      context.restore();
    }

    // Next frame
    if (this.state.currentScore <= 0 || this.state.otherscore <= 0) {
      this.gameOver();
      this.setState({ time: 0 });
    }

    if (this.state.time < 0) {
      this.gameOver();
      this.setState({ time: 0 });
    }
    requestAnimationFrame(() => {
      this.update();
    });
  }

  addScore(points) {
    if (this.state.inGame) {
      this.setState({
        currentScore: this.state.currentScore + points
      });
    }
  }

  startGame = () => {
    this.setState({
      inGame: true,
      currentScore: 10,
      time: 3600
    });
    this.updateTime = 0;
    this.ship = [];
    this.ship2 = [];
    // Make ship
    let ship = new Ship({
      position: {
        x: this.state.screen.width / 2,
        y: this.state.screen.height / 2
      },
      create: this.createObject.bind(this),
      onDie: this.gameOver.bind(this),
      spaceShip: this.props.profile.spaceShip,
      username: this.props.profile.username
    });

    this.createObject(ship, "ship");
    this.state.actions.send(JSON.stringify(ship));
  };

  gameOver() {
    this.setState({
      inGame: false
    });
  }

  drawShip(x, y, rotation, spaceShip, name) {
    const context = this.state.context;

    context.save();
    context.scale(this.state.screen.ratio, this.state.screen.ratio);

    context.translate(x, y);
    context.rotate((rotation * Math.PI) / 180);
    context.strokeStyle = "#ffffff";
    context.font = "15px Arial";
    context.strokeText(name, 5, 25);
    context.strokeStyle = "#ffffff";

    switch (spaceShip) {
      case "0":
        context.fillStyle = "#000000";
        break;
      case "1":
        context.fillStyle = "#ff0000";
        break;
      case "2":
        context.fillStyle = "#fff000";
        break;
      default:
        context.fillStyle = "#000000";
    }
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, -15);
    context.lineTo(10, 10);
    context.lineTo(5, 7);
    context.lineTo(-5, 7);
    context.lineTo(-10, 10);
    context.closePath();
    context.fill();
    context.stroke();
    context.restore();
  }

  drawBullet(positionx, positiony, rotation) {
    // Draw
    const context = this.state.context;
    context.save();
    context.translate(positionx, positiony);
    context.rotate((rotation * Math.PI) / 180);
    context.fillStyle = "#FFF";
    context.lineWidth = 0.5;
    context.beginPath();
    context.arc(0, 0, 2, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    context.restore();
  }

  drawBullets = items => {
    for (let item of items) {
      var bullet = item;
      this.drawBullet(bullet.position.x, bullet.position.y, bullet.rotation);
    }
  };

  createObject(item, group) {
    this[group].push(item);
  }

  updateObjects = (items, group) => {
    let index = 0;
    for (let item of items) {
      if (item.delete) {
        this[group].splice(index, 1);
      } else {
        item.render(this.state);
      }
      index++;
    }
  };

  checkCollisionsWith(items1, items2) {
    var a = items1.length - 1;
    var b;
    for (a; a > -1; --a) {
      b = items2.length - 1;
      for (b; b > -1; --b) {
        var item1 = items1[a];
        var item2 = items2[b];
        if (item2.username !== item1.username) {
          if (this.checkCollision(item1, item2)) {
            this.minusmyScore();
            item2.destroy();
          }
        }
        
      }
    }
  }

  checkCollisionsWith2 = items2 => {
    var idx = items2.length - 1;
    var item1 = this.ship2;
    for (idx; idx > -1; --idx) {
      var item2 = items2[idx];
      if (item2.username !== item1.username) {
        if (this.checkCollision(item1, item2)) {
          this.minusotherScore();
          item2.destroy();
        }
      }
      
    }
  };

  checkCollision(obj1, obj2) {
    var vx = obj1.position.x - obj2.position.x;
    var vy = obj1.position.y - obj2.position.y;
    var length = Math.sqrt(vx * vx + vy * vy);
    if (length < obj1.radius + obj2.radius) {
      return true;
    }
    return false;
  }

  minusmyScore() {
    var myscore = this.state.currentScore;
    var otherscore = this.state.otherScore;
    if (myscore > 0) {
      myscore = myscore - 1;
    }
    
    if (otherscore < 10) {
      otherscore = otherscore + 1;
    }
    var scoreData = {
      topic: "score",
      user: this.props.profile.username,
      myscore: myscore,
      otherscore: otherscore
    };
    this.state.actions.send(JSON.stringify(scoreData));
  }

  minusotherScore() {
    var myscore = this.state.currentScore;
    var otherscore = this.state.otherScore;
    if (myscore < 10) {
      myscore = myscore + 1;
    }
    if (otherscore > 0) {
      otherscore = otherscore - 1;
    }
    var scoreData = {
      topic: "score",
      user: this.props.profile.username,
      myscore: myscore,
      otherscore: otherscore
    };
    this.state.actions.send(JSON.stringify(scoreData));
  }

  endGame = e => {
    e.preventDefault();
    const { firestore, waitingRoom } = this.props;
    if (
      waitingRoom[0].player1 === this.props.profile.username ||
      waitingRoom[0].player2 === this.props.profile.username
    ) {
      const roomId = waitingRoom[0].id;
      firestore.update(
        { collection: "waitingRoom", doc: roomId },
        { gameIsOn: false, player1: "", player2: "", id1: "", id2: "" }
      );
    }
  };

  render() {
    let endgame;
    let message;
    let otherPlayerName

    if (this.props.waitingRoom) {
      otherPlayerName = (this.props.waitingRoom[0].player1 === this.props.profile.username) ? 
          (this.props.waitingRoom[0].player2):(this.props.waitingRoom[0].player1);
    }
    if (this.props.waitingRoom && !this.props.waitingRoom[0].gameIsOn) {
      this.state.actions.close();
      return <Redirect to="/" />;
    }
      

    if (this.state.otherScore <= 0 || this.state.currentScore <= 0 || !this.state.inGame) {
      if (this.state.otherScore <= this.state.currentScore) {
        endgame = (
          <div className="endgame w-50">
            <div
              className="jumbotron jumbotron-billboard"
              style={{ marginTop: "50px", marginBottom: "50px" }}
            >
              <p>{message}</p>
              <div
                className="align-middle font-weight-bold"
                style={{ marginTop: "-20px", marginBottom: "20px" }}
              >
                <span style={{ color: "#851941" }}>Congratulations! {"   "}</span>
                <span style={{ color: "#2D060F" }}>
                  {this.props.profile.username}
                </span>
                <br />
                <span style={{ color: "#851941" }}>YOU WIN</span>
              </div>
              <div style={{ marginBottom: "-50px" }}>
                  <button
                    className="col-3 btn btn-lg"
                    style={{
                      backgroundColor: "#851941",
                      color: "#fff",
                      fontFamily: "Numans"
                    }}
                    onClick={this.endGame}
                  >
                    Exit
                  </button>
              </div>
            </div>
          </div>
        );
      } else {
        endgame = (
          <div className="endgame w-50">
            <div
              className="jumbotron jumbotron-billboard"
              style={{ marginTop: "50px", marginBottom: "50px" }}
            >
              <p>{message}</p>
              <div
                className="align-middle font-weight-bold"
                style={{ marginTop: "-20px", marginBottom: "20px" }}
              >
                <span style={{ color: "#851941" }}>Sorry {"   "}</span>
                <span style={{ color: "#2D060F" }}>
                  {this.props.profile.username}
                </span>
                <br />
                <span style={{ color: "#851941" }}>YOU LOSE</span>
              </div>
              <div style={{ marginBottom: "-50px" }}>
                  <button
                    className="col-3 btn btn-lg"
                    style={{
                      backgroundColor: "#851941",
                      color: "#fff",
                      fontFamily: "Numans"
                    }}
                    onClick={this.endGame}
                  >
                    Exit
                  </button>
              </div>
            </div>
          </div>
        );
      }
    }
    

    return (
      <div>
        {endgame}
        <div className="score current-score ">
          {this.props.profile.username}<br />
          <progress 
            value={this.state.currentScore} 
            max="10"
            style={{ color: "#851941"}} 
            /> <br />
        </div>
        <div className="score top-score">
          {otherPlayerName}
          <br/>
          <progress 
            value={this.state.otherScore} 
            max="10"
            style={{ color: "#851941"}} 
            /> <br />
        </div>
        <span className="controls">
          Use [A][S][W][D] or [←][↑][↓][→] to MOVE
          <br />
          Use [SPACE] to SHOOT
          <br />
          <span className="timer">
            Time Left:{" "}
            {parseInt(this.state.time / 60 > 0 ? this.state.time / 60 : 0)}
          </span>
        </span>
        <canvas
          ref="canvas"
          width={this.state.screen.width * this.state.screen.ratio}
          height={this.state.screen.height * this.state.screen.ratio}
        />
      </div>
    );
  }
}

MultipleGame.propTypes = {
  firebase: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  actions: PropTypes.object
};

export default compose(
  firebaseConnect(),
  firestoreConnect(["gameRecord", "waitingRoom"]),
  connect((state, props) => ({
    profile: state.firebase.profile,
    gameRecord: state.firestore.ordered.gameRecord,
    waitingRoom: state.firestore.ordered.waitingRoom,
    auth: state.firebase.auth
  }))
)(MultipleGame);
