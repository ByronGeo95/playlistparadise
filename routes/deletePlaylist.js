//Created by: Byron Georgopoulos
//Created on: 01/11/2021
//Last Modified on: 25/01/2022
/*Description: Delete a user created playlist (playlist controller)*/

//Export the delete playlist route
module.exports = (app) => {
    const Playlist = require('../controllers/playlist.controller.js');
    app.post('/deletePlaylist', Playlist.deletePlaylist);
};