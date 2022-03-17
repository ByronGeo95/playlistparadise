//Created by: Byron Georgopoulos
//Created on: 07/11/2021
//Last Modified on: 25/01/2022
/*Description: Add user to list of admin requests (request to become an admin) (admin controller)*/

//Export the request admin route
module.exports = (app) => {
    const Admin = require('../controllers/admin.controller.js');
    app.post('/requestAdmin', Admin.requestAdmin);
};