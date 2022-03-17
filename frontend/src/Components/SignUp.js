//Created by: Byron Georgopoulos
//Created on: 31/10/2021
//Last Modified on: 01/02/2022
/*Description: Sign Up Page Component*/

import React from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

class SignUp extends React.Component {

    constructor (props)
    {
        super(props);

        this.state = {
          email: '',
          pass: '',
          passCon: '',
          username: '',
          passMatchBool: true,
          errMsg: '',
          token: '',
          signUpSucBool: false,
          userDetails: [],
          emailValidBool: false,
          passValidBool: false,
          usernameValidBool: false,
          passConValidBool: false,
          errMsgModalBool: false,
          signUpBtnTool: false,
        };
    };

    // componentDidMount = () => {
    //   console.log('CDM');
    // };

    //Recieves email text box input and updates it's state
    handleEmail= (event) => {
      let email = event.target.value;

      //Email address must contain an '@' and a '.'
      let re = /\S+@\S+\.\S+/;
      if (re.test(email))
      {
        this.setState({ emailValidBool: true });
      }
      if (!re.test(email))
      {
        this.setState({ emailValidBool: false });
      }

      this.setState({ email: email });
    };

    //Recieves password text box input and updates it's state
    handlePass= (event) => {
      let pass = event.target.value;

      //Checks to make sure the password is at least 8 characters in length
      if (pass.length < 8)
      {
        this.setState({ passValidBool: false });
      }
      if (pass.length >= 8)
      {
        this.setState({ passValidBool: true });
      }

      this.setState({ pass: pass });
    };

    //Recieves password confirmation text box input and updates it's state
    handlePassCon = (event) => {
      let passCon = event.target.value;

      //Checks to make sure the password is at least 8 characters in length
      if (passCon.length < 8)
      {
        this.setState({ passConValidBool: false });
      }
      if (passCon.length >= 8)
      {
        this.setState({ passConValidBool: true });
      }

      this.setState({ passCon: passCon });
    };

    //Recieves username text box input and updates it's state
    handleUsername = (event) => {
      let username = event.target.value;

      //Chackes to make sure the username is at least 6 characters in length
      if (username.length < 6)
      {
        this.setState({ usernameValidBool: false });
      }

      if (username.length >=6)
      {
        this.setState({ usernameValidBool: true });
      }

      this.setState({ username: username });
    };

    //When the sign up button is pressed
    clickSignUp = () => {
      let email = this.state.email;
      let pass = this.state.pass;
      let passCon = this.state.passCon;
      let username = this.state.username;
      let accType = 'default';

      //If the password and password confirmation match
      if (pass === passCon)
      {
        fetch('/signUp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password: pass, username: username, accType: accType }),
          })
          .then(res => res.json())
          .then(
          (result) => {
          if (result.errMsg)
          {
            this.setState({ errMsgModalBool: true });
          }
          this.setState({
                        token: result.token,
                        errMsg: result.errMsg,
                    });
            })
            //After the fetch request is finished, call a function to verify the JWT
            .then(this.verifyUserToken);
      }

