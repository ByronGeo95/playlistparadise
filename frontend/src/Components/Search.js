//Created by: Byron Georgopoulos
//Created on: 01/11/2021
//Last Modified on: 05/02/2022
/*Description: Search Page Component*/

import React from 'react';

import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Spinner from 'react-bootstrap/Spinner';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faHeart, faEllipsisH, faHeartBroken, faPlay, faMusic, faUsers, faList } from '@fortawesome/free-solid-svg-icons';
import { faDev } from '@fortawesome/free-brands-svg-icons';

class Search extends React.Component {

    constructor (props)
    {
        super(props);

        this.state = {
        searchTerm: '',
        userDetails: {},
        searchResult: [],
        searchResultName: [],
        searchResultArtist: [],
        userPlaylists: [],
        searchedUsers: [],
        searchedPlaylists: [],
        musicActive: true,
        usersActive: false,
        playlistActive: false,
        musicActiveAll: true,
        musicActiveName: false,
        musicArtistActive: false,
        oldSearchTerm: ' ',
        userPlaylistsBool: false,
        clickAddToPlaylistBool: false,
        clicked_id: '',
        clickedTracks: [],
        clickedName: '',
        clickedDesc: '',
        clickedDate: '',
        clickedImg: '',
        clickedUsername: '',
        clickedLen: '',
        clickedLikes: [],
        clickedPos: 0,
        likeModalBool: false,
        likedPlaylistUsers: [],
        clickUnlikePlaylistModalBool: false,
        clickLikePlaylistModalBool: false,
        adminPicks_id: [],
        playlistAsAdminPickModalBool: false,
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
                            userPlaylistsBool: true,
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

    //Add a track to a playlist
    clickAddToPlaylist = (_id, name, artist, col, artwork, preview) => {
        this.setState({ clickAddToPlaylistBool: true });

        //Fetch request to add a signle track to a specific playlist in the playlist collection on the MongoDB database
        fetch('/addTrackToPlaylist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: _id, name: name, artist: artist, col: col, artwork: artwork, preview: preview }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.setState({
                            clickAddToPlaylistBool: false,
                        });
            });

    };

    //Send (as props) the details of a clciked user
    sendClickedUser = (_id, username) => {
        this.props.sendClickedUser(_id, username);
    };

    //??
    musicActive = () => {
        this.setState({ musicActive: true, usersActive: false, playlistActive: false, musicActiveAll: true, musicActiveName: false });
    };

    //??
    usersActive = () => {
        this.setState({ musicActive: false, usersActive: true, playlistActive: false });
    };

    //Search the iTunes API and MongoDB database using the user entered search term
    handleSearches = (searchTerm) => {
        this.setState({ oldSearchTerm: searchTerm, musicActive: true, usersActive: false, playlistsActive: false });
        let userDetails = this.props.userDetails;
        let username = userDetails.username;
        let name = userDetails.name;

        //Fetch request that searches the iTunes API
        fetch(`https://itunes.apple.com/search?term=${searchTerm}&media=music&limit=200`)
        .then(res => res.json())
        .then(
        (result) => {
            let searchResult = result.results;
            let searchResultName = searchResult.filter(res => res['trackName'].toLowerCase().includes(searchTerm.toLowerCase()));
            let searchResultArtist = searchResult.filter(res => res['artistName'].toLowerCase().includes(searchTerm.toLowerCase()));
            this.setState({ searchResult: result.results, searchResultName: searchResultName, searchResultArtist: searchResultArtist });
        },
        (error) => {
           console.log(`Error with iTunes API:\n${error}`);
        });

        //Fetch request that searches the user collection in the MongoDB database
        fetch('/searchUsers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchTerm: searchTerm, username: username, name: name }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.setState({
                            searchedUsers: result,
                        });
        });

        //Fetch request that searches the playlist collection in the MongoDB database
        fetch('/searchPlaylists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchTerm: searchTerm }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.setState({
                            searchedPlaylists: result,
                        });
        });

    };

    //Updates the state of the currently clicked playlist
    clickPlaylistName = (_id, name, desc, date, img, username, tracks, likes, pos) => {
        let clickedLen = tracks.length;
        this.setState({ clicked_id: _id, clickedName: name, clickedDesc: desc, clickedDate: date, clickedImg: img, clickedUsername: username, clickedTracks: tracks, clickedLen: clickedLen, clickedLikes: likes, clickedPos: pos, musicActive: false, usersActive: false, playlistActive: true });
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

    //Open the like the modal
    openLikeModal = (clickedLikes) => {
        
        //Fetch request to get all the details of all the users that have liked a playlist
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
    unlikeLikedPlaylist = (clicked_id, clickedPos) => {
        this.setState({ clickUnlikePlaylistModalBool: true });
        let userDetails = this.state.userDetails;
        let _id = userDetails._id;

        //Fetch request to remove a user's ID from the list of ID's in the playlist collection on MongoDB
        fetch('/unlikeLikedPlaylist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: _id, playlist_id: clicked_id }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            let searchedPlaylists = this.state.searchedPlaylists;
            searchedPlaylists[clickedPos] = result;
            this.setState({
                            clickedLikes: result.likes,
                            searchedPlaylists: searchedPlaylists,
                        });
            })

        //Fetch request to remove a playlist ID from the list of ID's in the user collection on MongoDB
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
    clickLikePlaylist = (clicked_id, clickedPos) => {
        this.setState({ clickLikePlaylistModalBool: true });
        let userDetails = this.state.userDetails;
        let user_id = userDetails._id;

        //Fetch request to add a user's ID to the list of ID's in the playlist collection
        fetch('/clickLikePlaylist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: clicked_id, user_id: user_id }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            let searchedPlaylists = this.state.searchedPlaylists;
            searchedPlaylists[clickedPos] = result;
            this.setState({
                clickedLikes: result.likes,
                searchedPlaylists: searchedPlaylists,
            });
        });

        //Fetch request to add a playlist ID to the list of liked playlists on the user collection on MongoDB
        fetch('/addToLikedPlaylists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: clicked_id, user_id: user_id }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.props.updateUserDetails(result);
            this.setState({
                userDetails: result,
                clickLikePlaylistModalBool: false,
            });
        });

    };

    //When a user filters their music search by track name
    musicNameActive = () => {
        this.setState({ musicActive: true, usersActive: false, playlistActive: false, musicActiveAll: false, musicActiveName: true, musicArtistActive: false });
    };

    //When a user filters their music search by track artist
    musicArtistActive = () => {
        this.setState({ musicActive: true, usersActive: false, playlistActive: false, musicActiveAll: false, musicActiveName: false, musicArtistActive: true });
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
                playlistAsAdminPickModalBool: false,
            });
        });

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
        
        let oldSearchTerm = this.state.oldSearchTerm;
        let searchTerm = this.props.searchTerm;

        //Check to see if already on the Search page
        if (oldSearchTerm !== searchTerm)
        {
            this.handleSearches(searchTerm);
        }

        let userPlaylists = this.state.userPlaylists;
        let searchedUsers = this.state.searchedUsers;

        let musicActive = this.state.musicActive;
        let usersActive = this.state.usersActive;
        let playlistActive = this.state.playlistActive;

        let searchResult = this.state.searchResult;
        let searchResultName = this.state.searchResultName;
        let searchResultArtist = this.state.searchResultArtist;
        let clickedSearchResult = [];

        let userPlaylistsBool = this.state.userPlaylistsBool

        let musicActiveAll = this.state.musicActiveAll;
        let musicActiveName = this.state.musicActiveName;
        let musicArtistActive = this.state.musicArtistActive;

        //Check to see if any filters are applied to the music search

        if (musicActiveAll === true && musicActiveName === false && musicArtistActive === false)
        {
            clickedSearchResult = searchResult;
        }

        if (musicActiveAll === false && musicActiveName === true && musicArtistActive === false)
        {
            clickedSearchResult = searchResultName;
        }

        if (musicActiveAll === false && musicActiveName === false && musicArtistActive === true)
        {
            clickedSearchResult = searchResultArtist;
        }

        let clickedSearchResultLen = clickedSearchResult.length;

        let mapSearchResults = clickedSearchResult.map((song, pos) => {
            return (
                <div >
                    <Container >
                    <Row>
                        <Col sm={3} >
                            <Image src={song.artworkUrl100.replace('100x100', '1200x1200')} style={{ width: '100px' }} />
                        </Col>
                        <Col sm={6} style={{ paddingTop: '7.5px' }}  >
                            <div style={{ fontSize: '20px', marginLeft: 'auto', float: 'left', textAlign: 'left' }} >
                                 {this.trimName(song.trackName)}
                            </div>
                            <br></br>
                            <br></br>
                            <div style={{ fontSize: '15px', marginLeft: 'auto', float: 'left', textAlign: 'left' }} >
                                 {this.trimArtist(song.artistName)}
                                <br></br>
                                 {this.trimCol(song.collectionName)}
                            </div>
                        </Col>
                        <Col sm={3} >
                            <Button style={{ borderRadius: '50%', width: '40px', height: '40px', marginTop: '5px' }} onClick={this.playTrack.bind(this, song.trackName, song.artistName, song.collectionName, song.artworkUrl100.replace('100x100', '1200x1200'), song.previewUrl )} variant='outline-success' ><FontAwesomeIcon style={{ fontSize: '14px', position: 'absolute', top: '18.5%', left: '47.1%' }} icon={faPlay} /></Button>
                            <br></br>
                            <Dropdown>
                        <Dropdown.Toggle bsPrefix="p-0" style={{ borderRadius: '50%', width: '40px', height: '40px', marginTop: '15px' }} variant='outline-primary'   >
                            <FontAwesomeIcon style={{ fontSize: '14px', position: 'absolute', top: '51.5%', left: '45.25%' }} icon={faEllipsisH} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {
                            userPlaylistsBool &&
                            <div>
                            {userPlaylists.map(playlist => {
                                return (
                                <div>
                                <Button onClick={this.clickAddToPlaylist.bind(this, playlist._id, song.trackName, song.artistName, song.collectionName, song.artworkUrl100.replace('100x100', '1200x1200'), song.previewUrl )} variant='link' >{playlist.name}</Button> 
                                </div>
                                )
                            })}
                                </div>
                            }
                            {
                                !userPlaylistsBool &&
                                <div>
                                  <Row>
                                        <Col sm={3} style={{ paddingTop: '8.5px', textAlign: 'right', float: 'right', marginRight: '0px', paddingRight: '0px' }} >
                                            <Spinner style={{ width: '22px', height: '22px', marginLeft: '10px' }} animation='border' variant='dark' />
                                        </Col>
                                        <Col sm={9} style={{ textAlign: 'left', float: 'left', marginLeft: '0px', paddingLeft: '0px' }} >
                                            <Button style={{ pointerEvents: 'none', color: 'black', fontSize: '18px', marginRight: '0px', paddingRight: '0px' }} variant='link' >Loading...</Button>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                        </Col>
                    </Row>
                    </Container>
                    <hr style={{ display: (clickedSearchResultLen-1) === pos ? 'none': '' }} ></hr>
            </div>
            )
        });

        let searchedUsersLen = searchedUsers.length;

        let mapSearchedUsers = searchedUsers.map((user, pos) => {
            return (
                <div >
                    <Container >
                    <Row style={{ paddingBottom: (searchedUsersLen-1) === pos ? '12.5px': '' }} >
                        <Col sm={3} style={{ float: 'right', textAlign: 'right', marginRight: '0px', paddingRight: '0px' }} >
                            <Image src={user.img} style={{ width: '80px', height: '80px', objectFit: 'cover', objectPosition: '50 50', float: 'right', textAlign: 'right' }} roundedCircle />
                        </Col>
                        <Col sm={6} >
                            <div style={{ width: '200px', fontSize: '17px', float: 'left', textAlign: 'left', marginLeft: 'auto', paddingTop: '15px' }} >
                                <Link onClick={this.sendClickedUser.bind(this, user._id, user.username)} exact to={`/${user.username}`} >{user.username}</Link>
                            </div>
                            <div style={{ width: '200px', fontSize: '15px', float: 'left', textAlign: 'left', marginLeft: 'auto' }} >
                                  {user.name}
                            </div>
                        </Col>
                        <Col sm={3} >

                        </Col>
                    </Row>
                    </Container>
                    <hr style={{ display: (searchedUsersLen-1) === pos ? 'none': '' }} ></hr>
            </div>
            )
        });

        let searchedPlaylists = this.state.searchedPlaylists;

        let mapSearchedPlaylistsNames = searchedPlaylists.map((playlist, pos) => {
            return (
                <Button onClick={this.clickPlaylistName.bind(this, playlist._id, playlist.name, playlist.desc, playlist.date, playlist.img, playlist.username, playlist.tracks, playlist.likes, pos)} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px' }} >{playlist.name}</Button> 
            )
        });

        let clickedTracks = this.state.clickedTracks;
        let clicked_id = this.state.clicked_id;
        let clickedName = this.state.clickedName;
        let clickedDesc = this.state.clickedDesc;
        let clickedDate = this.state.clickedDate;
        let clickedImg = this.state.clickedImg;
        let clickedUsername = this.state.clickedUsername;
        let clickedLen = this.state.clickedLen;
        let clickedLikes = this.state.clickedLikes;
        let clickedPos = this.state.clickedPos;

        let clickedDateSub = clickedDate.substring(0,10);

        let clickAddToPlaylistBool = this.state.clickAddToPlaylistBool;

        let username = userDetails.username;
        let isMyPlaylistBool = true;

        if (username !== clickedUsername)
        {
            isMyPlaylistBool = false;
        }

        let likeBtnBool = false;
        let _id = userDetails._id;

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

        let clickAddToPlaylistModal = (
            <div>
                <Modal show={clickAddToPlaylistBool} style={{ textAlign: 'center', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} centered animation size='md' >
                    <Modal.Body>
                        <div style={{ fontSize: '20px' }} >
                            <Spinner animation="border" variant="success" /> Adding Track To Playlist...
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );

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

        let clickLikePlaylistModal = (
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
                            <Spinner animation="border" variant="success" />Adding To Editor's Picks...
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );

        return (
            <div className='App' style={{ float: 'center', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', paddingTop: '41.5px' }} >
            {clickAddToPlaylistModal}
            {likeModal}
            {clickunlikePlaylistModal}
            {clickLikePlaylistModal}
            {playlistAsAdminPickModal}
            <br></br>
            <Container style={{ borderStyle: 'solid', borderColor: 'lightgrey', borderWidth: '2px', width: '55%', backgroundColor: 'white', height: '748px' }} >
                <Row>
                    <Col style={{ borderRightStyle: 'solid', borderRightColor: 'lightgrey', borderWidth: '2px', height: '744px', overflowY: 'scroll' }} sm={3}>
                        <div style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginRight: '8.5px', fontSize: '14px', fontWeight: 'bold', paddingTop: '5px' }} ><FontAwesomeIcon icon={faMusic} /> Music({searchResult.length})</div>
                        <Button onClick={this.musicActive} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px' }} >All({searchResult.length})</Button>
                        <Button onClick={this.musicNameActive} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px' }} >Name({searchResultName.length})</Button>
                        <Button onClick={this.musicArtistActive} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px' }} >Artist({searchResultArtist.length})</Button>
                        <br></br>
                        <div style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginRight: '8.5px', fontSize: '14px', fontWeight: 'bold' }} ><FontAwesomeIcon icon={faUsers} /> User({searchedUsers.length})</div>
                        <Button onClick={this.usersActive} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px' }} >Users({searchedUsers.length})</Button>
                        <br></br>
                        <div style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginRight: '8.5px', fontSize: '14px', fontWeight: 'bold' }} ><FontAwesomeIcon icon={faList} /> Playlists({searchedPlaylists.length})</div>
                        {mapSearchedPlaylistsNames}

                    </Col>
                    <Col sm={9} style={{ overflowY: playlistActive ? '': 'scroll', height: '740px' }} >
                        {
                            musicActive &&
                            <div style={{ paddingTop: '12.5px', paddingBottom: '12.5px' }} >
                                {mapSearchResults}
                            </div>
                        }
                        {
                            usersActive &&
                            <div style={{ paddingTop: '12.5px' }} >
                                {mapSearchedUsers}
                            </div>
                        }
                        {
                            playlistActive &&
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
                                        <Dropdown style={{ visibility: userDetails.accType === 'dev' ? 'visible': 'hidden' }} >
                                            <Dropdown.Toggle style={{ fontSize: '25px', paddingTop: '50px', float: 'left', textAlign: 'left', marginLeft: 'auto', paddingLeft: '31.25px' }}  variant="link"   >
                                                <FontAwesomeIcon icon={faEllipsisH} />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
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
                    </Col>
                </Row>
            </Container>
            </div>
        );
    };
};

export default Search;