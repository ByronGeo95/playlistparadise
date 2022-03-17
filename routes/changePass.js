//Created by: Byron Georgopoulos
//Created on: 16/11/2021
//Last Modified on: 25/01/2022
/*Description: Route for changing a users password (user controller)*/

//Export the change password route
module.exports = (app) => {
    const User = require('../controllers/user.controller.js');
    app.post('/changePass', User.changePass);
};