//Created by: Byron Georgopoulos
//Created on: 01/11/2021
//Last Modified on: 25/01/2022
/*Description: Route for adding a track to an already existing playlist (playlist controller)*/

//Export add track to playlist route
module.exports = (app) => {
    const Playlist = require('../controllers/playlist.controller.js');
    app.post('/addTrackToPlaylist', Playlist.addTrackToPlaylist);
};