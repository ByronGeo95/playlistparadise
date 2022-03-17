//Created by: Byron Georgopoulos
//Created on: 31/10/2021
//Last Modified on: 25/01/2022
/*Description: Controller containing all the functions that CRUD the user collection on MongoDB*/

//Requirement declarations
let User = require('../models/user.model.js');
let jwt = require('jsonwebtoken');
const fs = require('fs'); 
const imgur = require('imgur-node-api'),
path = require('path');
require('dotenv').config();

//Sign Up Function
exports.signUp = (req, res) => {

    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    let accType = req.body.accType;

    //Find user by email in database
    User.findOne({ 'email': email }, (err, data) => {
        try
        { 
            //Checks if email already exists in databse
            if (data != null)
            {
                console.log(`Error! Email Already In Use...`);
                res.send({ 'errMsg': 'The email address you entered is already in use. Please try again with a different email address.' });
            }
            else
            {
                User.findOne({ 'username': username }, (err, data) => {
                    try
                    {
                        //Checks if username is already in database
                        if (data != null)
                        {
                            console.log(`Error! Username Already In Use...`);
                            res.send({ 'errMsg': 'The username you entered is already in use. Please try again with a different username.' });
                        }
                        else
                        {
                            //Creates new user model
                            let newUser = new User({
                                email: email,
                                password: password,
                                username: username,
                                accType: accType,
                            });

                            //Saves new user model into MongoDB
                            newUser.save((err, data) => {
                                if (err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    console.log(`newUser.save: ${data}`);
                                    //JWT Payload
                                    payload = {
                                        '_id': data._id,
                                        'admin' : data.admin,
                                        'accType': data.accType,
                                        'email': data.email,
                                        'username': data.username,
                                        'name': data.name,
                                        'location': data.location,
                                        'bio': data.bio,
                                        'img': data.img,
                                        'likedPlaylists': data.likedPlaylists,
                                    };
                                    //Creates new JWT based on previous payload, and sends it back to the frontend
                                    const token = jwt.sign( JSON.stringify(payload), 'jwt-secret', { algorithm: 'HS256' });
                                    res.send({ 
                                        'token' : token,
                                    });
                                }
                            });
                        }
                    }
                    catch (err)
                    {
                       console.log(`catch err: ${err}`); 
                    }
                });
            }
        }
        catch (err)
        {
            console.log(`catch err: ${err}`);
        }
    });
};

//Login Function
exports.login = (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    //Finds user details based on email
    User.findOne({ 'email': email }, (err, data) => {
        try
        {
            //Checks if email matches and password matches what is in the database
            if (email === data.email && password === data.password)
            {   
                //JWT Payload 
                payload = {
                    '_id': data._id,
                    'admin' : data.admin,
                    'accType': data.accType,
                    'email': data.email,
                    'username': data.username,
                    'name': data.name,
                    'location': data.location,
                    'bio': data.bio,
                    'img': data.img,
                    'likedPlaylists': data.likedPlaylists,
                };

                //Creates new JWT based on the previous payload, and sends ir back to tge frontend
                const token = jwt.sign( JSON.stringify(payload), 'jwt-secret', { algorithm: 'HS256' });
                res.send({ 
                    'token' : token,
                    'errMsg': '',
                });
            }
            else
            {
                res.send({ 
                    'errorMsg': `U&P Don't Match...`,
                });
            }
        }
        catch (err)
        {
            res.send({ 
                'errorMsg': `U Not Found...`,
            });
        }
    });

};

//Function to verify JWT upon sign up or login (follows on from previous 2 functions)
exports.verifyUserToken = (req, res) => {
    //Receives the token from the frontend, and splits it
    const auth = req.headers['authorization'];
    const token = auth.split(' ')[1];
    try
    {
        //Decodes (i.e. puts the token back into useable data) the JWT
        const decoded = jwt.verify(token, 'jwt-secret' );
        res.send({ 
            '_id': decoded._id,
            'admin' : decoded.admin,
            'accType': decoded.accType,
            'email': decoded.email,
            'username': decoded.username,
            'name': decoded.name,
            'location': decoded.location,
            'bio': decoded.bio,
            'img': decoded.img,
            'likedPlaylists': decoded.likedPlaylists,
        });
    }
    catch (err)
    {
        console.log(`Bad JWT: ${err}`);
    }
};

