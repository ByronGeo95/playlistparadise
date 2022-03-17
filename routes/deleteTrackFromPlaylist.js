//Created by: Byron Georgopoulos
//Created on: 01/11/2021
//Last Modified on: 25/01/2022
/*Description: Route for removing a specific track from a user created playlist (playlist controller)*/

//Export the delete track from playlist route
module.exports = (app) => {
    const Playlist = require('../controllers/playlist.controller.js');
    app.post('/deleteTrackFromPlaylist', Playlist.deleteTrackFromPlaylist);
};