      //If the password and the password confirmation do not match
      if (pass !== passCon)
      {
          this.setState({
            errMsg: `The passwords you entered don't match. Please try again.`,
            errMsgModalBool: true
        });
      }

    };

    //Verify the returned JSON Web Token
    verifyUserToken = () => {
        let token = this.state.token;

        fetch('/verifyUserToken', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            })
            .then(res => res.json())
            .then(
            (result) => {
                this.props.userDetails(result);
                this.setState({
                    userDetails: result,
                });
            })

    };

    //Changes state in the App.js file so that the login page is shown, and not the sign up page
    clickLogin = () => {
      this.props.loginAct(true);
    };

    //Changes state of an error message modal so that it closes
    closeErrMsgModal = () => {
      this.setState({ errMsgModalBool: false });
    };

    //Checks whether the sing up button is disabled depending if all the text box's inputs are valid
    //
    hoverSignUpBtn = () => {
        let emailValidBool = this.state.emailValidBool;
        let passValidBool = this.state.passValidBool;
        let usernameValidBool = this.state.usernameValidBool;
        let passConValidBool = this.state.passConValidBool;
        let signUpBtnBool = false;

        if (emailValidBool === true && passValidBool === true && usernameValidBool === true && passConValidBool === true)
        {
          signUpBtnBool = true;
        }

        if (signUpBtnBool === false)
        {
          this.setState({ signUpBtnTool: true });
        }
    };

    //When the users mouse has left the sign up button (no longer hovering)
    leaveSignUpBtn = () => {
      this.setState({ signUpBtnTool: false });
    };

    render ()
    {

        let errMsg = this.state.errMsg;
        let errMsgModalBool = this.state.errMsgModalBool;

        //Error Msg Modal for when sign up is not successful
        let errMsgModal = (
            <div>
                <Modal show={errMsgModalBool} style={{ textAlign: 'center', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} centered animation size='md' >
                    <Modal.Body>
                        <div>
                          <div>
                             <div style={{ fontSize: '25px', display: 'inline-block' }} >Error</div><div style={{ display: 'inline-block', float: 'right', textAlign: 'right', marginRight: '0px' }} ><Button style={{ color: 'red', marginTop: '0px', paddingTop: '0px' }} onClick={this.closeErrMsgModal} variant='link' ><FontAwesomeIcon style={{ fontSize: '30px' }} icon={faTimesCircle} /></Button></div>
                          </div>
                          <hr></hr>
                          <div style={{ fontSize: '16px', paddingTop: '20px', paddingBottom: '20px' }} >
                            {errMsg}
                          </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );

        let emailValidBool = this.state.emailValidBool;
        let passValidBool = this.state.passValidBool;
        let usernameValidBool = this.state.usernameValidBool;
        let passConValidBool = this.state.passConValidBool;
        let signUpBtnBool = false;
        
        //Checks whether the sing up button is disabled depending if all the text box's inputs are valid
        if (emailValidBool === true && passValidBool === true && usernameValidBool === true && passConValidBool === true)
        {
          signUpBtnBool = true;
        }

        let signUpBtnTool = this.state.signUpBtnTool;
        
        //Props for the sign up button tooltip (hover over sign up button)
        const renderTooltip = (props) => (
          <Tooltip {...props}>
             <div>
                Please complete the form
            </div>
          </Tooltip>
        );
        
        return (
             <div style={{ position: 'relative', top: '24%' }} className='App'>
               {errMsgModal}
               <div style={{ backgroundColor: 'white', width: '17.5%', borderStyle: 'solid', borderColor: 'grey', borderRadius: '4px', borderWidth: '0.5px',float: 'center', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', marginTop: '12.5px' }} >
                <div style={{ fontSize: '40px' }} >
                  <Image style={{ width: '290px', height: '290px', marginTop: '15px', marginBottom: '15px' }} src='https://i.imgur.com/SoUbkIV.png' />
                  <br></br>
                  <div style={{ fontSize: '16px', color: '#707070', fontWeight: 'bold' }} >
                    Sign up to see playlists created by your friends.
                  </div>
                </div>
                <br></br>
                <Form>
                <Form.Group>
                <Form.Control onChange={this.handleEmail} type="text" placeholder="Email Address" style={{ width: '90%', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} />
                <div style={{ color: 'grey', paddingTop: '5px', paddingBottom: '10px', float: 'left', textAlign: 'left', marginLeft: '20px' }} >
                    Please Enter a Valid Email Address.
                </div>
                </Form.Group>
                <br></br>
                <Form.Group>
                <Form.Control onChange={this.handlePass} type="password" placeholder="Password" style={{ width: '90%', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} />
                <div style={{ color: 'grey', paddingTop: '5px', paddingBottom: '10px', float: 'left', textAlign: 'left', marginLeft: '20px' }} >
                    Password must be at least 8 characters.
                </div>
                </Form.Group>
                <br></br>
                <Form.Group>
                <Form.Control onChange={this.handlePassCon} type="password" placeholder="Confirm Password" style={{ width: '90%', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} />
                <div style={{ color: 'grey', paddingTop: '5px', paddingBottom: '10px', float: 'left', textAlign: 'left', marginLeft: '20px' }} >
                    Confirm Your Password.
                </div>
                </Form.Group>
                <br></br>
                <Form.Group>
                <Form.Control onChange={this.handleUsername} type="text" placeholder="Username" style={{ width: '90%', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} />
                <div style={{ color: 'grey', paddingTop: '5px', paddingBottom: '30px', float: 'left', textAlign: 'left', marginLeft: '20px' }} >
                    Username must be at least 6 characters.
                </div>
                </Form.Group>
                </Form>
                <br></br>
                <div style={{ paddingTop: '35px' }} >
                  <OverlayTrigger placement='right' delay={{ show: 250, hide: 400 }} overlay={renderTooltip} show={signUpBtnTool} >
                  <div>
                      <Button disabled={!signUpBtnBool} style={{ width: '90%' }} onMouseOver={this.hoverSignUpBtn} onMouseLeave={this.leaveSignUpBtn} onClick={this.clickSignUp} onMouseOver={this.hoverSignUpBtn} variant='success'>Sign Up</Button>
                  </div>
                </OverlayTrigger>
                </div>
                <br></br>
               </div>
                <br></br>
                <div style={{ backgroundColor: 'white', width: '17.5%', borderStyle: 'solid', borderColor: 'grey', borderRadius: '4px', borderWidth: '0.5px', height: '40px', fontSize: '15px', float: 'center', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }} >
                   <Row style={{ paddingLeft: '27.5px' }} >
                     <Col sm={8} style={{ textAlign: 'right', float: 'right', marginRight: '0px', paddingRight: '0px', paddingTop: '7.5px' }} >
                        Already have an account?
                     </Col>
                     <Col sm={4} style={{ textAlign: 'left', float: 'left', marginLeft: '0px', paddingLeft: '0px', paddingTop: '1.5px' }} >
                        <Button style={{ fontSize: '15px' }} onClick={this.clickLogin} variant='link' >Login</Button>
                     </Col>
                   </Row>
                </div>
                
            </div>
        );
    };
};

export default SignUp;