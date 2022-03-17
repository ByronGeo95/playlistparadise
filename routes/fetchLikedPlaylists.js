//Created by: Byron Georgopoulos
//Created on: 04/11/2021
//Last Modified on: 25/01/2022
/*Description: Fetch all the playlists a user has liked (playlist controller)*/

//Export the fetch liked playlists route
module.exports = (app) => {
    const Playlist = require('../controllers/playlist.controller.js');
    app.post('/fetchLikedPlaylists', Playlist.fetchLikedPlaylists);
};