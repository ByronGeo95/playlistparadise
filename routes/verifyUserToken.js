//Created by: Byron Georgopoulos
//Created on: 31/10/2021
//Last Modified on: 25/01/2022
/*Description: Route for the verify user token (user controller)*/

//Export the verify user token route
module.exports = (app) => {
    const User = require('../controllers/user.controller.js');
    app.get('/verifyUserToken', User.verifyUserToken);
};