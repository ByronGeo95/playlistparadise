//Created by: Byron Georgopoulos
//Created on: 31/10/2021
//Last Modified on: 01/02/2022
/*Description: Home Page (Landing Page) Component*/

import React from 'react';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faPlay, faEllipsisH, faHeartBroken, faHeart, faPlusSquare, faFireAlt } from '@fortawesome/free-solid-svg-icons';
import { faDev } from '@fortawesome/free-brands-svg-icons';

class Home extends React.Component {

    constructor (props)
    {
        super(props);

        this.state = {
          userDetails: {},
          recentPlaylists: [],
          topLikedPlaylists: [],
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
          likeModalBool: false,
          likedPlaylistUsers: [],
          clickUnlikePlaylistModalBool: false,
          clickLikePlaylistModalBool: false,
          adminPicks_id: [],
          adminPickPlaylists: [],
          playlistAsAdminPickModalBool: false,
        };
    };

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
        
        //Fetch request to fetch the 3 most recently created playlists
        fetch('/fetchRecentPlaylists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: _id }),
        })
        .then(res => res.json())
        .then(
        (result) => {
        this.setState({
                        recentPlaylists: result,
                    });
        });

        //Fetch request to fetch the 3 top liked playlists
        fetch('/fetchTopLikedPlaylists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: _id }),
        })
        .then(res => res.json())
        .then(
        (result) => {
        this.setState({
                        topLikedPlaylists: result
                    });
        });

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
        })
        //Once admin pick playlists ID's are stored in state and fetched from MongoDB database
        .then(this.fetchAdminPicks);

    };

    //Fetch the data for the admin pick playlists using already fetched ID's
    fetchAdminPicks = () => {
        let adminPicks_id = this.state.adminPicks_id;

        fetch('/fetchAdminPickPlaylists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminPicks_id: adminPicks_id }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.setState({
                            adminPickPlaylists: result,
                            playlistAsAdminPickModalBool: false,
                        });
            });
    };

    //When a playlist is clicked from the sidebar, store its data in state
    clickPlaylistName = (_id, name, desc, date, img, username, tracks, likes) => {
        let clickedLen = tracks.length;
        this.setState({ clicked_id: _id, clickedName: name, clickedDesc: desc, clickedDate: date, clickedImg: img, clickedUsername: username, clickedTracks: tracks, clickedLen: clickedLen, clickedLikes: likes, playlistClicked: true });
    };

    //Send (as props) all the details of a track to be played in the AudioPlayer.js file via the App.js file
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

    //Send (as props) the ID and username of another user when their name is clicked on to the App.js file
    sendClickedUser = (_id, username) => {
        this.props.sendClickedUser(_id, username);
    };

    //Send (as props) the ID and username of another user when their name is clicked on to the App.js file (used when only the username is available, and their ID is required)
    sendClickedUserLink = (username) => {

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

    //When a user unlikes a playlist
    unlikeLikedPlaylist = (clicked_id, clickedUsername) => {
        this.setState({ clickUnlikePlaylistModalBool: true });
        let userDetails = this.state.userDetails;
        let _id = userDetails._id;

        //Fetch request to remove a users ID from the list of ID's in the playlist collection on MongoDB
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
        
        //Fetch request to remove a playlist ID from the list of liked playlist ID's on the user collection on MongoDB
        fetch('/unlikeLikedPlaylistUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: _id, playlist_id: clicked_id }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.props.updateUserDetails(result);
            this.setState({
                            userDetails: result,
                            clickUnlikePlaylistModalBool: false,
                        });
            })

    };

    //When a user likes a playlist
    clickLikePlaylist = (_id, username) => {
        this.setState({ clickLikePlaylistModalBool: true });
        let userDetails = this.state.userDetails;
        let user_id = userDetails._id;

        //Fetch request to add a user's ID to the list of ID's in the playlist collection
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
            })
            //Fetch request to add a playlist ID to the list of liked playlists on the user collection on MongoDB
            }).then(fetch('/addToLikedPlaylists', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ _id: _id, user_id: user_id }),
                    })
                    .then(res => res.json())
                    .then(
                    (result) => {
                    //Send (as props) the updated user details (after playlist ID's are added)
                    this.props.updateUserDetails(result);
                    this.setState({
                        userProfileDetails: result,
                        clickLikePlaylistModalBool: false,
                    });
                    })
                ); 

    };

    //Set a playlist as admin pick (only avai. when acc. type is set to 'dev')
    setPlaylistAsAdminPick = (clicked_id) => {
        this.setState({ playlistAsAdminPickModalBool: true });
        
        fetch('/addToAdminPick', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clicked_id: clicked_id }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            console.log(`In Search.js setPlaylistAsAdminPick\nresult: ${JSON.stringify(result)}`);
            let adminPicks_id = this.state.adminPicks_id;
            adminPicks_id.push(result.playlist_id);
            this.setState({
                adminPicks_id: adminPicks_id,
            });
        })
        .then(this.fetchAdminPicks);

    };

    //Trim the name of a track if it's too long
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

    //Trim the artist of a track if it's too long
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

    //Trim the collection (album) of a track if it's too long
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
        let recentPlaylists = this.state.recentPlaylists;
        let mapRecentPlaylists;

        if (recentPlaylists)
        {
          mapRecentPlaylists = recentPlaylists.map(playlist => {
            return (
              <div>
                 <Button onClick={this.clickPlaylistName.bind(this, playlist._id, playlist.name, playlist.desc, playlist.date, playlist.img, playlist.username, playlist.tracks, playlist.likes)} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px', backgroundColor: clicked_id === playlist._id ? '#303030': '', color: clicked_id === playlist._id ? 'white': '' }} ><div style={{ visibility: clicked_id === playlist._id ? '': 'hidden', display: 'inline-block' }} >•</div> {playlist.name}</Button> 
              </div>
            )
          });
        }

        let topLikedPlaylists = this.state.topLikedPlaylists;

        let mapTopLikedPlaylists = topLikedPlaylists.map(playlist => {
                return (
                    <Button onClick={this.clickPlaylistName.bind(this, playlist._id, playlist.name, playlist.desc, playlist.date, playlist.img, playlist.username, playlist.tracks, playlist.likes)} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px', backgroundColor: clicked_id === playlist._id ? '#303030': '', color: clicked_id === playlist._id ? 'white': '' }} ><div style={{ visibility: clicked_id === playlist._id ? '': 'hidden', display: 'inline-block' }} >•</div> {playlist.name}</Button> 
                )
        });

        let adminPickPlaylists = this.state.adminPickPlaylists;

        let mapAdminPickPlaylists = adminPickPlaylists.map(playlist => {
                return (
                    <Button onClick={this.clickPlaylistName.bind(this, playlist._id, playlist.name, playlist.desc, playlist.date, playlist.img, playlist.username, playlist.tracks, playlist.likes)} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px', backgroundColor: clicked_id === playlist._id ? '#303030': '', color: clicked_id === playlist._id ? 'white': '' }} ><div style={{ visibility: clicked_id === playlist._id ? '': 'hidden', display: 'inline-block' }} >•</div> {playlist.name}</Button> 
                )
        });

        let playlistClicked = this.state.playlistClicked;

        let clickedTracks = this.state.clickedTracks;
        let clickedName = this.state.clickedName;
        let clickedDesc = this.state.clickedDesc;
        let clickedDate = this.state.clickedDate;
        let clickedImg = this.state.clickedImg;
        let clickedUsername = this.state.clickedUsername;
        let clickedLen = this.state.clickedLen;
        let clickedLikes = this.state.clickedLikes;

        let clickedDateSub = clickedDate.substring(0,10);

        let username = userDetails.username;
        let isMyPlaylistBool = false;

        if (username === clickedUsername)
        {
            isMyPlaylistBool = true;
        }

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
                            <Button style={{ borderRadius: '50%', width: '50px', height: '50px', marginTop: '25px' }} onClick={this.playTrack.bind(this, song.name, song.artist, song.col, song.artwork.replace('100x100', '1200x1200'), song.preview )} variant='outline-success' ><FontAwesomeIcon style={{ fontSize: '16px', position: 'absolute', top: '17.5%', left: '47%', marginTop: '25px' }} icon={faPlay} /></Button>
                        </Col>
                    </Row>
                    </Container>
                    <hr style={{ display: (clickedLen-1) === pos ? 'none': '' }} ></hr>
                </div>
            )
        });

        let likeModalBool = this.state.likeModalBool;
        let likedPlaylistUsers = this.state.likedPlaylistUsers;
        let likedPlaylistUserLen = likedPlaylistUsers.length;

        let mapLikedPlaylistUsers;

        if (likedPlaylistUserLen === 0)
        {
            mapLikedPlaylistUsers = (
                    <div style={{ fontSize: '16px', position: 'absolute', top: '50%', left: '6%' }} >
                        Nobody likes this playlist, yet. Why don't you be the first?
                    </div>
                );
        }

        if (likedPlaylistUserLen > 0)
        {
            mapLikedPlaylistUsers = likedPlaylistUsers.map((user, pos) => {
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
        }

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

        let clickLikePlaylistModalBool = this.state.clickLikePlaylistModalBool;

        let clicklikePlaylistModal = (
            <div>
                <Modal show={clickLikePlaylistModalBool} style={{ textAlign: 'center', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} centered animation size='md' >
                    <Modal.Body>
                        <div style={{ fontSize: '20px' }} >
                            <Spinner animation="border" variant="success" /> Liking Playlist...
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );

        let adminPicks_id = this.state.adminPicks_id;

        let playlistAsAdminPickModalBool = this.state.playlistAsAdminPickModalBool;

        let playlistAsAdminPickModal = (
            <div>
                <Modal show={playlistAsAdminPickModalBool} style={{ textAlign: 'center', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} centered animation size='md' >
                    <Modal.Body>
                        <div style={{ fontSize: '20px' }} >
                            <Spinner animation="border" variant="success" /> Adding To Editor's Picks...
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
        
        return (
          <div className='App' style={{ float: 'center', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', paddingTop: '37.5px' }} >
            {likeModal}
            {clickunlikePlaylistModal}
            {clicklikePlaylistModal}
            {playlistAsAdminPickModal}
            <br></br>
            <Container style={{ borderStyle: 'solid', borderColor: 'lightgrey', borderWidth: '2px', width: '55%', backgroundColor: 'white', height: '748px' }} >
                <Row>
                    <Col style={{ borderRightStyle: 'solid', borderRightColor: 'lightgrey', borderWidth: '2px', height: '744px', overflowY: 'scroll' }} sm={3}>
                        <div style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginRight: '8.5px', fontSize: '14px', fontWeight: 'bold', paddingTop: '5px' }} ><FontAwesomeIcon icon={faDev} /> Editor's Picks({adminPickPlaylists.length})</div>
                        {mapAdminPickPlaylists}
                        <div style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginRight: '8.5px', fontSize: '14px', fontWeight: 'bold' }} ><FontAwesomeIcon icon={faPlusSquare} /> Recent Playlists({recentPlaylists.length})</div>
                        {mapRecentPlaylists}
                        <div style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginRight: '8.5px', fontSize: '14px', fontWeight: 'bold' }} ><FontAwesomeIcon icon={faFireAlt} /> Popular Playlists({topLikedPlaylists.length})</div>
                        {mapTopLikedPlaylists}
                    </Col>
                    <Col sm={9}  >
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
                                            <Link style={{ pointerEvents: clickedUsername == userDetails.username ? 'none': 'auto', color: clickedUsername == userDetails.username ? 'black': '' }} onClick={this.sendClickedUserLink.bind(this, clickedUsername)} exact to={`/${clickedUsername}`} >{clickedUsername}</Link> • {clickedLen} tracks • <Button style={{ fontSize: '13px', paddingTop: '0px', paddingBottom: '3px', paddingLeft: '0px', paddingRight: '0px', textDecoration: 'none' }} onClick={this.openLikeModal.bind(this, clickedLikes)} variant='link' >{clickedLikes.length} <FontAwesomeIcon icon={faHeart} /> </Button> • {clickedDateSub}
                                        </div>
                                    </Col>
                                    <Col sm={3} >
                                      {
                                        isMyPlaylistBool &&
                                        <div>
                                        <Dropdown style={{ display: userDetails.username === clickedUsername && userDetails.accType !== 'dev' ? 'none': '' }} >
                                          <Dropdown.Toggle style={{ fontSize: '25px', paddingTop: '50px', float: 'left', textAlign: 'left', marginLeft: 'auto', paddingLeft: '31.25px' }} variant="link"   >
                                            <FontAwesomeIcon icon={faEllipsisH} />
                                          </Dropdown.Toggle>
                                          <Dropdown.Menu >
                                            <div>
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
                                          <Dropdown.Toggle style={{ fontSize: '25px', paddingTop: '50px', float: 'left', textAlign: 'left', marginLeft: 'auto', paddingLeft: '31.25px' }} variant='link' >
                                            <FontAwesomeIcon icon={faEllipsisH} />
                                          </Dropdown.Toggle>
                                          <Dropdown.Menu >
                                            {
                                              likeBtnBool &&
                                              <div>
                                                <Button style={{ fontSize: '16px' }} onClick={this.unlikeLikedPlaylist.bind(this, clicked_id, clickedUsername)} variant='link' ><FontAwesomeIcon icon={faHeartBroken} /> Unlike</Button>
                                              </div>
                                            }
                                            {
                                              !likeBtnBool &&
                                              <div>
                                                <Button style={{ fontSize: '16px' }} onClick={this.clickLikePlaylist.bind(this, clicked_id, clickedUsername)} variant='link' ><FontAwesomeIcon icon={faHeart} /> Like</Button>
                                              </div>
                                            }
                                            <hr style={{ display: userDetails.accType === 'dev' ? '': 'none' }} ></hr>
                                            <div style={{ display: userDetails.accType === 'dev' ? '': 'none' }} >
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
                    {
                      !playlistClicked &&
                      <div>
                          Select A Playlist To Begin...
                      </div>
                    }
                    </Col>
                </Row>
            </Container>
            </div>
        );
    };
};

export default Home;