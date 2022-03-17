//Created by: Byron Georgopoulos
//Created on: 01/11/2021
//Last Modified on: 25/01/2022
/*Description: Route for user sign up (user controller)*/

//Export the sign up route
module.exports = (app) => {
    const User = require('../controllers/user.controller.js');
    app.post('/signUp', User.signUp);
};