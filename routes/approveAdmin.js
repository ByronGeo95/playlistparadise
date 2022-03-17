//Created by: Byron Georgopoulos
//Created on: 10/11/2021
//Last Modified on: 25/01/2022
/*Description: Approve a users request to become an admin (admin controller)*/

//Export the approve admin route
module.exports = (app) => {
    const Admin = require('../controllers/admin.controller.js');
    app.post('/approveAdmin', Admin.approveAdmin);
};