//Created by: Byron Georgopoulos
//Created on: 23/11/2021
//Last Modified on: 25/01/2022
/*Description: Fetch all the playlists the admins have set as 'admins picks' (editors picks) (playlist controller)*/

//Export the fetch admins picks playlists route
module.exports = (app) => {
    const Playlist = require('../controllers/playlist.controller.js');
    app.post('/fetchAdminPickPlaylists', Playlist.fetchAdminPickPlaylists);
};