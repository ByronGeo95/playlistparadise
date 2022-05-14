//Created by: Byron Georgopoulos
//Created on: 31/10/2021
//Last Modified on: 25/01/2022
/*Description: The main file for the express server of the application. Handles Express.js, Body Parser from the React frontend, all the routes, as well as the connection to MongoDB via Mongoose*/

//Require Express
const express = require('express');

const path = require('path');

//Require Dotenv
require('dotenv').config();

//Require Helmet
const helmet = require('helmet');

const app = express();

// if (process.env.NODE_ENV === 'production')
// {
//     app.use(express.static(path.join(__dirname, 'frontend/build')));
//     app.get('*',(req,res)=> {res.sendFile(path.resolve(__dirname, 'frontend', 'build','index.html'));});
// }

// app.use(express.static(path.join(__dirname,'frontend/build')));

app.use(helmet());

//Require Bosy Parser (50mb limit for images)
const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//Login Routes
require('./routes/login.js')(app);
require('./routes/signUp.js')(app);
require('./routes/verifyUserToken.js')(app);

//Routes that deal with fetching user data
require('./routes/fetchUserDetails.js')(app);
require('./routes/fetchUserDetailsUsername.js')(app);
require('./routes/searchUsers.js')(app);

//Routes that deal with editing user data
require('./routes/editProfile.js')(app);
require('./routes/changePass.js')(app);

//Routes that deal with a users liked playlists
require('./routes/fetchLikedPlaylists.js')(app);
require('./routes/addToLikedPlaylists.js')(app);
require('./routes/getLikedUserDetails.js')(app);
require('./routes/unlikeLikedPlaylist.js')(app);
require('./routes/unlikeLikedPlaylistUser.js')(app);

//Routes that deal with playlists (in general)
require('./routes/fetchRecentPlaylists.js')(app);
require('./routes/fetchTopLikedPlaylists.js')(app);
require('./routes/fetchUserPlaylists.js')(app);
require('./routes/searchPlaylists.js')(app);
require('./routes/createPlaylist.js')(app);
require('./routes/addTrackToPlaylist.js')(app);
require('./routes/deleteTrackFromPlaylist.js')(app);
require('./routes/editPlaylist.js')(app);
require('./routes/deletePlaylist.js')(app);
require('./routes/clickLikePlaylist.js')(app);

//Routes that deal with admin priveledges
require('./routes/requestAdmin.js')(app);
require('./routes/checkAdminStatus.js')(app);
require('./routes/fetchAdminReq.js')(app);
require('./routes/approveAdminUser.js')(app);
require('./routes/approveAdmin.js')(app);

//Routes that deal with admin picks
require('./routes/addToAdminPick.js')(app);
require('./routes/fetchAdminPicks.js')(app);
require('./routes/fetchAdminPickPlaylists.js')(app);
require('./routes/removePlaylistAdminPick.js')(app);

//Require Mongoose
const mongoose = require('mongoose');

//Login to my MongoDB
// const uri = 'mongodb+srv://ByronGeo95:stevengerrard8LFC@cluster0.8vfcd.mongodb.net/capstone?retryWrites=true&w=majority';
const uri = process.env.MONGO_URI;
mongoose.Promise = global.Promise;

//Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Function for successful connection to Mongo but not to the required DB
mongoose.connection.on('error', function () {
    console.log('Connection to Mongo established.');
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

//All connections to Mongo and DB successful
mongoose.connection.once('open', function () {
    console.log("Successfully connected to the database");
});


if (process.env.NODE_ENV === 'production') {
    console.log('Im in prod mode');
    //app.use(express.static(path.join(__dirname, 'frontend', 'build')));
    app.use(express.static(path.join(__dirname, 'frontend', 'build'), {
  setHeaders: function (res, path) {
    res.set('Content-Security-Policy', '');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

// app.use(express.static(path.join(__dirname, 'frontend', 'build'), {
//   setHeaders: function (res, path) {
//     res.set('Content-Security-Policy', '');
//     res.set('Cross-Origin-Resource-Policy', 'cross-origin');
//   }
// }));

//Express app listening on port 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
    console.log(`App is listening on PORT: ${PORT}`);
});

module.export = app;