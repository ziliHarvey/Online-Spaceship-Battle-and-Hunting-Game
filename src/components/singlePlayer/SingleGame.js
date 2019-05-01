import React, { Component } from "react";
import Ship from "./Ship";
import Asteroid from "./Asteroid";
import Fuel from "./Fuel";
import { randomNumBetweenExcluding } from "../../helpers/calculationHelper";
import "./style.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect, firestoreConnect } from "react-redux-firebase";

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

class SingleGame extends Component {
  constructor() {
    super();
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
      currentScore: 0,
      topScore: localStorage["topscore"] || 0,
      inGame: false,
      time: 3600,
      level: 0
    };
    this.ship = [];
    this.asteroids = [];
    this.bullets = [];
    this.fuels = [];
    this.updateTime = 0;
    this.selectLevel = false;
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
    this.setLevel();
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleKeys);
    window.removeEventListener("keydown", this.handleKeys);
    window.removeEventListener("resize", this.handleResize);
  }

  setLevel() {
    if (this.selectLevel) {
      this.startGame();
      requestAnimationFrame(() => {
        this.update();
      });
    }
  }

  enterGame = e => {
    e.preventDefault();
    if (this.state.level === "1" || this.state.level === "2" || this.state.level === "3") {
      this.selectLevel = true;
      this.startGame();
      requestAnimationFrame(() => {
      this.update();
    });
    } else {
      alert("Please select the game difficulty level!");
    }
    
  };
  onChange = e => this.setState({ [e.target.name]: e.target.value });

  update() {
    if (this.state.time >= 0 && this.state.inGame) {
      var curTime = this.state.time - 1;
    }
    this.setState({ time: curTime });
    const context = this.state.context;

    const image = new Image();
    image.src =
      "https://img3.akspic.com/image/25445-astronomical_object-space-hubble_space_telescope-cosmos-astronomy-1920x1080.jpg";
    context.drawImage(image, 0, 0);
    context.save();
    context.scale(this.state.screen.ratio, this.state.screen.ratio);

    // Next set of asteroids
    if (!this.asteroids.length) {
      let count = this.state.asteroidCount + 1;
      this.setState({ asteroidCount: count });
      this.generateAsteroids(count);
    }

    if (!this.fuels.length) {
      let count = this.state.fuelCount;
      this.generateFuels(count);
    }

    // Check for colisions
    this.checkCollisionsWith(this.bullets, this.asteroids);
    this.checkCollisionsWith(this.ship, this.asteroids);
    this.checkCollisionsWith(this.ship, this.fuels);

    // Remove or render
    this.updateObjects(this.asteroids, "asteroids");
    this.updateObjects(this.bullets, "bullets");
    this.updateObjects(this.ship, "ship");
    this.updateObjects(this.fuels, "fuels");

    context.restore();

    // Next frame
    if (this.state.time < 0) {
      this.gameOver();
      this.ship = [];
      this.setState({ time: 0 });
    }
    requestAnimationFrame(() => {
      this.update();
    });
  }

  addScore(points) {
    if (this.state.inGame) {
      this.setState({
        currentScore:
          this.state.currentScore + points * parseInt(this.state.level)
      });
    }
  }

  startGame() {
    this.setState({
      inGame: true,
      currentScore: 0,
      time: 3600
    });
    this.selectLevel = true;
    this.updateTime = 0;
    // Make ship
    let ship = new Ship({
      position: {
        x: this.state.screen.width / 2,
        y: this.state.screen.height / 2
      },
      create: this.createObject.bind(this),
      onDie: this.gameOver.bind(this),
      spaceShip: this.props.profile.spaceShip
    });
    this.createObject(ship, "ship");

    // Make asteroids
    this.asteroids = [];
    this.generateAsteroids(this.state.asteroidCount);
    this.generateFuels(this.state.fuelCount);
  }

  gameOver() {
    this.setState({
      inGame: false
    });

    // Replace top score
    if (this.state.currentScore > this.state.topScore) {
      this.setState({
        topScore: this.state.currentScore
      });
      localStorage["topscore"] = this.state.currentScore;
    }
  }

  generateAsteroids(howMany) {
    // let asteroids = [];
    let ship = this.ship[0];
    console.log(this.state.level);
    for (let i = 0; i < howMany; i++) {
      let asteroid = new Asteroid({
        size: 80,
        position: {
          x: randomNumBetweenExcluding(
            0,
            this.state.screen.width,
            ship.position.x - 60,
            ship.position.x + 60
          ),
          y: randomNumBetweenExcluding(
            0,
            this.state.screen.height,
            ship.position.y - 60,
            ship.position.y + 60
          )
        },
        create: this.createObject.bind(this),
        addScore: this.addScore.bind(this),
        level: this.state.level
      });
      this.createObject(asteroid, "asteroids");
    }
  }

  generateFuels(howMany) {
    let ship = this.ship[0];
    for (let i = 0; i < howMany; i++) {
      let fuel = new Fuel({
        size: 20,
        position: {
          x: randomNumBetweenExcluding(
            0,
            this.state.screen.width,
            ship.position.x - 20,
            ship.position.x + 20
          ),
          y: randomNumBetweenExcluding(
            0,
            this.state.screen.height,
            ship.position.y - 20,
            ship.position.y + 20
          )
        },
        create: this.createObject.bind(this),
        addScore: this.addScore.bind(this)
      });
      this.createObject(fuel, "fuels");
    }
  }

  createObject(item, group) {
    this[group].push(item);
  }

  updateObjects(items, group) {
    let index = 0;
    for (let item of items) {
      if (item.delete) {
        this[group].splice(index, 1);
      } else {
        item.render(this.state);
      }
      index++;
    }
  }

  checkCollisionsWith(items1, items2) {
    var a = items1.length - 1;
    var b;
    for (a; a > -1; --a) {
      b = items2.length - 1;
      for (b; b > -1; --b) {
        var item1 = items1[a];
        var item2 = items2[b];
        if (this.checkCollision(item1, item2)) {
          if (items2 === this.fuels) {
            item2.destroy();
          } else {
            item1.destroy();
            item2.destroy();
          }
        }
      }
    }
  }

  checkCollision(obj1, obj2) {
    var vx = obj1.position.x - obj2.position.x;
    var vy = obj1.position.y - obj2.position.y;
    var length = Math.sqrt(vx * vx + vy * vy);
    if (length < obj1.radius + obj2.radius) {
      return true;
    }
    return false;
  }

  render() {
    let endgame;
    let message;

    let levelDisplay;

    switch (this.state.level) {
      case "1":
        levelDisplay = "Easy Mode";
        break;
      case "2":
        levelDisplay = "Medium Mode";
        break;
      case "3":
        levelDisplay = "Hard Mode";
        break;
      default:
        levelDisplay = "Please select difficulty level";
    }

    if (!this.selectLevel) {
      endgame = (
        <div className="endgame w-50">
          <center>
            <div
              className="jumbotron jumbotron-billboard"
              style={{
                marginTop: "60px",
                marginBottom: "0px",
                height: "240px",
                width: "450px"
              }}
            >
              <label
                className="text-success col-lg-2"
                style={{ marginRight: "30px", fontSize: "1.25rem" }}
              >
                <input
                  type="radio"
                  name="level"
                  value="1"
                  onClick={this.onChange}
                />
                <br />
                <span className="text-center">Easy</span>
              </label>
              <label
                className="text-warning col-lg-2 "
                style={{ marginRight: "30px", fontSize: "1.25rem" }}
              >
                <input
                  type="radio"
                  name="level"
                  value="2"
                  onClick={this.onChange}
                />
                <br />
                <span className="text-center">Medium</span>
              </label>
              <label
                className=" text-danger col-lg-2"
                style={{ fontSize: "1.25rem" }}
              >
                <input
                  type="radio"
                  name="level"
                  value="3"
                  onClick={this.onChange}
                />
                <br />
                <span className="text-center">Hard</span>
              </label>
              <br />
              <button
                className="col-3 btn btn-lg text-uppercase"
                style={{
                  backgroundColor: "#851941",
                  color: "#fff",
                  fontFamily: "Numans"
                }}
                onClick={e => this.enterGame(e)}
              >
                enter{" "}
              </button>
            </div>
          </center>
        </div>
      );
    }

    if (!this.state.inGame && this.selectLevel) {
      const { score } = this.props.profile;
      if (this.updateTime === 0 && this.state.time !== 3600) {
        const { firebase, firestore, auth } = this.props;
        if (parseInt(score) < this.state.currentScore) {
          firebase.updateProfile({ score: this.state.currentScore });
        }
        console.log(this.state.currentScore);
        firestore.add(
          { collection: "gameRecord" },
          {
            username: this.props.profile.username,
            score: this.state.currentScore,
            time: new Date(),
            id: auth.uid
          }
        );
        this.updateTime++;
      }
      endgame = (
        <div className="endgame w-50">
          <div
            className="jumbotron jumbotron-billboard"
            style={{ marginTop: "50px", marginBottom: "50px" }}
          >
            <h4
              style={{
                marginTop: "-40px",
                marginBottom: "0px",
                color: "#851941"
              }}
            >
              Game over, man!
            </h4>
            <p>{message}</p>
            <div
              className="align-middle font-weight-bold"
              style={{ marginTop: "-20px", marginBottom: "20px" }}
            >
              <br />
              <span style={{ color: "#851941" }}>Top score:</span>{" "}
              <span style={{ color: "#2D060F" }}>{score}</span>
              <br />
              <span style={{ color: "#851941" }}>Current score:</span>{" "}
              <span style={{ color: "#2D060F" }}>
                {this.state.currentScore}
              </span>
              <br />
              <span style={{ color: "#851941" }}>Current Player:</span>
              <span style={{ color: "#2D060F" }}>
                {this.props.profile.username}
              </span>
              <br />
            </div>
            <div style={{ marginBottom: "-50px" }}>
              <button
                className="col-3 btn btn-lg"
                style={{
                  backgroundColor: "#851941",
                  color: "#fff",
                  fontFamily: "Numans"
                }}
                onClick={this.startGame.bind(this)}
              >
                Restart
              </button>
              <Link to="/">
                <button
                  className="col-3 btn btn-lg"
                  style={{
                    backgroundColor: "#851941",
                    color: "#fff",
                    fontFamily: "Numans"
                  }}
                >
                  Exit
                </button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    if (!this.state.inGame && this.state.keys.enter) {
      this.startGame();
    }

    return (
      <div>
        {endgame}
        <br />
        <span className="score current-score">
          Score: {this.state.currentScore}
        </span>
        <span className="controls">
          Use [A][S][W][D] or [←][↑][↓][→] to MOVE
          <br />
          Use [SPACE] to SHOOT
          <br />
          <span className="timer">
            Time Left:{" "}
            {parseInt(this.state.time / 60 > 0 ? this.state.time / 60 : 0)}
            <br />
            <br />
            <div style={{ marginTop: "-20px" }}>{levelDisplay}</div>
            <br />
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

SingleGame.propTypes = {
  firebase: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

export default compose(
  firebaseConnect(),
  firestoreConnect(["gameRecord"]),
  connect((state, props) => ({
    profile: state.firebase.profile,
    gameRecord: state.firestore.ordered.gameRecord,
    auth: state.firebase.auth
  }))
)(SingleGame);
