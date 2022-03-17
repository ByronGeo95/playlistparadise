//Created by: Byron Georgopoulos
//Created on: 31/10/2021
//Last Modified on: 25/01/2022
/*Description: Route for adding a new user created playlist to the database (playlist controller)*/

//Export the create playlists route
module.exports = (app) => {
    const Playlist = require('../controllers/playlist.controller.js');
    app.post('/createPlaylist', Playlist.createPlaylist);
};