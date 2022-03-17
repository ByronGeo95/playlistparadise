//Created by: Byron Georgopoulos
//Created on: 31/10/2021
//Last Modified on: 01/02/2022
/*Description: Top Navbar Component*/

import React from 'react';

import { NavLink } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faUser, faCog, faSignOutAlt, faHome } from '@fortawesome/free-solid-svg-icons';

class Nav extends React.Component {

    constructor (props)
    {
        super(props);

        this.state = {
        userDetails: {},
        searchTerm: '',
        homeActive: true,
        musicActive: false,
        searchActive: false,
        profileActive: false,
        settingsActive: false,
        };
    };

    //When component mounts for the first time
    componentDidMount = () => {
        let userDetails = this.props.userDetails;
        let _id = userDetails._id;

        //Fetch request to get the user's details from the MongoDB database
        fetch('/fetchUserDetails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: _id }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.setState({
                            userDetails: result,
                        });
        });

    };

    //When the component updates
    componentDidUpdate = () => {
        let userDetails = this.props.userDetails;
        let _id = userDetails._id;

        //Fetch request to get the user's details from the MongoDB database
        fetch('/fetchUserDetails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: _id }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.setState({
                            userDetails: result,
                        });
        });
    };

    //Recieves search text box input and updates it's state
    handleSearchTerm = (event) => {
        let searchTerm = event.target.value;
        this.setState({ searchTerm: searchTerm });
    };

    //When the search button is pressed
    clickSearch = () => {
        let searchTerm = this.state.searchTerm;
        //Sends search term from state as props to App.js file
        this.props.searchTerm(searchTerm);
        this.setState({ homeActive: false, musicActive: false, searchActive: true, profileActive: false, settingsActive: false });
    };

    //When 'Home' is clicked on Navbar
    clickHome = () => {
        this.setState({ homeActive: true, musicActive: false, searchActive: false, profileActive: false, settingsActive: false });
    };

    //When 'Music' is clicked on Navbar
    clickMusic = () => {
        this.setState({ homeActive: false, musicActive: true, searchActive: false, profileActive: false, settingsActive: false });
    };

    //When 'Profile' is clicked on Navbar
    clickProfile = () => {
        this.setState({ homeActive: false, musicActive: false, searchActive: false, profileActive: true, settingsActive: false });
    };

    //When 'Settings' is clicked on Navbar
    clickSettings = () => {
        this.setState({ homeActive: false, musicActive: false, searchActive: false, profileActive: false, settingsActive: true });
    };

    //When 'Logout' is clicked on Navbar
    clickLogout = () => {
        let logoutObj = {
            landingActive: true,
            dashboardActive: false
        };
        //Send new state boolena as props to App.js file
        this.props.logout(logoutObj);
    };

    render ()
    {

        let userDetails = this.state.userDetails;
        let username = userDetails.username;
        let _id = userDetails._id;
        let img = userDetails.img;
        let searchTerm = this.state.searchTerm;

        let homeActive = this.state.homeActive;
        let musicActive = this.state.musicActive;
        let searchActive = this.state.searchActive;
        let profileActive = this.state.profileActive;
        let settingsActive = this.state.settingsActive;
        
        return (
            <div className='App' >
                    <Navbar fixed='top' style={{ backgroundColor: '#1A1A1A', height: '60px' }} >
                    <NavLink onClick={this.clickHome} exact to='/' style={{ marginLeft: '25%', fontSize: '20px', color: 'white', fontWeight: homeActive === true ? 'bold': '' }} ><FontAwesomeIcon icon={faHome} /> Home</NavLink>
                    <NavLink onClick={this.clickMusic} exact to='/music' style={{ marginLeft: '5rem', fontSize: '20px', color: 'white', fontWeight: musicActive === true ? 'bold': '' }} ><FontAwesomeIcon icon={faMusic} /> Music</NavLink>
                    <Form>
                    <Form.Group>
                    <Form.Control ref='searchBox' onChange={this.handleSearchTerm} type="text" placeholder="Search..." style={{ marginLeft: '5rem', height: '22.5px' }} />
                    </Form.Group>
                    </Form>
                    <NavLink onClick={this.clickSearch} exact to='/search' style={{ marginLeft: '5rem', fontSize: '20px', color: 'white', fontWeight: searchActive === true ? 'bold': '' }} >Search</NavLink>
                    <Dropdown style={{ textAlign: 'right', float: 'right', marginLeft: 'auto', marginRight: '25%', paddingTop: '2.5px' }} >
                        <Dropdown.Toggle variant="link" style={{ fontSize: '20px', color: 'white', float: 'right', textAlign: 'right', fontWeight: profileActive === true || settingsActive === true ? 'bold': '' }}  >
                            <div style={{ display: 'inline' }} ><Image src={img} style={{ width: '35px', height: '35px', objectFit: 'cover', objectPosition: '50 50' }} roundedCircle /></div><div style={{ display: 'inline', paddingLeft: '5px' }} >{username}</div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ marginLeft: '5rem', fontSize: '16px' }} >
                            <NavLink onClick={this.clickProfile} exact to={`/${username}`} style={{ paddingLeft: '15px', fontWeight: profileActive === true ? 'bold': '' }} ><FontAwesomeIcon icon={faUser} /> Profile</NavLink>
                            <hr></hr>
                            <NavLink onClick={this.clickSettings} exact to='/settings' style={{ paddingLeft: '15px', fontWeight: settingsActive === true ? 'bold': '' }} ><FontAwesomeIcon icon={faCog} /> Settings</NavLink>
                            <hr></hr>
                            <NavLink onClick={this.clickLogout} exact to='/' style={{ paddingLeft: '15px' }} ><FontAwesomeIcon icon={faSignOutAlt} /> Logout</NavLink>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar>
            </div>
        );
    };
};

export default Nav;