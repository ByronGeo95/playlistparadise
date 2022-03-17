//Created by: Byron Georgopoulos
//Created on: 07/11/2021
//Last Modified on: 25/01/2022
/*Description: Check whether a user is an admin or not (admin controller)*/

//Export the check admin status route
module.exports = (app) => {
    const Admin = require('../controllers/admin.controller.js');
    app.post('/checkAdminStatus', Admin.checkAdminStatus);
};