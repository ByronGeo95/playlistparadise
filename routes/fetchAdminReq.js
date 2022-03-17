//Created by: Byron Georgopoulos
//Created on: 10/11/2021
//Last Modified on: 25/01/2022
/*Description: Fetch the details of users currently requesting admin status (admin controller)*/

//Export the fetch admin request route
module.exports = (app) => {
    const Admin = require('../controllers/admin.controller.js');
    app.post('/fetchAdminReq', Admin.fetchAdminReq);
};