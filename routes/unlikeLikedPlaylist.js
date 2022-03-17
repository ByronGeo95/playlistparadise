//Created by: Byron Georgopoulos
//Created on: 06/11/2021
//Last Modified on: 25/01/2022
/*Description: Unlike a previosuly liked user playlist (playlist controller)*/

//Export the unlike liked playlists route
module.exports = (app) => {
    const Playlist = require('../controllers/playlist.controller.js');
    app.post('/unlikeLikedPlaylist', Playlist.unlikeLikedPlaylist);
};