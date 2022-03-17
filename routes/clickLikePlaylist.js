//Created by: Byron Georgopoulos
//Created on: 04/11/2021
//Last Modified on: 25/01/2022
/*Description: Like another users playlist (playlist controller)*/

//Export the click like playlist route
module.exports = (app) => {
    const Playlist = require('../controllers/playlist.controller.js');
    app.post('/clickLikePlaylist', Playlist.clickLikePlaylist);
};