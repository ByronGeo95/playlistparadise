//Created by: Byron Georgopoulos
//Created on: 31/10/2021
//Last Modified on: 01/02/2022
/*Description: Main file that routes all of the frontend files togther*/

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

//Browser Router to switch between web pages
import { BrowserRouter, Switch } from 'react-router-dom';

import Login from './Components/Login.js';
import SignUp from './Components/SignUp.js';

import Nav from './Components/Nav.js';
import AudioPlayer from './Components/AudioPlayer.js';

import Home from './Components/Home.js';
import Music from './Components/Music.js';
import Search from './Components/Search.js';
import Profile from './Components/Profile.js';
import Settings from './Components/Settings.js';
import UserProfile from './Components/UserProfile.js';

class App extends React.Component {

    constructor (props)
    {
        super(props);

        this.state = {
            landingActive: true,
            dashboardActive: false,
            userDetails: [],
            searchTerm: '',
            trackArr: [],
            user_id: '',
            userUsername: '',
            loginActive: true,
            signUpActive: false,
        };
    };

    //Props for user details to be sent from login/sign up page to dashboard once JWT successful. Also changes state of dashboard to true upon successful login
    userDetails = (userDetails) => {
      this.setState({ userDetails: userDetails, landingActive: false, dashboardActive: true });
    };

    //Props for when a user updates his profile details
    updateUserDetails = (updateUserDetails) => {
      this.setState({ userDetails: updateUserDetails });
    };

    //Props to send a user search term from the navbar to the search page
    searchTerm = (searchTerm) => {
      this.setState({ searchTerm: searchTerm });
    };

    //Props to send the details of a track from a page to the bottom navbar (AudioPlayer.js)
    playTrack = (trackArr) => {
      this.setState({ trackArr: trackArr });
    };

    //Props to send the details of another user to the profile page
    sendClickedUser = (_id, username) => {
      this.setState({ user_id: _id, userUsername: username });
    };

    //Change state of landing page
    clickSignUp = (bool) => {
      this.setState({ signUpActive: bool, loginActive: !bool });
    };
    //Change state of landing page
    clickLogin = (bool) => {
      this.setState({ signUpActive: !bool, loginActive: bool });
    };

    //Resets all state and props
    logout = (logoutObj) => {
      let landingActive = logoutObj.landingActive;
      let dashboardActive = logoutObj.dashboardActive;
      this.setState({ landingActive: landingActive, dashboardActive: dashboardActive, loginActive: true, signUpActive: false, userDetails: [], searchTerm: '', trackArr: [], user_id: '', userUsername: '', });
    };

    render ()
    {

      let landingActive = this.state.landingActive;    
      let dashboardActive = this.state.dashboardActive;

      let userDetails = this.state.userDetails;
      let username = userDetails.username;

      let searchTerm = this.state.searchTerm;

      let trackArr = this.state.trackArr;

      let user_id = this.state.user_id;
      let userUsername = this.state.userUsername;
      let userProfileObj = { _id: user_id, username: userUsername };

      let loginActive = this.state.loginActive;
      let signUpActive = this.state.signUpActive;

      //Only active when the landing page is in a true state
      if (landingActive)
      {
            return (
              <div style={{ backgroundColor: 'ghostwhite', height: '100vh', float: 'center', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', overflowY: 'hidden' }} >
                <br></br>
                <br></br>
                {
                  loginActive &&
                  <div>
                      <Login signUpAct={this.clickSignUp} userDetails={this.userDetails} />
                  </div>
                }
                {
                  signUpActive &&
                  <div>
                    <SignUp loginAct={this.clickLogin} userDetails={this.userDetails} />
                  </div>
                }
              </div>
            );
      }
      else
      //Only active when the dashboard page is in a true state
      if (dashboardActive)
      {
              return (
              <div style={{ backgroundColor: 'ghostwhite', height: '100vh', float: 'center', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }} >
                <BrowserRouter>
                <Nav userDetails={userDetails} searchTerm={this.searchTerm} sendClickedUser={this.sendClickedUser} logout={this.logout} />
                <AudioPlayer trackArr={trackArr} />
                <Switch>
                  <Home exact path='/' userDetails={userDetails} playTrack={this.playTrack} sendClickedUser={this.sendClickedUser} updateUserDetails={this.updateUserDetails} />
                  <Music exact path='/music' userDetails={userDetails} playTrack={this.playTrack} sendClickedUser={this.sendClickedUser} />
                  <Search exact path='/search' userDetails={userDetails} searchTerm={searchTerm} playTrack={this.playTrack} sendClickedUser={this.sendClickedUser} updateUserDetails={this.updateUserDetails} />
                  <Profile exact path={`/${username}`} userDetails={userDetails} playTrack={this.playTrack} sendClickedUser={this.sendClickedUser} />
                  <Settings exact path='/settings' userDetails={userDetails} editUserDetails={this.userDetails} sendClickedUser={this.sendClickedUser} />
                  <UserProfile exact path={`/${userUsername}`} userDetails={userDetails} userProfileObj={userProfileObj} playTrack={this.playTrack} updateUserDetails={this.updateUserDetails} sendClickedUser={this.sendClickedUser} />
                </Switch>
                </BrowserRouter>
              </div>
            );
      }
      
    };
};

export default App;