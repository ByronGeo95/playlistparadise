//Created by: Byron Georgopoulos
//Created on: 04/11/2021
//Last Modified on: 07/02/2022
/*Description: Settings Page Component*/

import React from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Spinner from 'react-bootstrap/Spinner';

import { Link } from 'react-router-dom';

class UserProfile extends React.Component {

    constructor (props)
    {
        super(props);

        this.state = {
          userProfilePlaylists: [],
          userProfileDetails: {},
          profileActive: true,
          playlistsActive: false,
          playlistClicked: false,
          clickedTracks: [],
          clicked_id: '',
          clickedName: '',
          clickedDesc: '',
          clickedDate: '',
          clickedImg: '',
          clickedUsername: '',
          clickedLen: '',
          clickedLikes: [],
          likeModalBool: false,
          likedPlaylistUsers: [],
          clickLikePlaylistModalBool: false,
          clickUnlikePlaylistModalBool: false,
          userLikedPlaylists: [],
          adminPicks_id: [],
        };
    };

    componentDidMount = () => {
        let userProfileObj = this.props.userProfileObj;
        let _id = userProfileObj._id;
        let username = userProfileObj.username;

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
                userProfilePlaylists: result,
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
                userProfileDetails: result,
            });
        })
        .then(this.fetchLikedPlaylists);

        //Fetch requests to fetch the 'admin picks' (editors picks) playlists
        fetch('/fetchAdminPicks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: _id }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.setState({
                            adminPicks_id: result,
                        });
        });

    };

    //Fetch a users liked playlists
    fetchLikedPlaylists = () => {
        let userProfileDetails = this.state.userProfileDetails;
        let likedPlaylists = userProfileDetails.likedPlaylists;

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

    //Profile active (default)
    profileActive = () => {
        this.setState({ profileActive: true, playlistsActive: false });
    };

    //Playlists active
    playlistsActive = () => {
        this.setState({ profileActive: false, playlistsActive: true });
    };

    //Updates the state of the currently clicked playlist
    clickPlaylistName = (_id, name, desc, date, username, img, tracks, likes) => {
        let clickedLen = tracks.length;
        this.setState({ clicked_id: _id, clickedName: name, clickedDesc: desc, clickedDate: date, clickedImg: img, clickedUsername: username, clickedTracks: tracks, clickedLen: clickedLen, clickedLikes: likes, playlistClicked: true, profileActive: false, playlistsActive: true });
    };

    //Send (as props) the details of a track via the App.js file
    playTrack = (name, artist, col, artwork, preview) => {
        let trackObj = {
            name: name,
            artist: artist,
            col: col,
            artwork: artwork,
            preview: preview 
        };
        this.props.playTrack(trackObj);
    };

    //When a user likes a playlist
    clickLikePlaylist = (_id, username) => {
        this.setState({ clickLikePlaylistModalBool: true });
        let userDetails = this.props.userDetails;
        let user_id = userDetails._id;

        fetch('/clickLikePlaylist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: _id, user_id: user_id }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.setState({
                clickedLikes: result.likes,
            });
        }).then(fetch('/addToLikedPlaylists', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ _id: _id, user_id: user_id }),
                    })
                    .then(res => res.json())
                    .then(
                    (result) => {
                    this.props.updateUserDetails(result);
                    })
                ).then(fetch('/fetchUserPlaylists', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: username }),
                        })
                        .then(res => res.json())
                        .then(
                        (result) => {
                        this.setState({
                            userProfilePlaylists: result,
                            clickLikePlaylistModalBool: false,
                        });
                    })
                );        
    };

    //When a user unlikes a playlist
    unlikeLikedPlaylist = (clicked_id, clickedUsername) => {
        this.setState({ clickUnlikePlaylistModalBool: true });
        let userDetails = this.props.userDetails;
        let _id = userDetails._id;

        fetch('/unlikeLikedPlaylist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: _id, playlist_id: clicked_id }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.setState({
                            clickedLikes: result.likes,
                        });
            })

        fetch('/unlikeLikedPlaylistUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: _id, playlist_id: clicked_id }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.props.updateUserDetails(result);
            });

            fetch('/fetchUserPlaylists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: clickedUsername }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.setState({
                userProfilePlaylists: result,
                clickUnlikePlaylistModalBool: false,
            });
        });

    };

    //When the likes of a playlist is clicked on
    openLikeModal = (clickedLikes) => {
            
        //Fetch request to get the details of all the users that like a playlist
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

    //Change the state of the like modal to false (closes the like modal)
    closeLikeModal = () => {
        this.setState({ likeModalBool: false });
    };

    //If another user's profile is clicked on when already on a user's profile page
    getNewUserDetails = (_id, username) => {
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
                userProfilePlaylists: result,
            });
        });

        //Fetch request to get the user's details from the MongoDB database (using username)
        fetch('/fetchUserDetailsUsername', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.props.sendClickedUser(result._id, result.username);
            this.setState({
                            userDetails: result,
                        });
        }).then(this.fetchLikedPlaylists);
        
    };

    //Set a playlist as admin pick (only avai. when acc. type is set to 'dev')
    setPlaylistAsAdminPick = (clicked_id) => {

        fetch('/addToAdminPick', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clicked_id: clicked_id }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            let adminPicks_id = this.state.adminPicks_id;
            adminPicks_id.push(result.playlist_id);
            this.setState({
                adminPicks_id: adminPicks_id,
            });
        });

    };

    render ()
    {
        let userProfilePlaylists = this.state.userProfilePlaylists;
        let userProfileDetails = this.state.userProfileDetails;
        let profileUsername = userProfileDetails.username;
        let userLikedPlaylists = this.state.userLikedPlaylists;
        let img;

        if (userProfileDetails !== '')
        {
            img = userProfileDetails.img;
        }

        let profileActive = this.state.profileActive;
        let playlistsActive = this.state.playlistsActive;
        let userProfilePlaylistsLen = userProfilePlaylists.length;
        let mapPlaylistNames;

        if (userProfilePlaylists)
        {
        mapPlaylistNames = userProfilePlaylists.map(playlist => {
            return (
            <div>
                <Button onClick={this.clickPlaylistName.bind(this, playlist._id, playlist.name, playlist.desc, playlist.date, playlist.username, playlist.img, playlist.tracks, playlist.likes)} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px' }} >{playlist.name}</Button> 
            </div>
            )
        });
        }

        let userLikedPlaylistsLen = userLikedPlaylists.length;
        let mapLikedPlaylistsNames;

        if (userLikedPlaylists)
        {
            mapLikedPlaylistsNames = userLikedPlaylists.map(playlist => {
                return (
                    <div>
                         <Button onClick={this.clickPlaylistName.bind(this, playlist._id, playlist.name, playlist.desc, playlist.date, playlist.username, playlist.img, playlist.tracks, playlist.likes)} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px' }} >{playlist.name}</Button> 
                    </div>
                )
            });
        }

        let clicked_id = this.state.clicked_id;
        let clickedTracks = this.state.clickedTracks;
        let clickedName = this.state.clickedName;
        let clickedDesc = this.state.clickedDesc;
        let clickedDate = this.state.clickedDate;
        let clickedImg = this.state.clickedImg;
        let clickedUsername = this.state.clickedUsername;
        let clickedLen = this.state.clickedLen;
        let clickedLikes = this.state.clickedLikes;

        let clickedDateSub = clickedDate.substring(0,10);

        let userDetails = this.props.userDetails;
        let _id = userDetails._id;
        let likeBtnBool = false;

        if (clickedLikes.includes(_id))
        {
            likeBtnBool = true;
        }

        let mapClickedTracks = clickedTracks.map((song, pos) => {
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
                            <Button onClick={this.playTrack.bind(this, song.name, song.artist, song.col, song.artwork.replace('100x100', '1200x1200'), song.preview )} variant='success' >Play</Button>
                        </Col>
                    </Row>
                    </Container>
                    <hr></hr>
                </div>
            )
        });

        let adminStatBool = userProfileDetails.admin;
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
                                <Link style={{ pointerEvents: user.username == userDetails.username || user.username == profileUsername ? 'none': 'auto', color: user.username == userDetails.username || user.username == profileUsername ? 'black': '' }} onClick={this.getNewUserDetails.bind(this, user._id, user.username)} exact to={`/${user.username}`} >{user.username}</Link>
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
                        <div style={{ fontSize: '20px' }} >
                            Likes
                            <hr></hr>
                            {mapLikedPlaylistUsers}
                            <Button onClick={this.closeLikeModal} variant="danger">Cancel</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );

        let clickLikePlaylistModalBool = this.state.clickLikePlaylistModalBool;

        let clickLikePlaylistModal = (
            <div>
                <Modal show={clickLikePlaylistModalBool} style={{ textAlign: 'center', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} centered animation size='md' >
                    <Modal.Body>
                        <div style={{ fontSize: '20px' }} >
                            <Spinner animation="border" variant="primary" /> Liking Playlist...
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );

        let clickUnlikePlaylistModalBool = this.state.clickUnlikePlaylistModalBool;

        let clickunlikePlaylistModal = (
            <div>
                <Modal show={clickUnlikePlaylistModalBool} style={{ textAlign: 'center', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} centered animation size='md' >
                    <Modal.Body>
                        <div style={{ fontSize: '20px' }} >
                            <Spinner animation="border" variant="danger" /> Unliking Playlist...
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );

        let adminPicks_id = this.state.adminPicks_id;
        
        return (
            <div className='App' style={{ float: 'center', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', paddingTop: '37.5px' }} >
            {likeModal}
            {clickLikePlaylistModal}
            {clickunlikePlaylistModal}
            <br></br>
            <Container style={{ borderStyle: 'solid', borderColor: 'lightgrey', borderWidth: '2px', width: '55%', backgroundColor: 'white', height: '748px' }} >
                <Row>
                    <Col style={{ borderRightStyle: 'solid', borderRightColor: 'lightgrey', borderWidth: '2px', height: '744px', overflowY: 'scroll' }} sm={3}>
                        <Button onClick={this.profileActive} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px' }} >Profile</Button>
                        <br></br>
                        <hr></hr>
                        <div style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginRight: '8.5px', fontSize: '14px', fontWeight: 'bold' }} >{userProfileDetails.username}'s Playlists({userProfilePlaylistsLen})</div>
                        {mapPlaylistNames}
                        <div style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginRight: '8.5px', fontSize: '14px', fontWeight: 'bold' }} >{userProfileDetails.username}'s Liked Playlists({userLikedPlaylistsLen})</div>
                        {mapLikedPlaylistsNames}
                    </Col>
                     <Col sm={9}>
                    <hr></hr>
                    {
                        profileActive &&
                        <div>
                                <Container>
                                <Row>
                                    <Col sm={3} >
                                        <Image src={img} style={{ width: '150px', height: '150px', objectFit: 'cover', objectPosition: '50 50', borderStyle: 'solid', borderColor: 'black', borderWidth: '0.5px' }} roundedCircle />
                                    </Col>
                                        <Col sm={9} >
                                        <div style={{ fontSize: '22px', marginLeft: 'auto', float: 'left', textAlign: 'left', paddingTop: '21.5px' }} >
                                            {userProfileDetails.username}
                                        </div>
                                        <br></br>
                                        <br></br>
                                        <div style={{ fontSize: '18px', marginLeft: 'auto', float: 'left', textAlign: 'left', width: '90%' }} >
                                            {userProfileDetails.name}
                                        </div>
                                        <div style={{ fontSize: '14px', marginLeft: 'auto', float: 'left', textAlign: 'left', width: '90%' }} >
                                            {userProfileDetails.bio}
                                        </div>
                                        <div style={{ fontSize: '14px', marginLeft: 'auto', float: 'left', textAlign: 'left' }} >
                                            {userProfileDetails.email} • {userProfileDetails.location} • {adminStat}
                                        </div>
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
                                            <Link style={{ pointerEvents: clickedUsername == userDetails.username || clickedUsername == profileUsername ? 'none': 'auto', color: clickedUsername == userDetails.username || clickedUsername == profileUsername ? 'black': '' }} onClick={this.getNewUserDetails.bind(this, clicked_id, clickedUsername)} exact to={`/${clickedUsername}`} >{clickedUsername}</Link> • {clickedLen} tracks • <Button style={{ fontSize: '14px', paddingTop: '0px', paddingBottom: '3px', paddingLeft: '0px', paddingRight: '0px' }} onClick={this.openLikeModal.bind(this, clickedLikes)} variant='link' >{clickedLikes.length} likes </Button> • {clickedDateSub}
                                        </div>
                                    </Col>
                                    <Col sm={3} >
                                    <Dropdown style={{ display: userDetails.username === clickedUsername && userDetails.accType !== 'dev' ? 'none': '' }} >
                                    <Dropdown.Toggle style={{ fontSize: '16px', paddingTop: '52px', float: 'left', textAlign: 'left', marginLeft: 'auto', paddingLeft: '0px' }} variant='link' >
                                        Options...
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu >
                                        {
                                            likeBtnBool &&
                                            <div>
                                                <Button style={{ display: userDetails.username === clickedUsername ? 'none': '' }} onClick={this.unlikeLikedPlaylist.bind(this,clicked_id, clickedUsername)} variant='link' >Unlike...</Button>
                                            </div>
                                        }
                                        {
                                            !likeBtnBool &&
                                            <div>
                                                <Button style={{ display: userDetails.username === clickedUsername ? 'none': '' }} onClick={this.clickLikePlaylist.bind(this, clicked_id, clickedUsername)} variant='link' >Like...</Button>
                                            </div>
                                        }
                                        <div style={{ display: userDetails.accType === 'dev' ? '': 'none', textAlign: 'left', float: 'left' }} >
                                             <hr style={{ display: userDetails.username === clickedUsername ? 'none': '' }} ></hr>
                                            <Button style={{ pointerEvents: adminPicks_id.includes(clicked_id) ? 'none': 'auto', color: adminPicks_id.includes(clicked_id) ? 'grey': '' }} onClick={this.setPlaylistAsAdminPick.bind(this, clicked_id)} variant='link' >+ Editor's Pick...</Button>
                                        </div>
                                    </Dropdown.Menu>
                                    </Dropdown>
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

export default UserProfile;