//Function to fetch user details upon request of the frontend
exports.fetchUserDetails = (req, res) => {
    let _id = req.body._id;

    //Finds the user details by unique MongoDB ID
    User.findById({ '_id': _id }, (err, data) => {
        if (err)
        {
            console.log(err);
        }
        else
        {
            res.send(data);
        }
    });
};

//Function to fetch user details upon request of the frontend
exports.fetchUserDetailsUsername = (req, res) => {
    let username = req.body.username;

    //Finds the user details by a users username, not unique MongoDB ID (only used in special cases)
    User.findOne({ 'username': username }, (err, data) => {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(data);
            res.send(data);
        }
    });
};

//Function to edit a users details
exports.editProfile = (req, res) => {
    let _id = req.body._id;
    let username = req.body.username;
    let name = req.body.name;
    let location = req.body.location;
    let bio = req.body.bio;
    let img = req.body.img;

    //Find the unique entry to be edited
    User.findById({ '_id': _id }, (err, data) => {
        if (err)
        {
            console.log(err);
        }
        else
        {
            //Checks to see whether the profile picture is being updated too or not
            if (img === data.img)
            {
                User.findByIdAndUpdate({ '_id': _id }, { 'username': username, 'name': name, 'location': location, 'bio': bio }, { upsert: true, new: true }, (err, data) => {
                    if (err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log(data);
                        res.send(data);
                    }
                });
            }
            else
            if (img !== data.img)
            {
                //Removes the prefix to a base64 image string
                let newImg = img.replace(/^data:image\/png;base64,/, "");
                //Saves the image as a .png to the server
                fs.writeFile(`${_id} out.png`, newImg, 'base64', function(err) {
                    console.log(err);
                });
                //Imgur ID
                imgur.setClientID(process.env.IMGUR_ID);
                let imgurURL = '';

                //Uploads the image from the server to Imgur using the Imgur API, using a third party Imgur npm
                imgur.upload(path.join(__dirname, `../${_id} out.png`), function (err, res1) {
                    console.log(res1.data.link);
                    imgurURL = res1.data.link;

                    User.findByIdAndUpdate({ '_id': _id }, { 'username': username, 'name': name, 'location': location, 'bio': bio, 'img': imgurURL }, { upsert: true, new: true }, (err, data) => {
                        if (err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            console.log(data);
                            res.send(data);
                        }
                    });
                });
            }
        }
    });

};

//Function to search the entire collection of users by a users search term
exports.searchUsers = (req, res) => {
    let searchTerm = req.body.searchTerm;
    let username = req.body.username;
    let name = req.body.name;

        User.find({ $or: [ { 'username': { $regex: new RegExp(searchTerm, 'i'), $ne: username } }, { 'name': { $regex: new RegExp(searchTerm, 'i'), $ne: name } } ] }, (err, data) => {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(data);
            res.send(data);
        }
    });

};

//Function to add a playlist ID to a users 'likedPlaylists' object in their unique user entry
exports.addToLikedPlaylists = (req, res) => {
    let _id = req.body._id;
    let user_id = req.body.user_id;

    User.findOneAndUpdate({ '_id': user_id }, { $push: { 'likedPlaylists': _id } }, { new: true,  upsert: true, useFindAndModify: false }, (err, data) => {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(data);
            res.send(data);
        }
    });
};

//Function to get the details of all users that have liked a playlist for the 'Likes' Modal
exports.getLikedUserDetails = (req, res) => {
    let clickedLikes = req.body.clickedLikes;

    User.find({ '_id': clickedLikes }, (err, data) => {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(data);
            res.send(data);
        }
    });
};

//Function to remove a playlist ID from a users 'likedPlaylists' object in their unique user entry
exports.unlikeLikedPlaylistUser = (req, res) => {
    let _id = req.body._id;
    let playlist_id = req.body.playlist_id;

    User.findOneAndUpdate({ '_id': _id }, { $pull: { 'likedPlaylists': playlist_id } }, { new: true, useFindAndModify: false }, (err, data) => {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(data);
            res.send(data);
        }
    });

};

//Function to change a users admin status from false to true
exports.approveAdminUser = (req, res) => {
    let _id = req.body._id;

    User.findByIdAndUpdate({ '_id': _id }, { 'admin': true }, (err, data) => {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(data);
        }
    });

};

//Function to change a users password
exports.changePass = (req, res) => {
    let _id = req.body._id;
    let newPass = req.body.newPass;

    User.findByIdAndUpdate({ '_id': _id }, { 'password': newPass }, { upsert: true, new: true }, (err, data) => {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(data);
            res.send(data);
        }
    });
};