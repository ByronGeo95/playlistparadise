//Created by: Byron Georgopoulos
//Created on: 23/11/2021
//Last Modified on: 25/01/2022
/*Description: Add a playlist to the admin picks (editors picks) list (adminPick controller)*/

//Export the add to admin pick route
module.exports = (app) => {
    const AdminPick = require('../controllers/adminPick.controller.js');
    app.post('/addToAdminPick', AdminPick.addToAdminPick);
};