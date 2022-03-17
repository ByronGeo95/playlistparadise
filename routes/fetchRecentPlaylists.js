//Created by: Byron Georgopoulos
//Created on: 21/11/2021
//Last Modified on: 25/01/2022
/*Description: Route for returning the most recently created playlists in the entire database (playlist controller)*/

//Export the fetch recent playlists route
module.exports = (app) => {
    const Playlist = require('../controllers/playlist.controller.js');
    app.post('/fetchRecentPlaylists', Playlist.fetchRecentPlaylists);
};