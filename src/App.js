import './App.css';

import Navbar from './components/Navbar/Navbar';
import SignUp from './components/SignUp/SignUp.js';
import SignIn from './components/SignIn/SignIn.js';

import React, { Component } from 'react';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        whichPage:"SignIn"
    }
  }

  render(){
    if(this.state.whichPage==="SignUp") {
      return (
      <>
          <Navbar />
          <SignUp 
            addedNewUser={ this.addedNewUser } 
            changePage={ this.changePage }>
          </SignUp>
      </>
    )}
    
    if ( this.state.whichPage === "SignIn" ) {
      return (
      <>
      <Navbar />
      <SignIn 
        addedNewUser = {this.state.addedNewUser}
        loginUser = {this.loginUser}
        changePage = {this.changePage} > 
      </SignIn>;
      </>
    )}

  }
  changePage = (page)=> {
    this.setState({whichPage:page})
  }
  setGameIdForDetailsId = (gameId)=> {
    this.setState({gameForDetailsId:gameId})
  }
  addedNewUser = ()=> {
    this.setState({addedNewUser:true})
  }

  loginUser = (loggedInUser)=> {
    console.log("Logowanie użytkownika: ", loggedInUser);
    this.setState({currentUser:loggedInUser})
  };
}

export default App;
