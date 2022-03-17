//Created by: Byron Georgopoulos
//Created on: 31/10/2021
//Last Modified on: 01/02/2022
/*Description: Login Page Component*/

import React from 'react';

//Bootstrap Components
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

class Login extends React.Component {

    constructor (props)
    {
        super(props);

        this.state = {
          email: '',
          pass: '',
          token: '',
          userDetails: [],
        };
    };

    //Recieves email text box input and updates it's state
    handleEmail= (event) => {
      let email = event.target.value;
      this.setState({ email: email });
    };

    //Recieves password text box input and updates it's state
    handlePass= (event) => {
      let pass = event.target.value;
      this.setState({ pass: pass });
    };

    //When the login button is clicked
    clickLogin = () => {
      let email = this.state.email;
      let pass = this.state.pass;

      //Fetch request when the login button is cliked that returns a JWT (JSON Web Token)
      fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: pass }),
      })
      .then(res => res.json())
      .then(
      (result) => {
      this.setState({
                    token: result.token,
                });
        })
        //After the fetch request is finished, call a function to verify the JWT
        .then(this.verifyUserToken);

    };

    //Verify the returned JSON Web Token
    verifyUserToken = () => {
        let token = this.state.token;

        //Fetch request that returns the a users details once the JWT has been verified
        fetch('/verifyUserToken', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            })
            .then(res => res.json())
            .then(
            (result) => {
              //Sends the users details as props back to the App.js file
                this.props.userDetails(result);
                this.setState({
                    userDetails: result,
                });
            })

    };

    //Changes state in the App.js file so that the sign up page is shown, and not the login page
    clickSignUp = () => {
      this.props.signUpAct(true);
    };

    render ()
    {
        return (
             <div className='App'>
               <div style={{ backgroundColor: 'white', width: '17.5%', borderStyle: 'solid', borderColor: 'grey', borderRadius: '4px', borderWidth: '0.5px',float: 'center', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', marginTop: '100px' }} >
                 <Image style={{ width: '290px', height: '290px', marginTop: '15px', marginBottom: '15px' }} src='https://i.imgur.com/SoUbkIV.png' />
                <br></br>
                  <div style={{ fontSize: '16px', color: '#707070', fontWeight: 'bold' }} >
                    Login to get started with Playlist Paradise.
                  </div>
                  <br></br>
                <Form>
                <Form.Group>
                <Form.Control onChange={this.handleEmail} type="text" placeholder="Email Address" style={{ width: '90%', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} />
                </Form.Group>
                <br></br>
                <Form.Group>
                <Form.Control onChange={this.handlePass} type="password" placeholder="Password" style={{ width: '90%', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} />
                </Form.Group>
                </Form>
                <br></br>
                <Button style={{ width: '90%' }} onClick={this.clickLogin} variant='primary'>Login</Button>
                <br></br>
                <br></br>
               </div>
                <br></br>
                <div style={{ backgroundColor: 'white', width: '17.5%', borderStyle: 'solid', borderColor: 'grey', borderRadius: '4px', borderWidth: '0.5px', height: '40px', float: 'center', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }} >
                    <Row style={{ paddingLeft: '0px', paddingRight: '10px' }} >
                     <Col sm={8} style={{ textAlign: 'right', float: 'right', marginRight: '0px', paddingRight: '0px', paddingTop: '7.5px', fontSize: '15px' }} >
                        Don't have an account?
                     </Col>
                     <Col sm={4} style={{ textAlign: 'left', float: 'left', marginLeft: '0px', paddingLeft: '0px', paddingTop: '1.5px', fontSize: '15px' }} >
                        <Button style={{ fontSize: '15px' }} onClick={this.clickSignUp} variant='link' >Sign Up</Button>
                     </Col>
                   </Row>
                </div>
            </div>
        );
    };
};

export default Login;