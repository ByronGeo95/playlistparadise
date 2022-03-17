//Created by: Byron Georgopoulos
//Created on: 22/11/2021
//Last Modified on: 25/01/2022
/*Description: Route for searching the database for playlist based on a given search term (playlist controller)*/

//Export the search playlists route
module.exports = (app) => {
    const Playlist = require('../controllers/playlist.controller.js');
    app.post('/searchPlaylists', Playlist.searchPlaylists);
};