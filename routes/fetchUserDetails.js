//Created by: Byron Georgopoulos
//Created on: 31/10/2021
//Last Modified on: 25/01/2022
/*Description: Route for fetching user details upon login (using ID) (user controller)*/

//Export the fetch user details route
module.exports = (app) => {
    const User = require('../controllers/user.controller.js');
    app.post('/fetchUserDetails', User.fetchUserDetails);
};