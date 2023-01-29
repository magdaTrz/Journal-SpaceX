import "./App.css";

import Navbar from "./components/Navbar/Navbar.js";
import SignUp from "./components/SignUp/SignUp.js";
import SignIn from "./components/SignIn/SignIn.js";

import Rockets from "./components/Rockets/Rockerts.js";
import RocketsCard from "./components/RocketsCard/RocketsCard.js";

import Launches from "./components/Launches/Launches.js";
import LaunchesCard from "./components/LaunchesCard/LaunchCard.js";

import WatchList from "./components/WatchList/WatchList.js";

import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      whichPage: "SignIn",
    };
  }

  render() {
    if (this.state.whichPage === "SignUp") {
      return (
        <>
          <SignUp
            addedNewUser={this.addedNewUser}
            changePage={this.changePage}
          ></SignUp>
        </>
      );
    }

    if (this.state.whichPage === "SignIn") {
      return (
        <>
          <SignIn
            addedNewUser={this.state.addedNewUser}
            loginUser={this.loginUser}
            changePage={this.changePage}
          ></SignIn>
          ;
        </>
      );
    }

    if (this.state.whichPage === "Rockets") {
      return (
        <>
          <Navbar changePage={this.changePage} />
          <Rockets
            currentUser={this.state.currentUser}
            changePage={this.changePage}
            setGameIdForDetailsId={this.setGameIdForDetailsId}
          ></Rockets>
        </>
      );
    }

    if (this.state.whichPage === "RocketsCard") {
      return (
        <>
          <Navbar changePage={this.changePage} />
          <RocketsCard
            currentUser={this.state.currentUser}
            changePage={this.changePage}
            gameForDetailsId={this.state.gameForDetailsId}
            setGameIdForDetailsId={this.setGameIdForDetailsId}
          ></RocketsCard>
        </>
      );
    }

    if (this.state.whichPage === "Launches") {
      return (
        <>
          <Navbar changePage={this.changePage} />
          <Launches
            currentUser={this.state.currentUser}
            changePage={this.changePage}
            gameForDetailsId={this.state.gameForDetailsId}
            setGameIdForDetailsId={this.setGameIdForDetailsId}
          ></Launches>
        </>
      );
    }

    if (this.state.whichPage === "LaunchesCard") {
      return (
        <>
          <Navbar changePage={this.changePage} />
          <LaunchesCard
            currentUser={this.state.currentUser}
            changePage={this.changePage}
            setGameIdForDetailsId={this.setGameIdForDetailsId}
          ></LaunchesCard>
        </>
      );
    }

    if (this.state.whichPage === "WatchList") {
      return (
        <>
          <Navbar changePage={this.changePage} />
          <WatchList
            currentUser={this.state.currentUser}
            changePage={this.changePage}
            setGameIdForDetailsId={this.setGameIdForDetailsId}
          ></WatchList>
        </>
      );
    }
  }
  changePage = (page) => {
    this.setState({ whichPage: page });
  };
  setGameIdForDetailsId = (gameId) => {
    this.setState({ gameForDetailsId: gameId });
  };
  addedNewUser = () => {
    this.setState({ addedNewUser: true });
  };

  loginUser = (loggedInUser) => {
    console.log("currentUser: ", loggedInUser);
    this.setState({ currentUser: loggedInUser });
  };
}

export default App;
