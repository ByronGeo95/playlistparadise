//Created by: Byron Georgopoulos
//Created on: 01/11/2021
//Last Modified on: 25/01/2022
/*Description: Route for seraching for other users (user controller)*/

//Export the search users route
module.exports = (app) => {
    const User = require('../controllers/user.controller.js');
    app.post('/searchUsers', User.searchUsers);
};