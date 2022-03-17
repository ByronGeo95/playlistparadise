//Created by: Byron Georgopoulos
//Created on: 01/11/2021
//Last Modified on: 25/01/2022
/*Description: Edit the details of an already created user playlist (playlist controller)*/

//Export the edit playlist route
module.exports = (app) => {
    const Playlist = require('../controllers/playlist.controller.js');
    app.post('/editPlaylist', Playlist.editPlaylist);
};