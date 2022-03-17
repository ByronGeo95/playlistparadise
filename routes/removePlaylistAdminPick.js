//Created by: Byron Georgopoulos
//Created on: 24/11/2021
//Last Modified on: 25/01/2022
/*Description: Remove a playlist from the admin picks (editors picks) list (adminPick controller)*/

//Export the remove playlist admin pick route
module.exports = (app) => {
    const AdminPick = require('../controllers/adminPick.controller.js');
    app.post('/removePlaylistAdminPick', AdminPick.removePlaylistAdminPick);
};