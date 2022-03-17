//Created by: Byron Georgopoulos
//Created on: 18/11/2021
//Last Modified on: 25/01/2022
/*Description: Route for fetching user details (using username) (user controller)*/

//Export the login route
module.exports = (app) => {
    const User = require('../controllers/user.controller.js');
    app.post('/fetchUserDetailsUsername', User.fetchUserDetailsUsername);
};