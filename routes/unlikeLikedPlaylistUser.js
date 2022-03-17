//Created by: Byron Georgopoulos
//Created on: 06/11/2021
//Last Modified on: 25/01/2022
/*Description: Route for when a user unlikes a playlist (only removes from his liked playlists in user collection) (user controller)*/

//Export the unlike liked playlist route
module.exports = (app) => {
    const User = require('../controllers/user.controller.js');
    app.post('/unlikeLikedPlaylistUser', User.unlikeLikedPlaylistUser);
};