//Created by: Byron Georgopoulos
//Created on: 04/11/2021
//Last Modified on: 25/01/2022
/*Description: Route for when a user likes a playlist (only adds to his liked playlists in user collection) (user controller)*/

//Export the add to liked playlists route
module.exports = (app) => {
    const User = require('../controllers/user.controller.js');
    app.post('/addToLikedPlaylists', User.addToLikedPlaylists);
};