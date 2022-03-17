//Created by: Byron Georgopoulos
//Created on: 01/11/2021
//Last Modified on: 05/02/2022
/*Description: Profile Page Component*/

import React from 'react';

import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faPlay, faHeart } from '@fortawesome/free-solid-svg-icons';

class Profile extends React.Component {

    constructor (props)
    {
        super(props);

        this.state = {
        userDetails: {},
        userPlaylists: [],
        profileActive: true,
        playlistsActive: false,
        clickedTracks: [],
        clickedName: '',
        clickedDesc: '',
        clickedDate: '',
        clickedImg: '',
        clickedUsername: '',
        clickedLen: '',
        clickedLikes: [],
        likeModalBool: false,
        likedPlaylistUsers: [],
        userLikedPlaylists: [],
        };
    };

    componentDidMount = () => {

        let userDetails = this.props.userDetails;
        let _id = userDetails._id;
        let username = userDetails.username;

        //Fetch request to get the user's created playlists
        fetch('/fetchUserPlaylists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.setState({
                userPlaylists: result,
            });
        });

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
        })
        .then(this.fetchLikedPlaylists);

    };

    //Fetch a users liked playlists
    fetchLikedPlaylists = () => {
        let userDetails = this.state.userDetails;
        let likedPlaylists = userDetails.likedPlaylists;

        fetch('/fetchLikedPlaylists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ likedPlaylists: likedPlaylists }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.setState({
                            userLikedPlaylists: result,
                        });
            });
    };

    //When a users profile is active (clicked on, loads on default)
    profileActive = () => {
        this.setState({ profileActive: true, playlistsActive: false });
    };

    //When a users playlists are active
    playlistsActive = () => {
        this.setState({ profileActive: false, playlistsActive: true });
    };

    //Updates the state of the currently clicked playlist
    clickPlaylistName = (name, desc, date, username, img, tracks, likes) => {
        let clickedLen = tracks.length;
        this.setState({ clickedName: name, clickedDesc: desc, clickedDate: date, clickedImg: img, clickedUsername: username, clickedTracks: tracks, clickedLen: clickedLen, clickedLikes: likes, profileActive: false, playlistsActive: true });
    };

    //Send (as props) the details of a track via the App.js file
    playTrack = (name, artist, col, artwork, preview) => {
        console.log(`In playTrack\nName: ${name}\nArtist: ${artist}\nCol: ${col}, artwork: ${artwork}\npreview: ${preview}`);
        let trackObj = {
            name: name,
            artist: artist,
            col: col,
            artwork: artwork,
            preview: preview 
        };
        this.props.playTrack(trackObj);
    };

    //Open the like the modal
    openLikeModal = (clickedLikes) => {
        fetch('/getLikedUserDetails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clickedLikes: clickedLikes }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.setState({
                            likedPlaylistUsers: result,
                            likeModalBool: true,
                        });
            });
    };

    //Close the like modal
    closeLikeModal = () => {
        this.setState({ likeModalBool: false });
    };

    //Send (as props) the details of a clicked user
    sendClickedUser = (_id, username) => {
        this.props.sendClickedUser(_id, username);
    };

     //Send (as props) the details of a clicked user (using username)
    sendClickedUserUsername = (username) => {
        //Fetch request to get the details of a user using only their username
        fetch('/fetchUserDetailsUsername', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.props.sendClickedUser(result._id, result.username);
            })
    };

    render ()
    {
        let profileActive = this.state.profileActive;
        let playlistsActive = this.state.playlistsActive;
        let userDetails = this.state.userDetails;
        let img;

        if (userDetails !== '')
        {
            img = userDetails.img;
        }

        let userPlaylists = this.state.userPlaylists;
        let userPlaylistsLen = userPlaylists.length;

        let mapPlaylistNames;

        if (userPlaylists)
        {
        mapPlaylistNames = userPlaylists.map(playlist => {
            return (
            <div>
            <Button onClick={this.clickPlaylistName.bind(this, playlist.name, playlist.desc, playlist.date, playlist.username, playlist.img, playlist.tracks, playlist.likes)} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px' }} >{playlist.name}</Button> 
            </div>
            )
        });
        }

        let userLikedPlaylists = this.state.userLikedPlaylists;
        let userLikedPlaylistsLen = userLikedPlaylists.length;

        let mapLikedPlaylistsNames;

        if (userLikedPlaylists)
        {
            mapLikedPlaylistsNames = userLikedPlaylists.map(playlist => {
                return (
                    <div>
                         <Button onClick={this.clickPlaylistName.bind(this, playlist.name, playlist.desc, playlist.date, playlist.username, playlist.img, playlist.tracks, playlist.likes)} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px' }} >{playlist.name}</Button> 
                    </div>
                )
            });
        }

        let clickedTracks = this.state.clickedTracks;
        let clickedName = this.state.clickedName;
        let clickedDesc = this.state.clickedDesc;
        let clickedDate = this.state.clickedDate;
        let clickedImg = this.state.clickedImg;
        let clickedUsername = this.state.clickedUsername;
        let clickedLen = this.state.clickedLen;
        let clickedLikes = this.state.clickedLikes;

        let clickedDateSub = clickedDate.substring(0,10);

        let mapClickedTracks;

        if (clickedTracks)
        {
            mapClickedTracks = clickedTracks.map((song, pos) => {
            return (
                <div>
                 <Container >
                    <Row>
                        <Col sm={3} >
                            <Image src={song.artwork.replace('100x100', '1200x1200')} style={{ width: '100px' }} />
                        </Col>
                        <Col sm={6} >
                            <div style={{ fontSize: '20px', marginLeft: 'auto', float: 'left', textAlign: 'left' }} >
                                {song.name}
                            </div>
                            <br></br>
                            <br></br>
                            <div style={{ fontSize: '15px', marginLeft: 'auto', float: 'left', textAlign: 'left' }} >
                                {song.artist}
                                <br></br>
                                {song.col}
                            </div>
                        </Col>
                        <Col sm={3} >
                            <Button style={{ borderRadius: '50%', width: '50px', height: '50px', marginTop: '25px' }} onClick={this.playTrack.bind(this, song.name, song.artist, song.col, song.artwork.replace('100x100', '1200x1200'), song.preview )} variant='outline-success' ><FontAwesomeIcon style={{ fontSize: '16px', position: 'absolute', top: '17.5%', left: '47%', marginTop: '25px' }} icon={faPlay} /></Button>
                        </Col>
                    </Row>
                    </Container>
                    <hr></hr>
                </div>
            )
        });
        }

        let adminStatBool = userDetails.admin;
        let adminStat = '';

        if (adminStatBool === false)
        {
            adminStat = 'Non-Admin Account';
        }

        if (adminStatBool === true)
        {
            adminStat = 'Admin Account';
        }

        let likeModalBool = this.state.likeModalBool;
        let likedPlaylistUsers = this.state.likedPlaylistUsers;

        let mapLikedPlaylistUsers = likedPlaylistUsers.map((user) => {
            return (
                    <div>
                    <Container>
                    <Row>
                        <Col sm={3} style={{ float: 'right', textAlign: 'right', marginRight: '0px', paddingRight: '0px' }} >
                            <Image src={user.img} style={{ width: '80px', height: '80px', objectFit: 'cover', objectPosition: '50 50', float: 'right', textAlign: 'right' }} roundedCircle />
                        </Col>
                        <Col sm={6} >
                            <div style={{ width: '200px', fontSize: '17px', float: 'left', textAlign: 'left', marginLeft: 'auto', paddingTop: '15px' }} >
                                <Link style={{ pointerEvents: user.username === userDetails.username ? 'none': 'auto', color: user.username === userDetails.username ? 'black': '' }} onClick={this.sendClickedUser.bind(this, user._id, user.username)} exact to={`/${user.username}`} >{user.username}</Link>
                            </div>
                            <div style={{ width: '200px', fontSize: '15px', float: 'left', textAlign: 'left', marginLeft: 'auto' }} >
                                {user.name}
                            </div>
                        </Col>
                        <Col sm={3} >

                        </Col>
                    </Row>
                    </Container>
                    <hr></hr>
            </div>
            )
        });

        let likeModal = (
            <div>
                <Modal show={likeModalBool} style={{ textAlign: 'center', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} centered animation size='md' >
                    <Modal.Body>
                        <div style={{ height: '400px' }} >
                            <Row>
                                <Col style={{ float: 'right', textAlign: 'right', marginRight: '0px', paddingRight: '0px', paddingLeft: '100px', paddingRight: '5px', paddingTop: '35px' }} >
                                    <div style={{ position: 'absolute', bottom: '22.5%', left: '82.5%' }} >
                                        <FontAwesomeIcon style={{ fontSize: '30px' }} icon={faHeart} />
                                    </div>
                                </Col>
                                <Col style={{ float: 'left', textAlign: 'left', marginLeft: '0px', paddingLeft: '0px' }} >
                                    <div style={{ position: 'absolute', bottom: '20%', left: '2.5%', fontSize: '22.5px', paddingBottom: '0px', marginBottom: '0px' }} >
                                         {clickedLikes.length} Likes
                                    </div>
                                </Col>
                                <Col style={{ float: 'right', textAlign: 'right', marginRight: '0px', paddingRight: '0px' }} >
                                    <div style={{ position: 'absolute', bottom: '7.5%', left: '65%' }} >
                                        <Button style={{ color: 'red', marginTop: '0px', paddingTop: '0px' }} onClick={this.closeLikeModal} variant='link'><FontAwesomeIcon style={{ fontSize: '30px' }} icon={faTimesCircle} /></Button>
                                    </div>
                                </Col>
                            </Row>
                            <hr style={{ paddingTop: '0px', marginTop: '0px', backgroundColor: 'black' }} ></hr>
                            <div style={{ height: '352.5px', overflowY: 'scroll' }} >
                                {mapLikedPlaylistUsers}
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );

        return (
            <div className='App' style={{ float: 'center', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', paddingTop: '37.5px' }} >
            {likeModal}
            <br></br>
            <Container style={{ borderStyle: 'solid', borderColor: 'lightgrey', borderWidth: '2px', width: '55%', backgroundColor: 'white', height: '748px' }} >
                <Row>
                    <Col style={{ borderRightStyle: 'solid', borderRightColor: 'lightgrey', borderWidth: '2px', height: '744px', overflowY: 'scroll' }} sm={3}>
                        <Button onClick={this.profileActive} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px' }} >Profile</Button>
                        <br></br>
                        <hr></hr>
                        <div style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginRight: '8.5px', fontSize: '14px', fontWeight: 'bold' }} >{userDetails.username}'s Playlists({userPlaylistsLen})</div>
                        {mapPlaylistNames}
                        <div style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginRight: '8.5px', fontSize: '14px', fontWeight: 'bold' }} >{userDetails.username}'s Liked Playlists({userLikedPlaylistsLen})</div>
                        {mapLikedPlaylistsNames}
                    </Col>
                    <Col sm={9} style={{ paddingTop: '10px' }} >
                    {
                        profileActive &&
                        <div>
                                <Container>
                                <Row>
                                    <Col sm={3} >
                                        <Image src={img} style={{ width: '150px', height: '150px', objectFit: 'cover', objectPosition: '50 50', borderStyle: 'solid', borderColor: 'black', borderWidth: '0.5px' }} roundedCircle />
                                    </Col>
                                        <Col sm={7} >
                                        <div style={{ fontSize: '22px', marginLeft: 'auto', float: 'left', textAlign: 'left', paddingTop: '21.5px' }} >
                                            {userDetails.username}
                                        </div>
                                        <br></br>
                                        <br></br>
                                        <div style={{ fontSize: '18px', marginLeft: 'auto', float: 'left', textAlign: 'left', width: '90%' }} >
                                            {userDetails.name}
                                        </div>
                                        <div style={{ fontSize: '14px', marginLeft: 'auto', float: 'left', textAlign: 'left', width: '90%' }} >
                                            {userDetails.bio}
                                        </div>
                                        <div style={{ fontSize: '14px', marginLeft: 'auto', float: 'left', textAlign: 'left' }} >
                                            {userDetails.email} • {userDetails.location}
                                        </div>
                                    </Col>
                                    <Col sm={2} >
                                       
                                    </Col>
                                </Row>
                            </Container>
                            <hr></hr>
                        </div>
                    }
                    {
                        playlistsActive &&
                        <div>
                            <Container>
                                <Row>
                                    <Col sm={3} >
                                        <Image src={clickedImg} style={{ width: '125px', height: '125px', objectFit: 'cover', objectPosition: '50 50' }} />
                                    </Col>
                                    <Col sm={6} >
                                        <div style={{ fontSize: '22px', marginLeft: 'auto', float: 'left', textAlign: 'left', paddingTop: '20px' }} >
                                            {clickedName}
                                        </div>
                                        <br></br>
                                        <br></br>
                                        <div style={{ fontSize: '14px', marginLeft: 'auto', float: 'left', textAlign: 'left', width: '90%' }} >
                                            {clickedDesc}
                                        </div>
                                        <div style={{ fontSize: '13px', marginLeft: 'auto', float: 'left', textAlign: 'left' }} >
                                            <Link style={{ pointerEvents: clickedUsername === userDetails.username ? 'none': 'auto', color: clickedUsername === userDetails.username ? 'black': '' }} onClick={this.sendClickedUserUsername.bind(this, clickedUsername)} exact to={`/${clickedUsername}`} >{clickedUsername}</Link> • {clickedLen} tracks • <Button style={{ fontSize: '14px', paddingTop: '0px', paddingBottom: '3px', paddingLeft: '0px', paddingRight: '0px' }} onClick={this.openLikeModal.bind(this, clickedLikes)} variant='link' >{clickedLikes.length} <FontAwesomeIcon icon={faHeart} /> </Button> • {clickedDateSub}
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                            <hr></hr>
                            <div style={{ height: '560px', overflowY: 'scroll' }}  >
                                {mapClickedTracks}
                            </div>
                        </div>
                    }
                    </Col>
                </Row>
            </Container>
            </div>
        );
    };
};

export default Profile;