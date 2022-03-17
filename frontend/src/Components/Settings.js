//Created by: Byron Georgopoulos
//Created on: 31/10/2021
//Last Modified on: 05/02/2022
/*Description: Settings Page Component*/

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
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

class Settings extends React.Component {

    constructor (props)
    {
        super(props);

        this.state = {
        userDetails: {},
        editProfileActive: true,
        changePasswordActive: false,
        adminMenuActive: false,
        specialMenuActive: false,
        newUsername: '',
        newName: '',
        newLocation: '',
        newBio: '',
        img: '',
        saveChangesBool: false,
        adminReqStatus: '',
        adminReqList: [],
        adminReqStatusBool: false,
        oldPass: '',
        newPass: '',
        newPassCon: '',
        passMsg: '',
        passModalBool: false,
        adminPicks_id: [],
        adminPickPlaylists: [],
        removeAdminPickModalBool: false,
        profileImgHoverBool: false,
        likeModalBool: false,
        likedPlaylistUsers: [],
        };
    };

    componentDidMount = () => {
        let userDetails = this.props.userDetails;
        let _id = userDetails._id;

        //Fetch request to get the user's created playlists
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

        //Fetch request to check if a user is an admin or not, or has applied to be one
        fetch('/checkAdminStatus', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: _id }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.setState({
                            adminReqStatus: result,
                        });
        });

        //Fetch request to fetch a list of all the admin requests
        fetch('/fetchAdminReq', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: _id }),
            })
            .then(res => res.json())
            .then(
            (result) => {
            this.setState({
                            adminReqList: result,
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
        });

    };

    //Edit profile active (default)
    editProfileActive = () => {
        this.setState({ editProfileActive: true, changePasswordActive: false, adminMenuActive: false, specialMenuActive: false });
    };

    //Change password active
    changePasswordActive = () => {
        this.setState({ editProfileActive: false, changePasswordActive: true, adminMenuActive: false, specialMenuActive: false });
    };

    //Admin menu active
    adminMenuActive = () => {
        this.setState({ editProfileActive: false, changePasswordActive: false, adminMenuActive: true, specialMenuActive: false });
    };

    //Editors pick menu active
    specialMenuActive = () => {
        this.setState({ editProfileActive: false, changePasswordActive: false, adminMenuActive: false, specialMenuActive: true });
        let adminPicks_id = this.state.adminPicks_id;

        //Fetch request to get a list of playlist ID's that are currently set as admin (editors) picks
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
                        });
            });
    };

    //Recieves username text box input and updates it's state
    handleUsername = (event) => {
        let newUsername = event.target.value;
        this.setState({ newUsername: newUsername });
    };

    //Recieves name text box input and updates it's state
    handleName = (event) => {
        let newName = event.target.value;
        this.setState({ newName: newName});
    };

    //Recieves location text box input and updates it's state
    handleLocation = (event) => {
        let newLocation = event.target.value;
        this.setState({ newLocation: newLocation });
    };

    //Recieves bio text box input and updates it's state
    handleBio = (event) => {
        let newBio = event.target.value;
        this.setState({ newBio: newBio });
    };

    //Recieves playlist image input and updates it's state
    handleImgSelect = (event) => {
        if (event.target.files && event.target.files[0])
        {
            let reader = new FileReader();
            reader.onload = (e) => {
            this.setState({img: e.target.result});
        };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    //When a user clicks save
    clickSaveChanges = () => {
        this.setState({ saveChangesBool: true });
        let newUsername = this.state.newUsername;
        let newName = this.state.newName;
        let newLocation = this.state.newLocation;
        let newBio = this.state.newBio;
        
        let newImg = this.state.img;

        let userDetails = this.state.userDetails;
        let oldUsername = userDetails.username;
        let oldName = userDetails.name;
        let oldLocation = userDetails.location;
        let oldBio = userDetails.bio;
        let _id = userDetails._id;
        let oldImg = userDetails.img;

        //Checks to see if the new inputted data matches the old data
        if (newUsername === '')
        {
            newUsername = oldUsername;
        }

        if (newName === '')
        {
            newName = oldName;
        }

        if (newLocation === '')
        {
            newLocation = oldLocation;
        }

        if (newBio === '')
        {
            newBio = oldBio;
        }

        if (newImg === '')
        {
            newImg = oldImg;
        }

        //Fetch request to update / edit a user's details
        fetch('/editProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: _id, username: newUsername, name: newName, location: newLocation, bio: newBio, img: newImg }),
        })
        .then(res => res.json())
        .then(
        (result) => {
        this.props.editUserDetails(result);
        this.setState({
                        userDetails: result,
                        saveChangesBool: false,
                    });
        });

    };

    //Recieves old password text box input and updates it's state
    handleOldPass = (event) => {
        let oldPass = event.target.value;
        this.setState({ oldPass: oldPass });
    };

    //Recieves new password text box input and updates it's state
    handleNewPass = (event) => {
        let newPass = event.target.value;
        this.setState({ newPass: newPass });
    };

    //Recieves new password confirmation text box input and updates it's state
    handleNewPassCon = (event) => {
        let newPassCon = event.target.value;
        this.setState({ newPassCon: newPassCon });
    };

    //When a user clicks update password
    changePassword = () => {
        let oldPass = this.state.oldPass;
        let newPass = this.state.newPass;
        let newPassCon = this.state.newPassCon;
        let userDetails = this.state.userDetails;
        let userDetailsOldPass = userDetails.password;
        let _id = userDetails._id;

        //Checks to see if the inputted password is correct
        if (oldPass !== userDetailsOldPass)
        {
            this.setState({ passMsg: 'Your current password is incorrect...', passModalBool: true });
        }
        else
        //Checks to see that the new passwords match
        if (newPass !== newPassCon)
        {
            this.setState({ passMsg: 'Your new passwords do not match...', passModalBool: true });
        }
        else
        if (oldPass === userDetailsOldPass && newPass === newPassCon)
        {
            //Fetch request to update a users password
            fetch('/changePass', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: _id, newPass: newPass }),
                })
                .then(res => res.json())
                .then(
                (result) => {
                this.setState({
                                userDetails: result,
                                passMsg: 'Password successfully changed...',
                                passModalBool: true,
                            });
                });
        }

    };

    //Close the password msg modal
    closePassModal = () => {
        this.setState({ passModalBool: false });
    };

    //When a user requests to be an admin
    requestAdmin = () => {
        let userDetails = this.props.userDetails;

        //Fetch request to set a user as currnetly requesting to become an admin
        fetch('/requestAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userDetails: userDetails }),
        })
        .then(res => res.json())
        .then(
        (result) => {
        this.setState({
                        adminReqStatusBool: true,
                    });
        });

    };

    //Approve a users request to become an admin
    approveAdmin = (pos, _id) => {

        //Fetch request to approve a user as admin (updates their boolean admin status in MongoDB)
        fetch('/approveAdminUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: _id }),
        })

        //Fetch request to remove a user's ID from the currently requested admin list 
        fetch('/approveAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: _id }),
        })

        let adminReqList = this.state.adminReqList;
        adminReqList.splice(pos, 1);
        this.setState({ adminReqList: adminReqList });

    };

    //Deny a users request to become an admin
    declineAdmin = (pos, _id) => {

        //Fetch request to remove a user's ID from the currently requested admin list 
        fetch('/approveAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: _id }),
        })

        let adminReqList = this.state.adminReqList;
        adminReqList.splice(pos, 1);
        this.setState({ adminReqList: adminReqList });
    };

    //Send (as props) the ID and username of another user when their name is clicked on to the App.js file
    sendClickedUser = (_id, username) => {
        this.props.sendClickedUser(_id, username);
    };

    //Set state of the playlist image being hovered over to true
    handleImgMouseEnter = () => {
        this.setState({ profileImgHoverBool: true });
    };

    //Set state of the playlist image being hovered over to false
    handleImgMouseLeave = () => {
        this.setState({ profileImgHoverBool: false });
    };

    //Remove a playlist as admin pick (only avai. when acc. type is set to 'dev')
    removePlaylistAdminPick = (_id, pos) => {
        this.setState({ removeAdminPickModalBool: true });
        let adminPickPlaylists = this.state.adminPickPlaylists;
        adminPickPlaylists.splice(pos, 1);

        let adminPicks_id = this.state.adminPicks_id;
        adminPicks_id.splice(pos, 1);

        //Fetch request to remove the ID of a playlist from the admin (editors) picks collection on MongoDB
        fetch('/removePlaylistAdminPick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: _id }),
        })
        .then(res => res.json())
        .then(
        (result) => {
        this.setState({
                        adminPickPlaylists: adminPickPlaylists,
                        adminPicks_id: adminPicks_id,
                        removeAdminPickModalBool: false,
                    });
        });
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
    openLikesModal = (clickedLikes) => {

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
    }

    render ()
    {
        let userDetails = this.state.userDetails;
        let editProfileActive = this.state.editProfileActive;
        let changePasswordActive = this.state.changePasswordActive;
        let adminMenuActive = this.state.adminMenuActive;
        let specialMenuActive = this.state.specialMenuActive;

        let adminStatus = userDetails.admin;
        let adminReqStatus = this.state.adminReqStatus;
        let adminReqStatusBool = this.state.adminReqStatusBool;

        if (adminReqStatus !== '')
        {
            adminReqStatusBool = true;
        }

        let adminReqList = this.state.adminReqList;

        let mapAdminReqList = adminReqList.map((user, pos) => {
            return (
                    <div >
                    <Row >
                        <Col sm={4} style={{ float: 'left', textAlign: 'left', paddingLeft: '0px', marginLeft: '0px', paddingRight:' 20px' }} >
                            <Image src={user.userDetails.img} style={{ width: '80px', height: '80px', objectFit: 'cover', objectPosition: '50 50', float: 'right', textAlign: 'right' }} roundedCircle />
                        </Col>
                        <Col sm={4} >
                            <div style={{ width: '200px', fontSize: '17px', float: 'left', textAlign: 'left', marginLeft: 'auto', paddingTop: '15px', paddingLeft: '15px' }} >
                                <Link onClick={this.sendClickedUser.bind(this, user.userDetails._id, user.userDetails.username)} exact to={`/${user.userDetails.username}`} >{user.userDetails.username}</Link>
                            </div>
                            <div style={{ width: '200px', fontSize: '15px', float: 'left', textAlign: 'left', marginLeft: 'auto', paddingLeft: '15px' }} >
                                  {user.userDetails.name}
                            </div>
                        </Col>
                        <Col sm={4} >
                        <Dropdown>
                        <Dropdown.Toggle variant="link" style={{ fontSize: '15px', paddingTop: '27.5px' }}  >
                            Options
                        </Dropdown.Toggle>
                        <Dropdown.Menu >
                            <Button onClick={this.approveAdmin.bind(this, pos, user.userDetails._id)} variant='link' >Approve</Button>
                            <hr></hr>
                            <Button onClick={this.declineAdmin.bind(this, pos, user.userDetails._id)} variant='link' >Decline</Button>
                        </Dropdown.Menu>
                    </Dropdown>
                        </Col>
                    </Row>
                    <hr></hr>
            </div>
            )
        });

        let curImg = userDetails.img;
        let newImg = this.state.img;
        let img;

        if (newImg === '')
        {
            img = curImg;
        }
        else
        if (newImg !== '')
        {
            img = newImg;
        }

        let passMsg = this.state.passMsg;
        let passModalBool = this.state.passModalBool;

        let passModal = (
            <div>
                <Modal show={passModalBool} style={{ textAlign: 'center', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} centered animation size='md' >
                    <Modal.Body>
                        <div style={{ fontSize: '20px' }} >
                            Password
                            <hr></hr>
                            {passMsg}
                            <hr></hr>
                            <Button onClick={this.closePassModal} variant="danger">Cancel</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );

        let adminPickPlaylists = this.state.adminPickPlaylists;

        let mapAdminPickPlaylists = adminPickPlaylists.map((playlist, pos) => {
            return (
                <div>
                    <Row>
                        <Col sm={3} >
                            <Image src={playlist.img.replace('100x100', '1200x1200')} style={{ width: '125px', height: '125px', objectFit: 'cover', objectPosition: '50 50' }} />
                        </Col>
                        <Col sm={6} >
                            <div style={{ fontSize: '22px', marginLeft: 'auto', float: 'left', textAlign: 'left', paddingTop: '20px' }} >
                                {playlist.name}
                            </div>
                            <br></br>
                            <br></br>
                            <div style={{ fontSize: '14px', marginLeft: 'auto', float: 'left', textAlign: 'left', width: '90%' }} >
                                {playlist.desc}
                            </div>
                            <div style={{ fontSize: '13px', marginLeft: 'auto', float: 'left', textAlign: 'left' }} >
                                <Link style={{ pointerEvents: playlist.username == userDetails.username ? 'none': 'auto', color: playlist.username == userDetails.username ? 'black': '' }} onClick={this.sendClickedUserLink.bind(this, playlist.username)} exact to={`/${playlist.username}`} >{playlist.username}</Link> • {playlist.tracks.length} tracks • <Button onClick={this.openLikesModal.bind(this, playlist.likes)} style={{ fontSize: '13px', paddingTop: '0px', paddingBottom: '3px', paddingLeft: '0px', paddingRight: '0px' }} variant='link' >{playlist.likes.length} likes </Button> • {playlist.date.substring(0,10)}
                            </div>
                        </Col>
                        <Col sm={3} >
                            <Dropdown>
                            <Dropdown.Toggle style={{ fontSize: '16px', paddingTop: '52px', float: 'left', textAlign: 'left', marginLeft: 'auto', paddingLeft: '0px' }} variant="link" >
                                Options...
                            </Dropdown.Toggle>
                            <Dropdown.Menu >
                                <Button onClick={this.removePlaylistAdminPick.bind(this, playlist._id, pos)} variant='link' >- Editor's Picks...</Button>
                            </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                    <hr></hr>
                </div>
            )
        });

        let adminDisp = '';
        let admin = userDetails.admin;

        if (admin === true)
        {
            adminDisp = 'Yes';
        }

        if (admin === false)
        {
            adminDisp = 'No';
        }

        let accTypeDisp = '';
        let accType = userDetails.accType;

        if (accType === 'default')
        {
            accTypeDisp = 'Default';
        }

        if (accType === 'dev')
        {
            accTypeDisp = 'Developer / Editor';
        }

        let profileImgHoverBool = this.state.profileImgHoverBool;

        let saveChangesBool = this.state.saveChangesBool;

        let saveChangesModal = (
            <div>
                <Modal show={saveChangesBool} style={{ textAlign: 'center', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} centered animation size='md' >
                    <Modal.Body>
                        <div style={{ fontSize: '20px' }} >
                            <Spinner animation="border" variant="success" /> Saving Changes...
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
        
        let likeModalBool = this.state.likeModalBool;
        let likedPlaylistUsers = this.state.likedPlaylistUsers;

        let mapLikedPlaylistUsers = likedPlaylistUsers.map((user) => {
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

        let removeAdminPickModalBool = this.state.removeAdminPickModalBool;

        let removeAdminPickModal = (
            <div>
                <Modal show={removeAdminPickModalBool} style={{ textAlign: 'center', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} centered animation size='md' >
                    <Modal.Body>
                        <div style={{ fontSize: '20px' }} >
                            <Spinner animation="border" variant="danger" /> Removing Playlist...
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );

        return (
            <div className='App' style={{ float: 'center', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', paddingTop: '37.5px' }} >
            {passModal}
            {saveChangesModal}
            {likeModal}
            {removeAdminPickModal}
            <br></br>
            <Container style={{ borderStyle: 'solid', borderColor: 'lightgrey', borderWidth: '2px', width: '55%', backgroundColor: 'white', height: '748px' }} >
                <Row>
                    <Col style={{ borderRightStyle: 'solid', borderRightColor: 'lightgrey', borderWidth: '2px', height: '744px', overflowY: 'scroll' }} sm={3}>
                        <Button onClick={this.editProfileActive} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px' }} >Edit Profile</Button>
                        <br></br>
                        <Button onClick={this.changePasswordActive} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px' }} >Change Password</Button>
                        <br></br>
                        <Button onClick={this.adminMenuActive} variant='outline-dark' style={{ border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px' }} >Admin Menu</Button>
                        <br></br>
                        <Button onClick={this.specialMenuActive} variant='outline-dark' style={{ visibility: userDetails.accType === 'dev' ? 'visible': 'hidden', border: 'none', borderRadius: '0px', textAlign: 'right', float: 'right', width: '100%', marginTop: '1.5px' }} >Editor's Picks Menu</Button>
                    </Col>
                    <Col sm={9} style={{ height: '744px' }} >
                        {
                           editProfileActive &&
                           <div>
                               <div>
                                <Container>
                                   <Row style={{ paddingTop: '10px' }} >
                                       <Col style={{ float: 'right', marginRight: 'auto', textAlign: 'right' }} sm={4} >
                                        <div>
                                            <Image onClick={() => this.refs.fileInput.click()} onMouseEnter={this.handleImgMouseEnter} onMouseLeave={this.handleImgMouseLeave} src={img} style={{ width: '100px', height: '100px', objectFit: 'cover', objectPosition: '50 50', filter: profileImgHoverBool === true ? 'brightness(35%)': '' }} roundedCircle />
                                            <Button style={{ position: 'absolute', top: '18.5%', left: '55.75%', pointerEvents: 'none', visibility: profileImgHoverBool === true ? 'visible': 'hidden', color: 'white' }} variant='link' > <FontAwesomeIcon icon={faPencilAlt} style={{ fontSize: '20px', color: 'white' }} /> <div>Choose</div><div>Photo</div></Button>
                                            <Form.Control style={{ display: 'none' }} ref='fileInput' accept='.png' onChange={this.handleImgSelect} type="file" />
                                        </div>
                                       </Col>
                                       <Col style={{ float: 'left', marginRight: 'auto', textAlign: 'left', paddingTop: '25px' }} sm={8} >
                                            <div style={{ fontSize: '18px', paddingLeft: '9px', paddingBottom: '0px' }} >
                                                {userDetails.username}
                                            </div>
                                            <div style={{ fontSize: '15px', paddingLeft: '9px', paddingBottom: '0px' }} >
                                                {userDetails.name}
                                            </div>
                                       </Col>
                                   </Row>
                                </Container>
                               </div>
                                <hr></hr>
                                <div style={{ height: '542.5px', overflowY: 'scroll' }} >
                                <Container>
                                    <Row>
                                      <Col style={{ float: 'right', marginRight: 'auto', textAlign: 'right', fontSize: '16px' }} sm={4} >
                                            Email:
                                       </Col>
                                       <Col sm={8} >
                                            <Form.Control disabled type="text" defaultValue={userDetails.email} style={{ width: '75%' }} />
                                            <div style={{ color: 'grey', paddingTop: '5px', textAlign: 'left', float: 'left', paddingLeft: '10px', width: '75%' }} >
                                                Your Login Email Address (Cannot Be Changed)
                                            </div>
                                       </Col>
                                    </Row>
                                    <br></br>
                                   <Row>
                                        <Col style={{ float: 'right', marginRight: 'auto', textAlign: 'right', fontSize: '16px' }} sm={4} >
                                            Username:
                                       </Col>
                                       <Col sm={8} >
                                            <Form.Control disabled onChange={this.handleUsername} type="text" defaultValue={userDetails.username} style={{ width: '75%' }} />
                                            <div style={{ color: 'grey', paddingTop: '5px', textAlign: 'left', float: 'left', paddingLeft: '10px', width: '75%' }} >
                                                Your Unique Username, To Help Friends Discover You (Cannot Be Changed)
                                            </div>
                                       </Col>
                                    </Row>
                                    <br></br>
                                    <Row>
                                       <Col style={{ float: 'right', marginRight: 'auto', textAlign: 'right', fontSize: '16px' }} sm={4} >
                                            Full Name:
                                       </Col>
                                       <Col sm={8} >
                                            <Form.Control onChange={this.handleName} type="text" defaultValue={userDetails.name} style={{ width: '75%' }} />
                                            <div style={{ color: 'grey', paddingTop: '5px', textAlign: 'left', float: 'left', paddingLeft: '10px', width: '75%' }} >
                                                Your Real-Life, Full Name, To Help Friends Discover You (Can Be Changed)
                                            </div>
                                       </Col>
                                    </Row>
                                    <br></br>
                                    <Row>
                                      <Col style={{ float: 'right', marginRight: 'auto', textAlign: 'right', fontSize: '16px' }} sm={4} >
                                            Location:
                                       </Col>
                                       <Col sm={8} >
                                            <Form.Control onChange={this.handleLocation} type="text" defaultValue={userDetails.location} style={{ width: '75%' }} />
                                              <div style={{ color: 'grey', paddingTop: '5px', textAlign: 'left', float: 'left', paddingLeft: '10px', width: '75%' }} >
                                                Your Location (i.e. city, country, etc.) Somewhere In The World (Can Be Changed)
                                            </div>
                                       </Col>
                                    </Row>
                                    <br></br>
                                    <Row>
                                      <Col style={{ float: 'right', marginRight: 'auto', textAlign: 'right', fontSize: '16px' }} sm={4} >
                                            Bio:
                                       </Col>
                                       <Col sm={8} >
                                            <Form.Control maxLength='65' onChange={this.handleBio} type="text" defaultValue={userDetails.bio} style={{ width: '75%' }} />
                                              <div style={{ color: 'grey', paddingTop: '5px', textAlign: 'left', float: 'left', paddingLeft: '10px', width: '75%' }} >
                                                A Biography, Or A Little Bit About Yourself (Max 65 Characters) (Can Be Changed)
                                            </div>
                                       </Col>
                                    </Row>
                                    <br></br>
                                    <Row>
                                      <Col style={{ float: 'right', marginRight: 'auto', textAlign: 'right', fontSize: '16px' }} sm={4} >
                                            Admin:
                                       </Col>
                                       <Col sm={8} >
                                            <Form.Control disabled type="text" defaultValue={adminDisp} style={{ width: '75%' }} />
                                            <div style={{ color: 'grey', paddingTop: '5px', textAlign: 'left', float: 'left', paddingLeft: '10px', width: '75%' }} >
                                                Your Admin Status (Changed By Applying For Admin)
                                            </div>
                                       </Col>
                                    </Row>
                                    <br></br>
                                    <Row>
                                      <Col style={{ float: 'right', marginRight: 'auto', textAlign: 'right', fontSize: '16px' }} sm={4} >
                                            Account Type:
                                       </Col>
                                       <Col sm={8} >
                                            <Form.Control disabled type="text" defaultValue={accTypeDisp} style={{ width: '75%' }} />
                                            <div style={{ color: 'grey', paddingTop: '5px', textAlign: 'left', float: 'left', paddingLeft: '10px', width: '75%' }} >
                                                Your Account Type. Most Users Will Be Default, But Developers And Editors Will Be Displayed Here (Cannot Be Changed)
                                            </div>
                                       </Col>
                                    </Row>
                                    <br></br>
                                    <Row>
                                        <Col style={{ float: 'right', marginRight: 'auto', textAlign: 'right', fontSize: '16px' }} sm={4} >
                                            ID:
                                       </Col>
                                       <Col sm={8} >
                                            <Form.Control disabled type="text" defaultValue={userDetails._id} style={{ width: '75%' }} />
                                            <div style={{ color: 'grey', paddingTop: '5px', textAlign: 'left', float: 'left', paddingLeft: '10px', width: '75%' }} >
                                                Your Unique Profile ID (Cannot Be Changed)
                                            </div>
                                       </Col>
                                   </Row>
                                   </Container>
                                </div>
                                <hr></hr>
                                <div>
                                    <Container>
                                        <Row>
                                            <Col>
                                                <Button onClick={this.clickSaveChanges} variant="primary">Save Changes</Button>
                                            </Col>
                                            <Col>
                                            
                                            </Col>
                                        </Row>
                                    </Container>
                                </div>
                            </div>
                        }
                        {
                            changePasswordActive &&
                            <div>
                                <Container>
                                   <Row style={{ paddingTop: '10px' }} >
                                    <Col style={{ float: 'right', marginRight: 'auto', textAlign: 'right' }} sm={4} >
                                            <Image src={img} style={{ width: '100px', height: '100px', objectFit: 'cover', objectPosition: '50 50' }} roundedCircle />
                                    </Col>
                                    <Col style={{ float: 'left', marginRight: 'auto', textAlign: 'left', paddingTop: '25px' }} sm={4} >
                                        <div style={{ fontSize: '18px', paddingLeft: '9px', paddingBottom: '0px' }} >
                                            {userDetails.username}
                                        </div>
                                        <div style={{ fontSize: '15px', paddingLeft: '9px', paddingBottom: '0px' }} >
                                            {userDetails.name}
                                        </div>
                                        <div style={{ paddingTop: '0px' }} >
                                            <Row style={{ paddingLeft: '15px' }} >

                                            </Row>
                                        </div>
                                    </Col>
                                       <Col sm={4} >
                                       </Col>
                                   </Row>
                                   <hr></hr>
                                   <Row>
                                    <Col style={{ float: 'right', marginRight: 'auto', textAlign: 'right', fontSize: '16px' }} sm={4} >
                                            Old Password:
                                       </Col>
                                       <Col sm={8} >
                                            <Form.Control onChange={this.handleOldPass} type="password" style={{ width: '75%' }} />
                                       </Col>
                                   </Row>
                                   <br></br>
                                    <Row>
                                    <Col style={{ float: 'right', marginRight: 'auto', textAlign: 'right', fontSize: '16px' }} sm={4} >
                                            New Password:
                                       </Col>
                                       <Col sm={8} >
                                            <Form.Control onChange={this.handleNewPass} type="password" style={{ width: '75%' }} />
                                       </Col>
                                   </Row>
                                   <br></br>
                                    <Row>
                                    <Col style={{ float: 'right', marginRight: 'auto', textAlign: 'right', fontSize: '16px' }} sm={4} >
                                            Confirm New Password:
                                       </Col>
                                       <Col sm={8} >
                                            <Form.Control onChange={this.handleNewPassCon} type="password" style={{ width: '75%' }} />
                                       </Col>
                                   </Row>
                                   <hr></hr>
                                      <Row>
                                       <Col>
                                             <Button onClick={this.changePassword} variant="primary">Change Password</Button>
                                       </Col>
                                        <Col>
                                            
                                       </Col>
                                   </Row>
                                </Container>
                            </div>
                        }
                        {
                            adminMenuActive &&
                            <div>
                                <Container>
                                    <Row style={{ paddingTop: '10px' }} >
                                    <Col style={{ float: 'right', marginRight: 'auto', textAlign: 'right' }} sm={4} >
                                            <Image src={img} style={{ width: '100px', height: '100px', objectFit: 'cover', objectPosition: '50 50' }} roundedCircle />
                                    </Col>
                                    <Col style={{ float: 'left', marginRight: 'auto', textAlign: 'left', paddingTop: '25px' }} sm={4} >
                                        <div style={{ fontSize: '18px', paddingLeft: '9px', paddingBottom: '0px' }} >
                                            {userDetails.username}
                                        </div>
                                        <div style={{ fontSize: '15px', paddingLeft: '9px', paddingBottom: '0px' }} >
                                            {userDetails.name}
                                        </div>
                                        <div style={{ paddingTop: '0px' }} >
                                            <Row style={{ paddingLeft: '15px' }} >

                                            </Row>
                                        </div>
                                    </Col>
                                       <Col sm={4} >
                                       </Col>
                                   </Row>
                                </Container>
                                {
                                    adminStatus &&
                                    <div>
                                        <hr></hr>
                                        <Container style={{ height: '600px', overflowY: 'scroll' }} >
                                            {mapAdminReqList}
                                        </Container>
                                    </div>
                                }
                                {
                                    !adminStatus &&
                                    <div>
                                        {
                                            adminReqStatusBool &&
                                            <div>
                                                <hr></hr>
                                                <br></br>
                                                You have requested to become an Admin, and your request is under consideration by the Admins.
                                                <br></br>
                                            </div>
                                        }
                                        {
                                            !adminReqStatusBool &&
                                            <div>
                                            <hr></hr>
                                            <br></br>
                                                Request to be an Admin to be able to create more than 3 playlists at a time. Upon request, an Admin will review your current playlists, and if the criteria is met, will approve your request.
                                            <br></br>
                                            <Button onClick={this.requestAdmin} variant='link' >Request To Be An Admin...</Button>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        }
                        {
                            specialMenuActive &&
                            <div style={{ paddingTop: '10px', height: '742.5px', overflowY: 'scroll', overflowX: 'hidden' }} >
                                {mapAdminPickPlaylists}
                            </div>
                        }
                    </Col>
                </Row>
            </Container>
            </div>
        );
    };
};

export default Settings;