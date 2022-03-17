//Created by: Byron Georgopoulos
//Created on: 04/11/2021
//Last Modified on: 25/01/2022
/*Description: Route for getting the ID of playlists a user has liked (user controller)*/

//Export the get liked user details route
module.exports = (app) => {
    const User = require('../controllers/user.controller.js');
    app.post('/getLikedUserDetails', User.getLikedUserDetails);
};