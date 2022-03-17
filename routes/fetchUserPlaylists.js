//Created by: Byron Georgopoulos
//Created on: 31/10/2021
//Last Modified on: 25/01/2022
/*Description: Route for fetching user created playlists (playlist controller)*/

//Export the fetch user playlists route
module.exports = (app) => {
    const Playlist = require('../controllers/playlist.controller.js');
    app.post('/fetchUserPlaylists', Playlist.fetchUserPlaylists);
};