//Created by: Byron Georgopoulos
//Created on: 10/11/2021
//Last Modified on: 25/01/2022
/*Description: Set a users admin status to true upon request (user controller)*/

//Export the approve admin user route
module.exports = (app) => {
    const User = require('../controllers/user.controller.js');
    app.post('/approveAdminUser', User.approveAdminUser);
};