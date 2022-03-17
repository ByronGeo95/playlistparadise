//Created by: Byron Georgopoulos
//Created on: 31/10/2021
//Last Modified on: 02/02/2022
/*Description: Music Page Component*/

import React from 'react';

import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Spinner from 'react-bootstrap/Spinner';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faPlusCircle, faTimesCircle, faEdit, faHouseUser, faHeart, faEllipsisH, faTrashAlt, faHeartBroken, faPlay } from '@fortawesome/free-solid-svg-icons';
import { faDev } from '@fortawesome/free-brands-svg-icons';

class Music extends React.Component {

    constructor (props)
    {
        super(props);

        this.state = {
        userDetails: {},
        userPlaylists: [],
        userLikedPlaylists: [],
        createPlaylistModalBool: false,
        playlistName: '',
        playlistDesc: '',
        playlistImg: '',
        clicked_id: '',
        clickedTracks: [],
        clickedName: '',
        clickedDesc: '',
        clickedDate: '',
        clickedImg: '',
        clickedUsername: '',
        clickedLen: '',
        clickedLikes: [],
        playlistClicked: false,
        editPlaylistModalBool: false,
        newPlaylistName: '',
        newPlaylistDesc: '',
        newPlaylistImg: '',
        likeModalBool: false,
        likedPlaylistUsers: [],
        createPlaylistLoad: false,
        editPlaylistLoad: false,
        clickDelPlaylistBool: false,
        clickUnlikePlaylistBool: false,
        fetchUserPlaylistsBool: true,
        fetchUserLikedPlaylistBool: true,
        playlistDate: '',
        adminPicks_id: [],
        playlistImgHoverBool: false,
        };
    };

