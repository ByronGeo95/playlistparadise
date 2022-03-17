//Created by: Byron Georgopoulos
//Created on: 31/10/2021
//Last Modified on: 25/01/2022
/*Description: Route for editing a users existing details (user controller)*/

//Export the edit profile route
module.exports = (app) => {
    const User = require('../controllers/user.controller.js');
    app.post('/editProfile', User.editProfile);
};