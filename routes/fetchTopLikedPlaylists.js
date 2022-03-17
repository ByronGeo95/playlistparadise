//Created by: Byron Georgopoulos
//Created on: 22/11/2021
//Last Modified on: 25/01/2022
/*Description: Route for returning the highest liked playlists in the entire database (playlist controller)*/

//Export the fetch top liked playlists route
module.exports = (app) => {
    const Playlist = require('../controllers/playlist.controller.js');
    app.post('/fetchTopLikedPlaylists', Playlist.fetchTopLikedPlaylists);
};