    componentDidMount = () => {
        let userDetails = this.props.userDetails;
        let _id = userDetails._id;
        let username = userDetails.username;
        let likedPlaylists = userDetails.likedPlaylists;

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
                            fetchUserPlaylistsBool: false,
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
        });

        //Fetch request to get the user's liked playlists
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
                            fetchUserLikedPlaylistBool: false,
                        });
            });
        
        //Fetch request to get a list of the admin picks (editor's picks)
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

    //Recieves playlist name text box input and updates it's state
    handlePlaylistName = (event) => {
        let playlistName = event.target.value;
        this.setState({ playlistName: playlistName });
    };

    //Recieves playlist description text box input and updates it's state
    handlePlaylistDesc = (event) => {
        let playlistDesc = event.target.value;
        this.setState({ playlistDesc: playlistDesc });
    };

    //Recieves playlist image input and updates it's state
    handleImgSelect = (event) => {
        if (event.target.files && event.target.files[0])
        {
            let reader = new FileReader();
            reader.onload = (e) => {
            this.setState({playlistImg: e.target.result});
        };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    //Recieves edit playlist name text box input and updates it's state
    handlePlaylistNameEdit = (event) => {
        let newPlaylistName = event.target.value;
        this.setState({ newPlaylistName: newPlaylistName });
    };

    //Recieves edit playlist description text box input and updates it's state
    handlePlaylistDescEdit = (event) => {
        let newPlaylistDesc = event.target.value;
        this.setState({ newPlaylistDesc: newPlaylistDesc });
    };

    //Recieves edit playlist image input and updates it's state
    handleImgEditSelect = (event) => {
        if (event.target.files && event.target.files[0])
        {
            let reader = new FileReader();
            reader.onload = (e) => {
            this.setState({newPlaylistImg: e.target.result});
        };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    //When edit playlist button is clicked
    editPlaylist = () => {
        let clicked_id = this.state.clicked_id;

        let newPlaylistName = this.state.newPlaylistName;
        let newPlaylistDesc = this.state.newPlaylistDesc;
        let newPlaylistImg = this.state.newPlaylistImg;

        let clickedName = this.state.clickedName;
        let clickedDesc = this.state.clickedDesc;

        let userDetails = this.state.userDetails;
        let username = userDetails.username;

        let name;
        if (newPlaylistName === '')
        {
            name = clickedName;
        }
        else
        if (newPlaylistName !== '')
        {
            name = newPlaylistName;
        }

        let desc;
        if (newPlaylistDesc === '')
        {
            desc = clickedDesc;
        }
        else
        if (newPlaylistDesc !== '')
        {
            desc = newPlaylistDesc;
        }

        //Fetch request to update the details of an existing playlist in the MongoDB database
        fetch('/editPlaylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: clicked_id, name: name, desc: desc, img: newPlaylistImg }),
        })
        .then(this.setState({ editPlaylistLoad: true }))
        .then(res => res.json())
        .then(
        (result) => {
        this.setState({
                        clickedName: result.name,
                        clickedDesc: result.desc,
                        clickedImg: result.img,
                    });
        })
        //Fetch request to get the user's created playlists
        .then(
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
                            editPlaylistLoad: false,
                            editPlaylistModalBool: false,
                            newPlaylistImg: '',
                            clickDelPlaylistBool: false,
                        });
            })
        );

    };

    //Fallback funtion to fetch user created playlists
    fetchUserPlaylists = () => {
        let userDetails = this.props.userDetails;
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
                            editPlaylistLoad: false,
                            editPlaylistModalBool: false,
                            newPlaylistImg: '',
                            clickDelPlaylistBool: false,
                        });
            });

    };

    //Fallback function to fetch user liked playlists
    fetchLikedPlaylists = (clicked_id) => {
        let userDetails = this.props.userDetails;
        let likedPlaylists = userDetails.likedPlaylists;
        let pos = likedPlaylists.indexOf(clicked_id);
        likedPlaylists.splice(pos, 1);
        
        //Fetch request to get the user's liked playlists
        fetch('/fetchLikedPlaylists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ likedPlaylists: likedPlaylists }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.setState({
                            clickUnlikePlaylistBool: false,
                            userLikedPlaylists: result,
                        });
            });

    };

    //When the create playlist button is clicked
    createPlaylist = () => {
        let playlistName = this.state.playlistName;
        let playlistDesc = this.state.playlistDesc;
        let playlistImg = this.state.playlistImg;
        let playlistDate = this.state.playlistDate;
        let userDetails = this.state.userDetails;
        let username = userDetails.username;

        //Fetch request to create a new playlist in the MongoDB database
        fetch('/createPlaylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, playlistName: playlistName, playlistDesc: playlistDesc, playlistDate: playlistDate, playlistImg: playlistImg }),
        })
        .then(res => res.json())
        .then(this.setState({ createPlaylistLoad: true }))
        .then(
        (result) => {
        let userPlaylists = this.state.userPlaylists;
        userPlaylists.push(result);
        this.setState({
                        userPlaylists: userPlaylists,
                        createPlaylistModalBool: false,
                        createPlaylistLoad: false,
                    });
        });

    };

    //Update the state of the of the currently selected (clicked on) playlist
    clickPlaylistName = (_id, name, desc, date, img, username, tracks, likes) => {
        let clickedLen = tracks.length;
        this.setState({ clicked_id: _id, clickedName: name, clickedDesc: desc, clickedDate: date, clickedImg: img, clickedUsername: username, clickedTracks: tracks, clickedLen: clickedLen, clickedLikes: likes, playlistClicked: true });
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

    //When the delete track button is clicked
    deleteTrack = (pos, clicked_id) => {

        //Fetch reuqest to remove a specific track from an existing playlist
        fetch('/deleteTrackFromPlaylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: clicked_id, pos: pos }),
        });
        
        let clickedTracks = this.state.clickedTracks;
        //Remove the specific track from state, and update the state
        clickedTracks.splice(pos, 1);
        this.setState({ clickedTracks: clickedTracks });
    };

    //Open the edit playlist modal
    clickEditPlaylist = () => {
        this.setState({ editPlaylistModalBool: true });
    };

    //When the delete playlist button is clicked
    clickDelPlaylist = () => {
        let clicked_id = this.state.clicked_id;

        //Fetch request to delete a playlist from the MongoDB database
        fetch('/deletePlaylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: clicked_id }),
        })
        .then(this.setState({ clickDelPlaylistBool: true }))
        .then(res => res.json())
        .then(
        (result) => {
        this.setState({
                        playlistClicked: false,
                    });
        })
        //Call the function to fetch the user's playlists again, after the deletion
        .then(this.fetchUserPlaylists);

    };

    //Close the edit playlist modal
    closeEditPlaylist = () => {
        this.setState({ editPlaylistModalBool: false, newPlaylistImg: '' });
    };

    //Open the create playlist modal
    clickCreatePlaylist = () => {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let mins = date.getMinutes();

        //Create the new playlists date
        if (month.toString().length < 2)
        {
            month = `0${month}`;
        }

        if (day.toString().length < 2)
        {
            day = `0${day}`;
        }

        if (hours.toString().length < 2)
        {
            hours = `0${hours}`;
        }

        if (mins.toString().length < 2)
        {
            mins = `0${mins}`;
        }

        let playlistDate = `${year}-${month}-${day}T${hours}:${mins}`;

        this.setState({ createPlaylistModalBool: true, playlistDate: playlistDate });
    };

    //Close the create playlist modal
    closeCreatePlaylist = () => {
        this.setState({ createPlaylistModalBool: false });
    };

    //Open the like modal
    openLikeModal = (clickedLikes) => {
        
        //Fetch request to get the details of all the user's that have liked a playlist
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

    //Unlike an already liked playlist
    unlikeLikedPlaylist = (clicked_id) => {
        let userDetails = this.props.userDetails;
        let _id = userDetails._id;

        //Fetch request to remove a user's ID from the list of ID's in the playlist collection on MongoDB
        fetch('/unlikeLikedPlaylist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: _id, playlist_id: clicked_id }),
            });

        //Fetch request to remove a playlist ID from the list of ID's in the user collection on MongoDB
        fetch('/unlikeLikedPlaylistUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: _id, playlist_id: clicked_id }),
            })
            .then(this.setState({ clickUnlikePlaylistBool: true }))
            .then(res => res.json())
            .then(
            (result) => {
            this.setState({
                            playlistClicked: false,
                        });
            })
            .then(this.fetchLikedPlaylists(clicked_id));

    };   

    //Send (as props) the details of a clciked user
    sendClickedUser = (_id, username) => {
        this.props.sendClickedUser(_id, username);
    };

    //Send (as props) the details of a clicked user (using username)
    sendClickedUserLink = (username) => {

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
        });

    };

    //Set a playlist as an admin pick (editor's pick)
    setPlaylistAsAdminPick = (clicked_id) => {
        this.setState({ playlistAsAdminPickModalBool: true });

        //Fetch request to add a playlist to the list of admin picks
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

    //Set state of the playlist image being hovered over to true
    handleImgMouseEnter = () => {
        this.setState({ playlistImgHoverBool: true });
    };

    //Set state of the playlist image being hovered over to false
    handleImgMouseLeave = () => {
        this.setState({ playlistImgHoverBool: false });
    };

    //Slices extra characters off of track names of they're too long
    trimName = (name) => {
        let trimName = '';
        if (name.length >= 27)
        {
            trimName = name.substring(0,27) + '...';
        }
        else
        {
            trimName = name;
        }
        return trimName;
    };

    //Slices extra characters off of track artists of they're too long
    trimArtist = (artist) => {
        let trimArtist = '';
        if (artist.length >= 35)
        {
            trimArtist = artist.substring(0,35) + '...';
        }
        else
        {
            trimArtist = artist;
        }
        return trimArtist;
    };

    //Slices extra characters off of track collections (albums) of they're too long
    trimCol = (col) => {
        let trimCol = '';
        if (col.length >= 35)
        {
            trimCol = col.substring(0,35) + '...';
        }
        else
        {
            trimCol = col;
        }
        return trimCol;
    };

    render ()
    {
        let userDetails = this.state.userDetails;
        let clicked_id = this.state.clicked_id;
        let userPlaylists = this.state.userPlaylists;
        let mapPlaylistNames;
        let userPlaylistsCount = userPlaylists.length;
        let exceededPlaylistCount = false;

        if (userDetails.admin === false && userPlaylistsCount >= 3)
        {
            exceededPlaylistCount = true;
        }

        if (userPlaylists)
        {
        mapPlaylistNames = userPlaylists.map(playlist => {
            return (
            <div>
            <Button onClick={this.clickPlaylistName.bind(this, playlist._id, playlist.name, playlist.desc, playlist.date, playlist.img, playlist.username, playlist.tracks, playlist.likes)} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px', backgroundColor: clicked_id === playlist._id ? '#303030': '', color: clicked_id === playlist._id ? 'white': '' }} ><div style={{ visibility: clicked_id === playlist._id ? '': 'hidden', display: 'inline-block' }} >•</div> {playlist.name}</Button> 
            </div>
            )
        });
        }

        let userLikedPlaylists = this.state.userLikedPlaylists;
        let userLikedPlaylistsCount = userLikedPlaylists.length;
        let mapLikedPlaylistsNames;

        if (userLikedPlaylists)
        {
            mapLikedPlaylistsNames = userLikedPlaylists.map(playlist => {
            return (
            <div>
            <Button onClick={this.clickPlaylistName.bind(this, playlist._id, playlist.name, playlist.desc, playlist.date, playlist.img, playlist.username, playlist.tracks, playlist.likes)} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px', backgroundColor: clicked_id === playlist._id ? '#303030': '', color: clicked_id === playlist._id ? 'white': '' }} ><div style={{ visibility: clicked_id === playlist._id ? '': 'hidden', display: 'inline-block' }} >•</div> {playlist.name}</Button> 
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
        let clickedDateTime = clickedDate.substring(11, 16);

        let username = userDetails.username;
        let isMyPlaylistBool = true;

        if (username !== clickedUsername)
        {
            isMyPlaylistBool = false;
        }

        let mapClickedTracks = clickedTracks.map((song, pos) => {
            return (
                <div>
                 <Container >
                    <Row style={{ paddingBottom: (clickedLen-1) === pos ? '12.5px': '' }} >
                        <Col sm={3} >
                            <Image src={song.artwork.replace('100x100', '1200x1200')} style={{ width: '100px' }} />
                        </Col>
                        <Col sm={6} style={{ paddingTop: '7.5px' }} >
                            <div style={{ fontSize: '20px', marginLeft: 'auto', float: 'left', textAlign: 'left' }} >
                                {this.trimName(song.name)}
                            </div>
                            <br></br>
                            <br></br>
                            <div style={{ fontSize: '15px', marginLeft: 'auto', float: 'left', textAlign: 'left' }} >
                                {this.trimArtist(song.artist)}
                                <br></br>
                                {this.trimCol(song.col)}
                            </div>
                        </Col>
                        <Col sm={3} >
                            <Button style={{ borderRadius: '50%', width: '40px', height: '40px', marginTop: '5px' }} onClick={this.playTrack.bind(this, song.name, song.artist, song.col, song.artwork.replace('100x100', '1200x1200'), song.preview )} variant='outline-success' ><FontAwesomeIcon style={{ fontSize: '14px', position: 'absolute', top: '18.5%', left: '47.1%' }} icon={faPlay} /></Button>
                            <br></br>
                            <Button style={{ borderRadius: '50%', width: '40px', height: '40px', marginTop: '15px', visibility: isMyPlaylistBool ? 'visible': 'hidden' }} onClick={this.deleteTrack.bind(this, pos, clicked_id )} variant='outline-danger' ><FontAwesomeIcon style={{ fontSize: '14px', position: 'absolute', top: '73%', left: '46.51%' }} icon={faTrashAlt} /></Button>
                        </Col>
                    </Row>
                    </Container>
                    <hr style={{ display: (clickedLen-1) === pos ? 'none': '' }} ></hr>
                </div>
            )
        });

        let createPlaylistModalBool = this.state.createPlaylistModalBool;
        let playlistImgHoverBool = this.state.playlistImgHoverBool;

        let playlistImg = this.state.playlistImg;
        let albumArt;

        //Default album img
        if (playlistImg === '')
        {
            albumArt = 'https://i.pinimg.com/originals/1e/af/79/1eaf79deb5e10c46b43fac10cfcbe6ad.jpg'
        }
        else
        if (playlistImg !== '')
        {
            albumArt = playlistImg;
        }

        let createPlaylistLoad = this.state.createPlaylistLoad;
        let playlistDate = this.state.playlistDate;
        let date = playlistDate.substring(0, 10);
        let time = playlistDate.substring(11, 16);

        let createPlaylistModal = (
            <div>
                <Modal show={createPlaylistModalBool} style={{ textAlign: 'center', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} centered animation size='md' >
                    <Modal.Body>
                        {
                            exceededPlaylistCount &&
                            <div>
                                You Already Have 3 Playlists. Please Apply To Be An Admin In The Settings Menu To Gain Access To More Playlists...
                                <hr></hr>
                                <Button onClick={this.closeCreatePlaylist} variant="danger">Close</Button>
                            </div>
                        }
                        {
                            !exceededPlaylistCount &&
                            <div>
                            {
                            createPlaylistLoad &&
                            <div style={{ height: '267.5' }} >
                                <Spinner animation="border" variant="primary" /><h3>Creating Playlist...</h3>
                            </div>
                        }
                        {
                            !createPlaylistLoad &&
                            <div>
                                 <div style={{ height: '285px' }} >
                                <Row>
                                <Col  style={{ fontSize: '25px', float: 'right', textAlign: 'right', marginRight: '0px', paddingRight: '3px' }} >
                                    <FontAwesomeIcon icon={faPlusCircle} />
                                </Col>
                                <Col style={{ fontSize: '20px', float: 'left', textAlign: 'left', marginLeft: '0px', paddingLeft: '3px', marginRight: '100px', paddingTop: '2px' }} >
                                    Create A Playlist
                                </Col>
                                </Row>
                            <hr style={{ paddingTop: '0px', marginTop: '0px' }} ></hr>
                            <Form>
                                <Row>
                                    <Col>
                                        <div>
                                            <Image onClick={() => this.refs.fileInput.click()} onMouseEnter={this.handleImgMouseEnter} onMouseLeave={this.handleImgMouseLeave} src={albumArt} style={{ width: '150px', height: '150px', objectFit: 'cover', objectPosition: '50 50', filter: playlistImgHoverBool === true ? 'brightness(35%)': '' }} />
                                            <Button style={{ position: 'absolute', top: '28.5%', left: '28%', pointerEvents: 'none', visibility: playlistImgHoverBool === true ? 'visible': 'hidden', color: 'white' }} variant='link' > <FontAwesomeIcon icon={faPencilAlt} style={{ fontSize: '25px', color: 'white', position: 'relative', left: '2.5%' }} /> <div style={{ fontSize: '14px', paddingTop: '7.5px' }} >Choose Photo</div></Button>
                                            <Form.Control style={{ display: 'none' }} ref='fileInput' accept='.png' onChange={this.handleImgSelect} type="file" />
                                        </div>
                                    </Col>
                                    <Col>
                                        <Form.Control style={{ marginBottom: '15px', marginTop: '7.5px' }} onChange={this.handlePlaylistName} type='text' placeholder='Playlist Name...' />
                                        <Form.Control style={{ marginBottom: '10px' }} maxLength='37' onChange={this.handlePlaylistDesc} as='textarea' rows={2} placeholder='Playlist Description...' />
                                        <div style={{ fontSize: '12px', textAlign: 'center', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} >
                                        Created on <b>{date}</b> at <b>{time}</b>.
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                            <hr></hr>
                            <Row>
                                <Col>
                                    <Button style={{ float: 'right', textAlign: 'right', marginRight: '0px' }} onClick={this.createPlaylist} variant="primary"><FontAwesomeIcon icon={faPlusCircle} /> Create</Button>
                                </Col>
                                <Col>
                                    <Button style={{ float: 'left', textAlign: 'left', marginLeft: '0px' }} onClick={this.closeCreatePlaylist} variant="danger"><FontAwesomeIcon icon={faTimesCircle} /> Close</Button>
                                </Col>
                            </Row>
                        </div>
                            </div>
                        }
                            </div>
                        }
                    </Modal.Body>
                </Modal>
            </div>
        );

        let editPlaylistModalBool = this.state.editPlaylistModalBool;

        let newPlaylistImg = this.state.newPlaylistImg;
        let newClickedImg;

        if (newPlaylistImg === '')
        {
            newClickedImg = clickedImg;
        }
        else
        if (newPlaylistImg !== '')
        {
            newClickedImg = newPlaylistImg;
        }

        let editPlaylistLoad = this.state.editPlaylistLoad;

        let editPlaylistModal = (
            <div>
                <Modal show={editPlaylistModalBool} style={{ textAlign: 'center', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} centered animation size='md' >
                    <Modal.Body>
                        {
                            editPlaylistLoad &&
                            <div>
                                <Spinner animation="border" variant="primary" /><h3>Editing Playlist...</h3>
                            </div>
                        }
                        {
                            !editPlaylistLoad &&
                            <div>
                            <div style={{ height: '285px' }} >
                            <Row>
                                <Col style={{ fontSize: '25px', float: 'right', textAlign: 'right', marginRight: '0px', paddingRight: '3px' }} >
                                    <FontAwesomeIcon icon={faEdit} />
                                </Col>
                                <Col style={{ fontSize: '20px', float: 'left', textAlign: 'left', marginLeft: '0px', paddingLeft: '3px', marginRight: '60px', paddingTop: '4.5px' }} >
                                    Edit Playlist
                                </Col>
                                </Row>
                            <hr style={{ paddingTop: '0px', marginTop: '5px' }} ></hr>
                            <Form>
                                <Row>
                                    <Col>
                                        <Image onClick={() => this.refs.fileInputEdit.click()} onMouseEnter={this.handleImgMouseEnter} onMouseLeave={this.handleImgMouseLeave} src={newClickedImg.replace('100x100', '1200x1200')} style={{ width: '150px', height: '150px', objectFit: 'cover', objectPosition: '50 50', filter: playlistImgHoverBool === true ? 'brightness(35%)': '' }} />
                                        <Button style={{ position: 'absolute', top: '28.5%', left: '28%', pointerEvents: 'none', visibility: playlistImgHoverBool === true ? 'visible': 'hidden', color: 'white' }} variant='link' > <FontAwesomeIcon icon={faPencilAlt} style={{ fontSize: '25px', color: 'white', position: 'relative', left: '2.5%' }} /> <div style={{ fontSize: '14px', paddingTop: '7.5px' }} >Choose Photo</div></Button>
                                        <Form.Control style={{ display: 'none' }} ref='fileInputEdit' accept='.png' onChange={this.handleImgEditSelect} type="file" />
                                    </Col>
                                    <Col>
                                        <Form.Control style={{ marginBottom: '15px', marginTop: '7.5px' }} onChange={this.handlePlaylistNameEdit} type='text' defaultValue={clickedName} />
                                        <Form.Control style={{ marginBottom: '10px' }} maxLength='37' onChange={this.handlePlaylistDescEdit} as='textarea' rows={2} defaultValue={clickedDesc} />
                                        <div style={{ fontSize: '12px', textAlign: 'center', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} >
                                            Created on <b>{clickedDateSub}</b> at <b>{clickedDateTime}</b>.
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                            <hr></hr>
                            <Row>
                                <Col>
                                    <Button style={{ float: 'right', textAlign: 'right', marginRight: '0px' }} onClick={this.editPlaylist} variant="primary"><FontAwesomeIcon icon={faEdit} /> Edit</Button>
                                </Col>
                                <Col>
                                    <Button style={{ float: 'left', textAlign: 'left', marginLeft: '0px' }} onClick={this.closeEditPlaylist} variant="danger"><FontAwesomeIcon icon={faTimesCircle} /> Cancel</Button>
                                </Col>
                            </Row>
                        </div>
                            </div>
                        }
                    </Modal.Body>
                </Modal>
            </div>
        );

        let playlistClicked = this.state.playlistClicked;

        let likeModalBool = this.state.likeModalBool;
        let likedPlaylistUsers = this.state.likedPlaylistUsers;
        let likedPlaylistUserLen = likedPlaylistUsers.length;

        let mapLikedPlaylistUsers = likedPlaylistUsers.map((user, pos) => {
            return (
                    <div >
                    <Container >
                    <Row >
                        <Col sm={3} style={{ float: 'right', textAlign: 'right', marginRight: '0px', paddingRight: '0px' }} >
                            <Image src={user.img} style={{ width: '80px', height: '80px', objectFit: 'cover', objectPosition: '50 50', float: 'right', textAlign: 'right' }} roundedCircle />
                        </Col>
                        <Col sm={6} >
                            <div style={{ width: '200px', fontSize: '17px', float: 'left', textAlign: 'left', marginLeft: 'auto', paddingTop: '15px' }} >
                                <Link style={{ pointerEvents: userDetails.username  == user.username ? 'none': 'auto', color: userDetails.username  == user.username ? 'black': '' }} onClick={this.sendClickedUser.bind(this, user._id, user.username)} exact to={`/${user.username}`} >{user.username}</Link>
                            </div>
                            <div style={{ width: '200px', fontSize: '15px', float: 'left', textAlign: 'left', marginLeft: 'auto' }} >
                                  {user.name}
                            </div>
                        </Col>
                        <Col sm={3} >

                        </Col>
                    </Row>
                    </Container>
                    <hr style={{ display: (likedPlaylistUserLen-1) === pos ? 'none': '' }} ></hr>
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
                                    <div style={{ position: 'absolute', bottom: '22.5%', left: '87.5%' }} >
                                        <FontAwesomeIcon style={{ fontSize: '30px' }} icon={faHeart} />
                                    </div>
                                </Col>
                                <Col style={{ float: 'left', textAlign: 'left', marginLeft: '0px', paddingLeft: '0px' }} >
                                    <div style={{ position: 'absolute', bottom: '22.5%', left: '7.5%', fontSize: '22.5px', paddingBottom: '0px', marginBottom: '0px' }} >
                                         {likedPlaylistUserLen} Likes
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

        let clickDelPlaylistBool = this.state.clickDelPlaylistBool;

        let clickDelPlaylistModal = (
            <div>
                <Modal show={clickDelPlaylistBool} style={{ textAlign: 'center', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} centered animation size='md' >
                    <Modal.Body>
                        <div style={{ fontSize: '20px' }} >
                            <Spinner animation="border" variant="danger" /> Deleting Playlist...
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );

        let clickUnlikePlaylistBool = this.state.clickUnlikePlaylistBool;

        let clickUnlikePlaylistModal = (
            <div>
                <Modal show={clickUnlikePlaylistBool} style={{ textAlign: 'center', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} centered animation size='md' >
                    <Modal.Body>
                        <div style={{ fontSize: '20px' }} >
                            <Spinner animation="border" variant="danger" /> Unliking Playlist...
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );

        let fetchUserPlaylistsBool = this.state.fetchUserPlaylistsBool;
        let fetchUserLikedPlaylistBool = this.state.fetchUserLikedPlaylistBool;

        let adminPicks_id = this.state.adminPicks_id;

        return (
            <div className='App' style={{ float: 'center', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', paddingTop: '37.5px' }} >
            {createPlaylistModal}
            {editPlaylistModal}
            {likeModal}
            {clickDelPlaylistModal}
            {clickUnlikePlaylistModal}
            <br></br>
            <Container style={{ borderStyle: 'solid', borderColor: 'lightgrey', borderWidth: '2px', width: '55%', backgroundColor: 'white', height: '748px' }} >
                <Row>
                    <Col style={{ borderRightStyle: 'solid', borderRightColor: 'lightgrey', borderWidth: '2px', height: '744px', overflowY: 'scroll' }} sm={3}>
                        <Button onClick={this.clickCreatePlaylist} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px' }} ><FontAwesomeIcon icon={faPlusCircle} /> Create Playlist</Button>
                        <br></br>
                        <hr style={{ marginBottom: '5px' }} ></hr>
                        <div style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginRight: '8.5px', fontSize: '14px', fontWeight: 'bold', paddingBottom: '0px' }} ><FontAwesomeIcon icon={faHouseUser} /> My Playlists({userPlaylistsCount})</div>
                        <br></br>
                        {
                            fetchUserPlaylistsBool &&
                            <div>
                                <br></br>
                                <br></br>
                                <Row>
                                    <Col sm={5} style={{ textAlign: 'right', float: 'right', marginRight: '0px', paddingRight: '2px', paddingTop: '2.5px' }} >
                                        <Spinner style={{ width: '17px', height: '17px' }} animation="border" variant="primary" />
                                    </Col>
                                    <Col sm={7} style={{ fontSize: '14px', textAlign: 'left', float: 'left', marginLeft: '0px', paddingLeft: '2px' }} >
                                        Loading...
                                    </Col>
                                </Row>
                            </div>
                        }
                        {
                            !fetchUserPlaylistsBool &&
                            <div>
                                {mapPlaylistNames}
                            </div>
                        }
                        <br></br>
                        <br></br>
                        <div style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginRight: '8.5px', fontSize: '14px', fontWeight: 'bold' }} ><FontAwesomeIcon icon={faHeart} /> My Liked Playlists({userLikedPlaylistsCount})</div>
                        <br></br>
                        {
                            fetchUserLikedPlaylistBool &&
                            <div>
                                <br></br>
                                <br></br>
                                <Row>
                                    <Col sm={5} style={{ textAlign: 'right', float: 'right', marginRight: '0px', paddingRight: '2px', paddingTop: '2.5px' }} >
                                        <Spinner style={{ width: '17px', height: '17px' }} animation="border" variant="primary" />
                                    </Col>
                                    <Col sm={7} style={{ fontSize: '14px', textAlign: 'left', float: 'left', marginLeft: '0px', paddingLeft: '2px' }} >
                                        Loading...
                                    </Col>
                                </Row>
                            </div>
                        }
                        {
                            !fetchUserLikedPlaylistBool &&
                            <div>
                                {mapLikedPlaylistsNames}
                            </div>
                        }
                    </Col>
                     <Col sm={9}  >
                        {
                        !playlistClicked &&
                        <div>
                            Select A Playlist To Begin...
                        </div>
                        }
                        {
                        playlistClicked &&
                        <div>
                            <div>
                            <Container style={{ paddingTop: '12.5px' }} >
                                <Row>
                                    <Col sm={3} >
                                        <Image src={clickedImg.replace('100x100', '1200x1200')} style={{ width: '125px', height: '125px', objectFit: 'cover', objectPosition: '50 50' }} />
                                    </Col>
                                    <Col sm={6} >
                                        <div style={{ fontSize: '22px', marginLeft: 'auto', float: 'left', textAlign: 'left', paddingTop: '27.5px' }} >
                                            {clickedName}
                                        </div>
                                        <br></br>
                                        <br></br>
                                        <div style={{ fontSize: '14px', marginLeft: 'auto', float: 'left', textAlign: 'left', width: '90%' }} >
                                            {clickedDesc}
                                        </div>
                                        <div style={{ fontSize: '13px', marginLeft: 'auto', float: 'left', textAlign: 'left' }} >
                                               <Link style={{ pointerEvents: clickedUsername == userDetails.username ? 'none': 'auto', color: clickedUsername == userDetails.username ? 'black': '' }} onClick={this.sendClickedUserLink.bind(this, clickedUsername)} exact to={`/${clickedUsername}`} >{clickedUsername}</Link> • {clickedLen} tracks • <Button style={{ fontSize: '13px', paddingTop: '0px', paddingBottom: '3px', paddingLeft: '0px', paddingRight: '0px' }} onClick={this.openLikeModal.bind(this, clickedLikes)} variant='link' >{clickedLikes.length} <FontAwesomeIcon icon={faHeart} /> </Button> • {clickedDateSub}
                                        </div>
                                    </Col>
                                    <Col sm={3} >
                                    {
                                        isMyPlaylistBool &&
                                        <div>
                                        <Dropdown>
                                        <Dropdown.Toggle style={{ fontSize: '25px', paddingTop: '50px', float: 'left', textAlign: 'left', marginLeft: 'auto', paddingLeft: '31.25px' }} variant="link"   >
                                            <FontAwesomeIcon icon={faEllipsisH} />
                                        </Dropdown.Toggle>
                                    <Dropdown.Menu >
                                        <Button style={{ fontSize: '16px' }} onClick={this.clickEditPlaylist} variant='link' ><FontAwesomeIcon icon={faEdit} /> Edit</Button>
                                        <hr></hr>
                                        <Button style={{ fontSize: '16px', color: 'red' }} onClick={this.clickDelPlaylist} variant='link' ><FontAwesomeIcon icon={faTrashAlt} /> Delete</Button>
                                        <hr style={{ display: userDetails.accType === 'dev' ? '': 'none' }} ></hr>
                                        <div style={{ display: userDetails.accType === 'dev' ? '': 'none', textAlign: 'left', float: 'left' }} >
                                             <Button style={{ pointerEvents: adminPicks_id.includes(clicked_id) ? 'none': 'auto', color: adminPicks_id.includes(clicked_id) ? 'grey': '', fontSize: '16px' }} onClick={this.setPlaylistAsAdminPick.bind(this, clicked_id)} variant='link' ><FontAwesomeIcon icon={faDev} /> Editor's Pick</Button>
                                        </div>
                                    </Dropdown.Menu>
                                    </Dropdown>
                                        </div>
                                    }
                                    {
                                        !isMyPlaylistBool &&
                                        <div>
                                        <Dropdown>
                                      <Dropdown.Toggle style={{ fontSize: '25px', paddingTop: '50px', float: 'left', textAlign: 'left', marginLeft: 'auto', paddingLeft: '31.25px' }} variant="link"   >
                                            <FontAwesomeIcon icon={faEllipsisH} />
                                        </Dropdown.Toggle>
                                    <Dropdown.Menu >
                                        <Button style={{ fontSize: '16px' }} onClick={this.unlikeLikedPlaylist.bind(this, clicked_id)} variant='link' ><FontAwesomeIcon icon={faHeartBroken} />  Unlike</Button>
                                        <hr style={{ display: userDetails.accType === 'dev' ? '': 'none' }} ></hr>
                                        <div style={{ display: userDetails.accType === 'dev' ? '': 'none', textAlign: 'left', float: 'left' }} >
                                            <Button style={{ pointerEvents: adminPicks_id.includes(clicked_id) ? 'none': 'auto', color: adminPicks_id.includes(clicked_id) ? 'grey': '', fontSize: '16px' }} onClick={this.setPlaylistAsAdminPick.bind(this, clicked_id)} variant='link' ><FontAwesomeIcon icon={faDev} /> Editor's Pick</Button>
                                        </div>
                                    </Dropdown.Menu>
                                    </Dropdown>
                                        </div>
                                    }
                                    </Col>
                                </Row>
                            </Container>
                            <hr style={{ backgroundColor: 'black' }} ></hr>
                            </div>
                            <div style={{ height: '580px', overflowY: 'scroll' }}  >
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

export default Music;